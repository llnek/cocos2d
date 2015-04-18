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
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.xlib.util.format]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.odin.event.core]
        [czlabclj.frigga.core.util]
        [czlabclj.frigga.pong.arena])

  (:import  [com.zotohlab.odin.game Game PlayRoom GameEngine
                                    Player PlayerSession]
            [com.zotohlab.odin.event EventError Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onNetworkMsg

  ""

  [^GameEngine eng evt stateAtom stateRef]

  nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onSessionMsg ""

  [^GameEngine eng evt stateRef]

  (condp = (:code evt)

    Events/REPLAY
    (.restart eng {})

    Events/PLAY_MOVE
    (let [^czlabclj.frigga.pong.arena.ArenaAPI
          aa (:arena (.state eng))
          src (:source evt)
          pss (:context evt)]
      (log/debug "received paddle-move "
                 src
                 " from session " pss)
      (.enqueue aa evt))

    Events/STARTED
    (do
      (let [^PlayerSession pss (:context evt)
            src (:source evt)
            cmd (ReadJsonKW src)]
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
(deftype Pong [stateAtom stateRef]

  GameEngine

  ;; one time only, sets up the players
  (initialize [_ players]
    (let [m (MapPlayers players) ]
      (dosync
        (reset! stateAtom {:players players})
        (ref-set stateRef m))))

  ;; starts a new game by creating a new arena and players
  ;; follow by starting the first point.
  (start [this options]
    ;;(require 'czlabclj.frigga.pong.arena)
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
    (condp = (:type evt)
      Msgs/NETWORK
      (throw (EventError. "Unexpected network event."))

      Msgs/SESSION
      (onSessionMsg this evt stateRef)

      (log/warn "game engine: unhandled msg " evt)))

  (restart [this options]
    (log/debug "restarting game one more time.")
    ;;(require 'czlabclj.frigga.pong.core)
    (let [parr (:players @stateAtom)
          m (MapPlayers parr)]
      (dosync (ref-set stateRef m))
      (BCastAll this
                Events/RESTART
                (MapPlayersEx parr))))

  (ready [this room]
    ;;(require 'czlabclj.frigga.pong.core)
    (swap! stateAtom assoc :room room)
    (BCastAll this
              Events/START
              (MapPlayersEx (:players @stateAtom))))

  (startRound [_ cmd]
    (let [^czlabclj.frigga.pong.arena.ArenaAPI
          arena (:arena @stateAtom)]
      (.startPoint arena cmd)))

  (endRound [_ obj]
    (swap! stateAtom dissoc :arena))

  (container [_] (:room @stateAtom))

  (stop [_] )
  (finz [_] )

  (state [_] @stateAtom))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

