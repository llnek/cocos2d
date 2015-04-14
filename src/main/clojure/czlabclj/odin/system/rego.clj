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

  czlabclj.odin.system.rego

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.cocos2d.games.meta])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.core Session]
            [com.zotohlab.odin.event EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; players
;; { player-id -> player }
(def ^:private PLAYER-REGO (ref {}))

;; { player-id -> map of sessions { id -> session } }
(def ^:private PLAYER-SESS (ref {}))

;; {game-id -> map
;;             { room-id -> room }}
(def ^:private FREE-ROOMS (ref {}))
(def ^:private GAME-ROOMS (ref {}))

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
        (log/debug "Removing active room: " room
                   ", belonging to game: " game)
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
        (log/debug "Removing free room: " room
                   ", belonging to game: " game)
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
      (log/debug "Adding a free room: " rid ", game: " gid)
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
      (log/debug "Adding a game room: " rid ", game: " gid)
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
          (log/debug "Found a free room: " rid
                     ", belonging to game: " gid)
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
        (log/debug "Found a free room: " room
                     ", belonging to game: " game)
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
      (log/debug "Looking for room: " room
                 ", running game: " game)
      (get gm room))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayer ""

  ^Player
  [^String user ^String pwd]

  (let [impl (MakeMMap) ]
    (reify Player

      (setEmailId [_ email] (.setf! impl :email email))
      (emailId [_] (.getf impl :email))

      (setName [_ n] (.setf! impl :name n))
      (getName [_] (.getf impl :name))
      (id [_] user)

      (removeSession [_ ps]
        (dosync
          (when-let [m (@PLAYER-SESS user) ]
            (alter PLAYER-SESS
                   assoc
                   user
                   (dissoc m (.id ^Session ps))))))

      (countSessions [_]
        (dosync
          (if-let [m (@PLAYER-SESS user)]
            (int (count m))
            (int 0))))

      (addSession [_ ps]
        (dosync
          (let [m (ternary (@PLAYER-SESS user) {}) ]
            (alter PLAYER-SESS
                   assoc
                   user
                   (assoc m (.id ^Session ps) ps)))))

      (logout [_ ps]
        (dosync
          (when-let [m (@PLAYER-SESS user)]
            (doseq [^PlayerSession
                    pss (vals m)]
              (.close pss))
            (alter PLAYER-SESS dissoc user)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemovePlayer ""

  ^Player
  [^String user]

  (dosync
    (when-let [p (@PLAYER-REGO user) ]
      (alter PLAYER-REGO dissoc user)
      (when-let [m (@PLAYER-SESS user)]
        (doseq [^Session v (vals m)]
          (.close v)))
      (alter PLAYER-SESS dissoc user)
      p)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn CreatePlayer ""

  ^Player
  [^String user ^String pwd]

  (dosync
    (if-let [p (@PLAYER-REGO user)]
      p
      (let [p2 (ReifyPlayer user pwd)]
        (alter PLAYER-REGO assoc user p2)
        (alter PLAYER-SESS assoc user {})
        p2))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupPlayer ""

  (^Player
    [^String user ^String pwd]
    (CreatePlayer user pwd))

  (^Player
    [^String user]
    (dosync (get @PLAYER-REGO user))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private rego-eof nil)

