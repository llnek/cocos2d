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

  cmzlabclj.frigga.tictactoe.board

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.nucleus.util.str :only [hgl? strim] ]
        [cmzlabclj.nucleus.util.core :only [RandomSign]])

  (:use [cmzlabclj.cocos2d.games.meta]
        [cmzlabclj.odin.system.core])

  (:import  [java.util Date ArrayList List HashMap Map]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private CV_Z 0)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- mapGoalSpace ""

  [bsize]

  (with-local-vars [dx (long-array bsize 0)
                    dy (long-array bsize 0)
                    rowsp (transient [])
                    colsp (transient []) ]
    (doseq [r (range 0 bsize)]
      (let [h (long-array bsize 0)
            v (long-array bsize 0) ]
        (doseq [c (range 0 bsize)]
          (aset h c (+ c (* r bsize)))
          (aset v c (+ r (* c bsize))))
        (var-set rowsp (conj! rowsp h))
        (var-set colsp (conj! colsp v))
        (aset @dx r (+ r (* r bsize)))
        (aset @dy r (+ r (* bsize (dec (- bsize r)))))))
    (into [] (concat [@dx] [@dy]
                     (persistent! @rowsp)
                     (persistent! @colsp)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol PlayerAPI

  ""

  (bindBoard [_ b] )
  (isValue [_ v] ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayer ""

  ^cmzlabclj.frigga.tictactoe.board.PlayerAPI
  [idValue]

  (let []
    (reify PlayerAPI
      (isValue [_ v] (= v idValue))
      (bindBoard [_ b]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol TicTacToeBoardAPI

  ""

  (registerPlayers [_ p1 p2])
  (getCurActor [_])
  (isActive [_])
  (getPlayer2 [_])
  (getPlayer1 [_])
  (enqueue [_ cmd cb])
  (checkWin [_ cmd cb])
  (drawGame [_ cmd cb])
  (endGame [_ cmd cb])
  (toggleActor [_ cmd cb])
  (onStopReset [_])
  (finz [_])
  (isStalemate [_])
  (checkWinner [_])
  (isWinner [_ a])
  (getOtherPlayer [_ a]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyTicTacToeBoard ""

  ^cmzlabclj.frigga.tictactoe.board.TicTacToeBoardAPI
  [bsize]

  (let [grid (long-array (* bsize bsize) CV_Z)
        goalspace (mapGoalSpace bsize)
        numcells (alength grid)
        actors (make-array Object 3)
        impl (MakeMMap) ]
    (.setf! impl :gameon false)
    (reify TicTacToeBoardAPI

      (isActive [_] (.getf impl :gameon))
      (getCurActor [_] (aget actors 0))

      (registerPlayers [this p1 p2]
        (aset actors 2 p2)
        (aset actors 1 p1)
        (aset actors 0 (if (> (RandomSign) 0) p1 p2))
        (.bindBoard p2 this)
        (.bindBoard p1 this)
        (.setf! impl :gameon true))

      (getPlayer2 [_] (aget actors 2))
      (getPlayer1 [_] (aget actors 1))

      (enqueue [this cmd cb]
        (when (and (>= (.cell cmd) 0)
                   (< (.cell cmd) numcells)
                   (identical? (.actor cmd)
                               (.getCurActor this))
                   (== CV_Z (aget grid (.cell cmd))))
          (aset grid (.cell cmd) (-> (.actor cmd)
                                     (.value)))
          (.checkWin this cmd cb)))

      (checkWin [this cmd cb]
        (log/debug "checking for win " (.color (.actor cmd))
                   ", pos = " (.cell cmd))
        (cond
          (.isStalemate this)
          (.drawGame this cmd cb)

          (.isWinner this (.actor cmd)) ;;[0]
          (.endGame this cmd cb)

          :else
          (.toggleActor this cmd cb)))

      (drawGame [this cmd cb]
        (.onStopReset this)
        (cb cmd "draw"))

      (endGame [this cmd cb]
        (.onStopReset this)
        (cb cmd "win"))

      (toggleActor [this cmd cb]
        (aset actors 0 (.getOtherPlayer this
                                        (.getCurActor this)))
        (cb cmd "next" (.getCurActor this)))

      (finz [this] (.onStopReset this))
      (onStopReset [this]
        (.setf! impl :gameon false)
        (aset actors 0 nil))

      (isStalemate [_]
        (not (some #(== CV_Z %) grid)))

      (checkWinner [this]
        (some (fn [a]
                (if-let [w (.isWinner this a)]
                  [a w]
                  nil))
              (drop 1 actors)))

      (isWinner [this actor]
        (some (fn [r]
                (if (every? #(.isValue actor %)
                            ;;(map #(aget grid %) r))
                            (amap r idx ret
                                  (aget grid (aget r idx))))
                  r
                  nil))
              goalspace))

      (getOtherPlayer [_ color]
        (condp identical? color
          (aget actors 1)
          (aget actors 2)
          ;;else
          (aget actors 2)
          (aget actors 1)

          nil))

  )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private board-eof nil)

