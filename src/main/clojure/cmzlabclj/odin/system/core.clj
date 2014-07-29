;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  cmzlabclj.odin.system.core

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.odin.event.core]
        [cmzlabclj.odin.game.room]
        [cmzlabclj.odin.system.rego])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [io.netty.channel ChannelHandlerContext ChannelHandler
                              ChannelPipeline Channel]
            [org.apache.commons.io FileUtils]
            [java.io File]
            [com.zotohlab.frwk.netty SimpleInboundHandler]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.odin.event Events EventDispatcher]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rError ""

  [^Channel ch error msg]

  (let [src {:message (nsb msg)}
        rsp (ReifyEvent Events/SESSION_MSG
                        error
                        (json/write-str src)) ]
    (log/debug "replying back an error session/code " error)
    (.writeAndFlush ch (EventToFrame rsp))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; source json = [gameid, userid, password]
(defn- onPlayReq ""

  [evt]

  (let [^Channel ch (:socket evt)
        arr (:source evt) ]
    (cond
      (and (notnil? arr)
           (vector? arr)
           (= (count arr) 3))
      (with-local-vars [plyr nil
                        gm nil
                        pss nil
                        room nil]
        ;; maybe get the request game?
        (let [g (LookupGame (nth arr 0))]
          (if (and (notnil? g)
                   (.supportMultiPlayers g))
            (var-set gm g)
            (rError ch
                    Events/C_GAME_NOK
                    "no such game/not network enabled.")))
        ;; maybe get the player?
        (if-let [p (LookupPlayer (nth arr 1)
                                 (nth arr 2)) ]
          (var-set plyr p)
          (rError ch
                  Events/C_USER_NOK
                  "user or password error."))
        ;; maybe try to find or create a game room?
        (when (and (notnil? @plyr)
                   (notnil? @gm))
          (if-let [ps (OpenRoom @gm @plyr evt)]
            (do
              (var-set room (.room ps))
              (var-set pss ps))
            (rError ch
                    Events/C_ROOMS_FULL
                    "no room available.")))
        @pss)

      :else
      (rError ch
              Events/C_PLAYREQ_NOK
              "bad request."))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Request to join a specific game room.  Not used now.
;; source json = [gameid, roomid, userid, password]
(defn- onJoinReq ""

  [evt]

  (let [^Channel ch (:socket evt)
        arr (:source evt) ]
    (cond
      (and (notnil? arr)
           (vector? arr)
           (= (count arr) 4))
      (with-local-vars [plyr nil
                        pss nil
                        gm nil
                        room nil]
        ;; maybe get the player?
        (if-let [p (LookupPlayer (nth arr 2)
                                 (nth arr 3)) ]
          (var-set plyr p)
          (rError ch
                  Events/C_USER_NOK
                  "no such player."))
        ;; maybe get the requested room?
        (when-not (nil? @plyr)
          (let [gid (nth arr 0)
                rid (nth arr 1)
                r (ternary (LookupGameRoom gid rid)
                           (LookupFreeRoom gid rid)) ]
            (if (nil? r)
              (rError ch Events/C_ROOM_NOK "no such room.")
              (do
                (var-set pss (JoinRoom r @plyr evt))
                (when (nil? @pss)
                  (rError ch
                          Events/C_ROOM_FILLED
                          "no more room."))))))
        @pss)

      :else
      (rError ch
              Events/C_JOINREQ_NOK
              "bad request."))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Main entry point.
(defn OdinOnEvent ""

  [evt]

  (let [etype (:type evt)]
    (condp == etype
      Events/PLAYGAME_REQ
      (onPlayReq evt)

      Events/JOINGAME_REQ
      (onJoinReq evt)

      (log/warn "unhandled event " evt))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; One time init from the MainApp.
(defn OdinInit ""

  [^Container ctr]

  (let [appDir (.getAppDir ctr)
        fp (File. appDir "conf/odin.conf")
        json (json/read-str (FileUtils/readFileToString fp "utf-8")) ]
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

