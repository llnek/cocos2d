
(ns {:doc ""
     :author "kenl"}

)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;; --- how often the server should update clients with the world state
(def ^:private WORLD_SYNC_INTERVAL 5000)

;; game loop intervla in milliseconds
(def ^:private GAME_LOOP_INTERVAL 20)

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
(defn- reifyPaddle ""

  []
  )

(defn- reifyBall ""

  []

  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- gameLoop ""

  []

  (with-local-vars [lastTick (System/currentTimeMillis)
                    lastBallUpdate 0
                    thisTick 0]
    (while m_isGameRunning
      (var-set thisTick (System/currentTimeMillis))
      ;; --- update the game with the difference
      ;;in ms since the
      ;; --- last tick
      (let [diff (- @thisTick @lastTick)]
        (var-set lastBallUpdate (+ @lastBallUpdate diff))
        (update diff))
      (var-set lastTick @thisTick)

      ;; --- check if time to send a ball update
      (if (> @lastBallUpdate BALL_UPDATE_INTERVAL)
        (sendBallUpdate)
        (var-set lastBallUpdate (- @lastBallUpdate
                                   BALL_UPDATE_INTERVAL)))

      ;; --- pause game
      (TryC
        (Thread/sleep GAME_LOOP_INTERVAL)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;; tick the time in milliseconds since the last update
(defn- update ""

  [tick]

  (updatePaddle m_leftPaddle tick)
  (updatePaddle m_rightPaddle tick)
  (updateBall tick))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updatePaddle ""

  [^Paddle paddle tick]

  (let []
    (.setY paddle (Math.max(Math.min(paddle.getY()-
                Math.sin(paddle.getDirection())*paddle.getSpeed()*tick/1000,
                COURT_HEIGHT-WALL_HEIGHT-PADDLE_HEIGHT), WALL_HEIGHT)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateBall ""

  [tick]

  ;; --- determine the new X,Y without regard to game boundaries
  (let [bdir (.getDirection m_ball)
        bspd (.getSpeed m_ball)
        hvPI (/ Math/PI 2)
        tsecs (/ tick 1000)
        ballX (+ (.getX m_ball) (* (Math/cos bdir)
                                   (* tsecs bspd)))
        ballY (- (.getY m_ball) (* (Math/sin bdir)
                                   (* tsecs bspd)))]

    ;; --- set the potential new ball position which may be
    ;;overridden below
    (doto m_ball
      (.setX ballX)
      (.setY ballY))

    ;; --- determine if the ball hit a boundary
    ;; --- NOTE: this is a rough calculation and does not attempt to
    ;; --- interpolate within a tick to determine the exact position
    ;; --- of the ball and paddle at the potential time of a collision

    (if (< ballX PADDLE_WIDTH)
      (do
        ;;--- left side
        (if (and (> (+ ballY BALL_SIZE) (.getY m_leftPaddle))
                 (< ballY (+ (.getY m_leftPaddle)
                             PADDLE_HEIGHT)))
          (do
            ;; --- paddle hit the ball so it will appear the same distance
            ;; --- on the other side of the collision point and angle will
            ;; --- flip
            (.setX m_ball (- (* 2 PADDLE_WIDTH) ballX))
            (bounceBall (if (> (.getDirection m_ball) Math/PI)
                          (* 3 hvPI)
                          hvPI))
            (.setSpeed m_ball (+ (.getSpeed m_ball) BALL_SPEEDUP)))
          (do
            ;; --- increase score
            ;; TODO
            (inc m_rightPlayerScore)
            (sendScoreUpdate)
            ;; --- reset ball
            (resetBall)
            (sendBallUpdate))))
      (when (> ballX (- COURT_WIDTH PADDLE_WIDTH BALL_SIZE))
        ;; --- right side
        (if (and (> (+ ballY BALL_SIZE)
                    (.getY m_rightPaddle))
                 (< ballY (+ (.getY m_rightPaddle)
                               PADDLE_HEIGHT)))
          (do
            (.setX m_ball (- (* 2 (- COURT_WIDTH PADDLE_WIDTH BALL_SIZE)) ballX))
            (bounceBall (if (> (.getDirection m_ball)
                               (* 3 hvPI))
                          (* 3 hvPI)
                          hvPI))
            (.setSpeed m_ball (+ (.getSpeed m_ball) BALL_SPEEDUP)))
          (do
            ;; --- increase score
            (inc m_leftPlayerScore)
            (sendScoreUpdate)
            ;; --- reset ball
            (resetBall)
            (sendBallUpdate)))))

    ;; --- the ball may also have hit a top or bottom wall
    (if (< ballY WALL_HEIGHT)
      (do
        ;; --- top wall
        (.setY m_ball (- (* 2 WALL_HEIGHT) ballY))
        (bounceBall (if (> (.getDirection m_ball) hvPI)
                      Math/PI
                      (* 2 Math/PI))))
      (when (> (+ ballY BALL_SIZE)
               (- ARENA_HEIGHT WALL_HEIGHT))
        ;; --- bottom wall
        (.setY m_ball (- (* 2 (- COURT_HEIGHT WALL_HEIGHT BALL_SIZE)) ballY))
        (bounceBall (if (> (.getDirection m_ball)
                           (* 3 hvPI))
                      (* 2 Math/PI)
                      Math/PI))))
  ))

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


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private arena-eof nil)

