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
            [czlab.convoy.net.wess :as wss]
            [czlab.basal.resources :refer [rstr]])

  (:use [czlab.wabbit.plugs.auth.core]
        [czlab.convoy.nettio.resp]
        [czlab.convoy.net.core]
        [czlab.flux.wflow.core]
        [czlab.basal.core]
        [czlab.basal.io]
        [czlab.basal.str]
        [czlab.cocos2d.util.core])

  (:import [czlab.wabbit.plugs.auth AuthPluglet DuplicateUser]
           [czlab.jasal XData BadDataError Identifiable I18N]
           [org.apache.commons.codec.net URLCodec]
           [czlab.flux.wflow Job WorkStream]
           [czlab.wabbit.plugs.io HttpMsg]
           [czlab.convoy.net HttpResult]
           [java.net HttpCookie]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail "" []

  (script<>
    #(do->nil
       (let
         [err (:error (.lastResult ^Job %2))
          ^HttpMsg evt (.origin ^Job %2)
          gs (.gist evt)
          res (httpResult<> evt)]
         (if (inst? DuplicateUser err)
           (let [rcb (-> (.. evt source server id)
                         I18N/bundle)
                 json {:error {:msg
                               (rstr rcb
                                     "acct.dup.user")}}]
             (doto res
               (.setStatus 409)
               (.setContent (xdata<> (writeJsonStr json)))))
           (.setStatus res 400))
         (replyResult res)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK "" []

  (script<>
    #(do->nil
       (let
         [acct (:account (.lastResult ^Job %2))
          ^HttpMsg evt (.origin ^Job %2)
          gs (.gist evt)
          res (httpResult<> evt)
          json {:status {:code 200}}]
         (log/debug "success: signed up new acct %s" acct)
         (doto res
           (.setContent (xdata<> (writeJsonStr json)))
           (replyResult ))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn signupHandler "" []

  (log/debug "signup pipe-line - called")
  (workStream<>
    (ternary<>
      (partial signupTestExpr<> "32") (doSignupOK) (doSignupFail))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)]
         (-> (httpResult<> evt 403)
             (replyResult ))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK "" []

  (script<>
    #(do->nil
       (let
         [acct (:account (.lastResult ^Job %2))
          json {:status {:code 200}}
          ^HttpMsg evt (.origin ^Job %2)
          cfg (:session (.. evt source config))
          mvs (newSession<> evt nil)
          res (httpResult<> evt)]
         (.setPrincipal mvs (str (:acctid acct)))
         (doto res
           (.setContent (xdata<> (writeJsonStr json)))
           (.addCookie (csrfToken<> cfg nil))
           (replyResult {:session mvs}))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginHandler "" ^WorkStream []

  (log/debug "login pipe-line - called")
  (workStream<>
    (ternary<>
      (partial loginTestExpr<>) (doLoginOK) (doLoginFail))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          co (.. evt source server)
          pa (. co child :$auth)
          si (try (maybeGetAuthInfo evt)
                  (catch BadDataError _  {:e _ }))
          info (or si {})
          email (str (:email info))]
         (test-some "AuthPlugin" pa)
         (if (and (= "18" (:captcha info))
                  (hgl? email))
           (if-some [acct (. ^AuthPluglet
                             pa account {:email email})]
             (do (log/debug "found account, email=%s" email) acct)
             (log/debug "failed to find account with email=%s" email)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doAckReply "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          gs (.gist evt)
          res (httpResult<> evt)
          json {:status {:code 200}}]
         (doto res
           (.setContent (xdata<> (writeJsonStr json)))
           (replyResult (.. evt source config)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotHandler "" ^WorkStream []

  (log/debug "forgot-login pipe-line - called")
  (workStream<>
    (group<> (doAckReply) (doLookupEmail))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLogout "" []

  (script<>
    #(do->nil
       (let
         [json {:status {:code 200}}
          ^HttpMsg evt (.origin ^Job %2)
          mvs (.session evt)
          gs (.gist evt)
          {:keys [domainPath domain] :as cfg}
          (.. evt source config)
          res (httpResult<> evt)]
         (some-> mvs .invalidate)
         (doto res
          (.setContent (xdata<> (writeJsonStr json)))
          (replyResult ))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn logoutHandler "" ^WorkStream []

  (log/debug "logout pipe-line - called")
  (workStream<> (doLogout)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

