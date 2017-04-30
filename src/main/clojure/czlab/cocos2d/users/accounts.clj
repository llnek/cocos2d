;; Copyright (c) 2013-2017, Kenneth Leung. All rights reserved.
;; The use and distribution terms for this software are covered by the
;; Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
;; which can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any fashion, you are agreeing to be bound by
;; the terms of this license.
;; You must not remove this notice, or any other, from this software.

(ns  ^{:doc ""
       :author "Kenneth Leung"}

  czlab.cocos2d.users.accounts

  (:require [czlab.basal.format :refer [writeJsonStr]]
            [czlab.basal.logging :as log]
            [czlab.convoy.wess :as wss]
            [czlab.basal.resources :refer [rstr]])

  (:use [czlab.wabbit.shiro.core]
        [czlab.wabbit.xpis]
        [czlab.convoy.core]
        [czlab.basal.core]
        [czlab.basal.io]
        [czlab.basal.str]
        [czlab.cocos2d.util.core])

  (:import [czlab.jasal XData DataError Idable I18N]
           [org.apache.commons.codec.net URLCodec]
           [java.net HttpCookie]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail "" [evt res ^Throwable err]
  (reply-result
    (if (= "DuplicateUser" (.getMessage err))
      (let [rcb (-> (get-pluglet evt)
                    get-server id?? I18N/bundle)
            json {:error {:msg
                          (rstr rcb
                                "acct.dup.user")}}]
        (-> (->> (writeJsonStr json)
                 xdata<>
                 (assoc res :body))
            (assoc :status 409)))
      (assoc res :status 400))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK "" [evt res acct]
  (log/debug "success: signed up new acct %s" acct)
  (let [json {:status {:code 200}}]
    (reply-result
      (->> (writeJsonStr json)
           xdata<>
           (assoc res :body)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn signupHandler "" [evt res]
  (log/debug "signup pipe-line - called")
  (let [rc (signupTestExpr<> "32" evt)]
    (if (ist? Throwable rc)
      (doSignupFail evt res rc)
      (doSignupOK evt res rc))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail "" [evt res err]
  (-> (assoc res :status 403) reply-result))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK "" [evt res acct]
  (let [json {:status {:code 200}}
        plug (get-pluglet evt)
        svr (get-server plug)
        pk (pkey-bytes svr)
        cfg (:session (:conf @plug))
        ck (csrfToken<> cfg nil)
        mvs (wsession<> pk cfg)]
    (set-principal mvs (str (:acctid acct)))
    (-> (->> (writeJsonStr json)
             xdata<>
             (assoc res :body))
        (update-in [:cookies]
                   (.getName ck) ck)
        (reply-result mvs))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginHandler "" [evt res]
  (log/debug "login pipe-line - called")
  (let [rc (loginTestExpr<> evt)]
    (if (ist? Throwable rc)
      (doLoginFail evt res rc)
      (doLoginOK evt res rc))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail "" [evt res]
  (let [plug (get-pluglet evt)
        svr (get-server plug)
        pa (get-child svr :$auth)
        si (try (maybeGetAuthInfo evt)
                (catch DataError _  {:e _ }))
        info (or si {})
        email (str (:email info))]
    (test-some "AuthPlugin" pa)
    (if (and (= "18" (:captcha info))
             (hgl? email))
      (if-some [acct (get-account pa {:email email})]
        (do-with [acct acct]
                 (log/debug "found account, email=%s" email))
        (log/debug "failed to find account with email=%s" email)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doAckReply "" [evt res]
  (let [json {:status {:code 200}}]
    (->> (writeJsonStr json) xdata<> (assoc res :body) reply-result)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotHandler "" [evt res]
  (log/debug "forgot-login pipe-line - called")
  (doAckReply evt res)
  (doLookupEmail evt res))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLogout "" [evt res]
  (let [json {:status {:code 200}}]
    (some-> (:session evt) invalidate!)
    (->> (writeJsonStr json) xdata<> (assoc res :body) replyResult )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn logoutHandler "" [evt res]
  (log/debug "logout pipe-line - called")
  (doLogout evt res))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

