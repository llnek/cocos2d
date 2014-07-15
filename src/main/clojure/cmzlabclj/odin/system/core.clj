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

  (:import  [com.zotohlab.odin.game Game PlayRoom Player PlayerSession Session]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [io.netty.channel Channel]
            [org.apache.commons.io FileUtils]
            [java.io File]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.odin.event Events EventDispatcher]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- replyError ""

  [evt error msg]

  (let [rsp (EventToFrame error (nsb msg))
        ^Channel ch (:socket evt) ]
    (log/debug "replying back an error type " error)
    (.writeAndFlush ch rsp)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- replyOK ""

  [^PlayerSession ps]

  (let [rsp (EventToFrame Events/PLAYGAME_REQ_OK
                          (-> (.room ps)
                              (.roomId)))
        ^Channel ch (.impl ps) ]
    (log/debug "player connection request is ok.")
    (log/debug "player impl = " ch)
    (.sendMessage ps rsp)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onPlayReq ""

  [evt]

  (when-let [arr (:source evt)]
    (when (and (vector? arr)
               (= (count arr) 3))
      (with-local-vars [plyr nil
                        gm nil
                        ps nil
                        room nil]
        (let [g (LookupGame (nth arr 0))]
          (if (.supportMultiPlayers g)
            (var-set gm g)
            (replyError evt Events/INVALID_GAME "")))
        (if-let [p (LookupPlayer (nth arr 1)
                                 (nth arr 2)) ]
          (var-set plyr p)
          (replyError evt Events/INVALID_USER ""))
        (if-let [r (OpenRoom @gm @plyr)]
          (var-set room r)
          (replyError evt Events/ROOM_UNAVAILABLE ""))
        (when (and (notnil? @plyr)
                   (notnil? @gm)
                   (notnil? @room))
          (let [ps (JoinRoom @room @plyr)]
            (.bind ps (:socket evt))
            (replyOK ps)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OdinOnEvent ""

  [evt]

  (let [etype (:type evt)]
    (cond
      (== etype Events/PLAYGAME_REQ)
      (onPlayReq evt)

      :else
      (log/warn "unhandled event " evt))))





;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OdinInit ""

  [^Container ctr]

  (let [appDir (.getAppDir ctr)
        fp (File. appDir "conf/odin.conf")
        json (json/read-str (FileUtils/readFileToString fp "utf-8")) ]
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

