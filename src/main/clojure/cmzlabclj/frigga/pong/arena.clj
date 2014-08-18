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

  cmzlabclj.frigga.pong.arena

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [MakeMMap ternary notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.cocos2d.games.meta]
        [cmzlabclj.odin.event.core])

  (:import  [com.zotohlab.odin.game Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.event Events EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;; --- how often the server should update clients with the world state
(def ^:private WORLD_SYNC_INTERVAL 5000)

;; game loop intervla in milliseconds
(def ^:private GAME_LOOP_INTERVAL 1000/60)

;; --- game metrics (pixels)
;; 150px/sec
(def ^:private INITIAL_BALL_SPEED 150)
(def ^:private ARENA_HEIGHT 480)
(def ^:private ARENA_WIDTH 640)
(def ^:private BALL_SIZE 10)
(def ^:private BALL_SPEEDUP 25) ;; pixels / sec

(def ^:private PADDLE_HEIGHT 60)
(def ^:private PADDLE_WIDTH 10)
(def ^:private PADDLE_SPEED 300)
(def ^:private WALL_HEIGHT 10)

(def ^:private QUAD_PI (/ Math/PI 4))
(def ^:private HALF_PI (/ Math/PI 2))
(def ^:private TWO_PI (* Math/PI 2))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol ArenaAPI ""

  (enqueue [_ cmd])
  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- reifyPaddle ""

  []
  )

(defn- reifyBall ""

  []

  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- startGameLoop ""

  [framesPerSec options]

  (let [wsecs (/ 1000 framesPerSec)]
    (with-local-vars [lastTick (System/currentTimeMillis)
                      lastBallUpdate 0
                      loopy true
                      thisTick 0]
      (while @loopy
        (var-set thisTick (System/currentTimeMillis))
        ;; --- update the game with the difference
        ;;in ms since the
        ;; --- last tick
        (let [diff (- @thisTick @lastTick)]
          (var-set lastBallUpdate (+ @lastBallUpdate diff))
          (update diff options))
        (var-set lastTick @thisTick)
        ;; --- check if time to send a ball update
        (if (> @lastBallUpdate BALL_UPDATE_INTERVAL)
          (sendBallUpdate)
          (var-set lastBallUpdate (- @lastBallUpdate
                                     BALL_UPDATE_INTERVAL)))
        ;; --- pause game
        (TryC
          (Thread/sleep wsecs))))
  ))

(defn- traceEnclosure ""

  [dt ball bbox]

  (let [sz (/ (:height ball) 2)
        sw (/ (:width ball) 2)
        hit false
        y (+ (:y ball) (* dt (:vy ball)))
        x (+ (:x ball) (* dt (:vx ball))) ]
    ;; hitting top wall ?
    (when (> (+ y sz) (:top bbox))
      (var-set ball (assoc ball :vy (* -1 (:vy ball))))
      (var-set y (- (:top bbox sz)))
      (var-set hit true))
    ;; hitting bottom wall ?
    (when (< (- y sz) (:bottom bbox))
      (var-set ball (assoc ball :vy (* -1 (:vy ball))))
      (var-set y (+ (:bottom bbox) sz))
      (var-set hit true))

    if (x + sw > bbox.right) {
      this.vel.x = - this.vel.x;
      x = bbox.right - sw;
      hit=true;
    }

    if (x - sw < bbox.left) {
      this.vel.x = - this.vel.x;
      x = bbox.left + sw;
      hit=true;
    }

    //this.lastPos = this.sprite.getPosition();
    // no need to update the last pos
    if (hit) {
      this.sprite.setPosition(x, y);
    }

    return hit;
  },

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;; tick the time in milliseconds since the last update
(defn- update ""

  [tick p1 p2 ball options]

  (updateBall p1 p2 ball options tick))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateBall ""

  [tick p1 p2 ball options]

  (let [[b pos] (traceEnclosure)]
    (if b
      (setPos pos)
      (moveBall (+ (:x ball) (* dt (:vx ball)))
                (+ (:y ball) (* dt (:vy ball)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
; Bounces the ball off a wall. Essentially flips the angle over a given
; axis. 0(360) degrees is to the right increasing counter-clockwise.
; Eg. a ball moving left and bouncing off the bottom wall would be
; "flipped" over the 180 degree axis.
;
; @param bounceAxis the axis to flip around
;;
(defn- bounceBall ""

  [bounceAxis]

  (.setDirection m_ball
                 (mod (+ (- (* 2 bounceAxis) (.getDirection m_ball)) TWO_PI)
                      TWO_PI)))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- resetBall ""

  []

  ;; --- make ball reset moving towards a player
  (let [dir (if (< (Math/random)  0.5)
              ;; --- towards left player (between 135 and 225 degrees)
              (+ (* (Math/random) HALF_PI) (* 3 QUAD_PI))
              ;; --- towards right player (between 315 and 45 degrees)
              (mod (+ (* (Math/random) HALF_PI) (* 7 QUAD_PI)) TWO_PI))]
    (.setDirection m_ball)
    (doto m_ball
      (.setY (/ (- ARENA_HEIGHT BALL_SIZE) 2))
      (.setX (/ (- ARENA_WIDTH BALL_SIZE) 2))
      (.setSpeed m_ball INITIAL_BALL_SPEED))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- sendScoreUpdate ""

  []

  nil)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- sendBallUpdate ""

  []

  ;; pos[x,y] , speed + dir
  nil)

(defn- spawnGameLoop ""

  []

  (Coroutine #(startGameLoop 60 options)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPongArena ""

  [options]

  (reify ArenaAPI
    (registerPlayers [_ p1 p2])
    (enqueue [_ evt]
      (let [pss (:context evt)
            src (:source evt)
            cmd (json/read-str src
                               :key-fn keyword)]
        (log/debug "pong received cmd "
                   src
                   " from session " pss)))

  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private arena-eof nil)

