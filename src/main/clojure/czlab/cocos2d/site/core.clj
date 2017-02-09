;; Copyright (c) 2013-2017, Kenneth Leung. All rights reserved.
;; The use and distribution terms for this software are covered by the
;; Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
;; which can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any fashion, you are agreeing to be bound by
;; the terms of this license.
;; You must not remove this notice, or any other, from this software.

(ns  ^{:doc ""
       :author "Kenneth Leung"}

  czlab.cocos2d.site.core

  (:require [czlab.basal.dates :refer [parseDate]]
            [czlab.basal.io :refer [listFiles]]
            [czlab.basal.logging :as log]
            [clojure.string :as cs]
            [clojure.java.io :as io])

  (:use [czlab.cocos2d.games.meta]
        [czlab.wabbit.base.core])

  (:import [czlab.wabbit.plugs.io HttpMsg]
           [czlab.convoy.net HttpResult]
           [czlab.jasal XData]
           [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:dynamic *user-flag* :__u982i) ;; user id
(def ^:private doors (atom []))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- maybeCheckDoors  "" [^File appDir]

  (with-local-vars [rc (transient [])]
    (let [fds (-> (io/file appDir "public/ig/res/main/doors")
                  (listFiles  "png"))]
      (doseq [^File fd fds]
        (var-set rc (conj! @rc (.getName fd)))))
    (reset! doors (persistent! @rc))
    (log/debug "how many doors ? %s" (count @doors))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn myAppMain "" [^Container co]

  (doto (.getAppDir co)
    (scanGameManifests )
    (maybeCheckDoors ))
  ;;(OdinInit ctr)
  (log/info "app-main contextualized by container %s" co))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn getDftModel

  "Return a default object for Freemarker processing."
  [^HttpMsg evt]

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
      :viewport "content=\"width=device-width, initial-scale=1.0\"" }
     :appkey (getAppKeyFromEvent evt)
     :profile {:user uid }
     :body {} }))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateIndexPage "" [^HttpMsg evt]

  (-> (getDftModel evt)
      (update-in [:body]
                 #(merge %
                         {:doors @doors
                          :content "/main/index.ftl"}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          ri (get-in (.msgGist evt)
                     [:route :info])
          tpl (some-> ^RouteInfo
                      ri .template)
          {:keys [data ctype]}
          (loadTemplate nil
                        tpl
                        (interpolateIndexPage evt))
          res (httpResult<> nil)]
         (doto res
           (.setHeader "content-type" ctype)
           (.setContent data))
         (replyResult res)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn indexPage "" ^WorkStream [] (workStream<> (doShowPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

