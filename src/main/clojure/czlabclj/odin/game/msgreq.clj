;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  czlabclj.odin.game.msgreq

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap notnil?]]
        [czlabclj.xlib.util.files :only [ReadOneFile]]
        [czlabclj.xlib.util.format]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.xlib.util.wfs :only [SimPTask]]
        [czlabclj.xlib.i18n.resources :only [RStr]]
        [czlabclj.odin.event.core]
        [czlabclj.odin.game.room]
        [czlabclj.odin.game.player])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.wflow Job Activity
                                Pipeline PDelegate PTask]
            [com.zotohlab.skaro.io WebSockEvent Emitter]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.frwk.core Identifiable]
            [com.zotohlab.frwk.i18n I18N]
            [java.util ResourceBundle]
            [io.netty.channel Channel]
            [com.zotohlab.skaro.core Container]
            [com.zotohlab.odin.event Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rError "Reply back an error."

  [^Channel ch error msg]

  (log/debug "replying back an error code: " error)
  (->> (ReifySSEvent error {:message (nsb msg)})
       (EventToFrame)
       (.writeAndFlush ch)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; source json = [gameid, userid, password]
(defn DoPlayReq ""

  [evt]

  (let [^Identifiable ctr (.container ^Emitter (:emitter evt))
        rcb (I18N/getBundle (.id ctr))
        ^Channel ch (:socket evt)
        arr (:source evt) ]
    (if
      (and (vector? arr)
           (= (count arr) 3))
      (with-local-vars [plyr nil
                        gm nil
                        pss nil
                        room nil]
        ;; maybe get the requested game?
        (let [g (LookupGame (first arr))]
          (if (and (notnil? g)
                   (.supportMultiPlayers g))
            (var-set gm g)
            (rError ch
                    Events/GAME_NOK
                    (RStr rcb "game.notok"))))
        ;; maybe get the player?
        (if-let [p (LookupPlayer (nth arr 1)
                                 (nth arr 2)) ]
          (var-set plyr p)
          (rError ch
                  Events/USER_NOK
                  (RStr rcb "login.error")))
        ;; maybe try to find or create a game room?
        (when (and (notnil? @plyr)
                   (notnil? @gm))
          (if-let [ps (OpenRoom @gm @plyr evt)]
            (do
              (var-set room (.room ps))
              (var-set pss ps))
            (rError ch
                    Events/ROOMS_FULL
                    (RStr rcb "room.none"))))
        @pss)
      ;;else
      (rError ch
              Events/PLAYREQ_NOK
              (RStr rcb "bad.req")))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Request to join a specific game room.  Not used now.
;; source json = [gameid, roomid, userid, password]
(defn DoJoinReq ""

  [evt]

  (let [^Identifiable ctr (.container ^Emitter (:emitter evt))
        rcb (I18N/getBundle (.id ctr))
        ^Channel ch (:socket evt)
        arr (:source evt) ]
    (if
      (and (vector? arr)
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
                  Events/USER_NOK
                  (RStr rcb "login.error")))
        ;; maybe get the requested room?
        (when-not (nil? @plyr)
          (let [gid (nth arr 0)
                rid (nth arr 1)
                r (or (LookupGameRoom gid rid)
                           (LookupFreeRoom gid rid)) ]
            (if (nil? r)
              (rError ch Events/ROOM_NOK (RStr rcb "room.bad"))
              (do
                (var-set pss (JoinRoom r @plyr evt))
                (when (nil? @pss)
                  (rError ch
                          Events/ROOM_FILLED
                          (RStr rcb "room.full")))))))
        @pss)
      ;;else
      (rError ch
              Events/JOINREQ_NOK
              (RStr rcb "bad.req")))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private msgreq-eof nil)

