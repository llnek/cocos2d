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
      :author "kenl"}

  czlabclj.frigga.pong.core

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.odin.event.core]
        [czlabclj.frigga.pong.arena])

  (:import  [com.zotohlab.odin.game Game PlayRoom GameEngine
                                    Player PlayerSession]
            [com.zotohlab.odin.event Msgs
             Events Dispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mapPlayers ""

  ;; outputs map {id -> player-session}
  [players]

  (reduce #(assoc %1 (.id ^PlayerSession %2) %2)
          {}
          players
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mapPlayersEx ""

  ;; outputs map {id -> [player-number, player-id]}
  [players]

  {:ppids (reduce (fn [memo ^PlayerSession ps]
                      (assoc memo
                             (.id (.player ps))
                             [ (.number ps) (.id (.player ps)) ]))
                    {}
                    players) })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- bcastAll "Broadcast message to all player sessions."

  [^PlayRoom room code cmd]

  (let [evt (ReifyEvent Msgs/NETWORK
                        code
                        (if-not (nil? cmd)
                          (json/write-str cmd))) ]
    (.broadcast room evt)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onNetworkMsg

  ""

  [^GameEngine eng evt stateAtom stateRef]

  (condp = (:code evt)
    Events/C_REPLAY
    (.restart eng {})

    (log/warn "game engine: unhandled network msg " evt)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onSessionMsg ""

  [^GameEngine eng evt stateAtom stateRef]

  (condp = (:code evt)
    Events/C_REPLAY
    (onNetworkMsg eng evt stateAtom stateRef)

    Events/C_PLAY_MOVE
    (let [^czlabclj.frigga.pong.arena.ArenaAPI
          aa (:arena @stateAtom)
          src (:source evt)
          pss (:context evt)]
      (log/debug "received paddle-move "
                 src
                 " from session " pss)
      (.enqueue aa evt))

    Events/C_STARTED
    (do
      (let [^PlayerSession pss (:context evt)
            src (:source evt)
            cmd (json/read-str src :key-fn keyword) ]
        (log/debug "received started-event from " pss)
        (dosync
          (let [m (dissoc @stateRef (.id pss)) ]
            (if (empty? m)
              (do
                (ref-set stateRef {})
                (.start eng cmd))
              (ref-set stateRef m))))))

    (log/warn "game engine: unhandled session msg " evt)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype Pong [stateAtom stateRef] com.zotohlab.odin.game.GameEngine

  ;; one time only, sets up the players
  (initialize [_ players]
    (require 'czlabclj.frigga.pong.core)
    (let [m (mapPlayers players) ]
      (dosync
        (reset! stateAtom {:players players})
        (ref-set stateRef m))))

  ;; starts a new game by creating a new arena and players
  ;; follow by starting the first point.
  (start [this options]
    (require 'czlabclj.frigga.pong.arena)
    (let [ps (:players @stateAtom)
          p1 (ReifyPlayer (long \X) \X (nth ps 0))
          p2 (ReifyPlayer (long \O) \O (nth ps 1))
          ^czlabclj.frigga.pong.arena.ArenaAPI
          aa (ReifyPongArena this options) ]
      (swap! stateAtom assoc :arena aa)
      (.registerPlayers aa p1 p2)
      (.startRound this {:new true})))

  ;; updates from clients
  (update [this evt]
    (log/debug "game engine got an update " evt)
    (.onMsg this evt))

  (onMsg [this evt]
    (condp = (:type evt)
      Msgs/NETWORK
      (onNetworkMsg this evt stateAtom stateRef)
      (onSessionMsg this evt stateAtom stateRef)
      nil))

  (restart [this options]
    (log/debug "restarting game one more time.")
    (require 'czlabclj.frigga.pong.core)
    (let [parr (:players @stateAtom)
          m (mapPlayers parr)
          room (-> ^PlayerSession
                   (first parr)
                   (.room ))]
      (dosync (ref-set stateRef m))
      (bcastAll room
                Events/C_RESTART
                (mapPlayersEx parr))))

  (ready [_ room]
    (require 'czlabclj.frigga.pong.core)
    (bcastAll room
              Events/C_START
              (mapPlayersEx (:players @stateAtom))))

  (startRound [_ cmd]
    (let [^czlabclj.frigga.pong.arena.ArenaAPI
          arena (:arena @stateAtom)]
      (.startPoint arena cmd)))

  (endRound [_ obj]
    (swap! stateAtom dissoc :arena))

  (stop [_] )
  (finz [_] )

  (state [_] @stateAtom))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

