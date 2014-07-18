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
        [cmzlabclj.frigga.tictactoe.board])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.event EventDispatcher]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TicTacToe [stateObj] com.zotohlab.odin.game.GameEngine

  (initialize [_ players]
    (let [p1 (ReifyPlayer (long \X) \X (nth players 0))
          p2 (ReifyPlayer (long \O) \O (nth players 1))
          bd (ReifyTicTacToeBoard 3) ]
      (reset! stateObj {:board bd})
      (.registerPlayers bd p1 p2)))

  (update [_ evt]
    (let [^cmzlabclj.frigga.tictactoe.board.BoardAPI
          bd (:board @stateObj)
          cp (.getCurActor bd)
          pss (:context evt)
          src (:source evt)
          cmd (json/read-str src
                             :key-fn keyword) ]
      (log/debug "TicTacToe received cmd " src " from session " pss)
      (when (== (:value cp) (:value cmd))
        (.enqueue bd (assoc cmd :actor cp) nil))))

  (restart [_ room] )

  (start [_ room]
    (let [^cmzlabclj.frigga.tictactoe.board.BoardAPI
          bd (:board @stateObj)
          cp (.getCurActor bd)
          op (.getOtherPlayer bd cp)
          evt ()]
      (.broadcast ^PlayRoom room evt) ;; start game
      (.broadcast ^PlayRoom room evt) ;; who is player1,2
      (.sendMessage ^PlayerSession
                    (:session op) evt);; poke_wait
      (.sendMessage ^PlayerSession
                    (:session cp) evt)));; poke_move

  (stop [_] )
  (finz [_] )

  (state [_] @stateObj))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

