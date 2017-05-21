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

  (:require [czlab.basal.format :as f :refer [writeJsonStr]]
            [czlab.basal.resources :as r :refer [rstr]]
            [czlab.basal.log :as log]
            [czlab.convoy.wess :as ss]
            [czlab.convoy.wess :as ss]
            [czlab.wabbit.xpis :as xp]
            [czlab.convoy.core :as cc]
            [czlab.basal.core :as c]
            [czlab.basal.io :as i]
            [czlab.basal.str :as s]
            [czlab.cocos2d.util.core :as u]
            [czlab.wabbit.shiro.core :as sh])

  (:import [czlab.jasal XData DataError Idable I18N]
           [org.apache.commons.codec.net URLCodec]
           [java.net HttpCookie]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail "" [evt res ^Throwable err]
  (cc/reply-result
    (if (= "DuplicateUser" (.getMessage err))
      (let [rcb (-> (xp/get-pluglet evt)
                    xp/get-server c/id?? I18N/bundle)
            json {:error {:msg
                          (r/rstr rcb
                                  "acct.dup.user")}}]
        (-> (->> (f/writeJsonStr json)
                 i/xdata<>
                 (assoc res :body))
            (assoc :status 409)))
      (assoc res :status 400))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK "" [evt res acct]
  (log/debug "success: signed up new acct %s" acct)
  (let [json {:status {:code 200}}]
    (cc/reply-result
      (->> (f/writeJsonStr json)
           i/xdata<>
           (assoc res :body)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn signupHandler "" [evt res]
  (log/debug "signup pipe-line - called")
  (let [rc (sh/signupTestExpr<> "32" evt)]
    (if (c/ist? Throwable rc)
      (doSignupFail evt res rc)
      (doSignupOK evt res rc))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail "" [evt res err]
  (-> (assoc res :status 403) cc/reply-result))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK "" [evt res acct]
  (let [json {:status {:code 200}}
        plug (xp/get-pluglet evt)
        svr (xp/get-server plug)
        pk (xp/pkey-bytes svr)
        cfg (:session (:conf @plug))
        ck (sh/csrfToken<> cfg nil)
        mvs (ss/wsession<> pk cfg)]
    (ss/set-principal mvs (str (:acctid acct)))
    (-> (->> (f/writeJsonStr json)
             i/xdata<>
             (assoc res :body))
        (update-in [:cookies]
                   assoc
                   (.getName ck) ck)
        (cc/reply-result mvs))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginHandler "" [evt res]
  (log/debug "login pipe-line - called")
  (let [rc (sh/loginTestExpr<> evt)]
    (if (c/ist? Throwable rc)
      (doLoginFail evt res rc)
      (doLoginOK evt res rc))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail "" [evt res]
  (let [plug (xp/get-pluglet evt)
        svr (xp/get-server plug)
        pa (xp/get-child svr :$auth)
        si (try (sh/maybeGetAuthInfo evt)
                (catch DataError _  {:e _ }))
        info (or si {})
        email (str (:email info))]
    (c/test-some "AuthPlugin" pa)
    (if (and (= "18" (:captcha info))
             (s/hgl? email))
      (if-some [acct (sh/get-account pa {:email email})]
        (c/do-with [acct acct]
                   (log/debug "found account, email=%s" email))
        (log/debug "failed to find account with email=%s" email)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doAckReply "" [evt res]
  (let [json {:status {:code 200}}]
    (->> (f/writeJsonStr json) i/xdata<> (assoc res :body) cc/reply-result)))

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
    (some-> (:session evt) ss/invalidate!)
    (->> (f/writeJsonStr json) i/xdata<> (assoc res :body) cc/reply-result )))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn logoutHandler "" [evt res]
  (log/debug "logout pipe-line - called")
  (doLogout evt res))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

