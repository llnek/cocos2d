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

  czlab.frigga.tttoe.arena

  (:require [czlab.xlib.util.str :refer [hgl? strim]]
            [czlab.xlib.util.core
             :refer
             [notnil? MakeMMap RandomSign]])

  (:require [clojure.tools.logging :as log])

  (:use [czlab.xlib.util.format]
        [czlab.cocos2d.games.meta]
        [czlab.odin.event.core])

  (:import  [com.zotohlab.odin.game Game PlayRoom GameEngine
                                    Player PlayerSession]
            [com.zotohlab.skaro.core Muble]
            [com.zotohlab.odin.event Msgs Events]))

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
        (aset ^longs @dy r
              (long (+ r (* bsize
                            (dec (- bsize r))))))))
    (into [] (concat [@dx] [@dy]
                     (persistent! @rowsp)
                     (persistent! @colsp)))
  ))

(comment
  (doseq [v (mapGoalSpace 3)]
  (println (seq v))))

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
  (engine [_])
  (getCur [_])
  (getOther [_ a])
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
  (dequeue [_ cmd])
  (finz [_])
  (isStalemate [_])
  (isWinner [_ a]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyArena ""

  ^czlab.frigga.tttoe.arena.BoardAPI
  [^GameEngine theEngine options]

  (let [bsize (or (:size options) 3)
        grid (long-array (* bsize bsize) CV_Z)
        goalspace (mapGoalSpace bsize)
        actors (object-array 3)
        numcells (alength grid)
        impl (MakeMMap {:gameon false}) ]
    (reify BoardAPI

      (getCur [_] (aget #^"[Ljava.lang.Object;" actors 0))
      (isActive [_] (.getv impl :gameon))

      (engine [_] theEngine)

      (registerPlayers [this p1 p2]
        (let [which (if (> (RandomSign) 0) p1 p2)]
          (aset #^"[Ljava.lang.Object;" actors 0 which)
          (aset #^"[Ljava.lang.Object;" actors 2 p2)
          (aset #^"[Ljava.lang.Object;" actors 1 p1)
          (.setv impl :gameon true)))

      (getPlayer2 [_] (aget #^"[Ljava.lang.Object;" actors 2))
      (getPlayer1 [_] (aget #^"[Ljava.lang.Object;" actors 1))

      (dequeue [this cmd]
        (let [^PlayRoom room (.container theEngine)
              cp (.getCur this)
              op (.getOther this cp)
              gvs (vec grid)
              src (if-not (nil? cmd)
                    {:grid (vec grid) :cmd cmd}
                    {:grid (vec grid) })
              ^PlayerSession cpss (:session cp)
              ^PlayerSession opss (:session op) ]
          (->> (ReifySSEvent Events/POKE_WAIT
                             (assoc src :pnum (.number opss))
                             opss)
               (.sendMsg room))
          (->> (ReifySSEvent Events/POKE_MOVE
                             (assoc src :pnum (.number cpss))
                             cpss)
               (.sendMsg room))))

      (repoke [this]
        (let [^PlayerSession pss (:session (.getCur this))
              ^PlayRoom room (.container theEngine)]
          (->> (ReifySSEvent Events/POKE_MOVE
                             {:pnum (.number pss)
                              :grid (vec grid) }
                             pss)
               (.sendMsg room))))

      (enqueue [this src]
        (let [cmd (dissoc src :grid)
              gvs (:grid src)]
          (if (and (>= (:cell cmd) 0)
                   (< (:cell cmd) numcells)
                   (= (:value (.getCur this)
                              (:value cmd)))
                   (= CV_Z (aget grid (:cell cmd))))
            (do
              (aset ^longs grid (:cell cmd)
                    (long (:value cmd)))
              (.checkWin this cmd))
            (.repoke this))))

      (checkWin [this cmd]
        (log/debug "checking for win " (:color cmd)
                   ", pos = " (:cell cmd))
        (log/debug "current grid = " (vec grid))
        (if-some [combo (.isWinner this (.getCur this)) ]
          (.endGame this cmd combo)
          (if (.isStalemate this)
            (.drawGame this cmd)
            (.toggleActor this cmd))))

      (broadcastStatus [this ecode data status]
        (let [^PlayRoom room (.container theEngine)
              src (merge {:grid (vec grid)
                          :status status }
                         data)]
          (->> (ReifyNWEvent ecode src)
               (.sendMsg room))))

      (drawGame [this cmd]
        (.onStopReset this)
        (.broadcastStatus this
                          Events/STOP
                          {:cmd cmd :combo []} 0))

      (endGame [this cmd combo]
        (let [^PlayerSession pss (:session (.getCur this))]
          (log/debug "game to end, winner found! combo = " combo)
          (.onStopReset this)
          (.broadcastStatus this
                            Events/STOP
                            {:cmd cmd :combo combo}
                            (.number pss))))

      (toggleActor [this cmd]
        (aset #^"[Ljava.lang.Object;" actors 0
              (.getOther this (.getCur this)))
        (.dequeue this cmd))

      (finz [this] (.onStopReset this))

      (onStopReset [this]
        (.setv impl :gameon false))

      (isStalemate [_]
        (not (some #(== CV_Z %) (seq grid))))

      (isWinner [this actor]
        (log/debug "test isWinner - actor value = " (:value actor))
        (some (fn [r]
                (if (every? #(= (:value actor) %)
                            ;;(map #(aget grid %) r))
                            (let [xxx
                            (amap ^longs r idx ret
                                  (long (aget ^longs grid (aget ^longs r idx))))]
                              (log/debug "test one row === " (vec xxx))
                              xxx))
                  (vec r)
                  nil))
              goalspace))

      (getOther [_ cp]
        (condp identical? cp
          (aget #^"[Ljava.lang.Object;" actors 1)
          (aget #^"[Ljava.lang.Object;" actors 2)
          ;;else
          (aget #^"[Ljava.lang.Object;" actors 2)
          (aget #^"[Ljava.lang.Object;" actors 1)

          nil))
  )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF
