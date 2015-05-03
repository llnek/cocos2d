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

  (:require [clojure.tools.logging :as log])

  (:use [czlabclj.xlib.util.dates :only [ParseDate] ]
        [czlabclj.xlib.util.str :only [nsb hgl? strim] ]
        [czlabclj.tardis.core.consts]
        [czlabclj.xlib.util.consts]
        [czlabclj.xlib.util.wfs]
        [czlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ]
        [czlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow Job Activity PTask]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.frwk.server Emitter]
            [com.zotohlab.server WorkFlow]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage ""

  ^Map
  [^HTTPEvent evt ^String csrf]

  (let [^czlabclj.tardis.io.webss.WebSS
        mvs (.getSession evt)
        dm (GetDftModel evt)
        {bd "body"
         jss "scripts"
         css "stylesheets"} dm]
    (doto ^Map bd
      (.put "content" "/main/users/register.ftl")
      (.put "csrf" csrf))
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
        {bd "body"
         jss "scripts"
         css "stylesheets"} dm]
    (doto ^Map bd
      (.put "content" "/main/users/login.ftl")
      (.put "csrf" csrf))
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
        {bd "body"
         jss "scripts"
         css "stylesheets"} dm]
    (doto ^Map bd
      (.put "content" "/main/users/forgot.ftl")
      (.put "csrf" csrf))
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^Activity
  [interpolateFunc]

  (SimPTask
    (fn [^Job j]
      (let [tpl (nsb (:template (.getv j EV_OPTS)))
            ^HTTPEvent evt (.event j)
            ^czlabclj.tardis.core.sys.Elmt
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            ^Container co (.container ^Emitter src)
            ^czlabclj.tardis.io.webss.WebSS
            mvs (.getSession evt)
            csrf (-> ^czlabclj.tardis.impl.ext.ContainerAPI
                     co
                     (.generateCsrf))
            est (:sessionAgeSecs cfg)
            [rdata ct] (.loadTemplate co tpl
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
(deftype RegisterPage [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.rego)
    (doShowPage interpolateRegisterPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginPage [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.rego)
    (doShowPage interpolateLoginPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotPage [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.users.rego)
    (doShowPage interpolateForgotPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private rego-eof nil)


