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

  cmzlabclj.cocos2d.site.core

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.nucleus.util.dates :only [ParseDate] ]
        [cmzlabclj.nucleus.util.str :only [hgl? strim] ]
        [cmzlabclj.tardis.core.constants]
        [cmzlabclj.tardis.core.wfs]
        [cmzlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ])

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
(def ^:dynamic *USER-FLAG* :__u982i) ;; user id

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private GAMES-MNFS (atom []))
(def ^:private GAMES-HASH (atom {}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- scanGameManifests ""

  [^File appDir]

  (with-local-vars [rc (transient []) mc (transient {}) ]
    (let [fs (IOUtils/listFiles (File. appDir "public/ig/info")
                                "manifest"
                                true) ]
      (doseq [^File f (seq fs) ]
        (let [json (json/read-str (FileUtils/readFileToString f "utf-8"))
              gid (-> (.getParentFile f)(.getName))
              uri (get json "uri")
              pdt (ParseDate (-> (strim (get json "pubdate"))
                                 (.replace \/ \-))
                             "yyyy-MM-dd")
              info (-> json
                       (assoc "pubdate" pdt)
                       (assoc "gamedir" gid)) ]
          (var-set mc (assoc! @mc uri info))
          (var-set rc (conj! @rc info)))))
    (reset! GAMES-MNFS (vec (sort #(compare (.getTime ^Date (get %1 "pubdate"))
                                            (.getTime ^Date (get %2 "pubdate")))
                                  (persistent! @rc))))
    (reset! GAMES-HASH (persistent! @mc))
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsList ""

  []

  @GAMES-MNFS)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsHash ""

  []

  @GAMES-HASH)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype MyAppMain [] cmzlabclj.tardis.impl.ext.CljAppMain

  (contextualize [_ ctr]
    (require 'cmzlabclj.cocos2d.site.core)
    (scanGameManifests (.getAppDir ^Container ctr))
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
    (.put tags "keywords" "web browser games mobile ios android windows phone")
    (.put tags "description" "Hello World!")
    (.put tags "viewport" "width=device-width, initial-scale=1.0")
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
    (.put bd "content" "/main/index.ftl")
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
            ^Emitter src (.emitter evt)
            ^cmzlabclj.tardis.impl.ext.ContainerAPI
            co (.container src)
            [rdata ct] (.loadTemplate co tpl (interpolateFunc evt))
            ^HTTPResult res (.getResultObj evt) ]
        (.setHeader res "content-type" ct)
        (.setContent res rdata)
        (.setStatus res 200)
        (.replyResult evt)))
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype IndexPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.cocos2d.site.core)
    (doShowPage interpolateIndexPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)


