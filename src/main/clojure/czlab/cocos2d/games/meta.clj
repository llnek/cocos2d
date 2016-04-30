;; Licensed under the Apache License, Version 2.0 (the "License");
;; you may not use this file except in compliance with the License.
;; You may obtain a copy of the License at
;;
;;     http://www.apache.org/licenses/LICENSE-2.0
;;
;; Unless required by applicable law or agreed to in writing, software
;; distributed under the License is distributed on an "AS IS" BASIS,
;; WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
;; See the License for the specific language governing permissions and
;; limitations under the License.
;;
;; Copyright (c) 2013-2016, Kenneth Leung. All rights reserved.


(ns  ^{:doc ""
       :author "kenl" }

  czlab.cocos2d.games.meta

  (:require
    [czlab.xlib.util.files :refer [ReadOneFile ListDirs] ]
    [czlab.xlib.util.format
    :refer [ReadJsonKW ReadJson
    ReadEdn WriteJson]]
    [czlab.xlib.util.logging :as log]
    [clojure.java.io :as io]
    [czlab.xlib.util.str :refer [hgl? strim] ]
    [czlab.xlib.util.dates :refer [DTime ParseDate] ])

  (:use [czlab.skaro.core.consts])

  (:import
    [java.io File]
    [java.util Date]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private GAMES-MNFS (atom []))
(def ^:private GAMES-LIST (atom []))
(def ^:private GAMES-HASH (atom {}))
(def ^:private GAMES-UUID (atom {}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ScanGameManifests

  "Fetch game manifests and build an internal
   model of each game.  These models are then
   consumed by the GUI and game-engines"

  [^File appDir]

  (with-local-vars
    [uc (transient {})
     mc (transient {})
     tmp nil
     gc (transient [])
     rc (transient []) ]
    (doseq [^File fd (->> (io/file appDir "public/ig/info")
                          (ListDirs))
           :let [info (merge (-> (ReadEdn (io/file fd "game.mf"))
                                 (assoc :gamedir (.getName fd)))
                             (-> (io/file fd "game.json")
                                 (ReadOneFile)
                                 (ReadJsonKW)))
                 {:keys [network uuid uri]}
                 info
                 online (true? (:enabled network))]]
      ;; create a UI friendly version for freemarker
      (var-set tmp (transient{}))
      (doseq [[k v] info]
        (var-set tmp (assoc! @tmp (name k) v)))
      (var-set tmp (assoc! @tmp "network" online))
      (var-set gc (conj! @gc (persistent! @tmp)))
      (var-set uc (assoc! @uc uuid info))
      (var-set mc (assoc! @mc uri info))
      (var-set rc (conj! @rc info)))
    (reset! GAMES-MNFS (vec (sort #(compare (DTime (%1 :pubdate))
                                            (DTime (%2 :pubdate)))
                                  (persistent! @rc))))
    (reset! GAMES-HASH (persistent! @mc))
    (reset! GAMES-UUID (persistent! @uc))
    (reset! GAMES-LIST (vec (sort #(compare (DTime (%1 "pubdate"))
                                            (DTime (%2 "pubdate")))
                                  (persistent! @gc))))
    ;;set true for debugging
    (when true
      (log/debug "############ game manifests ##########################")
      (log/debug "%s" @GAMES-MNFS)
      (log/debug "############ game UriHash ##########################")
      (log/debug "%s" (keys @GAMES-HASH))
      (log/debug "############ game UUID ##########################")
      (log/debug "%s" (keys @GAMES-UUID))
      ;;(log/debug "############ game SimpleList ##########################")
      ;;(log/debug @GAMES-LIST)
      (log/debug ""))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsListForUI

  "Return the game models as a list for the UI"

  []

  @GAMES-LIST)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsList

  "Return the list of manifests"

  []

  @GAMES-MNFS)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsHash

  "Return the manifests keyed by the game uri"

  []

  @GAMES-HASH)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsUUID

  "Return the manifests keyed by the game uuid"

  []

  @GAMES-UUID)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

