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

  cmzlabs.cocos2d.users.accounts

  (:require [clojure.tools.logging :as log :only (info warn error debug)])
  (:require [clojure.data.json :as json])
  (:require [clojure.string :as cstr])
  (:use [cmzlabsclj.tardis.core.wfs])
  (:use [cmzlabsclj.tardis.auth.plugin :only [MaybeSignupTest
                                            MaybeLoginTest] ])
  (:import (com.zotohlab.gallifrey.runtime DuplicateUser))
  (:import ( com.zotohlab.wflow If FlowPoint Activity
                                 Pipeline PipelineDelegate PTask Work))
  (:import (com.zotohlab.gallifrey.io HTTPEvent HTTPResult))
  (:import (org.apache.commons.codec.net URLCodec))
  (:import (java.net HttpCookie))
  (:import (com.zotohlab.frwk.io XData))
  (:import (com.zotohlab.wflow.core Job)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private USER_FLAG :__u982i) ;; user id


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt)
             err (:error (.getLastResult job)) ]
        (cond
          (instance? DuplicateUser err)
          (let [ json { :error { :msg "An account with same id already exist." }} ]
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
    (fn [ fw ^Job job arg]
      (let [ ^HTTPEvent evt (.event job)
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
    (require 'cmzlabs.cocos2d.users.accounts)
    (log/debug "signup pipe-line - called.")
    (If. (MaybeSignupTest "32") (doSignupOK) (doSignupFail)))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail ""

  ^PTask
  []

  (DefWFTask
    (fn [ fw ^Job job arg]
      (let [ ^HTTPEvent evt (.event job)
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
    (fn [ fw ^Job job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^cmzlabsclj.tardis.io.webss.WebSession
             mvs (.getSession evt)
             ^cmzlabsclj.tardis.core.sys.Element
             src (.emitter evt)
             acct (:account (.getLastResult job))
             json { :status { :code 200 } }
             cc (URLCodec. "utf-8")
             ck (HttpCookie. (name USER_FLAG)
                             (.encode cc (:acctid acct)))
             ^HTTPResult res (.getResultObj evt) ]
        (.setContent res (XData. (json/write-str json)))
        (.setStatus res 200)
        (.setNew! mvs true (.getAttr src :sessionAgeSecs))
        (doto ck
          (.setMaxAge (.getExpiryTime mvs))
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
    (require 'cmzlabs.cocos2d.users.accounts)
    (log/debug "login pipe-line - called.")
    (If. (MaybeLoginTest) (doLoginOK) (doLoginFail)))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private pipe-eof nil)




