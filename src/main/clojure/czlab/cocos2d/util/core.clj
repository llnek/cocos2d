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

  (:require [czlab.basal.io :as i :refer [dirRead?]]
            [czlab.basal.log :as log]
            [clojure.java.io :as io]
            [clojure.string :as cs]
            [czlab.convoy.core :as cc]
            [czlab.convoy.wess :as ss]
            [czlab.basal.core :as c]
            [czlab.basal.str :as s]
            [czlab.wabbit.xpis :as xp]
            [czlab.cocos2d.games.meta :as gm])

  (:import [java.net HttpCookie]
           [java.io File]
           [java.util List Locale]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* false)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getDftModel
  "For Freemarker" [evt]

  (let [ss (:session evt)
        ok? (if ss (c/try! (c/do->true (ss/validate?? ss))))
        uid (some-> ss ss/principal)
        uid (if (and ok? (s/hgl? uid)) uid "Guest")]
    {:title "ZotohLab | Fun &amp; Games."
     :description "Bonjour!"
     :encoding "utf-8"
     :stylesheets []
     :scripts []
     :metatags
     {:keywords "content=\"web browser games mobile ios android windows phone\""
      :description "content=\"Hello World!\""
      :viewport "content=\"width=device-width, initial-scale=1.0\""}
     :appkey (-> evt xp/get-pluglet xp/get-server xp/pkey-chars c/strit)
     :profile {:user uid :session (c/bool! ok?) }
     :body {} }))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- main "" [& args]

  ;; for security, don't just eval stuff
  ;;(alter-var-root #'*read-eval* (constantly false))

  (let [appDir (io/file (first args))
        apps ((comp (fn [_] (gm/getGamesAsList))
                    gm/scanGameManifests) appDir)]
    (doseq [a apps]
      (log/debug "app = %s" (:gamedir a)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

