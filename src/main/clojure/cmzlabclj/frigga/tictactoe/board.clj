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

  cmzlabclj.frigga.tictactoe.board

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.nucleus.util.core :only [notnil? ternary MakeMMap RandomSign]]
        [cmzlabclj.nucleus.util.str :only [hgl? strim] ])

  (:use [cmzlabclj.cocos2d.games.meta]
        [cmzlabclj.odin.event.core]
        [cmzlabclj.odin.system.core])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.event Events]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

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
  (broadcastStatus [_ ecode cmd status] )
  (registerPlayers [_ p1 p2])
  (getCurActor [_])
  (isActive [_])
  (getPlayer2 [_])
  (getPlayer1 [_])
  (enqueue [_ cmd])
  (checkWin [_ cmd])
  (drawGame [_ cmd])
  (endGame [_ cmd combo])
  (toggleActor [_ cmd])
  (onStopReset [_])
  (repoke [_])
  (broadcast [_ cmd])
  (finz [_])
  (isStalemate [_])
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

      (broadcast [this cmd]
        (let [cp (.getCurActor this)
              op (.getOtherPlayer this cp)
              gvs (vec grid)
              src (if (notnil? cmd)
                    {:grid (vec grid) :cmd cmd}
                    {:grid (vec grid) })
              ^PlayerSession cpss (:session cp)
              ^PlayerSession opss (:session op) ]
          (.sendMessage opss (ReifyEvent Events/NETWORK_MSG
                                         Events/C_POKE_WAIT
                                         (json/write-str (assoc src :pnum (.number opss)))))
          (.sendMessage cpss (ReifyEvent Events/NETWORK_MSG
                                         Events/C_POKE_MOVE
                                         (json/write-str (assoc src :pnum (.number cpss)))))))

      (repoke [this]
        (let [^PlayerSession pss (:session (.getCurActor this))
              src {:pnum (.number pss)
                   :grid (vec grid) } ]
          (.sendMessage pss
                        (ReifyEvent Events/SESSION_MSG
                                    Events/C_POKE_MOVE
                                    (json/write-str src )))))

      (enqueue [this src]
        (let [gvs (:grid src)
              cmd (dissoc src :grid) ]
          (if (and (>= (:cell cmd) 0)
                   (< (:cell cmd) numcells)
                   (== (:value (.getCurActor this)
                               (:value cmd)))
                   (== CV_Z (aget grid (:cell cmd))))
            (do
              (aset ^longs grid (:cell cmd)
                    (long (:value cmd)))
              (.checkWin this cmd))
            (.repoke this))))

      (checkWin [this cmd]
        (log/debug "checking for win " (:color cmd)
                   ", pos = " (:cell cmd))
        (log/debug "current grid = " (vec grid))
        (if-let [combo (.isWinner this (.getCurActor this)) ]
          (.endGame this cmd combo)
          (if (.isStalemate this)
            (.drawGame this cmd)
            (.toggleActor this cmd))))

      (broadcastStatus [this ecode data status]
        (let [^PlayerSession pss (:session (.getCurActor this))
              ^PlayRoom room (.room pss)
              src (merge {:grid (vec grid) :status status }
                         data)
              evt (ReifyEvent Events/NETWORK_MSG
                              ecode
                              (json/write-str src)) ]
          (.broadcast room evt)))

      (drawGame [this cmd]
        (.onStopReset this)
        (.broadcastStatus this Events/C_STOP
                               {:cmd cmd :combo []}
                               0))

      (endGame [this cmd combo]
        (let [^PlayerSession pss (:session (.getCurActor this))]
          (log/debug "game to end, winner found! combo = " combo)
          (.onStopReset this)
          (.broadcastStatus this
                            Events/C_STOP
                            {:cmd cmd :combo combo}
                            (.number pss))))

      (toggleActor [this cmd]
        (aset #^"[Ljava.lang.Object;" actors 0
              (.getOtherPlayer this (.getCurActor this)))
        (.broadcast this cmd))

      (finz [this] (.onStopReset this))

      (onStopReset [this]
        (.setf! impl :gameon false))

      (isStalemate [_]
        (not (some #(== CV_Z %) (seq grid))))

      (isWinner [this actor]
        (log/debug "test isWinner - actor value = " (:value actor))
        (some (fn [r]
                (if (every? #(== (:value actor) %)
                            ;;(map #(aget grid %) r))
                            (let [xxx
                            (amap ^longs r idx ret
                                  (long (aget ^longs grid (aget ^longs r idx))))]
                              (log/debug "test one row === " (vec xxx))
                              xxx))
                  (vec r)
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

