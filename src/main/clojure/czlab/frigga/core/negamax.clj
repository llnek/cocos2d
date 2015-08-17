;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2015, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl"}

  czlab.frigga.core.negamax

  (:require [czlab.xlib.util.core :refer [MubleObj! notnil? ]]
            [czlab.xlib.util.str :refer [strim nsb hgl?]])

  (:require [clojure.tools.logging :as log])

  (:import  [com.zotohlab.odin.game Game PlayRoom
             Board Player PlayerSession]
           [com.zotohlab.skaro.core Muble]
            [com.zotohlab.odin.core Session]))

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
(defn NegaMax "The Nega-Max algo implementation."
  [^czlab.frigga.core.negamax.NegaSnapshotAPI
   game
   ^Board board
   maxDepth depth alpha beta]

  (if (or (== depth 0)
          (.isOver board game))
    (.evalScore board game)
    ;;:else
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
            (doto board
              (.makeMove game move)
              (.switchPlayer game))
            (var-set rc (- (NegaMax game board maxDepth
                                    (dec depth)
                                    (- beta)
                                    (- @localAlpha))))
            (doto board
              (.switchPlayer game)
              (.unmakeMove game move))
            (var-set bestValue (Math/max (long @bestValue) (long @rc)))
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
(defn ReifyNegaMaxAlgo  "Create an implementation of nega-max."

  ^czlab.frigga.core.negamax.NegaAlgoAPI
  [^Board board]

  (reify NegaAlgoAPI
    (evaluate [_]
      (let [^czlab.frigga.core.negamax.NegaSnapshotAPI
            snapshot (.takeSnapshot board) ]
        ;;(require 'czlab.frigga.core.negamax)
        (NegaMax snapshot board 10 10 (- PINF) PINF)
        (.lastBestMove snapshot)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifySnapshot "Create a snapshot."

  ^czlab.frigga.core.negamax.NegaSnapshotAPI
  []

  (let [impl (MubleObj!)]
    (reify NegaSnapshotAPI
      (setLastBestMove [_ m] (.setv impl :lastbestmove m))
      (setOther [_ o] (.setv impl :other o))
      (setCur [_ c] (.setv impl :cur c))
      (setState [_ s] (.setv impl :state s))
      (lastBestMove [_] (.getv impl :lastbestmove))
      (other [_] (.getv impl :other))
      (cur [_] (.getv impl :cur))
      (state [_] (.getv impl :state)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

