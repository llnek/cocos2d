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

  (:require [czlab.basal.dates :as d :refer [parseDate]]
            [czlab.wabbit.plugs.mvc :as mvc]
            [czlab.basal.log :as log]
            [czlab.convoy.wess :as ss]
            [czlab.wabbit.xpis :as xp]
            [czlab.convoy.core :as cc]
            [czlab.convoy.util :as cu]
            [czlab.basal.core :as c]
            [czlab.basal.str :as s]
            [czlab.basal.io :as i]
            [czlab.cocos2d.util.core :as u]
            [czlab.wabbit.shiro.core :as sh])

  (:import [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectPage
  "" [evt action csrf]

  (update-in (u/getDftModel evt)
             [:body]
             #(merge % {:content (str "/users/" action ".ftl")
                        :csrf csrf})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" [func evt res]
   (let [plug (xp/get-pluglet evt)
         svr (xp/get-server plug)
         token (cu/generateCsrf)
         ri (get-in evt
                    [:route :info])
         tpl (:template ri)
         cfg (:session (:conf @plug))
         {:keys [data ctype]}
         (mvc/loadTemplate plug
                           tpl
                           (injectPage evt func token))
         ck (sh/csrfToken<> cfg token)]
     (cc/reply-result
       (-> (cc/set-res-header res "content-type" ctype)
           (update-in [:cookies]
                      assoc (.getName ck) ck)
           (assoc :body data)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn registerPage "" [evt res] (doShowPage "register" evt res))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginPage "" [evt res] (doShowPage "login" evt res))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotPage "" [evt res] (doShowPage "forgot" evt res))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

