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
            [czlab.wabbit.plugs.auth
             :refer [maybeSignupTest
                     maybeLoginTest]]
            [czlab.basal.logging :as log]
            [czlab.basal.resources :refer [rstr]])

  (:use [czlab.wabbit.plugs.auth]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.cocos2d.site.core])

  (:import [czlab.wabbit.plugs.auth AuthPluglet DuplicateUser]
           [czlab.jasal XData BadDataError Identifiable I18N]
           [org.apache.commons.codec.net URLCodec]
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
          co (.. evt source server)
          res (httpResult<> )]
         (if (inst? DuplicateUser err)
           (let [rcb (-> (.id co)
                         I18N/getBundle)
                 json {:error {:msg (rstr rcb "acct.dup.user")}}]
             (doto res
               (.setStatus 409)
               (.setContent (XData. (writeJsonStr json)))))
           ;else
           (.setStatus res 400))
         (replyResult<> evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK "" []

  (script<>
    #(do->nil
       (let
         [acct (:account (.lastResult ^Job %2))
          ^HttpMsg evt (.origin ^JOb %2)
          res (httpResult<> )
          json {:status {:code 200}}]
         (log/debug "successfully signed up new account %s" acct)
         (doto res
           (.setContent (XData. (writeJsonStr json))))
         (replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn signupHandler "" []

  (log/debug "signup pipe-line - called")
  (workStream<>
    (ternery<>
      (maybeSignupTest "32") (doSignupOK) (doSignupFail))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          res (httpResult<> 403)]
         (replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK "" []

  (script<>
    #(do->nil
       (let
         [acct (:account (.lastResult ^Job %2))
          json {:status {:code 200 } }
          ^HttpMsg evt (.origin ^JOb %2)
          mvs (.session evt)
          {:keys [sessionAgeSecs]}
          (.. evt source config)
          ck (HttpCookie. (name *user-flag*)
                          (str (:acctid acct)))
          res (httpResult<> )]
         (doto ck
           (.setMaxAge est)
           (.setHttpOnly false)
           (.setSecure (if mvs (.isSSL mvs) false))
           (.setPath (:domainPath cfg))
           (.setDomain (:domain cfg)))
         (doto res
           (.setContent (XData. (writeJsonStr json)))
           (.addCookie ck))
         (some-> mvs (.setNew true sessionAgeSecs))
         (replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn loginHandler "" []

  (log/debug "login pipe-line - called")
  (workStream<>
    (ternery<>
      (maybeLoginTest) (doLoginOK) (doLoginFail))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          co (.. evt source server)
          pa (. co child :auth)
          si (try (maybeGetAuthInfo evt)
                  (catch BadDataError e#  {:e e# }))
          info (or si {})
          email (str (:email info))]
         (test-nonil "AuthPlugin" pa)
         (if
           (and (= "18" (:captcha info))
                (hgl? email))
           (if-some [acct (-> ^AuthPluglet
                              pa
                              (.getAccount {:email email }))]
             (do (log/debug "found account, email=%s" email) acct)
             (log/debug "failed to find account with email=%s" email)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doAckReply "" []

  (script<>
    #(do->nil
       (let
         [^HttpMsg evt (.origin ^Job %2)
          res (httpResult<> )
          json {:status {:code 200}}]
         (doto res
           (.setContent (XData. (writeJsonStr json))))
         (replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn forgotHandler "" []

  (log/debug "forgot-login pipe-line - called")
  (workStream<>
    (group<> (doAckReply) (doLookupEmail))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLogout "" []

  (script<>
    #(do->nil
       (let
         [ck (HttpCookie. (name *user-flag*) "")
          json {:status {:code 200 } }
          ^HttpMsg evt (.origin ^Job %2)
          mvs (.session evt)
          res (httpResult<> )]
         (doto ck
           (.setMaxAge 0)
           (.setHttpOnly false)
           (.setSecure (if mvs (.isSSL mvs) false))
           (.setPath (:domainPath cfg))
           (.setDomain (:domain cfg)))
        (doto res
          (.setContent (XData. (writeJsonStr json)))
          (.addCookie ck))
        (some-> mvs .invalidate)
        (replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn logoutHandler "" []

  (log/debug "logout pipe-line - called")
  (workStream<> (doLogout)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

