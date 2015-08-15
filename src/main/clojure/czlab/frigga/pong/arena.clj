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

  czlab.frigga.pong.arena

  (:require [czlab.xlib.util.core
             :refer [MubleObj trap! notnil? RandomSign tryc]]
            [czlab.xlib.util.process :refer [Coroutine]]
            [czlab.xlib.util.str :refer [strim nsb hgl?]])

  (:require [clojure.tools.logging :as log])

  (:use [czlab.xlib.util.format]
        [czlab.cocos2d.games.meta]
        [czlab.frigga.core.util]
        [czlab.odin.event.core])

  (:import  [com.zotohlab.odin.game GameEngine Game
             PlayRoom Player PlayerSession]
           [com.zotohlab.skaro.core Muble]
            [com.zotohlab.odin.event Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;; 150px/sec
;;(def ^:private INITIAL_BALL_SPEED 150)
;;(def ^:private BALL_SPEEDUP 25) ;; pixels / sec

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defmacro halve [v] `(* ~v 0.5))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defprotocol ArenaAPI ""

  (registerPlayers [_ p1 p2])
  (startPoint [_ cmd])
  (innards [_] )
  (engine [_])
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
(defn- reifyObject ""

  [x y w h]

  (MubleObj {:x x :y y
             :vx 0 :vy 0
             :height h :width w}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- reifyPaddle ""

  [x y w h]

  (reifyObject x y w h))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- reifyBall ""

  [x y w h]

  (reifyObject x y w h))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rectXrect "If 2 rects intersect."

  [ra rb]

  (not (or (< (:right ra) (:left rb))
           (< (:right rb) (:left ra))
           (< (:top ra) (:bottom rb))
           (< (:top rb) (:bottom ra)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- rect "Make a rect with all 4 corners."

  ([^Muble obj]
   (rect (.getv obj :x)
         (.getv obj :y)
         (.getv obj :width)
         (.getv obj :height)))

  ([x y w h]
   (let [h2 (halve h)
         w2 (halve w) ]
     {:left (- x w2)
     :right (+ x w2)
     :top (+ y h2)
     :bottom (- y h2) })))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- clamp "Ensure paddle does not go out of bound."

  [^Muble
   paddle bbox port?]

  (let [fx (fn [op kw o1 o2] (op (kw o1) (kw o2)))
        h2 (halve (.getv paddle :height))
        w2 (halve (.getv paddle :width))
        rc (rect paddle)]
    (if port?
      (do
        (when (fx < :left rc bbox)
          (.setv paddle :x (+ (:left bbox) w2)))
        (when (fx > :right rc bbox)
          (.setv paddle :x (- (:right bbox) w2))))
      (do
        (when (fx < :bottom rc bbox)
          (.setv paddle :y (+ (:bottom bbox) h2)))
        (when (fx > :top rc bbox)
          (.setv paddle :y (- (:top bbox) h2)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; The *enclosure* is the bounding box => the world.
(defn- traceEnclosure "Check if the ball has just hit a wall."

  [^Muble ball
   dt
   bbox port?]

  (with-local-vars [y (+ (.getv ball :y) (* dt (.getv ball :vy)))
                    x (+ (.getv ball :x) (* dt (.getv ball :vx)))
                    hit false]
    (let [sz (halve (.getv ball :height))
          sw (halve (.getv ball :width))]
      (if port?
        (do
          ;;check left and right walls
          (when (cond
                  (> (+ @x sw) (:right bbox))
                  (do (var-set x (- (:right bbox) sw))
                      true)
                  (< (- @x sw) (:left bbox))
                  (do (var-set x (+ (:left bbox) sw))
                      true)
                  :else false)
            (.setv ball :vx (- (.getv ball :vx)))
            (var-set hit true)))
        (do
          ;;check top and bottom walls
          (when (cond
                  (< (- @y sz) (:bottom bbox))
                  (do
                    (var-set y (+ (:bottom bbox) sz))
                    true)
                  (> (+ @y sz) (:top bbox))
                  (do (var-set y (- (:top bbox) sz))
                      true)
                  :else false)
            (.setv ball :vy (- (.getv ball :vy)))
            (var-set hit true))))
      (.setv ball :x @x)
      (.setv ball :y @y))
    @hit
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- collide? "Check if the ball has collided with a paddle."

  [^Muble p1
   ^Muble p2
   ^Muble ball
   bbox port?]

  (with-local-vars [winner 0]
    (let [hh (halve (.getv ball :height))
          hw (halve (.getv ball :width))
          br (rect ball)]
      (let [r (rect p2)]
        (if (rectXrect br r)
          (if port?
            (do
              (.setv ball :vy (- (.getv ball :vy)))
              (.setv ball :y (- (:bottom r) hh)))
            (do
              (.setv ball :vx (- (.getv ball :vx)))
              (.setv ball :x (- (:left r) hw))))
          (when (> (:bottom br)(:top r))
            (var-set winner 1))))
      (let [r (rect p1)]
        (if (rectXrect br r)
          (if port?
            (do
              (.setv ball :vy (- (.getv ball :vy)))
              (.setv ball :y (+ (:top r) hh)))
            (do
              (.setv ball :vx (- (.getv ball :vx)))
              (.setv ball :x (+ (:right r) hw))))
          (when (< (:top br)(:bottom r))
            (var-set winner 2)))))
    @winner
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- maybeStartNewPoint "A point has been won.
                          Let the UI know, and reset local entities."

  [^czlab.frigga.pong.arena.ArenaAPI arena winner]

  (let [^Muble impl (.innards arena)
        s2 (.getv impl :score2)
        s1 (.getv impl :score1)
        src {:scores {:p2 s2 :p1 s1 }}]
    (BCastAll (-> ^GameEngine
                  (.engine arena)
                  (.container)) Events/SYNC_ARENA src)
    ;; toggle flag to skip game loop logic until new
    ;; point starts
    (.setv impl :resetting-point true)
    (.resetPoint arena)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- gameOver "Game over.  Let the UI know."

  [^czlab.frigga.pong.arena.ArenaAPI arena winner]

  (let [^PlayRoom room (.container ^GameEngine (.engine arena))
        ^Muble impl (.innards arena)
        ^PlayerSession ps2 (:session (.getv impl :p2))
        ^PlayerSession ps1 (:session (.getv impl :p1))
        s2 (.getv impl :score2)
        s1 (.getv impl :score1)
        pwin (if (> s2 s1) ps2 ps1)
        src {:winner {:pnum (.number pwin)
                      :scores {:p2 s2 :p1 s1 }}}]
    ;; end game
    (log/debug "game over: winner of this game is " src)
    (doto room
      (BCastAll Events/SYNC_ARENA src)
      (BCastAll Events/STOP nil))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updatePoint "A point has been won. Update the score,
                    and maybe trigger game-over."

  [^czlab.frigga.pong.arena.ArenaAPI arena winner]

  (let [^Muble impl (.innards arena)
        nps (.getv impl :numpts)
        s2 (.getv impl :score2)
        s1 (.getv impl :score1)
        sx (if (= winner 2)
             (inc s2)
             (inc s1))]
    (log/debug "increment score by 1, "
               "someone lost a point. " s1  " , " s2)
    (.setv impl :sync false)
    (if (= winner 2)
      (.setv impl :score2 sx)
      (.setv impl :score1 sx))
    (maybeStartNewPoint arena winner)
    (when (>= sx nps)
      (gameOver arena winner))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateEntities "Move local entities per game loop."

  [^czlab.frigga.pong.arena.ArenaAPI arena
   dt bbox]

  (let [^Muble impl (.innards arena)
        ^Muble pad2 (.getv impl :paddle2)
        ^Muble pad1 (.getv impl :paddle1)
        ^Muble ball (.getv impl :ball)
        port? (.getv impl :portrait)]

    (if port?
      (do
        (.setv pad2 :x (+ (* dt (.getv pad2 :vx))
                           (.getv pad2 :x)))
        (.setv pad1 :x (+ (* dt (.getv pad1 :vx))
                           (.getv pad1 :x))))
      (do
        (.setv pad2 :y (+ (* dt (.getv pad2 :vy))
                           (.getv pad2 :y)))
        (.setv pad1 :y (+ (* dt (.getv pad1 :vy))
                           (.getv pad1 :y)))))

    (clamp pad2 bbox port?)
    (clamp pad1 bbox port?)
    (traceEnclosure ball dt bbox port?)

    (let [winner (collide? pad1 pad2 ball bbox port?) ]
      (when (> winner 0)
        (updatePoint arena winner)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- syncClients "Update UI with states of local entities."

  [^czlab.frigga.pong.arena.ArenaAPI arena]

  (let [^PlayRoom room (.container ^GameEngine (.engine arena))
        ^Muble impl (.innards arena)
        port? (.getv impl :portrait)
        ^Muble
        pad2 (.getv impl :paddle2)
        ^Muble
        pad1 (.getv impl :paddle1)
        ^Muble
        ball (.getv impl :ball)
        src {:p2 {:y (.getv pad2 :y)
                  :x (.getv pad2 :x)
                  :pv (if port?
                        (.getv pad2 :vx)
                        (.getv pad2 :vy))}
             :p1 {:y (.getv pad1 :y)
                  :x (.getv pad1 :x)
                  :pv (if port?
                        (.getv pad1 :vx)
                        (.getv pad1 :vy))}
             :ball {:y (.getv ball :y)
                    :x (.getv ball :x)
                    :vy (.getv ball :vy)
                    :vx (.getv ball :vx) }} ]
    (log/debug "sync new BALL values " (:ball src))
    (BCastAll room Events/SYNC_ARENA src)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- updateArena "Update the state of the Arena per game loop."

  [^czlab.frigga.pong.arena.ArenaAPI arena options]

  (let [^Muble impl (.innards arena)]
    (if-not (true? (.getv impl :resetting-point))
      (let [waitIntv (:syncMillis options)
            maxpts (:numpts options)
            world (:world options)
            lastTick (.getv impl :lastTick)
            lastSync (.getv impl :lastSync)
            now (System/currentTimeMillis)]
        ;; --- update the game with the difference
        ;;in ms since the
        ;; --- last tick
        (let [diff (- now lastTick)
              lastSync2 (+ lastSync diff)]
          (updateEntities arena (/ diff 1000) world)
          (.setv impl :lastSync lastSync2)
          (.setv impl :lastTick now)
          ;; --- check if time to send a ball update
          (when (> lastSync waitIntv)
            (when (.getv impl :sync)
              (syncClients arena))
            (.setv impl :lastSync 0)))))
    ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- postUpdateArena "After update, check if either one of the
                       score has reached the target value, and if
                       so, end the game else pause and loop again."

  [^czlab.frigga.pong.arena.ArenaAPI arena
   options]

  (let [^Muble impl (.innards arena)
        ^GameEngine eng (.engine arena)
        fps (/ 1000 (:framespersec options))
        nps (:numpts options)
        s2 (.getv impl :score2)
        s1 (.getv impl :score1)]
    (if (and (not (true? (.getv impl :resetting-point)))
             (or (>= s2 nps)
                 (>= s1 nps)))
      (do
        (log/debug "haha score " s2
                   " vs " s1
                   " :-------------------> game over.")
        (.endRound eng nil)
        ;; use this to get out of the while loop
        (trap! Exception "game over."))
      (tryc (Thread/sleep fps)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- runGameLoop "Spawn a game loop in a separate thread."

  [^czlab.frigga.pong.arena.ArenaAPI arena options new?]

  (let [^Muble impl (.innards arena)]
    (.setv impl :lastTick (System/currentTimeMillis))
    (.setv impl :lastSync 0)
    (.setv impl :sync true)
    (.setv impl :resetting-point false)
    (when new?
      (.setv impl :numpts (:numpts options))
      (.setv impl :score2 0)
      (.setv impl :score1 0)
      (Coroutine #(while true
                    (tryc (updateArena arena options))
                    (postUpdateArena arena options))
                 {:daemon true}))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- initEntities "Initialize all local entities."

  [^czlab.frigga.pong.arena.ArenaAPI arena
   pp1 pp2
   pd ba]

  (let [^Muble impl (.innards arena)]
    (log/debug "resetting all entities back to default positions.")
    (.setv impl :paddle2 (reifyPaddle (:x pp2)
                                        (:y pp2)
                                        (:width pd)
                                        (:height pd)))
    (.setv impl :paddle1 (reifyPaddle (:x pp1)
                                        (:y pp1)
                                        (:width pd)
                                        (:height pd)))
    (let [^Muble
          b (reifyBall (:x ba)
                       (:y ba)
                       (:width ba)
                       (:height ba))]
      (.setv b :vx (* (RandomSign) (:speed ba)))
      (.setv b :vy (* (RandomSign) (:speed ba)))
      (.setv impl :ball b))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- pokeAndStartUI ""

  [^czlab.frigga.pong.arena.ArenaAPI arena options]

  (let [^PlayRoom room (.container ^GameEngine (.engine arena))
        ^Muble impl (.innards arena)
        ^PlayerSession p2 (:session (.getv impl :p2))
        ^PlayerSession p1 (:session (.getv impl :p1))
        ^Muble
        ball (.getv impl :ball)
        src {:ball {:vx (.getv ball :vx)
                    :vy (.getv ball :vy)
                    :x (.getv ball :x)
                    :y (.getv ball :y)} }]
    (->> (ReifySSEvent Events/POKE_MOVE
                       {:pnum (.number p2)} p2)
         (.sendMsg room))
    (->> (ReifySSEvent Events/POKE_MOVE
                       {:pnum (.number p1)} p1)
         (.sendMsg room))
    (BCastAll room Events/SYNC_ARENA src)
    (log/debug "setting default ball values " src)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyArena "The local game arena."

  ^czlab.frigga.pong.arena.ArenaAPI
  [^GameEngine theEngine options]

  (let [maxpts (:numpts options)
        world (:world options)
        pd (:paddle options)
        ba (:ball options)
        pp2 (:p2 options)
        pp1 (:p1 options)
        impl (MubleObj) ]
    (.setv impl
           :portrait
           (> (- (:top world)(:bottom world))
              (- (:right world)(:left world))))
    (reify ArenaAPI
      (registerPlayers [this p1Wrap p2Wrap]
        (.setv impl :p2 p2Wrap)
        (.setv impl :p1 p1Wrap)
        (initEntities this pp1 pp2 pd ba))

      (getPlayer2 [_] (-> (.getv impl :p2)
                          (:player)))
      (getPlayer1 [_] (-> (.getv impl :p1)
                          (:player)))

      (engine [_] theEngine)
      (innards [_] impl)

      (restart [_]
        (.setv impl :resetting-point false)
        (.setv impl :score2 0)
        (.setv impl :score1 0))

      (resetPoint [this]
        (initEntities this pp1 pp2 pd ba)
        (.startPoint this {}))

      (startPoint [this cmd]
        (pokeAndStartUI this options)
        (runGameLoop this options
                     (true? (:new cmd))))

      (enqueue [_ evt]
        (let [^PlayerSession p2 (:session (.getv impl :p2))
              ^PlayerSession p1 (:session (.getv impl :p1))
              ^PlayerSession pss (:context evt)
              ^PlayRoom room (.container theEngine)
              pnum (.number pss)
              kw (if (= pnum 1) :p1 :p2)
              pt (if (= pnum 1) p2 p1)
              src (:source evt)
              cmd (ReadJsonKW src)
              ;;pv (* (:dir (kw cmd)) (:speed pd))
              pv (:pv (kw cmd))
              ^Muble
              other (if (= pnum 2)
                      (.getv impl :paddle2)
                      (.getv impl :paddle1))]
          (if (.getv impl :portrait)
            (.setv other :vx pv)
            (.setv other :vy pv))
          (->> (ReifySSEvent Events/SYNC_ARENA cmd pt)
               (.sendMsg room))))
    )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

