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

  cmzlabs.cocos2d.games.core

  (:require [clojure.tools.logging :as log :only (info warn error debug)])
  (:require [clojure.string :as cstr])
  (:require [clojure.data.json :as json])

  (:use [cmzlabsclj.nucleus.util.dates :only [ParseDate] ])
  (:use [cmzlabsclj.nucleus.util.str :only [hgl? strim] ])

  (:use [cmzlabsclj.tardis.core.constants])
  (:use [cmzlabsclj.tardis.core.wfs])
  (:use [cmzlabsclj.tardis.impl.ext :only [GetAppKeyFromEvent] ])
  (:use [cmzlabs.cocos2d.site.core ])

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
(defn- interpolateBrowsePage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (GetDftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.put bd "games" (GetGamesAsList))
    (.put bd "content" "/main/games/games.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateArenaPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ uri (.getUri evt)
         ^Map mf (get (GetGamesAsHash) (.getUri evt))
         dm (GetDftModel evt)
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
    (.put bd "games" (GetGamesAsList))
    (.put bd "content" "/main/games/arena.ftl")
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolatePicksPage ""

  ^Map
  [^HTTPEvent evt]

  (let [ dm (GetDftModel evt)
         ^Map bd (.get dm "body")
         ^List jss (.get dm "scripts")
         ^List css (.get dm "stylesheets") ]
    (.add css "/public/vendors/owl-carousel/owl.carousel.css")
    (.add css "/public/vendors/owl-carousel/owl.theme.css")
    (.add jss "/public/vendors/owl-carousel/owl.carousel.min.js")
    (.put bd "picks" (GetGamesAsList))
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
(deftype AllGamesPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.games.core)
    (doShowPage interpolateBrowsePage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TopPicksPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.games.core)
    (doShowPage interpolatePicksPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype GameArenaPage [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabs.cocos2d.games.core)
    (doShowPage interpolateArenaPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)


