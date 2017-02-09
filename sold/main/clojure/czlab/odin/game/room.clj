;; Licensed under the Apache License, Version 2.0 (the "License");
;; you may not use this file except in compliance with the License.
;; You may obtain a copy of the License at
;;
;;     http://www.apache.org/licenses/LICENSE-2.0
;;
;; Unless required by applicable law or agreed to in writing, software
;; distributed under the License is distributed on an "AS IS" BASIS,
;; WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
;; See the License for the specific language governing permissions and
;; limitations under the License.
;;
;; Copyright (c) 2013-2016, Kenneth Leung. All rights reserved.


(ns ^{:doc ""
      :author "kenl" }

  czlab.odin.game.room

  (:require
    [czlab.xlib.util.core :refer [MubleObj! ]]
    [czlab.xlib.util.guids :refer [NewUUid]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.meta :refer [NewObjArgN]]
    [czlab.xlib.util.str :refer [strim hgl?]])

  (:use [czlab.xlib.util.format]
        [czlab.odin.system.util]
        [czlab.odin.event.core]
        [czlab.odin.event.disp]
        [czlab.odin.game.session]
        [czlab.cocos2d.games.meta])

  (:import
    [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
    [com.zotohlab.odin.game Game PlayRoom PlayerSession
    Player GameEngine]
    [com.zotohlab.odin.core Session]
    [java.util.concurrent.atomic AtomicLong]
    [io.netty.channel Channel]
    [com.zotohlab.frwk.server Emitter]
    [com.zotohlab.skaro.core CLJShim Muble Container]
    [com.zotohlab.odin.event Events Eventee PubSub
    Msgs Sender Receiver Dispatchable]))

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
(defn LookupGame

  "Find a game from the registry"

  ^Game
  [^String gameid]

  (log/debug "looking for game with uuid = %s" gameid)
  (when-some [g (get (GetGamesAsUUID) gameid) ]
    (let [{:keys [enabled minp maxp engine]
           :or {enabled false
                minp 1
                maxp 1 engine ""}}
          (:network g)]
      (log/debug "found game with uuid = %s" gameid)
      (reify Game
        (supportMultiPlayers [_] (true? enabled))
        (maxPlayers [_] (if (> maxp 0)
                          (int maxp)
                          Integer/MAX_VALUE))
        (minPlayers [_] (if (> minp 0)
                          (int minp)
                          (int 1)))
        (getName [_] (:name g))
        (engineClass [_] engine)
        (info [_] g)
        (id [_] (:uuid g))
        (unload [_] nil)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemoveGameRoom

  "Remove an active room"

  ^PlayRoom
  [^String game ^String room]

  (dosync
    (when-some [gm (@GAME-ROOMS game) ]
      (when-some [r (get gm room)]
        (log/debug "remove room(A): %s, game: %s" room game)
        (alter GAME-ROOMS
               assoc
               game (dissoc gm room))
      r))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemoveFreeRoom

  "Remove a waiting room"

  ^PlayRoom
  [^String game ^String room]

  (dosync
    (when-some [gm (@FREE-ROOMS game) ]
      (when-some [r (get gm room)]
        (log/debug "remove room(F): %s, game: %s" room game)
        (alter FREE-ROOMS
               assoc
               game (dissoc gm room))
      r))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AddFreeRoom

  "Add a new partially filled room
   into the pending set"

  ^PlayRoom
  [^PlayRoom room]

  (dosync
    (let [rid (.roomId room)
          g (.game room)
          gid (.id g)
          m (or (@FREE-ROOMS gid) {}) ]
      (log/debug "add a room(F): %s, game: %s" rid gid)
      (alter FREE-ROOMS
             assoc
             gid
             (assoc m rid room))
      room)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AddGameRoom

  "Move room into the active set"

  ^PlayRoom
  [^PlayRoom room]

  (dosync
    (let [rid (.roomId room)
          g (.game room)
          gid (.id g)
          m (or (@GAME-ROOMS gid) {}) ]
      (log/debug "add a room(A): %s, game: %s" rid gid)
      (alter GAME-ROOMS
             assoc
             gid
             (assoc m rid room))
      room)))

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
      (when-some [^PlayRoom r (if (not-empty gm)
                               (first (vals gm))) ]
        (let [rid (.roomId r)]
          (log/debug "found a room(F): %s, game: %s" rid gid)
          (alter FREE-ROOMS
                 assoc
                 gid
                 (dissoc gm rid)))
        r))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defmethod LookupFreeRoom String

  [^String game ^String room]

  (dosync
    (when-some [gm (@FREE-ROOMS game) ]
      (when-some [r (get gm room)]
        (log/debug "found a room(F): %s, game: %s" room game)
        (alter FREE-ROOMS
               assoc
               game
               (dissoc gm room))
        r))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupGameRoom ""

  ^PlayRoom
  [^String game ^String room]

  (dosync
    (when-some [gm (@GAME-ROOMS game) ]
      (log/debug "looking for room: %s, game: %s" room game)
      (get gm room))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mkNetworkSubr ""

  ^Eventee
  [^PlayerSession ps]

  (reify Eventee

    (eventType [_] Msgs/NETWORK)
    (session [_] ps)

    Receiver
    (onMsg [_ evt] (.sendMsg ps evt))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onSessionMsg ""

  [^PlayRoom room evt]

  (when-some [^Sender s (:context evt)]
    (.sendMsg s evt)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onNetworkMsg ""

  [^PlayRoom room evt]

  ;;for now, just bcast everything

  (.broadcast room evt))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- reifyPlayRoom ""

  ^PlayRoom
  [^Game gameObj options]

  (let [^Container
        ctr (-> ^Emitter
                (:emitter options)
                (.container))
        crt (.getCljRt ctr)
        engObj (.callEx crt (.engineClass gameObj)
                            (object-array [(atom {}) (ref {})]))
        created (System/currentTimeMillis)
        disp (ReifyDispatcher)
        sessions (ref {})
        pssArr (ref [])
        pcount (AtomicLong.)
        impl (MubleObj!)
        rid (NewUUid)]
    (.setv impl :shutting false)
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
          ps))

      (isShuttingDown [_] (.getv impl :shutting))

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
            (-> (.player v)
                (.removeSession v))
            (.close v))
          (ref-set sessions {})))

      (isActive [_] (true? (.getv impl :active)))

      (activate [this]
        (let [^GameEngine eng (.engine this)
              sss (seq @pssArr)]
          (log/debug "activating room %s" rid)
          (.setv impl :active true)
          (doseq [s sss]
            (.addHandler this (mkNetworkSubr s)))
          (doto eng
            (.initialize  sss)
            (.ready  this))))

      Dispatchable

      (removeHandler [_ h] (.unsubscribe disp h))
      (addHandler [_ h] (.subscribe disp h))

      Sender

      (sendMsg [this msg]
        (condp = (:type msg)
          Msgs/NETWORK (onNetworkMsg this msg)
          Msgs/SESSION (onSessionMsg this msg)
          (log/warn "room.sendmsg: unhandled event %s" msg)))

      Receiver

      (onMsg [this evt]
        (let [^GameEngine eng (.engine this) ]
          (log/debug "room got an event %s" evt)
          (condp = (:type evt)
            Msgs/NETWORK (onNetworkMsg this evt)
            Msgs/SESSION (.update eng evt)
            (log/warn "room.onmsg: unhandled event %s" evt))))

      Object

      (hashCode [this]
        (if-some [ n (.roomId this) ]
          (.hashCode n)
          31))

      (equals [this obj]
        (if (nil? obj)
          false
          (or (identical? this obj)
              (and (== (.getClass this)
                       (.getClass obj))
                   (== (.roomId ^PlayRoom obj)
                       (.roomId this)))))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn NewFreeRoom ""

  ^PlayerSession
  [^Game game ^Player py options]

  (let [room (reifyPlayRoom game options) ]
    (log/debug "created a new play room: %s" (.roomId room))
    (.connect room py)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn OpenRoom ""

  ^PlayerSession
  [^Game game ^Player plyr options]

  (with-local-vars [pss nil]
    (when-some [room (LookupFreeRoom game) ]
      (var-set pss (.connect room plyr))
      (if (.canActivate room)
        (do
          (log/debug "room has enought players, turning active")
          (AddGameRoom room))
        (AddFreeRoom room)))
    (when (nil? @pss)
      (var-set pss (NewFreeRoom game plyr options))
      (AddFreeRoom (.room ^PlayerSession @pss)))
    (when-some [^PlayerSession ps @pss]
      (let [^Channel ch (:socket options)
            room (.room ps)
            src {:room (.roomId room)
                 :game (.id game)
                 :pnum (.number ps)}
            evt (ReifySSEvent Events/PLAYREQ_OK src) ]
        (ApplyGameHandler ps (:emitter options) ch)
        (log/debug "replying back to user: %s" evt)
        (.writeAndFlush ch (EventToFrame evt))
        (->> (ReifyNWEvent Events/PLAYER_JOINED
                           {:pnum (.number ps)
                            :puid (.id plyr)})
             (.broadcast room))
        (when (.canActivate room)
          (log/debug "room.canActivate = true")
          (.activate room))))
    @pss))

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
            evt (ReifySSEvent Events/JOINREQ_OK src) ]
        (ApplyGameHandler pss (:emitter options) ch)
        (.writeAndFlush ch (EventToFrame evt))
        (log/debug "replying back to user: %s" evt)
        (when-not (.isActive room)
          (if (.canActivate room)
            (do
              (log/debug "room.canActivate = true")
              (.activate room)
              (AddGameRoom room))
            (AddFreeRoom room)))
        pss))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

