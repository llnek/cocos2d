;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl"}

  czlabclj.frigga.core.util

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [ternary notnil? ]]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.xlib.util.format]
        [czlabclj.odin.event.core])

  (:import  [com.zotohlab.odin.game PlayRoom GameEngine PlayerSession]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn MapPlayers ""

  ;; outputs map {id -> player-session}
  [players]

  (reduce #(assoc %1 (.id ^PlayerSession %2) %2)
          {}
          players
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn MapPlayersEx ""

  ;; outputs map {id -> [player-number, player-id]}
  [players]

  {:ppids (reduce (fn [memo ^PlayerSession ps]
                      (assoc memo
                             (.id (.player ps))
                             [ (.number ps) (.id (.player ps)) ]))
                    {}
                    players) })

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn BCastAll "Broadcast message to all player sessions."

  [^PlayRoom room code body]

  (->> (ReifyNWEvent code body)
       (.sendMsg room)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private util-eof nil)

