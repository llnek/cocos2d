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

  [x y w h]

  (let [impl (MakeMMap)]
    (.setf! impl :x x)
    (.setf! impl :y y)
    (.setf! impl :height h)
    (.setf! impl :width w)
    impl
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- reifyBall ""

  [x y w h]


  (let [impl (MakeMMap)]
    (.setf! impl :x x)
    (.setf! impl :y y)
    (.setf! impl :height h)
    (.setf! impl :width w)
    (.setf! impl :vx 0)
    (.setf! impl :vy 0)
    impl
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- preStartPoint ""

  [options]

  (let [bbox (:world options)
        pz (:paddle options)
        bz (:ball options)
        p2 (reifyPaddle (- (:right bbox)
                           4
                           (:width bz)
                           (/ (:width pz) 2))
                        (+ (:bottom world)
                           (/ (:height bbox) 2))
                        (:width pz)
                        (:height pz))
        p1 (reifyPaddle (+ (:left world)
                           4
                           (:width bz)
                           (/ (:width pz) 2))
                        (+ (:bottom world)
                           (/ (:height bbox) 2))
                        (:width pz)
                        (:height pz))
        ball (reifyBall (+ (:left world)
                           (/ (:width world) 2))
                        (+ (:bottom world)
                           (/ (:height world) 2))
                        (:width bz)
                        (:height bz)) ]
    (.setf! ball :vx (* (RandomSign) (:speed bz)))
    (.setf! ball :vy (* (RandomSign) (:speed bz)))

    ;; this is the game loop context for each point
    {:options options
     :p2 p1
     :p1 p1
     :ball ball}
  ))


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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- traceEnclosure ""

  [dt ball bbox]

  (with-local-vars [y (+ (.getf ball :y)
                         (* dt (.getf ball :vy)))
                    x (+ (.getf ball :x)
                         (* dt (.getf ball :vx)))
                    hit false]
    (let [sz (/ (.getf ball :height) 2)
          sw (/ (.getf ball :width) 2)]
      ;; hitting top wall ?
      (when (> (+ y sz) (:top bbox))
        (.setf! ball :vy (- (.getf ball :vy)))
        (var-set y (- (:top bbox sz)))
        (var-set hit true))
      ;; hitting bottom wall ?
      (when (< (- y sz) (:bottom bbox))
        (.setf! ball :vy (- (.getf ball :vy)))
        (var-set y (+ (:bottom bbox) sz))
        (var-set hit true))
      (when (> (+ x sw) (:right bbox))
        (.setf! ball :vx (- (.getf ball :vx)))
        (var-set x (- (:right bbox) sw))
        (var-set hit true))
      (when (< (- x sw) (:left bbox))
        (.setf! ball :vx (- (.getf ball :vx)))
        (var-set x (+ (:left bbox) sw))
        (var-set hit true))
      (when @hit
        (.setf! ball :x x)
        (.setf! ball :y y)))
    @hit
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;; tick the time in milliseconds since the last update
(defn- update ""

  [tick p1 p2 ball options]

  (updateBall p1 p2 ball options tick))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- bbox ""

  [x y w h]

  (let [h2 (/ h 2)
        w2 (/ w 2) ]

    {:left (- x w2)
     :right (+ x w2)
     :top (+ y h2)
     :bottom (- y h2) }
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rectXrect ""

  [ra rb]

  (not (or (< (:right ra) (:left rb))
           (< (:right rb) (:left ra))
           (< (:top ra) (:bottom rb))
           (< (:top rb) (:bottom ra)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- maybeUpdateBall ""

  [world p1 p2 ball]

  (let [hh (/ (:height ball) 2)
        hw (/ (:width ball) 2)
        b2 (bbox (:x ball)
                 (:y ball)
                 (:width ball)
                 (:height ball)) ]
    ;; ensure ball is not out of bound
    (with-local-vars [x (:x ball)
                      y (:y ball)]
      (when (> (:right b2)
               (:right world))
        (var-set x (- (:right world) hw)))

      (when (< (:left b2)
               (:left world))
        (var-set x (+ (:left world hw))))

      (when (> (:top b2)
               (:top world))
        (var-set y (- (:top world) hh)))

      (when (< (:bottom b2)
               (:bottom world))
        (var-set y (+ (:bottom world) hh)))

      (.setf! ball :x @x)
      (.setf! ball :y @y))
    ;; check if ball is hitting paddles

    (when (rectXrect b2 (bbox (:x p2)(:y p2)
                              (:width p2)(:height p2)))
      (.setf! ball :x (- (:left p2) hw))
      (.setf! ball :vx (- (.getf ball :vx))))

    (when (rectXrect b2 (bbox (:x p1)(:y p1)
                              (:width p1)(:height p1)))
      (.setf! ball :x (+ (:right p1) hw))
      (.setf! ball :vx (- (.getf ball :vx))))
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateBall ""

  [dt ball options]

  (when-not (traceEnclosure dt ball bbox)
    (.setf! ball :x (+ (* dt (.getf ball :vx))
                       (.getf ball :x)))
    (.setf! ball :y (+ (* dt (.getf ball :vy))
                       (.getf ball :y))))
  (maybeUpdateBall p1 p2 ball))

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

  [ch options]

  (let [maxpts (:numpts options)
        world (:world options)
        pd (:paddle options)
        ba (:ball options)]
    (reify ArenaAPI
      (registerPlayers [_ ps1 ps2]
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

