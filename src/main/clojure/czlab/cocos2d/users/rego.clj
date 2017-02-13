;; Copyright (c) 2013-2017, Kenneth Leung. All rights reserved.
;; The use and distribution terms for this software are covered by the
;; Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
;; which can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any fashion, you are agreeing to be bound by
;; the terms of this license.
;; You must not remove this notice, or any other, from this software.

(ns  ^{:doc ""
       :author "Kenneth Leung"}

  czlab.cocos2d.users.rego

  (:require [czlab.basal.dates :refer [parseDate]]
            [czlab.basal.logging :as log]
            [czlab.wabbit.plugs.io.mvc :as mvc]
            [czlab.convoy.net.util :refer [generateCsrf]])

  (:use [czlab.flux.wflow.core]
        [czlab.convoy.net.core]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.basal.io]
        [czlab.cocos2d.util.core]
        [czlab.convoy.nettio.resp])

  (:import [czlab.convoy.net RouteInfo HttpResult]
           [czlab.flux.wflow WorkStream Job]
           [czlab.wabbit.plugs.io HttpMsg]
           [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectRegisterPage
  "" [^HttpMsg evt ^String csrf]

  (update-in (getDftModel evt)
             [:body]
             #(merge % {:content "/users/register.ftl"
                        :csrf csrf})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectLoginPage
  "" [^HttpMsg evt ^String csrf]

  (update-in (getDftModel evt)
             [:body]
             #(merge % {:content "/users/login.ftl"
                        :csrf csrf})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectForgotPage
  "" [^HttpMsg evt ^String csrf]

  (update-in (getDftModel evt)
             [:body]
             #(merge % {:content "/users/forgot.ftl"
                        :csrf csrf})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" [func]

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          gs (.msgGist evt)
          ri (get-in gs [:route :info])
          tpl (some-> ^RouteInfo
                      ri .template)
          csrf (generateCsrf)
          mvs (.session evt)
          {:keys [sessionAgeSecs] :as cfg}
          (.. evt source config)
          {:keys [data ctype]}
          (mvc/loadTemplate (.source evt)
                            tpl (func evt csrf))
          res (httpResult<> evt)]
         (when mvs
           (.setNew mvs true sessionAgeSecs)
           (.setXref mvs csrf))
         (doto res
           (.setContentType ctype)
           (.setContent data)
           (replyResult  cfg))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn registerPage "" ^WorkStream []
  (workStream<> (doShowPage injectRegisterPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginPage "" ^WorkStream []
  (workStream<> (doShowPage injectLoginPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotPage "" ^WorkStream []
  (workStream<> (doShowPage injectForgotPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

