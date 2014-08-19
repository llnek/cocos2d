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

  (registerPlayers [_ p1 p2])
  (broadcast [_ cmd])
  (getPlayer2 [_])
  (getPlayer1 [_])
  (enqueue [_ cmd])
  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayer ""

  [idValue pcolor psession]

  {:value idValue
   :color pcolor
   :session psession })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPongArena ""

  [options]

  (let [maxpts (:numpts options)
        world (:world options)
        pd (:paddle options)
        ba (:ball options)
        impl (MakeMMap) ]
    (reify ArenaAPI
      (registerPlayers [_ ps1 ps2]
        (.setf! impl :p2 ps2)
        (.setf! impl :p1 ps1))

      (getPlayer2 [_] (.getf impl :p2))
      (getPlayer1 [_] (.getf impl :p1))

      (broadcast [this cmd]
        (let [^PlayerSession p2 (:session (.getf impl :p2))
              ^PlayerSession p1 (:session (.getf impl :p1))
              src {}]
          (.sendMessage p2 (ReifyEvent Events/SESSION_MSG
                                       Events/C_POKE_MOVE
                                       (json/write-str (assoc src :pnum (.number p2)))))
          (.sendMessage p1 (ReifyEvent Events/NETWORK_MSG
                                       Events/C_POKE_MOVE
                                       (json/write-str (assoc src :pnum (.number p1)))))))

      (enqueue [_ evt]
        (let [^PlayerSession p2 (:session (.getf impl :p2))
              ^PlayerSession p1 (:session (.getf impl :p1))
              pss (:context evt)
              src (:source evt)
              cmd (json/read-str src :key-fn keyword)
              pt (if (= p2 pss) p1 p2)]
          (.sendMessage pt (ReifyEvent Events/SESSION_MSG
                                       Events/C_POKE_MOVE
                                       (json/write-str (assoc cmd :pnum (.number pss)))))))

    )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private arena-eof nil)

