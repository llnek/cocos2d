;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014 Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl"}

  cmzlabclj.frigga.common.negamax

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:import  [com.zotohlab.odin.game Game PlayRoom Player PlayerSession Session]
            [com.zotohlab.odin.event EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private PINF 1000000)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol NegaAlgoAPI "" (evaluate [_]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol NegaSnapshotAPI

  ""

  (setLastBestMove [_ m] )
  (setOther [_ o] )
  (setCur [_ c] )
  (setState [_ s] )
  (lastBestMove [_] )
  (other [_] )
  (cur [_] )
  (state [_] ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn NegaMax ""

  [board game maxDepth depth alpha beta]

  (cond
    (or (== depth 0)
        (.isOver board game))
    (.evalScore board game)

    :else
    (with-local-vars [openMoves (.getNextMoves board game)
                      bestValue (- PINF)
                      localAlpha alpha
                      halt false
                      rc 0
                      bestMove (nth openMoves 0) ]
      (when (== depth maxDepth)
        (.setLastBestMove game (nth @openMoves 0))) ;; this will change overtime, most likely
      (loop [n 0]
        (when-not (or (> n (count @openMoves))
                      (true? @halt))
          (let [move (nth @openMoves n) ]
            (.makeMove board game move)
            (.switchPlayer board game)
            (var-set rc (- (NegaMax board game maxDepth
                                    (dec depth)
                                    (- beta)
                                    (- @localAlpha))))
            (.switchPlayer board game)
            (.unmakeMove board game move)
            (var-set bestValue (Math/max @bestValue @rc))
            (when (< @localAlpha @rc)
              (var-set localAlpha @rc)
              (var-set bestMove move)
              (when (== depth maxDepth)
                (.setLastBestMove game move))
              (when (>= @localAlpha beta)
                (var-set halt true)))
            (recur (inc n) ))))
      @bestValue)
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyNegaMaxAlgo  ""

  ^cmzlabclj.frigga.common.negamax.NegaAlgoAPI
  [board]

  (reify NegaAlgoAPI
    (evaluate [_]
      (let [snapshot (.takeSnapshot board) ]
        ;;(require 'cmzlabclj.frigga.common.negamax)
        (NegaMax board snapshot 10 10 (- PINF) PINF)
        (.lastBestMove snapshot)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySnapshot ""

  ^cmzlabclj.frigga.common.negamax.NegaSnapshotAPI
  []

  (let [impl (MakeMMap)]
    (reify NegaSnapshotAPI
      (setLastBestMove [_ m] (.setf! impl :lastbestmove m))
      (setOther [_ o] (.setf! impl :other o))
      (setCur [_ c] (.setf! impl :cur c))
      (setState [_ s] (.setf! impl :state s))
      (lastBestMove [_] (.getf impl :lastbestmove))
      (other [_] (.getf impl :other))
      (cur [_] (.getf impl :cur))
      (state [_] (.getf impl :state)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private negamax-eof nil)

