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
            [czlab.wabbit.plugs.io.mvc :as mvc])

  (:use [czlab.wabbit.plugs.auth.core]
        [czlab.flux.wflow.core]
        [czlab.convoy.net.core]
        [czlab.convoy.net.util]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.basal.io]
        [czlab.convoy.net.wess :as wss]
        [czlab.cocos2d.util.core]
        [czlab.convoy.nettio.resp])

  (:import [czlab.convoy.net RouteInfo HttpResult]
           [czlab.flux.wflow Workstream Job]
           [czlab.wabbit.plugs.io HttpMsg]
           [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectPage
  "" [^HttpMsg evt ^String action ^String csrf]

  (update-in (getDftModel evt)
             [:body]
             #(merge % {:content (str "/users/" action ".ftl")
                        :csrf csrf})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" [func]

  #(do->nil
     (let
       [^HttpMsg evt (.origin ^Job %)
        gs (.gist evt)
        token (generateCsrf)
        ri (get-in gs [:route :info])
        tpl (some-> ^RouteInfo ri .template)
        cfg (:session (.. evt source config))
        {:keys [data ctype]}
        (mvc/loadTemplate (.source evt)
                          tpl
                          (injectPage evt func token))
        res (httpResult<> evt)]
       (doto res
         (.addCookie (csrfToken<> cfg token))
         (.setContentType ctype)
         (.setContent data)
         (replyResult  )))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn registerPage "" ^Workstream []
  (workstream<> (doShowPage "register")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginPage "" ^Workstream []
  (workstream<> (doShowPage "login")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotPage "" ^Workstream []
  (workstream<> (doShowPage "forgot")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

