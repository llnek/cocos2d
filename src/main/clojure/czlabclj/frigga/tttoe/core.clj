; This library is distributed in  the hope that it will be useful but without
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

  czlabclj.frigga.tttoe.core

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.format]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.odin.event.core]
        [czlabclj.frigga.core.util]
        [czlabclj.frigga.tttoe.arena])

  (:import  [com.zotohlab.odin.game Game PlayRoom GameEngine
                                    Player PlayerSession]
            [com.zotohlab.odin.event EventError Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onSessionMsg ""

  [^GameEngine eng evt stateRef]

  (condp = (:code evt)

    Events/REPLAY
    (.restart eng {})

    Events/PLAY_MOVE
    (let [bd (:arena (.state eng))
          pss (:context evt)
          src (:source evt)
          cmd (ReadJsonKW src)]
      (log/debug "TicTacToe rec'ved cmd " src " from session " pss)
      (-> ^czlabclj.frigga.tttoe.arena.BoardAPI bd (.enqueue cmd)))

    Events/STARTED
    (do
      (log/debug "TicTacToe received started event " evt)
      (let [^PlayerSession ps (:context evt) ]
      (dosync
        (let [m (dissoc @stateRef (.id ps)) ]
          (if (empty? m)
            (do
              (ref-set stateRef {})
              (.start eng {}))
            (ref-set stateRef m))))))

    (log/warn "game engine: unhandled session msg " evt)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onInitialize [stateAtom stateRef players]
  (dosync
    (ref-set stateRef (MapPlayers players))
    (reset! stateAtom {:players players})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onStart [this stateAtom options]
  (let [[ps1 ps2] (:players @stateAtom)
        p1 (ReifyPlayer (long \X) \X ps1)
        p2 (ReifyPlayer (long \O) \O ps2)
        bd (ReifyArena this {}) ]
    (swap! stateAtom assoc :arena bd)
    (.registerPlayers bd p1 p2)
    (.dequeue bd nil)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onUpdate [this stateRef evt]
  (log/debug "game engine got an update " evt)
  (condp = (:type evt)
    Msgs/NETWORK
    (throw (EventError. "Unexpected network event."))

    Msgs/SESSION
    (onSessionMsg this evt stateRef)

    (log/warn "game engine: unhandled msg " evt)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onRestart [this stateAtom stateRef options]
  (log/debug "restarting tictactoe game one more time...")
  (let [parr (:players @stateAtom)
        m (MapPlayers parr)]
    (dosync (ref-set stateRef m))
    (BCastAll (.container this)
              Events/RESTART (MapPlayersEx parr))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onReady [this stateAtom room]
  (swap! stateAtom assoc :room room)
  (BCastAll (.container this)
            Events/START
            (MapPlayersEx (:players @stateAtom))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TicTacToe [stateAtom stateRef]

  GameEngine

  (initialize [this players]
    (require 'czlabclj.frigga.tttoe.core)
    (onInitialize stateAtom stateRef players))

  (start [this options]
    (require 'czlabclj.frigga.tttoe.core)
    (onStart this stateAtom options))

  (update [this evt]
    (require 'czlabclj.frigga.tttoe.core)
    (onUpdate this stateRef evt))

  (restart [this options]
    (require 'czlabclj.frigga.tttoe.core)
    (onRestart this stateAtom stateRef options))

  (ready [this room]
    (require 'czlabclj.frigga.tttoe.core)
    (onReady this stateAtom room))

  (container [_] (:room @stateAtom))

  (startRound [_ obj])
  (endRound [_ obj])

  (stop [_] )
  (finz [_] )

  (state [_] @stateAtom))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

