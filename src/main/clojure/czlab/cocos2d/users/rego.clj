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
            [czlab.convoy.net.util :refer [generateCsrf]])

  (:use [czlab.wabbit.plugs.io.http]
        [czlab.basal.consts]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.cocos2d.site.core])

  (:import [czlab.flux.wflow WorkStream Job]
           [czlab.wabbit.plugs.io HttpMsg]
           [czlab.convoy.net HttpResult]
           [czlab.jasal XData]
           [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage
  ""
  [^HttpMsg evt ^String csrf]

  (-> (getDftModel evt)
      (update-in [:body]
                 #(merge % {:content "/main/users/register.ftl"
                            :csrf csrf}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateLoginPage
  ""
  [^HttpMsg evt ^String csrf]

  (-> (getDftModel evt)
      (update-in [:body]
                 #(merge % {:content "/main/users/login.ftl"
                            :csrf csrf}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateForgotPage
  ""
  [^HttpMsg evt ^String csrf]

  (-> (getDftModel evt)
      (update-in [:body]
                 #(merge % {:content "/main/users/forgot.ftl"
                            :csrf csrf}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" [func]

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          ri (get-in (.msgGist evt)
                     [:route :info])
          tpl (some-> ^RouteInfo
                      ri .template)
          csrf (generateCsrf)
          mvs (.session evt)
          {:keys [sessionAgeSecs]}
          (.. evt source config)
          {:keys [data ctype]}
          (loadTemplate nil
                        tpl (func evt csrf))
          res (httpResult<> )]
         (doto res
           (.setHeader "content-type" ctype)
           (.setContent data))
         (doto mvs
           (.setNew true sessionAgeSecs)
           (.setXref csrf))
         (replyResult res)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn registerPage "" ^WorkStream []
  (workStream<>
    (doShowPage interpolateRegisterPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginPage "" ^WorkStream []
  (workStream<>
    (doShowPage interpolateLoginPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotPage "" ^WorkStream []

  (workStream<>
    (doShowPage interpolateForgotPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

