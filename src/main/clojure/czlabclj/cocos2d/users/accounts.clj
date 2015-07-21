;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2015, Ken Leung. All rights reserved.

(ns  ^{:doc ""
       :author "kenl" }

  czlabclj.cocos2d.users.accounts

  (:require [czlabclj.xlib.util.core :refer [test-nonil ]]
            [czlabclj.xlib.util.str :refer [nsb strim  hgl?]]
            [czlabclj.xlib.util.wfs :refer [SimPTask]]
            [czlabclj.tardis.auth.plugin :refer [MaybeSignupTest
                                                MaybeLoginTest]]
            [czlabclj.xlib.util.format :refer [WriteJson]]
            [czlabclj.xlib.i18n.resources :refer [RStr]])

  (:require [clojure.tools.logging :as log])

  (:use [czlabclj.tardis.io.basicauth]
        [czlabclj.tardis.core.consts]
        [czlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.runtime DuplicateUser]
            [com.zotohlab.wflow If Activity
             WorkFlow Job BoolExpr PTask Work]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult]
            [org.apache.commons.codec.net URLCodec]
            [com.zotohlab.frwk.i18n I18N]
            [java.net HttpCookie]
            [com.zotohlab.frwk.server Emitter]
            [com.zotohlab.frwk.core Identifiable]
            [com.zotohlab.frwk.util CrappyDataError]
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
      (let [^HTTPEvent evt (.event j)
            ctr (-> ^Emitter
                    (.emitter evt) (.container))
            ^HTTPResult res (.getResultObj evt)
            err (:error (.getLastResult j)) ]
        (cond
          (instance? DuplicateUser err)
          (let [rcb (I18N/getBundle (.id ^Identifiable ctr))
                json {:error
                      {:msg (RStr rcb "acct.dup.user") }} ]
            (doto res
              (.setStatus 409)
              (.setContent (XData. (WriteJson json)))))
          :else
          (.setStatus res 400))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ^HTTPResult res (.getResultObj evt)
            json { :status { :code 200 } }
            acct (:account (.getLastResult j)) ]
        (log/debug "successfully signed up new account " acct)
        (doto res
          (.setStatus 200)
          (.setContent (XData. (WriteJson json))))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype SignupHandler [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "signup pipe-line - called.")
    (If. (MaybeSignupTest "32") (doSignupOK) (doSignupFail))))

(ns-unmap *ns* '->SignupHandler)
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
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ^czlabclj.tardis.io.webss.WebSS
            mvs (.getSession evt)
            ^czlabclj.tardis.core.sys.Elmt
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            acct (:account (.getLastResult j))
            json { :status { :code 200 } }
            est (:sessionAgeSecs cfg)
            ck (HttpCookie. (name *USER-FLAG*)
                            (nsb (:acctid acct)))
            ^HTTPResult res (.getResultObj evt) ]
        (doto ck
          (.setMaxAge est)
          (.setHttpOnly false)
          (.setSecure (.isSSL? mvs))
          (.setPath (:domainPath cfg))
          (.setDomain (:domain cfg)))
        (doto res
          (.setContent (XData. (WriteJson json)))
          (.addCookie ck)
          (.setStatus 200))
        (.setNew! mvs true est)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginHandler [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "login pipe-line - called.")
    (If. (MaybeLoginTest) (doLoginOK) (doLoginFail))))

(ns-unmap *ns* '->LoginHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ^czlabclj.tardis.core.sys.Elmt
            ctr
            (-> ^Emitter
                (.emitter evt) (.container))
            ^czlabclj.tardis.auth.plugin.AuthPlugin
            pa (:auth (.getAttr ctr K_PLUGINS))
            si (try (MaybeGetAuthInfo evt)
                    (catch CrappyDataError e#  { :e e# }))
            info (or si {} )
            email (nsb (:email info)) ]
        (test-nonil "AuthPlugin" pa)
        (cond
          (and (= "18" (:captcha info))
               (hgl? email))
          (if-let [ acct (.getAccount pa { :email email }) ]
            (do
              (log/debug "Found account with email " email))
            (do
              (log/debug "Failed to look up account with email " email)))

          :else nil)
      ))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doAckReply ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ^HTTPResult res (.getResultObj evt)
            json { :status { :code 200 } } ]
        (doto res
          (.setStatus 200)
          (.setContent (XData. (WriteJson json))))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotHandler [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "Forgot-login pipe-line - called.")
    (-> (doAckReply)
        (.chain (doLookupEmail)))))

(ns-unmap *ns* '->ForgotHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLogout ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^HTTPEvent evt (.event j)
            ^czlabclj.tardis.io.webss.WebSS
            mvs (.getSession evt)
            ^czlabclj.tardis.core.sys.Elmt
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            json { :status { :code 200 } }
            ck (HttpCookie. (name *USER-FLAG*) "")
            ^HTTPResult res (.getResultObj evt) ]
        (doto ck
          (.setMaxAge 0)
          (.setHttpOnly false)
          (.setSecure (.isSSL? mvs))
          (.setPath (:domainPath cfg))
          (.setDomain (:domain cfg)))
        (doto res
          (.setContent (XData. (WriteJson json)))
          (.setStatus 200)
          (.addCookie ck))
        (.invalidate! mvs)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LogoutHandler [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "logout pipe-line - called.")
    (doLogout)))



(ns-unmap *ns* '->LogoutHandler)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

