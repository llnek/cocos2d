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

  cmzlabclj.odin.core.rego

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.string :as cstr])
  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:import  [com.zotohlab.odin.game Game PlayRoom Player Session]))

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
(defn- enableHandlers ""

  [^EventDispatcher disp
   ^PlayerSession ps]

  ;; Add the handler to the game room's EventDispatcher so that it will
  ;; pass game room network events to player session session.
  (let [h (ReifyNetworkEventListener ps) ]
    (.addHandler disp h)
    (log/debug "added Network listener for session " ps)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- applyProtocol ''

  [^PlaySession ps]

  (let [^Channel ch (-> (.getTcpSender ps)(.impl))
        pipe (.pipeline ch) ]
    (log/debug "applying websocket protocol to the player session " ps)
    (.addLast pipe "PlayerSessionHandler", (ReifyPlayerSessionHandler ps))
    ;;(.remove pipe "IDLE_STATE_CHECK_HANDLER")
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- postConnect ""

  [^StateManager stateMgr
   ^PlaySession ps]

  (.setStatus ps Session$Status/CONNECTED)
  (when-let [state (.getState stateMgr) ]
    (.onEvent ps (Events/networkEvent state))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayRoom ""

  ^PlayRoom
  [^Game g]

  (let [disp (EventDispatchers/jetLang nil)
        sess (ConcurrentHashMap.)
        impl (MakeMMap)
        mgr nil]
    (reify PlayRoom

      (isShuttingDown [_] (.getf impl :shutting))
      (game [_] g)
      (stateManager [_] mgr)

      (disconnect [_ ps]
        (.removeHandlers disp ps)
        (.remove sess (.id ps)))

      (connect [this player]
        (if (.isShuttingDown this)
          (do
            (log/warn "play room is shutting down, rejecting " player)
            nil)
          (let [ps (ReifyPlayerSession this player)]
            (enableHandlers disp ps)
            (applyProtocol ps)
            (.put sess (.id ps) ps)
            (postConnect mgr ps)
            ps)))

      (roomId [_] "")

      (broadcast [_ evt] (.onEvent this evt))
      (post [_ evt] (.onEvent this evt))

      (shutdown [this]
        (let [cb (reify Callable
                   (call [_]
                     (.setf! impl :shutting true)
                     (doseq [v (seq (.values sess))]
                       (.close v))
                     (.clear sess)
                     (.setf! impl :shutting false))) ]
        (CoreUtils/syncExec this cb)))
  )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn CreateRoom ""

  ^PlayRoom
  [^Game g]

  (dosync
    (let [r (ReifyPlayRoom g) ]
      (alter GAME-ROOMS assoc (.id r) r)
      r)
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

