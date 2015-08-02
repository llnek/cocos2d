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

  czlab.cocos2d.users.rego

  (:require [czlab.xlib.util.dates :refer [ParseDate] ]
            [czlab.xlib.util.str :refer [nsb hgl? strim] ]
            [czlab.skaro.impl.ext :refer [GetAppKeyFromEvent] ])

  (:require [clojure.tools.logging :as log])

  (:use [czlab.skaro.core.consts]
        [czlab.xlib.util.consts]
        [czlab.xlib.util.wfs]
        [czlab.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow WorkFlow Job Activity PTask]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult]
            [com.zotohlab.frwk.io XData]
            [com.zotohlab.frwk.server Emitter]
            [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage ""

  [^HTTPEvent evt ^String csrf]

  (let [^czlab.skaro.io.webss.WebSS
        mvs (.getSession evt)]
    (-> (GetDftModel evt)
        (update-in [:body]
                   #(merge % {:content "/main/users/register.ftl"
                              :csrf csrf})))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateLoginPage ""

  [^HTTPEvent evt ^String csrf]

  (let [^czlab.skaro.io.webss.WebSS
        mvs (.getSession evt)]
    (-> (GetDftModel evt)
        (update-in [:body]
                   #(merge % {:content "/main/users/login.ftl"
                              :csrf csrf})))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateForgotPage ""

  [^HTTPEvent evt ^String csrf]

  (let [^czlab.skaro.io.webss.WebSS
        mvs (.getSession evt)]
    (-> (GetDftModel evt)
        (update-in [:body]
                   #(merge % {:content "/main/users/forgot.ftl"
                              :csrf csrf})))
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
            ^czlab.skaro.core.sys.Elmt
            src (.emitter evt)
            cfg (.getAttr src :emcfg)
            ^Container co (.container ^Emitter src)
            ^czlab.skaro.io.webss.WebSS
            mvs (.getSession evt)
            csrf (-> ^czlab.skaro.impl.ext.ContainerAPI
                     co (.generateCsrf))
            est (:sessionAgeSecs cfg)
            [rdata ct] (.loadTemplate co tpl
                                      (interpolateFunc evt csrf))
            ^HTTPResult res (.getResultObj evt) ]
        (doto res
          (.setHeader "content-type" ct)
          (.setContent rdata)
          (.setStatus 200))
        (doto mvs
          (.setNew! true est)
          (.setXref csrf))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype RegisterPage [] WorkFlow

  (startWith [_]
    (require 'czlab.cocos2d.users.rego)
    (doShowPage interpolateRegisterPage)))

(ns-unmap *ns* '->RegisterPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginPage [] WorkFlow

  (startWith [_]
    (require 'czlab.cocos2d.users.rego)
    (doShowPage interpolateLoginPage)))

(ns-unmap *ns* '->LoginPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype ForgotPage [] WorkFlow

  (startWith [_]
    (require 'czlab.cocos2d.users.rego)
    (doShowPage interpolateForgotPage)))

(ns-unmap *ns* '->ForgotPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF


