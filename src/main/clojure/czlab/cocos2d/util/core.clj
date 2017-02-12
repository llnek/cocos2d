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

  ;;(:gen-class)

  (:require [czlab.basal.logging :as log]
            [clojure.java.io :as io]
            [clojure.string :as cs]
            [czlab.basal.io :refer [dirRead?]])

  (:use [czlab.cocos2d.games.meta]
        [czlab.basal.core]
        [czlab.basal.str])

  (:import [czlab.wabbit.plugs.io HttpMsg]
           [java.net HttpCookie]
           [java.io File]
           [java.util List Locale]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* false)
(def ^:dynamic *user-flag* :__u982i) ;; user id

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getDftModel "Default object for Freemarker processing" [^HttpMsg evt]

  (let [ck (. evt cookie (name *user-flag*))
        uid (if (nil? ck)
              "Guest"
              (strim (.getValue ck)))]
    {:title "ZotohLab | Fun &amp; Games."
     :encoding "utf-8"
     :description "Bonjour!"
     :stylesheets []
     :scripts []
     :metatags
     {:keywords "content=\"web browser games mobile ios android windows phone\""
      :description "content=\"Hello World!\""
      :viewport "content=\"width=device-width, initial-scale=1.0\""}
     :appkey (.. evt source server pkey)
     :profile {:user uid}
     :body {} }))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- main "" [& args]

  ;; for security, don't just eval stuff
  ;;(alter-var-root #'*read-eval* (constantly false))

  (let [appDir (io/file (first args))
        apps ((comp (fn [_] (getGamesAsList))
                    scanGameManifests) appDir)]
    (doseq [a apps]
      (log/debug "app = %s" (:gamedir a)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

