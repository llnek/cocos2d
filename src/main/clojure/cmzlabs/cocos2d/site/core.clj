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
  (:use [cmzlabsclj.nucleus.util.str :only [hgl? strim] ])

  (:use [cmzlabsclj.tardis.core.constants])
  (:use [cmzlabsclj.tardis.core.wfs])
  (:use [cmzlabsclj.tardis.impl.ext :only [GetAppKeyFromEvent] ])

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
(def ^:private GAMES-HASH (atom {}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- scanGameManifests ""

  [^File appDir]

  (with-local-vars [ rc (transient []) mc (transient {}) ]
    (let [ fs (IOUtils/listFiles (File. appDir "public/ig/info")
                                 "manifest"
                                 true) ]
      (doseq [ ^File f (seq fs) ]
        (let [ json (json/read-str (FileUtils/readFileToString f "utf-8"))
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
(deftype MyAppMain [] cmzlabsclj.tardis.impl.ext.CljAppMain

  (contextualize [_ ctr]
    (require 'cmzlabs.cocos2d.site.core)
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
(defn- dftModel ""

  ^Map
  [^HTTPEvent evt]

  (let [ tags (HashMap.)
         dm (HashMap.) ]
    (doto dm
      (.put "title" "ZotohLab | Fun &amp; Games.")
      (.put "encoding" "UTF-8")
      (.put "description" "Hello World!")
      (.put "stylesheets" (ArrayList.))
      (.put "scripts" (ArrayList.))
      (.put "metatags" tags)
      (.put "appkey" (GetAppKeyFromEvent evt))
      (.put "body" (HashMap.)))
    (.put tags "keywords" "web browser games mobile ios android windows phone")
    (.put tags "description" "Hello World!")
    (.put tags "viewport" "width=device-width, initial-scale=1.0")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateRegisterPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (dftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/users/register.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateLoginPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (dftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/users/login.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateIndexPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (dftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "content" "/main/index.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateBrowsePage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (dftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "games" @GAMES-MNFS)
    (.put bd "content" "/main/games/games.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateArenaPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ uri (.getUri evt)
         ^Map mf (get @GAMES-HASH (.getUri evt))
         dm (dftModel evt)
         ^Map tags (.get dm "metatags")
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put tags "viewport" "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    (.put tags "apple-mobile-web-app-capable" "yes")
    (when-not (nil? mf)
        (.put tags "screen-orientation" (.get mf "orientation")))
    (.put tags "full-screen" "yes")
    (.put tags "x5-fullscreen" "true")
    (.put tags "360-fullscreen" "true")
    (.put bd "games" @GAMES-MNFS)
    (.put bd "content" "/main/games/arena.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolatePicksPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (dftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.add css "/public/vendors/owl-carousel/owl.carousel.css")
    (.add css "/public/vendors/owl-carousel/owl.theme.css")
    (.add jss "/public/vendors/owl-carousel/owl.carousel.min.js")
    (.put bd "picks" @GAMES-MNFS)
    (.put bd "content" "/main/games/picks.ftl")
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
             [rdata ct] (.loadTemplate co tpl (interpolateFunc evt))
             ^HTTPResult res (.getResultObj evt) ]
        (.setHeader res "content-type" ct)
        (.setContent res rdata)
        (.setStatus res 200)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype RegisterPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.site.core)
    (doShowPage interpolateRegisterPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LoginPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.site.core)
    (doShowPage interpolateLoginPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

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
    (doShowPage interpolateBrowsePage))

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
(deftype GameArenaPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.site.core)
    (doShowPage interpolateArenaPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)


