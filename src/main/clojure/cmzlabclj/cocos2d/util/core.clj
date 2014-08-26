;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  cmzlabclj.cocos2d.util.core

  (:gen-class)

  (:require [clojure.tools.logging :as log :only [warn error info debug] ]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [test-cond] ]
        [cmzlabclj.nucleus.util.str :only [MakeString] ]
        [cmzlabclj.nucleus.util.files :only [DirRead?] ])

  (:use [cmzlabclj.cocos2d.games.meta])

  (:import  [java.util List Locale]
            [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* false)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn -main "Main Entry"

  [& args]

  ;; for security, don't just eval stuff
  ;;(alter-var-root #'*read-eval* (constantly false))
  (let [appDir (File. (first args))
        apps ((comp (fn [_] (GetGamesAsList))
                    ScanGameManifests)
              appDir) ]
    (doseq [a apps]
      (log/debug "app = " (:gamedir a)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

