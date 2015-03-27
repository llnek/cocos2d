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

  czlabclj.odin.game.room

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ] ]
        [czlabclj.xlib.util.guids :only [NewUUid]]
        [czlabclj.xlib.util.meta :only [MakeObjArgN]]
        [czlabclj.xlib.util.str :only [strim nsb hgl?] ])

  (:use [czlabclj.odin.system.util]
        [czlabclj.odin.event.core]
        [czlabclj.odin.event.disp]
        [czlabclj.odin.game.session]
        [czlabclj.odin.system.rego])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.game Game PlayRoom PlayerSession
                                    Player GameEngine]
            [com.zotohlab.odin.core Session$Status Session]
            [io.netty.channel Channel]
            [org.apache.commons.io FileUtils]
            [java.util.concurrent.atomic AtomicLong]
            [java.util.concurrent ConcurrentHashMap]
            [java.util ArrayList]
            [java.io File]
            [com.zotohlab.gallifrey.core Container]
            [com.zotohlab.odin.event Events EventHandler
                                     Eventable EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private vacancy 1000)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mkNetworkSubr ""

  ^EventHandler
  [^PlayerSession ps]

  (reify EventHandler
    (eventType [_] Events/NETWORK_MSG)
    (session [_] ps)
    (onEvent [_ evt]
      ;; if a context is given, then only the
      ;; matching one gets the message.
      (if-let [c (:context evt)]
        (when (identical? c ps)
          (.onEvent ps evt))
        (.onEvent ps evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayRoom ""

  ^PlayRoom
  [^Game gameObj]

  (let [engObj (MakeObjArgN (.engineClass gameObj)
                            (atom {})
                            (ref {}))
        created (System/currentTimeMillis)
        disp (ReifyEventDispatcher)
        sessions (ref {})
        pssArr (ref [])
        pcount (AtomicLong.)
        impl (MakeMMap)
        rid (NewUUid)]
    (.setf! impl :shutting false)
    (reify PlayRoom

      (disconnect [_ ps]
        (let [^PlayerSession ss ps
              py (.player ss)]
          (dosync
            (alter sessions dissoc (.id ss))
            (ref-set pssArr (filter #(not (identical? % ss))
                                    @pssArr)))
          (.removeSession py ss)
          (.unsubscribeIfSession disp ss)))

      (countPlayers [_] (count @pssArr))

      (connect [this p]
        (let [ps (ReifyPlayerSession this p
                                     (.incrementAndGet pcount))
              ^Player py p
              src {:puid (.id py)
                   :pnum (.number ps) } ]
          (dosync
            (alter sessions assoc (.id ps) ps)
            (alter pssArr conj ps))
          (.addSession py ps)
          (.broadcast this (ReifyEvent Events/NETWORK_MSG
                                       Events/C_PLAYER_JOINED
                                       (json/write-str src)))
          ps))

      (isShuttingDown [_] (.getf impl :shutting))

      (canActivate [this]
        (and (not (.isActive this))
             (>= (.countPlayers this)
                 (.minPlayers gameObj))))

      (broadcast [_ evt] (.publish disp evt))

      (engine [_] engObj)

      (game [_] gameObj)

      (roomId [_] rid)

      (close [_]
        (dosync
          (doseq [^PlayerSession v (vals @sessions)]
            (.close v))
          (ref-set sessions {})))

      (isActive [_] (true? (.getf impl :active)))

      (activate [this]
        (let [^GameEngine sm (.engine this)
              sss (seq @pssArr)]
          (log/debug "activating room " rid)
          (.setf! impl :active true)
          (doseq [v sss]
            (.addHandler this (mkNetworkSubr v)))
          (.initialize sm sss)
          (.ready sm this)))

      Eventable

      (removeHandler [_ h] (.unsubscribe disp h))

      (addHandler [_ h] (.subscribe disp h))

      (sendMessage [this msg] (.onEvent this msg))

      (onEvent [this evt]
        (let [^GameEngine sm (.engine this) ]
          (log/debug "room got an event " evt)
          (condp == (:type evt)
            Events/NETWORK_MSG (.broadcast this evt)
            Events/SESSION_MSG (.update sm evt)
            (log/warn "room.onevent: unhandled event " evt))))

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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn NewFreeRoom ""

  ^PlayerSession
  [^Game game ^Player py]

  (let [room (ReifyPlayRoom game) ]
    (log/debug "created a new play room: " (.roomId room))
    (.connect room py)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OpenRoom ""

  ^PlayerSession
  [^Game game ^Player plyr options]

  (with-local-vars [pss nil]
    (when-let [room (LookupFreeRoom game) ]
      (var-set pss (.connect room plyr))
      (if (.canActivate room)
        (do
          (log/debug "room has enought players, turning active")
          (AddGameRoom room))
        (AddFreeRoom room)))
    (when (nil? @pss)
      (var-set pss (NewFreeRoom game plyr))
      (AddFreeRoom (.room ^PlayerSession @pss)))
    (when-let [^PlayerSession ps @pss]
      (let [^Channel ch (:socket options)
            room (.room ps)
            src {:room (.roomId room)
                 :game (.id game)
                 :pnum (.number ps)}
            evt (ReifyEvent Events/SESSION_MSG
                            Events/C_PLAYREQ_OK
                            (json/write-str src)) ]
        (ApplyProtocol ps ch)
        (log/debug "replying back to user: " evt)
        (.writeAndFlush ch (EventToFrame evt))
        (when (.canActivate room)
          (log/debug "room.canActivate = true")
          (.activate room))))
    @pss
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn JoinRoom ""

  ^PlayerSession
  [^PlayRoom room ^Player plyr options]

  (let [^Channel ch (:socket options)
        game (.game room)]
    (when (< (.countPlayers room)
             (.maxPlayers game))
      (let [pss (.connect room plyr)
            src {:room (.roomId room)
                 :game (.id game)
                 :pnum (.number pss) }
            evt (ReifyEvent Events/SESSION_MSG
                            Events/C_JOINREQ_OK
                            (json/write-str src)) ]
        (ApplyProtocol pss ch)
        (.writeAndFlush ch (EventToFrame evt))
        (when-not (.isActive room)
          (if (.canActivate room)
            (do
              (.activate room)
              (AddGameRoom room))
            (AddFreeRoom room)))
        pss))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private room-eof nil)
