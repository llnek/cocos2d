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
            [czlab.wabbit.plugs.io.mvc :as mvc]
            [czlab.basal.logging :as log]
            [clojure.string :as cs]
            [clojure.java.io :as io])

  (:use [czlab.cocos2d.games.meta]
        [czlab.flux.wflow.core]
        [czlab.convoy.net.core]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.basal.io]
        [czlab.wabbit.base.core]
        [czlab.convoy.nettio.resp])

  (:import [czlab.flux.wflow Job TaskDef WorkStream]
           [czlab.convoy.net RouteInfo HttpResult]
           [czlab.wabbit.plugs.io HttpMsg]
           [czlab.wabbit.sys Execvisor]
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
(defn- maybeCheckDoors  "" [appDir]

  (->> (file-seq (io/file appDir "public/res/doors"))
       (filter #(.endsWith (.getName ^File %) ".png"))
       (mapv #(.getName ^File %))
       (reset! doors))
  (log/debug "how many doors ? %s" (count @doors)))

(defn- odinInit "" [_])
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn myAppMain "" [^Execvisor co]

  (doto (.homeDir co)
    (scanGameManifests )
    (maybeCheckDoors )
    (odinInit co))
  (log/info "app-main called by container %s" co))

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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectIndexPage "" [^HttpMsg evt]

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
          (mvc/loadTemplate (.source evt)
                            tpl (injectIndexPage evt))
          res (httpResult<> (.socket evt)
                            (.msgGist evt))]
         (doto res
           (.setContentType ctype)
           (.setContent data))
         (replyResult res)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn indexPage "" ^WorkStream [] (workStream<> (doShowPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

