;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013 Cherimoia, LLC. All rights reserved.


(ns  ^{ :doc ""
        :author "kenl" }

  cmzlabclj.cocos2d.users.accounts


  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core :only [ternary test-nonil ]]
        [cmzlabclj.nucleus.util.str :only [nsb strim  hgl?]]
        [cmzlabclj.tardis.core.wfs]
        [cmzlabclj.tardis.auth.plugin :only [MaybeSignupTest
                                                  MaybeLoginTest] ]
        [cmzlabclj.tardis.io.basicauth]
        [cmzlabclj.tardis.core.constants]
        [cmzlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.gallifrey.runtime DuplicateUser]
            [com.zotohlab.wflow If FlowPoint Activity Block
                                 Pipeline PipelineDelegate PTask Work]
            [com.zotohlab.gallifrey.io HTTPEvent HTTPResult]
            [org.apache.commons.codec.net URLCodec]
            [java.net HttpCookie]
            [com.zotohlab.frwk.util CrappyDataError]
            [com.zotohlab.frwk.io XData]
            [com.zotohlab.wflow.core Job]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^HTTPEvent evt (.event job)
            ^HTTPResult res (.getResultObj evt)
            err (:error (.getLastResult job)) ]
        (cond
          (instance? DuplicateUser err)
          (let [json { :error { :msg "An account with same id already exist." }} ]
            (.setStatus res 409)
            (.setContent res (XData. (json/write-str json))))

          :else
          (.setStatus res 400))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^HTTPEvent evt (.event job)
            ^HTTPResult res (.getResultObj evt)
            json { :status { :code 200 } }
            acct (:account (.getLastResult job)) ]
        (log/debug "successfully signed up new account " acct)
        (.setStatus res 200)
        (.setContent res (XData. (json/write-str json)))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype SignupHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.accounts)
    (log/debug "signup pipe-line - called.")
    (If. (MaybeSignupTest "32") (doSignupOK) (doSignupFail)))

  (onStop [_ pipe]
    (log/debug "SignupHandler: stopped."))

  (onError [ _ err curPt]
    (log/error "SignupHandler: I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^HTTPEvent evt (.event job)
            ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 403)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^HTTPEvent evt (.event job)
            ^cmzlabclj.tardis.io.webss.WebSession
            mvs (.getSession evt)
            ^cmzlabclj.tardis.core.sys.Element
            src (.emitter evt)
            acct (:account (.getLastResult job))
            json { :status { :code 200 } }
            est (.getAttr src :sessionAgeSecs)
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
          (.setPath (.getAttr src :domainPath))
          (.setDomain (.getAttr src :domain)))
        (.addCookie res ck)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.accounts)
    (log/debug "login pipe-line - called.")
    (If. (MaybeLoginTest) (doLoginOK) (doLoginFail)))

  (onStop [_ pipe]
    (log/debug "LoginHandler: stopped."))

  (onError [ _ err curPt]
    (log/info "LoginHandler: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLookupEmail ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^cmzlabclj.tardis.core.sys.Element ctr (.container job)
            ^cmzlabclj.tardis.auth.plugin.AuthPlugin
            pa (:auth (.getAttr ctr K_PLUGINS))
            ^HTTPEvent evt (.event ^Job job)
            si (try (MaybeGetAuthInfo evt) (catch CrappyDataError e#  { :e e# }))
            info (ternary si {} )
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

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^HTTPEvent evt (.event ^Job job)
            ^HTTPResult res (.getResultObj evt)
            json { :status { :code 200 } } ]
        (.setStatus res 200)
        (.setContent res (XData. (json/write-str json)))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.accounts)
    (log/debug "forgot-login pipe-line - called.")
    (doto (Block.)
      (.chain (doAckReply))
      (.chain (doLookupEmail))))

  (onStop [_ pipe]
    (log/debug "ForgotHandler: stopped."))

  (onError [ _ err curPt]
    (log/error "ForgotHandler: I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLogout ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^HTTPEvent evt (.event job)
            ^cmzlabclj.tardis.io.webss.WebSession
            mvs (.getSession evt)
            ^cmzlabclj.tardis.core.sys.Element
            src (.emitter evt)
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
          (.setPath (.getAttr src :domainPath))
          (.setDomain (.getAttr src :domain)))
        (.addCookie res ck)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LogoutHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.accounts)
    (log/debug "logout pipe-line - called.")
    (doLogout))

  (onStop [_ pipe]
    (log/debug "LogoutHandler: stopped."))

  (onError [ _ err curPt]
    (log/error "LogoutHandler: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private accounts-eof nil)




