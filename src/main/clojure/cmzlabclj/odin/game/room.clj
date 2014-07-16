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

  cmzlabclj.odin.game.room

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.guids]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.odin.system.util]
        [cmzlabclj.odin.event.core]
        [cmzlabclj.odin.event.disp]
        [cmzlabclj.odin.game.session]
        [cmzlabclj.odin.system.rego])

  (:import  [com.zotohlab.odin.game Game PlayRoom Player
                                    GameEngine
                                    Session$Status
                                    PlayerSession Session]
            [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [io.netty.channel Channel]
            [org.apache.commons.io FileUtils]
            [java.util.concurrent ConcurrentHashMap]
            [java.io File]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.odin.event Events EventHandler
                                     Eventable EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private vacancy 1000)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mkNetworkSubr ""

  [^PlayerSession ps]

  (reify EventHandler
    (eventType [_] Events/NETWORK_MSG)
    (session [_] ps)
    (onEvent [_ evt]
      (.onEvent ps evt))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayRoom ""

  ^PlayRoom
  [^Game gm]

  (let [created (System/currentTimeMillis)
        disp (ReifyEventDispatcher)
        impl (MakeMMap)
        pm (ConcurrentHashMap.)
        rid "1"];;(NewUUid)]
    (.setf! impl :shutting true)
    (reify PlayRoom
      (disconnect [_ ps]
        (let [^PlaySession ss ps
              py (.player ps)]
          (.remove pm (.id ps))
          (.removeSession py ps)
          (.unsubscribeIfSession disp ps)))
      (countPlayers [_] (.size pm))
      (connect [this p]
        (let [ps (ReifyPlayerSession this p)
              ^Player py p]
          (.put pm (.id ps) ps)
          (.addSession py ps)
          ps))
      (engine [_] )
      (game [_] gm)
      (roomId [_] rid)
      (broadcast [_ evt] (.publish disp evt))
      (isShuttingDown [_] (.getf impl :shutting))
      (close [_])
      (activate [this]
        (log/debug "activating room " rid)
        (doseq [v (seq (.values pm))]
          (.addHandler this (mkNetworkSubr v))))

      Eventable

      (removeHandler [_ h] (.unsubscribe disp h))
      (addHandler [_ h] (.subscribe disp h))
      (sendMessage [this msg] (.onEvent this msg))
      (onEvent [this evt]
        (let [^GameEngine sm (.engine this)
              etype (:type evt)]
          (cond
            (== Events/NETWORK_MSG etype)
            (.broadcast this evt)
            (== Events/SESSION_MSG etype)
            (.update sm evt)
            :else nil)))

      Object

      (hashCode [this]
        (if-let [ n (.roomId this) ]
          (.hashCode n)
          31))
      (equals [this obj]
        (if (nil? obj)
          false
          (or (identical? this obj)
              (and (= (.getClass this)
                      (.getClass obj))
                   (= (.roomId ^PlayRoom obj)
                      (.roomId this))))))
      )
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OpenRoom ""

  ^PlayRoom
  [^Game game ^Player plyr]

  (cond
    (== vacancy 0)
    nil

    (> (.countSessions plyr) 5)
    nil

    :else
    (AddRoom (ReifyPlayRoom game))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn JoinRoom ""

  ^PlayerSession
  [^PlayRoom room ^Player plyr]

  (.connect room plyr))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private room-eof nil)

