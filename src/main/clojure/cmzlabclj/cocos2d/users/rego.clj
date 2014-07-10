;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.


(ns  ^{ :doc ""
        :author "kenl" }

  cmzlabclj.cocos2d.users.rego

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.nucleus.util.dates :only [ParseDate] ]
        [cmzlabclj.nucleus.util.str :only [hgl? strim] ]
        [cmzlabclj.tardis.core.constants]
        [cmzlabclj.tardis.core.wfs]
        [cmzlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ]
        [cmzlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.gallifrey.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow FlowPoint Activity
                                Pipeline PipelineDelegate PTask Work]
            [com.zotohlab.gallifrey.io HTTPEvent HTTPResult Emitter]
            [com.zotohlab.frwk.net ULFormItems ULFileItem]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.wflow.core Job]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage ""

  ^Map
  [^HTTPEvent evt ^String csrf]

  (let [^cmzlabclj.tardis.io.webss.WebSession
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

  (let [^cmzlabclj.tardis.io.webss.WebSession
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

  (let [^cmzlabclj.tardis.io.webss.WebSession
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

  ^PTask
  [interpolateFunc]

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^String tpl (:template (.getv job EV_OPTS))
            ^HTTPEvent evt (.event job)
            ^cmzlabclj.tardis.core.sys.Element
            src (.emitter evt)
            ^cmzlabclj.tardis.impl.ext.ContainerAPI
            co (.container ^Emitter src)
            ^cmzlabclj.tardis.io.webss.WebSession
            mvs (.getSession evt)
            csrf (.generateCsrf co)
            est (.getAttr src :sessionAgeSecs)
            [rdata ct] (.loadTemplate co tpl (interpolateFunc evt csrf))
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
(deftype RegisterPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.rego)
    (doShowPage interpolateRegisterPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.rego)
    (doShowPage interpolateLoginPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.users.rego)
    (doShowPage interpolateForgotPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private rego-eof nil)


