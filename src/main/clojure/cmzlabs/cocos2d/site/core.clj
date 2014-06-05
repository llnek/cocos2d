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

  cmzlabs.cocos2d.site.core

  (:require [clojure.tools.logging :as log :only (info warn error debug)])
  (:require [clojure.string :as cstr])
  (:require [clojure.data.json :as json])

  (:use [cmzlabsclj.nucleus.util.dates :only [ParseDate] ])
  (:use [cmzlabsclj.nucleus.util.str :only [strim] ])
  (:use [cmzlabsclj.tardis.core.constants])
  (:use [cmzlabsclj.tardis.core.wfs])

  (:import (com.zotohlab.gallifrey.core Container ConfigError ))
  (:import (org.apache.commons.io FileUtils))

  (:import ( com.zotohlab.wflow FlowPoint Activity
                                 Pipeline PipelineDelegate PTask Work))
  (:import (com.zotohlab.gallifrey.io HTTPEvent HTTPResult Emitter))
  (:import (com.zotohlab.frwk.net ULFormItems ULFileItem))
  (:import (com.zotohlab.frwk.io IOUtils XData))
  (:import (com.zotohlab.wflow.core Job))
  (:import (java.io File))
  (:import (java.util Date ArrayList List HashMap Map)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private GAMES-MNFS (atom []))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- scanGameManifests ""

  [^File appDir]

  (with-local-vars [ rc (transient []) ]
    (let [ fs (IOUtils/listFiles (File. appDir "public/ig/info")
                                 "manifest"
                                 true) ]
      (doseq [ ^File f (seq fs) ]
        (let [ json (json/read-str (FileUtils/readFileToString f "utf-8"))
               gid (-> (.getParentFile f)(.getName))
               pdt (ParseDate (-> (strim (get json "pubdate"))
                                  (.replace \/ \-))
                              "yyyy-MM-dd")
               info (-> json
                        (assoc "pubdate" pdt)
                        (assoc "gamedir" gid)) ]
          (var-set rc (conj! @rc info)))))
    (vec (sort #(compare (.getTime ^Date (get %1 "pubdate"))
                         (.getTime ^Date (get %2 "pubdate")))
               (persistent! @rc)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype MyAppMain [] cmzlabsclj.tardis.impl.ext.CljAppMain

  (contextualize [_ ctr]
    (require 'cmzlabs.cocos2d.site.core)
    (reset! GAMES-MNFS
            (scanGameManifests (.getAppDir ^Container ctr)))
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
(defn- dftModel ""

  ^Map
  []

  (let [ dm (HashMap.) ]
    (doto dm
      (.put "title" "zotohlab | Fun &amp; Games.")
      (.put "encoding" "UTF-8")
      (.put "description" "Hello World!")
      (.put "stylesheets" (ArrayList.))
      (.put "scripts" (ArrayList.))
      (.put "body" (HashMap.))
      (.put "keywords" "web browser games mobile ios android windows phone"))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateIndexPage ""

  ^Map
  []

  (let [ dm (dftModel)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/index.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateGamesPage ""

  ^Map
  []

  (let [ dm (dftModel)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "games" @GAMES-MNFS)
    (.put bd "content" "/main/games.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolatePicksPage ""

  ^Map
  []

  (let [ dm (dftModel)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.add css "/public/vendors/owl-carousel/owl.carousel.css")
    (.add css "/public/vendors/owl-carousel/owl.theme.css")
    (.add jss "/public/vendors/owl-carousel/owl.carousel.min.js")
    (.put bd "picks" @GAMES-MNFS)
    (.put bd "content" "/main/picks.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^PTask
  [interpolateFunc]

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [ ^String tpl (:template (.getv job EV_OPTS))
             ^HTTPEvent evt (.event job)
             ^Emitter src (.emitter evt)
             ^cmzlabsclj.tardis.impl.ext.ContainerAPI
             co (.container src)
             [rdata ct] (.loadTemplate co tpl (interpolateFunc))
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
    (require 'cmzlabs.cocos2d.site.core)
    (doShowPage interpolateIndexPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype AllGamesPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.site.core)
    (doShowPage interpolateGamesPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TopPicksPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.site.core)
    (doShowPage interpolatePicksPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)


