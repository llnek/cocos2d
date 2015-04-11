;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014, Ken Leung. All rights reserved.


(ns  ^{:doc ""
       :author "kenl" }

  czlabclj.cocos2d.users.rego

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [czlabclj.xlib.util.dates :only [ParseDate] ]
        [czlabclj.xlib.util.str :only [nsb hgl? strim] ]
        [czlabclj.tardis.core.constants]
        [czlabclj.xlib.util.wfs]
        [czlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ]
        [czlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow FlowNode Activity
                                Pipeline PDelegate PTask Work]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult Emitter]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.wflow Job]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage ""

  ^Map
  [^HTTPEvent evt ^String csrf]

  (let [^czlabclj.tardis.io.webss.WebSS
        mvs (.getSession evt)
        dm (GetDftModel evt)
        ^Map bd (.get dm "body")
        ^List jss (.get dm "scripts")
        ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/users/register.ftl")
    (.put bd "csrf" csrf)
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateLoginPage ""

  ^Map
  [^HTTPEvent evt ^String csrf]

  (let [^czlabclj.tardis.io.webss.WebSS
        mvs (.getSession evt)
        dm (GetDftModel evt)
        ^Map bd (.get dm "body")
        ^List jss (.get dm "scripts")
        ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/users/login.ftl")
    (.put bd "csrf" csrf)
    dm
  ))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateForgotPage ""

  ^Map
  [^HTTPEvent evt ^String csrf]

  (let [^czlabclj.tardis.io.webss.WebSS
        mvs (.getSession evt)
        dm (GetDftModel evt)
        ^Map bd (.get dm "body")
        ^List jss (.get dm "scripts")
        ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/users/forgot.ftl")
    (.put bd "csrf" csrf)
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^Activity
  [interpolateFunc]

  (SimPTask
    (fn [^Job job]
      (let [tpl (:template (.getv job EV_OPTS))
            ^HTTPEvent evt (.event job)
            ^czlabclj.tardis.core.sys.Element
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            co (.container ^Emitter src)
            ^czlabclj.tardis.io.webss.WebSS
            mvs (.getSession evt)
            csrf (.generateCsrf ^czlabclj.tardis.impl.ext.ContainerAPI co)
            est (:sessionAgeSecs cfg)
            [rdata ct] (.loadTemplate co (nsb tpl)
                                      (interpolateFunc evt csrf))
            ^HTTPResult res (.getResultObj evt) ]
        (.setHeader res "content-type" ct)
        (.setContent res rdata)
        (.setStatus res 200)
        (.setNew! mvs true est)
        (.setXref mvs csrf)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype RegisterPage [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.rego)
    (doShowPage interpolateRegisterPage))

  (onStop [_ pipe]
    (log/debug "RegisterPage: stopped."))

  (onError [ _ err curPt]
    (log/error "RegisterPage: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginPage [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.rego)
    (doShowPage interpolateLoginPage))

  (onStop [_ pipe]
    (log/debug "LoginPage: stopped."))

  (onError [ _ err curPt]
    (log/error "LoginPage: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotPage [] PDelegate

  (startWith [_  pipe]
    (require 'czlabclj.cocos2d.users.rego)
    (doShowPage interpolateForgotPage))

  (onStop [_ pipe]
    (log/debug "ForgotPage: stopped."))

  (onError [ _ err curPt]
    (log/error "ForgotPage: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private rego-eof nil)


