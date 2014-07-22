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

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap RandomSign]]
        [cmzlabclj.nucleus.util.str :only [hgl? strim] ])

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
          (aset h c (long (+ c (* r bsize))))
          (aset v c (long (+ r (* c bsize)))))
        (var-set rowsp (conj! @rowsp h))
        (var-set colsp (conj! @colsp v))
        (aset ^longs @dx r (long (+ r (* r bsize))))
        (aset ^longs @dy r (long (+ r (* bsize (dec (- bsize r))))))))
    (into [] (concat [@dx] [@dy]
                     (persistent! @rowsp)
                     (persistent! @colsp)))
  ))

;;(doseq [v (mapGoalSpace 3)]
;;(println (seq v)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayer ""

  [idValue pcolor psession]

  {:value idValue
   :color pcolor
   :session psession })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol BoardAPI

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

  ^cmzlabclj.frigga.tictactoe.board.BoardAPI
  [bsize]

  (let [grid (long-array (* bsize bsize) CV_Z)
        goalspace (mapGoalSpace bsize)
        actors (object-array 3)
        numcells (alength grid)
        impl (MakeMMap) ]
    (.setf! impl :gameon false)
    (reify BoardAPI

      (getCurActor [_] (aget #^"[Ljava.lang.Object;" actors 0))
      (isActive [_] (.getf impl :gameon))

      (registerPlayers [this p1 p2]
        (let [which (if (> (RandomSign) 0) p1 p2)]
          (aset #^"[Ljava.lang.Object;" actors 0 which)
          (aset #^"[Ljava.lang.Object;" actors 2 p2)
          (aset #^"[Ljava.lang.Object;" actors 1 p1)
          (.setf! impl :gameon true)))

      (getPlayer2 [_] (aget #^"[Ljava.lang.Object;" actors 2))
      (getPlayer1 [_] (aget #^"[Ljava.lang.Object;" actors 1))

      (enqueue [this cmd cb]
        (when (and (>= (:cell cmd) 0)
                   (< (:cell cmd) numcells)
                   (identical? (:actor cmd)
                               (.getCurActor this))
                   (== CV_Z (aget grid (:cell cmd))))
          (aset ^longs grid (:cell cmd)
                (long (:value (:actor cmd))))
          (.checkWin this cmd cb)))

      (checkWin [this cmd cb]
        (log/debug "checking for win " (:color (:actor cmd))
                   ", pos = " (:cell cmd))
        (cond
          (.isWinner this (:actor cmd))
          (.endGame this cmd cb)

          (.isStalemate this)
          (.drawGame this cmd cb)

          :else
          (.toggleActor this cmd cb)))

      (drawGame [this cmd cb]
        (.onStopReset this)
        (cb cmd "draw"))

      (endGame [this cmd cb]
        (.onStopReset this)
        (cb cmd "win"))

      (toggleActor [this cmd cb]
        (aset #^"[Ljava.lang.Object;" actors 0
              (.getOtherPlayer this (.getCurActor this)))
        (cb cmd "next" (.getCurActor this)))

      (finz [this] (.onStopReset this))
      (onStopReset [this]
        (.setf! impl :gameon false))

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
                (if (every? #(== (:value actor) %)
                            ;;(map #(aget grid %) r))
                            (amap ^longs r idx ret
                                  (long (aget ^longs grid (aget ^longs r idx)))))
                  r
                  nil))
              goalspace))

      (getOtherPlayer [_ cp]
        (condp identical? cp
          (aget #^"[Ljava.lang.Object;" actors 1)
          (aget #^"[Ljava.lang.Object;" actors 2)
          ;;else
          (aget #^"[Ljava.lang.Object;" actors 2)
          (aget #^"[Ljava.lang.Object;" actors 1)

          nil))

  )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private board-eof nil)

