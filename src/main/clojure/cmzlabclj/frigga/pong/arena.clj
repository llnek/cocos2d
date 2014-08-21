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
            ;;[clojure.core.async :as async])

  (:use [cmzlabclj.nucleus.util.core
         :only [MakeMMap ternary notnil? RandomSign TryC] ]
        [cmzlabclj.nucleus.util.process :only [Coroutine]]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:use [cmzlabclj.cocos2d.games.meta]
        [cmzlabclj.odin.event.core])

  (:import  [com.zotohlab.odin.game GameEngine Game PlayRoom
                                    Player PlayerSession]
            [com.zotohlab.odin.event Events EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;; 150px/sec
(def ^:private INITIAL_BALL_SPEED 150)
(def ^:private BALL_SIZE 10)
(def ^:private BALL_SPEEDUP 25) ;; pixels / sec
(def ^:private PADDLE_HEIGHT 60)
(def ^:private PADDLE_WIDTH 10)
(def ^:private PADDLE_SPEED 300)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol ArenaAPI ""

  (registerPlayers [_ p1 p2])
  (broadcast [_ cmd])
  (getPlayer2 [_])
  (getPlayer1 [_])
  (enqueue [_ cmd])
  )

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
(defn- clamp ""

  [^cmzlabclj.nucleus.util.core.MubleAPI paddle bbox]

  (let [h2 (/ (.getf paddle :height) 2)
        y (.getf paddle :y)
        b (- y h2)
        t (+ y h2)]
    (when (> t (:top bbox))
      (.setf! paddle :y (- (:top bbox) h2)))

    (when (< b (:bottom bbox))
      (.setf! paddle :y (+ (:bottom bbox) h2)))
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rect ""

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
(defn- traceEnclosure ""

  [dt ^cmzlabclj.nucleus.util.core.MubleAPI ball bbox]

  (with-local-vars [y (+ (.getf ball :y)
                         (* dt (.getf ball :vy)))
                    x (+ (.getf ball :x)
                         (* dt (.getf ball :vx)))
                    winner 0
                    hit false]
    (let [sz (/ (.getf ball :height) 2)
          sw (/ (.getf ball :width) 2)]
      ;; hitting top wall ?
      (when (> (+ @y sz) (:top bbox))
        (.setf! ball :vy (- (.getf ball :vy)))
        (var-set y (- (:top bbox) sz))
        (var-set hit true))
      ;; hitting bottom wall ?
      (when (< (- @y sz) (:bottom bbox))
        (.setf! ball :vy (- (.getf ball :vy)))
        (var-set y (+ (:bottom bbox) sz))
        (var-set hit true))

      (when (> (+ @x sw) (:right bbox))
        (.setf! ball :vx (- (.getf ball :vx)))
        (var-set x (- (:right bbox) sw))
        (var-set winner 1)
        (var-set hit true))

      (when (< (- @x sw) (:left bbox))
        (.setf! ball :vx (- (.getf ball :vx)))
        (var-set x (+ (:left bbox) sw))
        (var-set winner 2)
        (var-set hit true))

      (when @hit
        (.setf! ball :x @x)
        (.setf! ball :y @y)))
    [@hit @winner]
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- maybeUpdate ""

  [^cmzlabclj.nucleus.util.core.MubleAPI p1
   ^cmzlabclj.nucleus.util.core.MubleAPI p2
   ^cmzlabclj.nucleus.util.core.MubleAPI ball
   bbox]

  (let [hh (/ (.getf ball :height) 2)
        hw (/ (.getf ball :width) 2)
        b2 (rect (.getf ball :x)
                 (.getf ball :y)
                 (.getf ball :width)
                 (.getf ball :height)) ]
    ;; ensure ball is not out of bound
    (with-local-vars [x (.getf ball :x)
                      y (.getf ball :y)]
      (when (> (:right b2)
               (:right bbox))
        (var-set x (- (:right bbox) hw)))

      (when (< (:left b2)
               (:left bbox))
        (var-set x (+ (:left bbox hw))))

      (when (> (:top b2)
               (:top bbox))
        (var-set y (- (:top bbox) hh)))

      (when (< (:bottom b2)
               (:bottom bbox))
        (var-set y (+ (:bottom bbox) hh)))

      (.setf! ball :x @x)
      (.setf! ball :y @y))

    ;; check if ball is hitting paddles

    (let [r (rect (.getf p2 :x)
                  (.getf p2 :y)
                  (.getf p2 :width)
                  (.getf p2 :height))]
      (when (rectXrect b2 r)
        (.setf! ball :x (- (:left r) hw))
        (.setf! ball :vx (- (.getf ball :vx)))))

    (let [r (rect (.getf p1 :x)
                  (.getf p1 :y)
                  (.getf p1 :width)
                  (.getf p1 :height))]
      (when (rectXrect b2 r)
        (.setf! ball :x (+ (:right r) hw))
        (.setf! ball :vx (- (.getf ball :vx)))))

  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- resetPoint ""

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   winner]

  )

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- gameOver ""

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   winner]

  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updatePoint ""

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   winner]

  (let [s2 (.getf impl :score2)
        s1 (.getf impl :score1)
        sx (if (== winner 2)
             (inc s2)
             (inc s1))]
    (.setf! impl :score2 s2)
    (.setf! impl :score1 s1)
    (if (> sx (.getf impl :numpts))
      (gameOver winner)
      (resetPoint winner))

  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateEntities ""

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   dt bbox]

  (let [^cmzlabclj.nucleus.util.core.MubleAPI
        pad2 (.getf impl :paddle2)
        ^cmzlabclj.nucleus.util.core.MubleAPI
        pad1 (.getf impl :paddle1)
        ^cmzlabclj.nucleus.util.core.MubleAPI
        ball (.getf impl :ball)]

    (.setf! pad2 :y (+ (* dt (.getf pad2 :vy))
                       (.getf pad2 :y)))
    (.setf! pad1 :y (+ (* dt (.getf pad1 :vy))
                       (.getf pad1 :y)))
    (clamp pad2 bbox)
    (clamp pad1 bbox)

    (let [[hit winner] (traceEnclosure dt ball bbox)]
      (when hit
          (.setf! ball :x (+ (* dt (.getf ball :vx))
                             (.getf ball :x)))
          (.setf! ball :y (+ (* dt (.getf ball :vy))
                             (.getf ball :y))))
      (if (> winner 0)
        (updatePoint impl winner)
        (maybeUpdate pad1 pad2 ball bbox)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayer ""

  [idValue pcolor psession]

  {:value idValue
   :color pcolor
   :session psession })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- reifyPaddle ""

  [x y w h]

  (let [impl (MakeMMap)]
    (.setf! impl :x x)
    (.setf! impl :y y)
    (.setf! impl :vx 0)
    (.setf! impl :vy 0)
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
(defn- syncClients ""

  [^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (let [^cmzlabclj.nucleus.util.core.MubleAPI
        pad2 (.getf impl :paddle2)
        ^cmzlabclj.nucleus.util.core.MubleAPI
        pad1 (.getf impl :paddle1)
        ^cmzlabclj.nucleus.util.core.MubleAPI
        ball (.getf impl :ball)
        ^PlayerSession ps2 (:session (.getf impl :p2))
        ^PlayerSession ps1 (:session (.getf impl :p1))
        src {:p2 {:y (.getf pad2 :y)
                  :x (.getf pad2 :x)
                  :vy (.getf pad2 :vy)}
             :p1 {:y (.getf pad1 :y)
                  :x (.getf pad1 :x)
                  :vy (.getf pad1 :vy)}
             :ball {:y (.getf ball :y)
                    :x (.getf ball :x)
                    :vy (.getf ball :vy)
                    :vx (.getf ball :vx) }} ]
    (.sendMessage ps2 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
    (.sendMessage ps1 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateArena ""

  [options ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (let [waitIntv (:syncMillis options)
        maxpts (:numpts options)
        world (:world options)
        lastTick (.getf impl :lastTick)
        lastSync (.getf impl :lastSync)
        now (System/currentTimeMillis)]
    ;; --- update the game with the difference
    ;;in ms since the
    ;; --- last tick
    (let [diff (- now lastTick)
          lastSync2 (+ lastSync diff)]
      (updateEntities impl (/ diff 1000) world)
      (.setf! impl :lastSync lastSync2)
      (.setf! impl :lastTick now)
      ;; --- check if time to send a ball update
      (when (> lastSync waitIntv)
        (syncClients impl)
        (.setf! impl :lastSync 0)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- postUpdateArena ""

  [^GameEngine engine
   options
   ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (let [fps (/ 1000 (:framespersec options))
        nps (:numpts options)
        s2 (.getf impl :score2)
        s1 (.getf impl :score1)]
    (if (or (> s2 nps)
            (> s1 nps))
      (do
        (log/debug "haha score " s2
                   " vs " s1
                   " :-------------------> game over.")
        (.endRound engine nil)
        ;; use this to get out of the while loop
        (throw (Exception. "game over.")))
      (TryC (Thread/sleep fps)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- runGameLoop ""

  [engine options ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (.setf! impl :lastTick (System/currentTimeMillis))
  (.setf! impl :numpts (:numpts options))
  (.setf! impl :lastSync 0)
  (.setf! impl :score2 0)
  (.setf! impl :score1 0)
  (Coroutine #(while true
                (TryC (updateArena options impl))
                (postUpdateArena engine options impl))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPongArena ""

  [engine options]

  (let [maxpts (:numpts options)
        world (:world options)
        pd (:paddle options)
        ba (:ball options)
        pp2 (:p2 options)
        pp1 (:p1 options)
        impl (MakeMMap) ]
    (reify ArenaAPI
      (registerPlayers [_ ps1 ps2]
        (.setf! impl :p2 ps2)
        (.setf! impl :p1 ps1)
        (.setf! impl :paddle2 (reifyPaddle (:x pp2)
                                           (:y pp2)
                                           (:width pd)
                                           (:height pd)))
        (.setf! impl :paddle1 (reifyPaddle (:x pp1)
                                           (:y pp1)
                                           (:width pd)
                                           (:height pd)))
        (.setf! impl :ball (reifyBall (:x ba)
                                      (:y ba)
                                      (:width ba)
                                      (:height ba))))

      (getPlayer2 [_] (.getf impl :p2))
      (getPlayer1 [_] (.getf impl :p1))

      (broadcast [this cmd]
        (let [^PlayerSession p2 (:session (.getf impl :p2))
              ^PlayerSession p1 (:session (.getf impl :p1))
              ^cmzlabclj.nucleus.util.core.MubleAPI
              ball (.getf impl :ball)
              src {:ball {:vx (* (RandomSign) (:speed ba))
                          :vy (* (RandomSign) (:speed ba))
                          :x (:x ba)
                          :y (:y ba)}}]
          (.setf! ball :vx (:vx (:ball src)))
          (.setf! ball :vy (:vy (:ball src)))
          (.sendMessage p2 (ReifyEvent Events/SESSION_MSG
                                       Events/C_POKE_MOVE
                                       (json/write-str {:pnum (.number p2)})))
          (.sendMessage p1 (ReifyEvent Events/NETWORK_MSG
                                       Events/C_POKE_MOVE
                                       (json/write-str {:pnum (.number p1)})))
          (.sendMessage p2 (ReifyEvent Events/SESSION_MSG
                                       Events/C_SYNC_ARENA
                                       (json/write-str src)))
          (.sendMessage p1 (ReifyEvent Events/SESSION_MSG
                                       Events/C_SYNC_ARENA
                                       (json/write-str src)))
          (runGameLoop engine options impl)))

      (enqueue [_ evt]
        (let [^PlayerSession p2 (:session (.getf impl :p2))
              ^PlayerSession p1 (:session (.getf impl :p1))
              ^PlayerSession pss (:context evt)
              pnum (.number pss)
              kw (if (== pnum 1) :p1 :p2)
              pt (if (== pnum 1) p2 p1)
              src (:source evt)
              cmd (json/read-str src :key-fn keyword)
              ;;vy (* (:dir (kw cmd)) (:speed pd))
              vy (:vy (kw cmd))
              ^cmzlabclj.nucleus.util.core.MubleAPI
              other (if (== pnum 2)
                      (.getf impl :paddle2)
                      (.getf impl :paddle1))]
          (.setf! other :vy vy)
          (.sendMessage pt (ReifyEvent Events/SESSION_MSG
                                       Events/C_SYNC_ARENA
                                       (json/write-str cmd)))))

    )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private arena-eof nil)

