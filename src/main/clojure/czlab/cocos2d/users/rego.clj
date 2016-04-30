;; Licensed under the Apache License, Version 2.0 (the "License");
;; you may not use this file except in compliance with the License.
;; You may obtain a copy of the License at
;;
;;     http://www.apache.org/licenses/LICENSE-2.0
;;
;; Unless required by applicable law or agreed to in writing, software
;; distributed under the License is distributed on an "AS IS" BASIS,
;; WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
;; See the License for the specific language governing permissions and
;; limitations under the License.
;;
;; Copyright (c) 2013-2016, Kenneth Leung. All rights reserved.


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

