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

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.data.json :as js]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.guids :only [NewUUid]]
        [czlabclj.xlib.util.meta :only [MakeObjArgN]]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.odin.system.util]
        [czlabclj.odin.system.rego]
        [czlabclj.odin.event.core]
        [czlabclj.odin.event.disp]
        [czlabclj.odin.game.session]
        [czlabclj.cocos2d.games.meta])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.odin.game Game PlayRoom PlayerSession
                                    Player GameEngine]
            [com.zotohlab.odin.core Session]
            [java.util.concurrent.atomic AtomicLong]
            [io.netty.channel Channel]
            [com.zotohlab.skaro.core Container]
            [com.zotohlab.odin.event Events Eventee
             Msgs Eventable Dispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;; {game-id -> map
;;             { room-id -> room }}
(def ^:private FREE-ROOMS (ref {}))
(def ^:private GAME-ROOMS (ref {}))
(def ^:private vacancy 1000)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupGame "Find a game from the registry."

  ^Game
  [^String gameid]

  (log/debug "Looking for game with uuid = " gameid)
  (when-let [g (get (GetGamesAsUUID) gameid) ]
    (let [{flag :enabled minp :minp maxp :maxp eng :engine
           :or {flag false minp 1 maxp 1 eng ""}}
          (:network g)]
      (log/debug "Found game with uuid = " gameid)
      (reify Game
        (supportMultiPlayers [_] (true? flag))
        (maxPlayers [_] (if (> maxp 0)
                          (int maxp)
                          Integer/MAX_VALUE))
        (minPlayers [_] (if (> minp 0)
                          (int minp)
                          (int 1)))
        (getName [_] (:name g))
        (engineClass [_] eng)
        (info [_] g)
        (id [_] (:uuid g))
        ;;TODO: unload is an extreme action, what about the
        ;;game rooms???
        (unload [_] nil)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemoveGameRoom "Remove an active room."

  ^PlayRoom
  [^String game ^String room]

  (dosync
    (when-let [gm (@GAME-ROOMS game) ]
      (when-let [r (get gm room)]
        (log/debug "Remove room(A): " room ", game: " game)
        (alter GAME-ROOMS
               assoc
               game (dissoc gm room))
      r))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemoveFreeRoom "Remove a waiting room."

  ^PlayRoom
  [^String game ^String room]

  (dosync
    (when-let [gm (@FREE-ROOMS game) ]
      (when-let [r (get gm room)]
        (log/debug "Remove room(F): " room ", game: " game)
        (alter FREE-ROOMS
               assoc
               game (dissoc gm room))
      r))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AddFreeRoom "Add a new partially filled room
                   into the pending set."

  ^PlayRoom
  [^PlayRoom room]

  (dosync
    (let [rid (.roomId room)
          g (.game room)
          gid (.id g)
          m (ternary (@FREE-ROOMS gid) {}) ]
      (log/debug "Add a room(F): " rid ", game: " gid)
      (alter FREE-ROOMS
             assoc
             gid
             (assoc m rid room))
      room)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AddGameRoom "Move room into the active set."

  ^PlayRoom
  [^PlayRoom room]

  (dosync
    (let [rid (.roomId room)
          g (.game room)
          gid (.id g)
          m (ternary (@GAME-ROOMS gid) {}) ]
      (log/debug "Add a room(A): " rid ", game: " gid)
      (alter GAME-ROOMS
             assoc
             gid
             (assoc m rid room))
      room)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Returns a free room which is detached from the pending set.
(defmulti ^PlayRoom LookupFreeRoom (fn [a & args] (class a)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defmethod LookupFreeRoom Game

  [^Game game]

  (dosync
    (let [gid (.id game)
          gm (@FREE-ROOMS gid) ]
      (when-let [^PlayRoom r (if (not-empty gm)
                               (first (vals gm))) ]
        (let [rid (.roomId r)]
          (log/debug "Found a room(F): " rid ", game: " gid)
          (alter FREE-ROOMS
                 assoc
                 gid
                 (dissoc gm rid)))
        r))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defmethod LookupFreeRoom String

  [^String game ^String room]

  (dosync
    (when-let [gm (@FREE-ROOMS game) ]
      (when-let [r (get gm room)]
        (log/debug "Found a room(F): " room ", game: " game)
        (alter FREE-ROOMS
               assoc
               game
               (dissoc gm room))
        r))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupGameRoom ""

  ^PlayRoom
  [^String game ^String room]

  (dosync
    (when-let [gm (@GAME-ROOMS game) ]
      (log/debug "Looking for room: " room ", game: " game)
      (get gm room))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mkNetworkSubr ""

  ^Eventee
  [^PlayerSession ps]

  (reify Eventee
    (eventType [_] Msgs/NETWORK)
    (session [_] ps)
    (onEvent [_ evt]
      ;; if a context is given, then only the
      ;; matching one gets the message.
      (if-let [c (:context evt)]
        (when (identical? c ps)
          (.onMsg ps evt))
        (.onMsg ps evt)))
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
        disp (ReifyDispatcher)
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
          (.broadcast this (ReifyNWEvent Events/C_PLAYER_JOINED
                                         (js/write-str src)))
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

      (sendMsg [this msg] (.onMsg this msg))

      (onMsg [this evt]
        (let [^GameEngine sm (.engine this) ]
          (log/debug "room got an event " evt)
          (condp = (:type evt)
            Msgs/NETWORK (.broadcast this evt)
            Msgs/SESSION (.update sm evt)
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
              (and (== (.getClass this)
                       (.getClass obj))
                   (== (.roomId ^PlayRoom obj)
                       (.roomId this))))))
  )))

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
            evt (ReifyEvent Msgs/SESSION
                            Events/C_PLAYREQ_OK
                            (js/write-str src)) ]
        (ApplyGameHandler ps ch)
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
            evt (ReifyEvent Msgs/SESSION
                            Events/C_JOINREQ_OK
                            (js/write-str src)) ]
        (ApplyGameHandler pss ch)
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

