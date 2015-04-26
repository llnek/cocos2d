;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013, Ken Leung. All rights reserved.

(ns  ^{:doc ""
       :author "kenl" }

  czlabclj.cocos2d.users.accounts

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [test-nonil ]]
        [czlabclj.xlib.util.str :only [nsb strim  hgl?]]
        [czlabclj.xlib.util.wfs :only [SimPTask]]
        [czlabclj.tardis.auth.plugin :only [MaybeSignupTest
                                                  MaybeLoginTest] ]
        [czlabclj.tardis.io.basicauth]
        [czlabclj.xlib.i18n.resources :only [RStr]]
        [czlabclj.tardis.core.consts]
        [czlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.runtime DuplicateUser]
            [com.zotohlab.wflow If FlowNode Activity
             BoolExpr Pipeline PDelegate PTask Work]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult]
            [org.apache.commons.codec.net URLCodec]
            [com.zotohlab.frwk.i18n I18N]
            [java.net HttpCookie]
            [com.zotohlab.frwk.core Identifiable]
            [com.zotohlab.frwk.util CrappyDataError]
            [com.zotohlab.frwk.io XData]
            [com.zotohlab.wflow Job]))

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
            ^HTTPResult res (.getResultObj evt)
            err (:error (.getLastResult j)) ]
        (cond
          (instance? DuplicateUser err)
          (let [rcb (I18N/getBundle (.id ^Identifiable (.container j)))
                json {:error
                      {:msg (RStr rcb "acct.dup.user") }} ]
            (.setStatus res 409)
            (.setContent res (XData. (json/write-str json))))

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
        (.setStatus res 200)
        (.setContent res (XData. (json/write-str json)))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype SignupHandler [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "signup pipe-line - called.")
    (If. (MaybeSignupTest "32") (doSignupOK) (doSignupFail)))

  (onStop [_ pipe] )
  (onError [ _ err curPt]
    (log/error "SignupHandler: I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

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
            ^czlabclj.tardis.core.sys.Element
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            acct (:account (.getLastResult j))
            json { :status { :code 200 } }
            est (:sessionAgeSecs cfg)
            ck (HttpCookie. (name *USER-FLAG*)
                            (nsb (:acctid acct)))
            ^HTTPResult res (.getResultObj evt) ]
        (.setContent res (XData. (json/write-str json)))
        (.setStatus res 200)
        (.setNew! mvs true est)
        (doto ck
          (.setMaxAge est)
          (.setHttpOnly false)
          (.setSecure (.isSSL? mvs))
          (.setPath (:domainPath cfg))
          (.setDomain (:domain cfg)))
        (.addCookie res ck)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginHandler [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "login pipe-line - called.")
    (If. (MaybeLoginTest) (doLoginOK) (doLoginFail)))

  (onStop [_ pipe] )
  (onError [ _ err curPt]
    (log/info "LoginHandler: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^czlabclj.tardis.core.sys.Element ctr (.container j)
            ^czlabclj.tardis.auth.plugin.AuthPlugin
            pa (:auth (.getAttr ctr K_PLUGINS))
            ^HTTPEvent evt (.event j)
            si (try (MaybeGetAuthInfo evt) (catch CrappyDataError e#  { :e e# }))
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
        (.setStatus res 200)
        (.setContent res (XData. (json/write-str json)))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotHandler [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "Forgot-login pipe-line - called.")
    (-> (doAckReply)
        (.chain (doLookupEmail))))

  (onStop [_ pipe] )
  (onError [ _ err curPt]
    (log/error "ForgotHandler: I got an error!")))


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
            ^czlabclj.tardis.core.sys.Element
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            json { :status { :code 200 } }
            ck (HttpCookie. (name *USER-FLAG*) "")
            ^HTTPResult res (.getResultObj evt) ]
        (.setContent res (XData. (json/write-str json)))
        (.setStatus res 200)
        (.invalidate! mvs)
        (doto ck
          (.setMaxAge 0)
          (.setHttpOnly false)
          (.setSecure (.isSSL? mvs))
          (.setPath (:domainPath cfg))
          (.setDomain (:domain cfg)))
        (.addCookie res ck)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LogoutHandler [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.accounts)
    (log/debug "logout pipe-line - called.")
    (doLogout))

  (onStop [_ pipe] )
  (onError [ _ err curPt]
    (log/error "LogoutHandler: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private accounts-eof nil)




