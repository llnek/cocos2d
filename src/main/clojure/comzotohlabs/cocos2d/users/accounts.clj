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

  comzotohlabs.cocos2d.users.accounts

  (:require [clojure.tools.logging :as log :only (info warn error debug)])
  (:require [clojure.string :as cstr])
  (:use [comzotohlabscljc.tardis.core.wfs])
  (:use [comzotohlabscljc.tardis.auth.core :only [MaybeSignupTest
                                              MaybeLoginTest] ])

  (:import ( com.zotohlabs.wflow If FlowPoint Activity
                                 Pipeline PipelineDelegate PTask Work))
  (:import (com.zotohlabs.gallifrey.io HTTPEvent HTTPResult))
  (:import (com.zotohlabs.wflow.core Job)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupFail ""

  ^PTask
  []

  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 500)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doSignupOK ""

  ^PTask
  []

  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 200)
        (.setContent res "You're signed up!!")
        (.setHeader res "content-type" "text/plain")
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype SignupHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'comzotohlabs.cocos2d.users.accounts)
    (log/debug "signup pipe-line - called.")
    (If. (MaybeSignupTest) (doSignupOK) (doSignupFail)))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginFail ""

  ^PTask
  []

  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 500)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doLoginOK ""

  ^PTask
  []

  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^comzotohlabscljc.tardis.io.webss.WebSession
             mvs (.getSession evt)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 200)
        (.setContent res "You're logged-in !!!")
        (.setHeader res "content-type" "text/plain")
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'comzotohlabs.cocos2d.users.accounts)
    (log/debug "login pipe-line - called.")
    (If. (MaybeLoginTest) (doLoginOK) (doLoginFail)))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private pipe-eof nil)




