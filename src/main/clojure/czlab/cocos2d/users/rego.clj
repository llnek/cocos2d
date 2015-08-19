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

  (:require
    [czlab.skaro.impl.ext :refer [GetAppKeyFromEvent] ]
    [czlab.xlib.util.dates :refer [ParseDate] ]
    [czlab.xlib.util.str :refer [hgl? strim] ]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.net.comms :refer [GenerateCsrf]])

  (:use [czlab.skaro.core.consts]
        [czlab.xlib.util.consts]
        [czlab.xlib.util.wfs]
        [czlab.cocos2d.site.core ])

  (:import
    [com.zotohlab.skaro.core Muble Container ConfigError]
    [com.zotohlab.wflow WorkFlow Job Activity PTask]
    [com.zotohlab.skaro.io WebSS HTTPEvent HTTPResult]
    [com.zotohlab.frwk.io XData]
    [com.zotohlab.frwk.server Emitter]
    [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage ""

  [^HTTPEvent evt ^String csrf]

  (-> (GetDftModel evt)
      (update-in [:body]
                 #(merge % {:content "/main/users/register.ftl"
                            :csrf csrf}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateLoginPage ""

  [^HTTPEvent evt ^String csrf]

  (-> (GetDftModel evt)
      (update-in [:body]
                 #(merge % {:content "/main/users/login.ftl"
                            :csrf csrf}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateForgotPage ""

  [^HTTPEvent evt ^String csrf]

  (-> (GetDftModel evt)
      (update-in [:body]
                 #(merge % {:content "/main/users/forgot.ftl"
                            :csrf csrf}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^Activity
  [func]

  (SimPTask
    (fn [^Job j]
      (let
        [tpl (:template (.getv j EV_OPTS))
         ^HTTPEvent evt (.event j)
         src (.emitter evt)
         cfg (-> ^Muble
                 src (.getv :emcfg))
         ^Container co (.container src)
         mvs (.getSession evt)
         csrf (GenerateCsrf)
         est (:sessionAgeSecs cfg)
         {:keys [data ctype]}
         (.loadTemplate co
                        tpl
                        (func evt csrf))
         res (.getResultObj evt) ]
        (doto ^HTTPResult
          res
          (.setHeader "content-type" ctype)
          (.setContent data)
          (.setStatus 200))
        (doto ^WebSS
          mvs
          (.setNew true est)
          (.setXref csrf))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RegisterPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage interpolateRegisterPage))))

;;(ns-unmap *ns* '->RegisterPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LoginPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage interpolateLoginPage))))

;;(ns-unmap *ns* '->LoginPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ForgotPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage interpolateForgotPage))))

;;(ns-unmap *ns* '->ForgotPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

