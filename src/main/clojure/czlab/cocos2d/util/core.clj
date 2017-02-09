;; Copyright (c) 2013-2017, Kenneth Leung. All rights reserved.
;; The use and distribution terms for this software are covered by the
;; Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
;; which can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any fashion, you are agreeing to be bound by
;; the terms of this license.
;; You must not remove this notice, or any other, from this software.

(ns ^{:doc ""
      :author "Kenneth Leung"}

  czlab.cocos2d.util.core

  (:gen-class)

  (:require [czlab.basal.logging :as log]
            [clojure.java.io :as io]
            [clojure.string :as cs]
            [czlab.basal.io :refer [dirRead?]])

  (:use [czlab.cocos2d.games.meta]
        [czlab.basal.core]
        [czlab.basal.str])

  (:import [java.io File]
           [java.util List Locale]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* false)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn -main "" [& args]

  ;; for security, don't just eval stuff
  ;;(alter-var-root #'*read-eval* (constantly false))

  (let [appDir (io/file (first args))
        apps ((comp (fn [_] (getGamesAsList))
                    scanGameManifests) appDir)]
    (doseq [a apps]
      (log/debug "app = %s" (:gamedir a)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

