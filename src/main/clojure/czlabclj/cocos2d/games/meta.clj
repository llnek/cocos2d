;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013, Ken Leung. All rights reserved.

(ns  ^{:doc ""
       :author "kenl" }

  czlabclj.cocos2d.games.meta

  (:require [clojure.tools.logging :as log]
            [clojure.java.io :as io])

  (:use [czlabclj.xlib.util.format :only [ReadJsonKW ReadJson
                                          ReadEdn WriteJson]]
        [czlabclj.xlib.util.str :only [nsb hgl? strim] ]
        [czlabclj.xlib.util.dates :only [ParseDate] ]
        [czlabclj.xlib.util.files :only [ReadOneFile] ]
        [czlabclj.tardis.core.consts])

  (:import  [org.apache.commons.io FileUtils]
            [com.zotohlab.frwk.io IO]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

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
(defn ScanGameManifests "Fetch game manifests and build an internal
                        model of each game.  These models are then
                        consumed by the GUI and game-engines."

  [^File appDir]

  (with-local-vars [uc (transient {})
                    mc (transient {})
                    tmp nil
                    gc (transient [])
                    rc (transient []) ]
    (let [fds (IO/listDirs (io/file appDir "public" "ig" "info")) ]
      (doseq [^File fd (seq fds) ]
        (let [info (merge (assoc (ReadEdn (io/file fd "game.mf"))
                                 :gamedir (.getName fd))
                          (-> (io/file fd "game.json")
                              (ReadOneFile)
                              (ReadJsonKW)))
              {:keys [network uuid uri]} info
              online (true? (:enabled network))]
          ;; create a UI friendly version for freemarker
          (var-set tmp (transient{}))
          (doseq [[k v] (seq info)]
            (var-set tmp (assoc! @tmp (name k) v)))
          (var-set tmp (assoc! @tmp "network" online))
          (var-set gc (conj! @gc (persistent! @tmp)))
          (var-set uc (assoc! @uc uuid info))
          (var-set mc (assoc! @mc uri info))
          (var-set rc (conj! @rc info)))))
    (reset! GAMES-MNFS (vec (sort #(compare (.getTime ^Date (%1 :pubdate))
                                            (.getTime ^Date (%2 :pubdate)))
                                  (persistent! @rc))))
    (reset! GAMES-HASH (persistent! @mc))
    (reset! GAMES-UUID (persistent! @uc))
    (reset! GAMES-LIST (vec (sort #(compare (.getTime ^Date (%1 "pubdate"))
                                            (.getTime ^Date (%2 "pubdate")))
                                  (persistent! @gc))))
    ;;set true for debugging
    (when true
      (log/debug "############ game manifests ##########################")
      (log/debug @GAMES-MNFS)
      (log/debug "############ game UriHash ##########################")
      (log/debug (keys @GAMES-HASH))
      (log/debug "############ game UUID ##########################")
      (log/debug (keys @GAMES-UUID))
      ;;(log/debug "############ game SimpleList ##########################")
      ;;(log/debug @GAMES-LIST)
      (log/debug ""))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsListForUI "Return the game models as a list
                          for the UI."

  []

  @GAMES-LIST)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsList "Return the list of manifests."

  []

  @GAMES-MNFS)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsHash "Return the manifests keyed by the
                     game uri."

  []

  @GAMES-HASH)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsUUID "Return the manifests keyed by the
                     game uuid."

  []

  @GAMES-UUID)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private meta-eof nil)

