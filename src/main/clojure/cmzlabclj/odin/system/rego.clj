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

  cmzlabclj.odin.system.rego

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.cocos2d.games.meta])

  (:import  [com.zotohlab.odin.game Game PlayRoom Player PlayerSession Session]
            [com.zotohlab.odin.event EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; reconnect registry of abandoned sessions.
;; { reconnection-key -> session }
(def ^:private RECONN-REGO (ref {}))

;; players
;; { player-id -> player }
(def ^:private PLAYER-REGO (ref {}))

;; { player-id -> map of sessions { id -> session } }
(def ^:private PLAYER-SESS (ref {}))

;; { room-id -> room }
(def ^:private GAME-ROOMS (ref {}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupGame ""

  ^Game
  [^String gameid]

  (if-let [g (get (GetGamesAsUUID) gameid) ]
    (let [ [flag minp maxp] (get g "network")]
      (reify Game
        (maxPlayers [_] (if (nil? maxp) Integer/MAX_VALUE (int maxp)))
        (minPlayers [_] (if (nil? minp) 2 (int minp)))
        (supportMultiPlayers [_] (true? flag))
        (getName [_] (get g "name"))
        (info [_] g)
        (id [_] (get g "uuid"))
        (unload [_] nil)))
    nil
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemoveRoom ""

  ^PlayRoom
  [^String room]

  (dosync
    (when-let [r (get @GAME-ROOMS room) ]
      (alter GAME-ROOMS dissoc room)
      r)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AddRoom ""

  ^PlayRoom
  [^PlayRoom room]

  (dosync
    (alter GAME-ROOMS assoc (.roomId room) room)
    room
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupRoom ""

  ^PlayRoom
  [^String room]

  (dosync
    (get @GAME-ROOMS room)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemoveSession "For possible reconnection."

  ^Session
  [^String reconnKey]

  (dosync
    (when-let [s (get @RECONN-REGO reconnKey) ]
      (alter RECONN-REGO dissoc reconnKey)
      s)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AddSession "For possible reconnection."

  [^String reconnKey
   ^Session s]

  (dosync
    (alter RECONN-REGO assoc reconnKey s)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupSession "For possible reconnection."

  ^Session
  [^String reconnKey]

  (dosync
    (get @RECONN-REGO reconnKey)
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

      (removeSession [_  ps]
        (dosync
          (if-let [m (get @PLAYER-SESS user) ]
            (alter PLAYER-SESS
                   assoc
                   user
                   (dissoc m (.id ^Session ps))))))

      (countSessions [_]
        (dosync
          (if-let [m (get @PLAYER-SESS user)]
            (int (count m))
            (int 0))))

      (addSession [_  ps]
        (dosync
          (let [m (ternary (get @PLAYER-SESS user) {}) ]
            (alter PLAYER-SESS
                   assoc
                   user
                   (assoc m (.id ^Session ps) ps)))))

      (logout [_ ps] ))
    ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemovePlayer ""

  ^Player
  [^String user]

  (dosync
    (when-let [p (get @PLAYER-REGO user) ]
      (alter PLAYER-REGO dissoc user)
      (alter PLAYER-SESS dissoc user)
      p)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn CreatePlayer ""

  ^Player
  [^String user ^String pwd]

  (dosync
    (if-let [p (get @PLAYER-REGO user)]
      p
      (let [p2 (ReifyPlayer user pwd)]
        (alter PLAYER-REGO assoc user p2)
        (alter PLAYER-SESS assoc user {})
        p2))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupPlayer ""

  (^Player [^String user ^String pwd] (CreatePlayer user pwd))

  (^Player [^String user] (dosync (get @PLAYER-REGO user))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private rego-eof nil)

