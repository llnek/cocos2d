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

  czlab.cocos2d.site.core

  (:require
    [czlab.skaro.impl.ext :refer [GetAppKeyFromEvent]]
    [czlab.xlib.util.dates :refer [ParseDate]]
    [czlab.xlib.util.files :refer [ListFiles]]
    [czlab.xlib.util.str :refer [hgl? strim]]
    [czlab.xlib.util.logging :as log]
    [clojure.java.io :as io])

  (:use [czlab.skaro.core.consts]
        [czlab.xlib.util.wfs]
        [czlab.cocos2d.games.meta]
        [czlab.xlib.util.consts]
        [czlab.odin.system.core])

  (:import
    [com.zotohlab.skaro.core Container ConfigError]
    [com.zotohlab.skaro.runtime AppMain]
    [com.zotohlab.frwk.server Emitter]
    [com.zotohlab.wflow Activity
    WorkFlow Job PTask]
    [com.zotohlab.skaro.io HTTPEvent HTTPResult]
    [com.zotohlab.frwk.io XData]
    [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:dynamic *USER-FLAG* :__u982i) ;; user id
(def ^:private DOORS (atom []))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- maybeCheckDoors  ""

  [^File appDir]

  (with-local-vars [rc (transient [])]
    (let [fds (-> (io/file appDir "public/ig/res/main/doors")
                  (ListFiles  "png")) ]
      (doseq [^File fd fds]
        (var-set rc (conj! @rc (.getName fd)))))
    (reset! DOORS (persistent! @rc))
    (log/debug "how many doors ? %s" (count @DOORS))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn MyAppMain ""

  ^AppMain
  []

  (reify

    AppMain

    (contextualize [_ ctr]
      (doto (.getAppDir ^Container ctr)
        (ScanGameManifests )
        (maybeCheckDoors ))
      (OdinInit ctr)
      (log/info "app-main contextualized by container %s" ctr))

    (configure [_ options])
    (initialize [_])
    (start [_])
    (stop [_])
    (dispose [_])))

;;(ns-unmap *ns* '->MyAppMain)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetDftModel

  "Return a default object for Freemarker processing."

  [^HTTPEvent evt]

  (let [ck (.getCookie evt (name *USER-FLAG*))
        uid (if (nil? ck)
              "Guest"
              (strim (.getValue ck)))]
    {:title "ZotohLab | Fun &amp; Games."
     :encoding "utf-8"
     :description "Bonjour!"
     :stylesheets []
     :scripts []
     :metatags
     {:keywords "content=\"web browser games mobile ios android windows phone\""
      :description "content=\"Hello World!\""
      :viewport "content=\"width=device-width, initial-scale=1.0\"" }
     :appkey (GetAppKeyFromEvent evt)
     :profile {:user uid }
     :body {} }))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateIndexPage ""

  [^HTTPEvent evt]

  (-> (GetDftModel evt)
      (update-in [:body]
                 #(merge %
                         {:doors @DOORS
                          :content "/main/index.ftl"}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  []

  (SimPTask
    (fn [^Job j]
      (let [tpl (:template (.getv j EV_OPTS))
            ^HTTPEvent evt (.event j)
            src (.emitter evt)
            ^Container
            co (.container src)
            {:keys [data ctype]}
            (.loadTemplate co
                           tpl
                           (interpolateIndexPage evt))
            ^HTTPResult res (.getResultObj evt) ]
        (doto res
          (.setHeader "content-type" ctype)
          (.setContent data)
          (.setStatus 200))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn IndexPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage))))

;;(ns-unmap *ns* '->IndexPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

