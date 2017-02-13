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
        [czlab.cocos2d.util.core]
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
(def ^:private doors (atom nil))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- maybeCheckDoors  "" [resDir]

  (->> (file-seq (io/file resDir "doors"))
       (filter #(.endsWith (.getName ^File %) ".png"))
       (mapv #(.getName ^File %))
       (reset! doors))
  (log/debug "how many color doors ? %d" (count @doors)))

(defn- odinInit "" [_ _])
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn myAppMain "" [^Execvisor co]

  (doto (.homeDir co)
    (scanGameManifests )
    (odinInit co))
  (log/info "app-main called by container %s" co))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectIndexPage "" [^HttpMsg evt]

  (if (nil? @doors)
    (let [{:keys [publicRootDir mediaDir]}
          (.. evt source config)]
      (-> (io/file publicRootDir mediaDir)
          (maybeCheckDoors ))))
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
          res (httpResult<> evt)]
         (doto res
           (.setContentType ctype)
           (.setContent data)
           (replyResult (.. evt source config)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn indexPage "" ^WorkStream [] (workStream<> (doShowPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

