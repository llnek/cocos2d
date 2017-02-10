;; Copyright (c) 2013-2017, Kenneth Leung. All rights reserved.
;; The use and distribution terms for this software are covered by the
;; Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
;; which can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any fashion, you are agreeing to be bound by
;; the terms of this license.
;; You must not remove this notice, or any other, from this software.

(ns  ^{:doc ""
       :author "Kenneth Leung"}

  czlab.cocos2d.games.meta

  (:require [czlab.basal.io :refer [readAsStr listDirs]]
            [czlab.basal.logging :as log]
            [clojure.java.io :as io]
            [clojure.string :as cs]
            [czlab.basal.dates :refer [dtime parseDate]])

  (:use [czlab.wabbit.base.core]
        [czlab.basal.format]
        [czlab.basal.core]
        [czlab.basal.str])

  (:import [java.io File]
           [java.util Date]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private games-mnfs (atom []))
(def ^:private games-list (atom []))
(def ^:private games-hash (atom {}))
(def ^:private games-uuid (atom {}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn scanGameManifests

  "Fetch game manifests and build an internal
   model of each game.  These models are then
   consumed by the GUI and game-engines"

  [^File appDir]

  (with-local-vars
    [uc (transient {})
     mc (transient {})
     gc (transient [])
     rc (transient [])]
    (doseq
      [^File fd (listDirs (io/file appDir
                                   "public/info"))
       :let [info (merge (-> (io/file fd "game.mf")
                             readEdn
                             (assoc :gamedir (.getName fd)))
                         (-> (io/file fd "game.json")
                             readAsStr
                             readJsonStrKW))
             {:keys [network uuid uri]}
             info
             online (true? (:enabled network))]]
      ;; create a UI friendly version for freemarker
      (->> (-> (preduce<map>
                 #(let [[k v] %2]
                    (assoc! %1 (name k) v)) info)
               (assoc "network" online))
           (conj! @gc)
           (var-set gc))
      (var-set uc (assoc! @uc uuid info))
      (var-set mc (assoc! @mc uri info))
      (var-set rc (conj! @rc info)))
    (reset! games-mnfs
            (vec (sort #(compare (dtime (%1 :pubdate))
                                 (dtime (%2 :pubdate)))
                       (persistent! @rc))))
    (reset! games-hash (persistent! @mc))
    (reset! games-uuid (persistent! @uc))
    (reset! games-list
            (vec (sort #(compare (dtime (%1 "pubdate"))
                                 (dtime (%2 "pubdate")))
                       (persistent! @gc))))
    ;;set true for debugging
    (when true
      (log/debug "############ game manifests ##########################")
      (log/debug "%s" @games-mnfs)
      (log/debug "############ game UriHash ##########################")
      (log/debug "%s" (keys @games-hash))
      (log/debug "############ game UUID ##########################")
      (log/debug "%s" (keys @games-uuid))
      ;;(log/debug "############ game SimpleList ##########################")
      ;;(log/debug @games-list)
      (log/debug ""))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getGamesAsListForUI

  "Return the game models as a list for the UI"
  []

  @games-list)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getGamesAsList

  "Return the list of manifests"
  []

  @games-mnfs)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getGamesAsHash

  "Return the manifests keyed by the game uri"
  []

  @games-hash)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getGamesAsUUID

  "Return the manifests keyed by the game uuid"
  []

  @games-uuid)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

