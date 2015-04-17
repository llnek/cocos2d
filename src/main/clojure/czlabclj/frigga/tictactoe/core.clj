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

  czlabclj.frigga.tictactoe.core

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            ;;[clojure.data.json :as js]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil? ]]
        [czlabclj.xlib.util.format]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.odin.event.core]
        [czlabclj.frigga.core.util]
        [czlabclj.frigga.tictactoe.board])

  (:import  [com.zotohlab.odin.game Game PlayRoom GameEngine
                                    Player PlayerSession]
            [com.zotohlab.odin.event Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onNetworkMsg ""

  [^GameEngine eng evt stateAtom stateRef]

  nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onSessionMsg ""

  [^GameEngine eng evt stateAtom stateRef]

  (condp = (:code evt)

    Events/REPLAY
    (.restart eng {})

    Events/PLAY_MOVE
    (let [bd (:board @stateAtom)
          pss (:context evt)
          src (:source evt)
          cmd (ReadJsonKW src)]
      (log/debug "TicTacToe rec'ved cmd " src " from session " pss)
      (-> ^czlabclj.frigga.tictactoe.board.BoardAPI
          bd
          (.enqueue cmd)))

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
(deftype TicTacToe [stateAtom stateRef]

  ;;com.zotohlab.odin.game.GameEngine
  GameEngine

  (initialize [_ players]
    ;;(require 'czlabclj.frigga.tictactoe.core)
    (let [m (MapPlayers players) ]
      (dosync
        (reset! stateAtom {:players players})
        (ref-set stateRef m))))

  (start [_ options]
    ;;(require 'czlabclj.frigga.tictactoe.board)
    (let [ps (:players @stateAtom)
          p1 (ReifyPlayer (long \X) \X (nth ps 0))
          p2 (ReifyPlayer (long \O) \O (nth ps 1))
          bd (ReifyTicTacToeBoard 3) ]
      (swap! stateAtom assoc :board bd)
      (.registerPlayers bd p1 p2)
      (.broadcast bd nil)))

  (update [this evt]
    (log/debug "game engine got an update " evt)
    (.onMsg this evt))

  (onMsg [this evt]
    (condp = (:type evt)
      Msgs/NETWORK
      (onNetworkMsg this evt stateAtom stateRef)

      Msgs/SESSION
      (onSessionMsg this evt stateAtom stateRef)

      (log/warn "game engine: unhandled msg " evt)))

  (restart [this options]
    (log/debug "restarting tictactoe game one more time...")
    ;;(require 'czlabclj.frigga.tictactoe.core)
    (let [parr (:players @stateAtom)
          room (-> ^PlayerSession
                   (first parr) (.room))
          src (MapPlayersEx parr)
          m (MapPlayers parr)
          evt (ReifyNWEvent Events/RESTART
                            (WriteJson src)) ]
      (dosync (ref-set stateRef m))
      (.broadcast room evt)))

  (ready [_ room]
    ;;(require 'czlabclj.frigga.tictactoe.core)
    (let [src (MapPlayersEx (:players @stateAtom))
          evt (ReifyNWEvent Events/START
                            (WriteJson src)) ]
      (.broadcast ^PlayRoom room evt)))

  (startRound [_ obj])
  (endRound [_ obj])

  (stop [_] )
  (finz [_] )

  (state [_] @stateAtom))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

