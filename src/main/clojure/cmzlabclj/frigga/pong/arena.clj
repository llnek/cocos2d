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
(defmacro halve [v] `(/ ~v 2))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol ArenaAPI ""

  (registerPlayers [_ p1 p2])
  (startPoint [_ cmd])
  (resetPoint [_])
  (restart [_])
  (getPlayer2 [_])
  (getPlayer1 [_])
  (enqueue [_ cmd]))

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
(defn- rectXrect "If 2 rects intersect."

  [ra rb]

  (not (or (< (:right ra) (:left rb))
           (< (:right rb) (:left ra))
           (< (:top ra) (:bottom rb))
           (< (:top rb) (:bottom ra)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- clamp "Ensure paddle does not go out of bound."

  [^cmzlabclj.nucleus.util.core.MubleAPI paddle bbox]

  (let [h2 (halve (.getf paddle :height))
        y (.getf paddle :y)
        b (- y h2)
        t (+ y h2)]
    (when (< b (:bottom bbox))
      (.setf! paddle :y (+ (:bottom bbox) h2)))
    (when (> t (:top bbox))
      (.setf! paddle :y (- (:top bbox) h2)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rect "Make a rect with all 4 corners."

  [x y w h]

  (let [h2 (halve h)
        w2 (halve w) ]

    {:left (- x w2)
     :right (+ x w2)
     :top (+ y h2)
     :bottom (- y h2) }
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; The *enclosure* is the bounding box => the world.
(defn- traceEnclosure "Check if the ball has just hit a wall."

  [dt ^cmzlabclj.nucleus.util.core.MubleAPI ball bbox]

  (with-local-vars [y (+ (.getf ball :y) (* dt (.getf ball :vy)))
                    x (+ (.getf ball :x) (* dt (.getf ball :vx)))
                    winner 0
                    hit false]
    (let [sz (halve (.getf ball :height))
          sw (halve (.getf ball :width))]
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
(defn- collide? "Check if the ball has collided with anything"

  [^cmzlabclj.nucleus.util.core.MubleAPI p1
   ^cmzlabclj.nucleus.util.core.MubleAPI p2
   ^cmzlabclj.nucleus.util.core.MubleAPI ball
   bbox]

  (let [hh (halve (.getf ball :height))
        hw (halve (.getf ball :width))
        br (rect (.getf ball :x)
                 (.getf ball :y)
                 (.getf ball :width)
                 (.getf ball :height)) ]
    ;; ensure ball is not out of bound
    (with-local-vars [x (.getf ball :x)
                      y (.getf ball :y)]
      (when (> (:right br)
               (:right bbox))
        (var-set x (- (:right bbox) hw)))

      (when (< (:left br)
               (:left bbox))
        (var-set x (+ (:left bbox hw))))

      (when (> (:top br)
               (:top bbox))
        (var-set y (- (:top bbox) hh)))

      (when (< (:bottom br)
               (:bottom bbox))
        (var-set y (+ (:bottom bbox) hh)))

      (.setf! ball :x @x)
      (.setf! ball :y @y))

    ;; check if ball is hitting paddles

    (let [r (rect (.getf p2 :x)
                  (.getf p2 :y)
                  (.getf p2 :width)
                  (.getf p2 :height))]
      (when (rectXrect br r)
        (.setf! ball :vx (- (.getf ball :vx)))
        (.setf! ball :x (- (:left r) hw))))

    (let [r (rect (.getf p1 :x)
                  (.getf p1 :y)
                  (.getf p1 :width)
                  (.getf p1 :height))]
      (when (rectXrect br r)
        (.setf! ball :vx (- (.getf ball :vx)))
        (.setf! ball :x (+ (:right r) hw))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- resetPoint "A point has been won.
                   Let the UI know, and reset local entities."

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   winner]

  (let [^PlayerSession ps2 (:session (.getf impl :p2))
        ^PlayerSession ps1 (:session (.getf impl :p1))
        s2 (.getf impl :score2)
        s1 (.getf impl :score1)
        ^cmzlabclj.frigga.pong.arena.ArenaAPI
        arena (.getf impl :arena)
        src {:scores {:p2 s2 :p1 s1 }}]
    ;;TODO should be network msg
    ;; update scores
    (.sendMessage ps2 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
    (.sendMessage ps1 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
    ;; toggle flag to skip game loop logic until new
    ;; point starts
    (.setf! impl :resetting-point true)
    (.resetPoint arena)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- gameOver "Game over.  Let the UI know."

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   winner]

  (let [^PlayerSession ps2 (:session (.getf impl :p2))
        ^PlayerSession ps1 (:session (.getf impl :p1))
        s2 (.getf impl :score2)
        s1 (.getf impl :score1)
        pwin (if (> s2 s1) ps2 ps1)
        ^cmzlabclj.frigga.pong.arena.ArenaAPI
        arena (.getf impl :arena)
        src {:winner {:pnum (.number pwin)
                      :scores {:p2 s2 :p1 s1 }}}]
    ;; TODO: use network-msg
    ;; end game
    (.sendMessage ps2 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
    (.sendMessage ps1 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updatePoint "A point has been won. Update the score,
                    and maybe trigger game-over."

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   winner]

  (let [nps (.getf impl :numpts)
        s2 (.getf impl :score2)
        s1 (.getf impl :score1)
        sx (if (== winner 2)
             (inc s2)
             (inc s1))]
    (log/debug "increment score by 1, "
               "someone lost a point. " s1  " , " s2)
    (if (== winner 2)
      (.setf! impl :score2 sx)
      (.setf! impl :score1 sx))
    (resetPoint impl winner)
    (when (>= sx nps)
      (gameOver impl winner))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateEntities "Move local entities per game loop."

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
      (when-not hit
          (.setf! ball :x (+ (* dt (.getf ball :vx))
                             (.getf ball :x)))
          (.setf! ball :y (+ (* dt (.getf ball :vy))
                             (.getf ball :y))))
      (if (> winner 0)
        (updatePoint impl winner)
        (collide? pad1 pad2 ball bbox)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- syncClients "Update UI with states of local entities."

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
    ;; TODO: use network-msg
    (log/debug "sync new BALL values " (:ball src))
    (.sendMessage ps2 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
    (.sendMessage ps1 (ReifyEvent Events/SESSION_MSG
                                  Events/C_SYNC_ARENA
                                  (json/write-str src)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateArena "Update the state of the Arena per game loop."

  [options ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (if (true? (.getf impl :resetting-point))
    nil ;; wait for new point to start, do nothing now
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
          (.setf! impl :lastSync 0))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- postUpdateArena "After update, check if either one of the
                       score has reached the target value, and if
                       so, end the game else pause and loop again."

  [^GameEngine engine
   options
   ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (let [fps (/ 1000 (:framespersec options))
        nps (:numpts options)
        s2 (.getf impl :score2)
        s1 (.getf impl :score1)]
    (if (and (not (true? (.getf impl :resetting-point)))
             (or (>= s2 nps)
                 (>= s1 nps)))
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
(defn- rerunGameLoop "When a new point starts, re run the
                     current game loop."

  [engine options ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (.setf! impl :lastTick (System/currentTimeMillis))
  (.setf! impl :lastSync 0)
  (.setf! impl :resetting-point false))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- runGameLoop "Spawn a game loop in a separate thread."

  [engine options ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (.setf! impl :lastTick (System/currentTimeMillis))
  (.setf! impl :numpts (:numpts options))
  (.setf! impl :resetting-point false)
  (.setf! impl :lastSync 0)
  (.setf! impl :score2 0)
  (.setf! impl :score1 0)
  (Coroutine #(while true
                (TryC (updateArena options impl))
                (postUpdateArena engine options impl))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- initEntities "Initialize all local entities."

  [^cmzlabclj.nucleus.util.core.MubleAPI impl
   pp1 pp2
   pd ba]

  (log/debug "resetting all entities back to default positions.")
  (.setf! impl :paddle2 (reifyPaddle (:x pp2)
                                      (:y pp2)
                                      (:width pd)
                                      (:height pd)))
  (.setf! impl :paddle1 (reifyPaddle (:x pp1)
                                      (:y pp1)
                                      (:width pd)
                                      (:height pd)))
  (let [^cmzlabclj.nucleus.util.core.MubleAPI
        b (reifyBall (:x ba)
                     (:y ba)
                     (:width ba)
                     (:height ba))]
    (.setf! b :vx (* (RandomSign) (:speed ba)))
    (.setf! b :vy (* (RandomSign) (:speed ba)))
    (.setf! impl :ball b)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- pokeAndStartUI ""

  [engine options
   ^cmzlabclj.nucleus.util.core.MubleAPI impl]

  (let [^PlayerSession p2 (:session (.getf impl :p2))
        ^PlayerSession p1 (:session (.getf impl :p1))
        ^cmzlabclj.nucleus.util.core.MubleAPI
        ball (.getf impl :ball)
        src {:ball {:vx (.getf ball :vx)
                    :vy (.getf ball :vy)
                    :x (.getf ball :x)
                    :y (.getf ball :y)} }]
    (.sendMessage p2 (ReifyEvent Events/SESSION_MSG
                                 Events/C_POKE_MOVE
                                 (json/write-str {:pnum (.number p2)})))
    (.sendMessage p1 (ReifyEvent Events/SESSION_MSG
                                 Events/C_POKE_MOVE
                                 (json/write-str {:pnum (.number p1)})))
    (.sendMessage p2 (ReifyEvent Events/SESSION_MSG
                                 Events/C_SYNC_ARENA
                                 (json/write-str src)))
    (.sendMessage p1 (ReifyEvent Events/SESSION_MSG
                                 Events/C_SYNC_ARENA
                                 (json/write-str src)))
    (log/debug "setting default ball values " src)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPongArena "The local game arena."

  ^cmzlabclj.frigga.pong.arena.ArenaAPI
  [engine options]

  (let [maxpts (:numpts options)
        world (:world options)
        pd (:paddle options)
        ba (:ball options)
        pp2 (:p2 options)
        pp1 (:p1 options)
        impl (MakeMMap) ]
    (reify ArenaAPI
      (registerPlayers [this ps1 ps2]
        ;;(require 'cmzlabclj.frigga.pong.arena)
        (.setf! impl :arena this)
        (.setf! impl :p2 ps2)
        (.setf! impl :p1 ps1)
        (initEntities impl pp1 pp2 pd ba))

      (getPlayer2 [_] (.getf impl :p2))
      (getPlayer1 [_] (.getf impl :p1))

      (restart [_]
        (.setf! impl :resetting-point false)
        (.setf! impl :score2 0)
        (.setf! impl :score1 0))

      (resetPoint [this]
        (initEntities impl pp1 pp2 pd ba)
        (.startPoint this {}))

      (startPoint [_ cmd]
        (pokeAndStartUI engine options impl)
        (if (true? (:new cmd))
          (runGameLoop engine options impl)
          (rerunGameLoop engine options impl)))

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

