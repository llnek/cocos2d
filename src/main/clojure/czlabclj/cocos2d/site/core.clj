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

  czlabclj.cocos2d.site.core

  (:require [czlabclj.xlib.util.dates :refer [ParseDate]]
            [czlabclj.xlib.util.str :refer [nsb hgl? strim]]
            [czlabclj.tardis.impl.ext :refer [GetAppKeyFromEvent]])

  (:require [clojure.tools.logging :as log]
            [clojure.java.io :as io])

  (:use [czlabclj.tardis.core.consts]
        [czlabclj.xlib.util.wfs]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.xlib.util.consts]
        [czlabclj.odin.system.core])

  (:import  [com.zotohlab.skaro.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.frwk.server Emitter]
            [com.zotohlab.wflow Activity
             WorkFlow Job PTask]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult]
            [com.zotohlab.frwk.io IO XData]
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
    (let [fds (IO/listFiles (io/file appDir "public/ig/res/main/doors")
                            "png" false) ]
      (doseq [^File fd fds]
        (var-set rc (conj! @rc (.getName fd)))))
    (reset! DOORS (persistent! @rc))
    (log/debug "How many doors ? " (count @DOORS))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype MyAppMain [] czlabclj.tardis.core.sys.CljAppMain

  (contextualize [_ ctr]
    (require 'czlabclj.cocos2d.games.meta)
    (require 'czlabclj.cocos2d.site.core)
    (let [d (.getAppDir ^Container ctr)]
      (ScanGameManifests d)
      (maybeCheckDoors d))
    (require 'czlabclj.odin.system.core)
    (OdinInit ctr)
    (log/info "My AppMain contextualized by container " ctr))

  (configure [_ options]
    (log/info "My AppMain configured with options " options))

  (initialize [_]
    (log/info "My AppMain initialized!"))

  (start [_]
    (log/info "My AppMain started"))

  (stop [_]
    (log/info "My AppMain stopped"))

  (dispose [_]
    (log/info "My AppMain finz'ed")))

(ns-unmap *ns* '->MyAppMain)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetDftModel "Return a default object for Freemarker processing."

  [^HTTPEvent evt]

  (let [ck (.getCookie evt (name *USER-FLAG*))
        uid (if (nil? ck)
              "Guest"
              (strim (.getValue ck)))]
    {
      :title "ZotohLab | Fun &amp; Games."
      :encoding "UTF-8"
      :description "Hello World!"
      :stylesheets []
      :scripts []
      :metatags {
        :keywords "content=\"web browser games mobile ios android windows phone\""
        :description "content=\"Hello World!\""
        :viewport "content=\"width=device-width, initial-scale=1.0\""
      }
      :appkey (GetAppKeyFromEvent evt)
      :profile { :user uid }
      :body {}
    }
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateIndexPage ""

  [^HTTPEvent evt]

  (-> (GetDftModel evt)
      (update-in [:body]
                 #(merge %
                         {:doors @DOORS
                          :content "/main/index.ftl"}))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  []

  (SimPTask
    (fn [^Job j]
      (let [tpl (:template (.getv j EV_OPTS))
            ^HTTPEvent evt (.event j)
            ^Emitter src (.emitter evt)
            ^Container
            co (.container src)
            [rdata ct]
            (.loadTemplate co
                           (nsb tpl)
                           (interpolateIndexPage evt))
            ^HTTPResult res (.getResultObj evt) ]
        (doto res
          (.setHeader "content-type" ct)
          (.setContent rdata)
          (.setStatus 200))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype IndexPage [] WorkFlow
  (startWith [_]
    (require 'czlabclj.cocos2d.site.core)
    (doShowPage)))



(ns-unmap *ns* '->IndexPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF


