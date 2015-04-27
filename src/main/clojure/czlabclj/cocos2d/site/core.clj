;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013, Ken Leung. All rights reserved.


(ns  ^{:doc ""
       :author "kenl" }

  czlabclj.cocos2d.site.core

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [czlabclj.xlib.util.dates :only [ParseDate] ]
        [czlabclj.xlib.util.str :only [nsb hgl? strim] ]
        [czlabclj.tardis.core.consts]
        [czlabclj.xlib.util.wfs]
        [czlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ])

  (:use [czlabclj.cocos2d.games.meta]
        [czlabclj.odin.system.core])

  (:import  [com.zotohlab.skaro.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow FlowNode Activity
                                Pipeline SDelegate PTask Work]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult Emitter]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.wflow Job]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

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
    (let [fds (IOUtils/listFiles (File. appDir "public/ig/res/main/doors")
                                 "png" false) ]
      (doseq [^File fd (seq fds) ]
        (var-set rc (conj! @rc (.getName fd)))))
    (reset! DOORS (persistent! @rc))
    (log/debug "How many doors ? " (count @DOORS))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype MyAppMain [] czlabclj.tardis.impl.ext.CljAppMain

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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetDftModel ""

  ^Map
  [^HTTPEvent evt]

  (let [tags (HashMap.)
        dm (HashMap.)
        pf (HashMap.) ]
    (doto dm
      (.put "title" "ZotohLab | Fun &amp; Games.")
      (.put "encoding" "UTF-8")
      (.put "description" "Hello World!")
      (.put "stylesheets" (ArrayList.))
      (.put "scripts" (ArrayList.))
      (.put "metatags" tags)
      (.put "appkey" (GetAppKeyFromEvent evt))
      (.put "profile" pf)
      (.put "body" (HashMap.)))
    (.put tags "keywords" "content=\"web browser games mobile ios android windows phone\"")
    (.put tags "description" "content=\"Hello World!\"")
    (.put tags "viewport" "content=\"width=device-width, initial-scale=1.0\"")
    (.put pf "user" "Guest")
    (when-let [ck (.getCookie evt (name *USER-FLAG*)) ]
      (let [s (strim (.getValue ck)) ]
        (.put pf "user" s)))
    dm
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateIndexPage ""

  ^Map
  [^HTTPEvent evt]

  (let [dm (GetDftModel evt)
        ^Map bd (.get dm "body")
        ^List jss (.get dm "scripts")
        ^List css (.get dm "stylesheets") ]
    (.put bd "doors" @DOORS)
    (.put bd "content" "/main/index.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(DefPipe
  doShowPage
  (SimPTask
    (fn [^Job j]
      (let [tpl (nsb (:template (.getv j EV_OPTS)))
            ^HTTPEvent evt (.event j)
            src (.emitter evt)
            co (.container src)
            [rdata ct]
            (.loadTemplate co tpl
                               (interpolateIndexPage evt))
            ^HTTPResult res (.getResultObj evt) ]
        (.setHeader res "content-type" ct)
        (.setContent res rdata)
        (.setStatus res 200)
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(DefMorphable IndexPage doShowPage)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)


