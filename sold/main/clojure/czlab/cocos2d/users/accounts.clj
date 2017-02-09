;; Licensed under the Apache License, Version 2.0 (the "License");
;; you may not use this file except in compliance with the License.
;; You may obtain a copy of the License at
;;
;;     http://www.apache.org/licenses/LICENSE-2.0
;;
;; Unless required by applicable law or agreed to in writing, software
;; distributed under the License is distributed on an "AS IS" BASIS,
;; WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
;; See the License for the specific language governing permissions and
;; limitations under the License.
;;
;; Copyright (c) 2013-2016, Kenneth Leung. All rights reserved.


(ns  ^{:doc ""
       :author "kenl" }

  czlab.cocos2d.users.accounts

  (:require
    [czlab.skaro.auth.plugin :refer [MaybeSignupTest
    MaybeLoginTest]]
    [czlab.xlib.util.core :refer [test-nonil ]]
    [czlab.xlib.util.str :refer [strim  hgl?]]
    [czlab.xlib.util.wfs :refer [SimPTask]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.format :refer [WriteJson]]
    [czlab.xlib.i18n.resources :refer [RStr]])

  (:use [czlab.skaro.io.basicauth]
        [czlab.skaro.core.consts]
        [czlab.cocos2d.site.core ])

  (:import
    [com.zotohlab.skaro.io WebSS HTTPEvent HTTPResult]
    [com.zotohlab.skaro.runtime DuplicateUser]
    [com.zotohlab.skaro.etc AuthPlugin]
    [com.zotohlab.wflow If Activity
    WorkFlow Job BoolExpr PTask Work]
    [com.zotohlab.skaro.core Muble]
    [org.apache.commons.codec.net URLCodec]
    [com.zotohlab.frwk.i18n I18N]
    [java.net HttpCookie]
    [com.zotohlab.frwk.server Emitter]
    [com.zotohlab.frwk.core Identifiable]
    [com.zotohlab.frwk.util BadDataError]
    [com.zotohlab.frwk.io XData]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [err (:error (.getLastResult j))
            ^HTTPEvent evt (.event j)
            ctr (-> evt
                    (.emitter )
                    (.container))
            ^HTTPResult
            res (.getResultObj evt)]
        (if
          (instance? DuplicateUser err)
          (let [rcb (-> (.id ^Identifiable ctr)
                        (I18N/getBundle ))
                json {:error {:msg (RStr rcb "acct.dup.user") }} ]
            (doto res
              (.setStatus 409)
              (.setContent (XData. (WriteJson json)))))
          ;else
          (.setStatus res 400))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [acct (:account (.getLastResult j))
            ^HTTPEvent evt (.event j)
            ^HTTPResult
            res (.getResultObj evt)
            json {:status {:code 200 } } ]
        (log/debug "successfully signed up new account %s" acct)
        (doto res
          (.setStatus 200)
          (.setContent (XData. (WriteJson json))))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn SignupHandler ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (log/debug "signup pipe-line - called")
      (If. (MaybeSignupTest "32") (doSignupOK) (doSignupFail)))))

;;(ns-unmap *ns* '->SignupHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 403)
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let
        [acct (:account (.getLastResult j))
         json {:status {:code 200 } }
         ^HTTPEvent evt (.event j)
         ^WebSS mvs (.getSession evt)
         ^Muble
         src (.emitter evt)
         cfg (.getv src :emcfg)
         est (:sessionAgeSecs cfg)
         ck (HttpCookie. (name *USER-FLAG*)
                         (str (:acctid acct)))
         ^HTTPResult
         res (.getResultObj evt) ]
        (doto ck
          (.setMaxAge est)
          (.setHttpOnly false)
          (.setSecure (.isSSL mvs))
          (.setPath (:domainPath cfg))
          (.setDomain (:domain cfg)))
        (doto res
          (.setContent (XData. (WriteJson json)))
          (.addCookie ck)
          (.setStatus 200))
        (.setNew mvs true est)
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LoginHandler ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (log/debug "login pipe-line - called")
      (If. (MaybeLoginTest) (doLoginOK) (doLoginFail)))))

;;(ns-unmap *ns* '->LoginHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ctr (-> (.emitter evt)
                    (.container))
            pa (:auth (-> ^Muble
                          ctr (.getv K_PLUGINS)))
            si (try (MaybeGetAuthInfo evt)
                    (catch BadDataError e#  {:e e# }))
            info (or si {} )
            email (str (:email info)) ]
        (test-nonil "AuthPlugin" pa)
        (if
          (and (= "18" (:captcha info))
               (hgl? email))
          (if-some [acct (-> ^AuthPlugin
                             pa
                             (.getAccount {:email email }))]
            (do (log/debug "found account, email=%s" email) acct)
            (log/debug "failed to find account with email=%s" email))
          nil)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doAckReply ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            res (.getResultObj evt)
            json {:status {:code 200 } } ]
        (doto
          ^HTTPResult
          res
          (.setStatus 200)
          (.setContent (XData. (WriteJson json))))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ForgotHandler ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (log/debug "forgot-login pipe-line - called")
      (-> (doAckReply)
          (.chain (doLookupEmail))))))

;;(ns-unmap *ns* '->ForgotHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLogout ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let
        [ck (HttpCookie. (name *USER-FLAG*) "")
         json {:status {:code 200 } }
         ^HTTPEvent evt (.event j)
         ^WebSS
         mvs (.getSession evt)
         src (.emitter evt)
         cfg (-> ^Muble src
                 (.getv :emcfg))
         ^HTTPResult
         res (.getResultObj evt) ]
        (doto ck
          (.setMaxAge 0)
          (.setHttpOnly false)
          (.setSecure (.isSSL mvs))
          (.setPath (:domainPath cfg))
          (.setDomain (:domain cfg)))
        (doto res
          (.setContent (XData. (WriteJson json)))
          (.setStatus 200)
          (.addCookie ck))
        (.invalidate mvs)
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LogoutHandler ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (log/debug "logout pipe-line - called")
      (doLogout))))

;;(ns-unmap *ns* '->LogoutHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

