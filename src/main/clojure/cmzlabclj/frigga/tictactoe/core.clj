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
      :author "kenl"}

  cmzlabclj.frigga.tictactoe.core

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.cocos2d.games.meta]
        [cmzlabclj.odin.event.core]
        [cmzlabclj.frigga.tictactoe.board])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.event Events EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mapPlayers ""

  [players]

  (reduce #(assoc %1 (.id ^PlayerSession %2) %2)
          {}
          players
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mapPlayersEx ""

  [players]

  {:players (reduce (fn [memo ^PlayerSession ps]
                      (assoc memo
                             (.id (.player ps))
                             [ (.number ps) (.id (.player ps)) ]))
                    {}
                    players) })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TicTacToe [stateAtom stateRef] com.zotohlab.odin.game.GameEngine

  (initialize [_ players]
    (require 'cmzlabclj.frigga.tictactoe.core)
    (let [m (mapPlayers players) ]
      (dosync
        (reset! stateAtom {:players players})
        (ref-set stateRef m))))

  (start [_]
    (require 'cmzlabclj.frigga.tictactoe.board)
    (let [ps (:players @stateAtom)
          p1 (ReifyPlayer (long \X) \X (nth ps 0))
          p2 (ReifyPlayer (long \O) \O (nth ps 1))
          bd (ReifyTicTacToeBoard 3) ]
      (swap! stateAtom assoc :board bd)
      (.registerPlayers bd p1 p2)
      (.broadcast bd nil)))

  (update [this evt]
    (log/debug "game engine got an update " evt)
    (condp == (:type evt)
      Events/NETWORK_MSG (.onNetworkMsg this evt)
      Events/SESSION_MSG (.onSessionMsg this evt)
      (log/warn "game engine: unhandled update event " evt)))

  (onNetworkMsg [this evt]
    (condp == (:code evt)
      Events/C_REPLAY
      (.restart this)

      nil))

  (onSessionMsg [this evt]
    (condp == (:code evt)
      Events/C_REPLAY
      (.onNetworkMsg this evt)

      Events/C_PLAY_MOVE
      (let [^cmzlabclj.frigga.tictactoe.board.BoardAPI
            bd (:board @stateAtom)
            cp (.getCurActor bd)
            pss (:context evt)
            src (:source evt)
            cmd (json/read-str src
                               :key-fn keyword) ]
        (log/debug "TicTacToe received cmd " src " from session " pss)
        (.enqueue bd cmd))

      Events/C_STARTED
      (do
        (log/debug "TicTacToe received started event " evt)
        (let [^PlayerSession ps (:context evt) ]
        (dosync
          (let [m (dissoc @stateRef (.id ps)) ]
            (if (= (count m) 0)
              (do
                (ref-set stateRef {})
                (.start this))
              (ref-set stateRef m))))))

      (log/warn "game engine: unhandled session msg " evt)))

  (restart [this ]
    (log/debug "restarting game one more time.....................")
    (require 'cmzlabclj.frigga.tictactoe.core)
    (let [parr (:players @stateAtom)
          pss (first parr)
          room (.room ^PlayerSession pss)
          m (mapPlayers parr)
          src (mapPlayersEx parr)
          evt (ReifyEvent Events/NETWORK_MSG
                          Events/C_RESTART
                          (json/write-str src)) ]
      (dosync (ref-set stateRef m))
      (.broadcast ^PlayRoom room evt)))

  (ready [_  room]
    (require 'cmzlabclj.frigga.tictactoe.core)
    (let [src (mapPlayersEx (:players @stateAtom))
          evt (ReifyEvent Events/NETWORK_MSG
                          Events/C_START
                          (json/write-str src)) ]
      (.broadcast ^PlayRoom room evt)))

  (stop [_] )
  (finz [_] )

  (state [_] @stateAtom))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

