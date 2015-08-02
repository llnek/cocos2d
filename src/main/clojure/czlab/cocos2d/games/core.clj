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

  czlab.cocos2d.games.core

  (:require [czlab.xlib.util.str :refer [nsb hgl? strim] ]
            [czlab.xlib.util.wfs :refer [SimPTask]])

  (:require [clojure.tools.logging :as log])

  (:use [czlab.skaro.core.consts]
        [czlab.xlib.util.consts]
        [czlab.cocos2d.games.meta]
        [czlab.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.core Container]
            [com.zotohlab.wflow Activity
             WorkFlow Job PTask]
            [com.zotohlab.frwk.server Emitter]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateBrowsePage ""

  [^HTTPEvent evt]

  (let [dm (GetDftModel evt)
        bd (:body dm) ]
    (assoc dm :body (merge bd {:games (GetGamesAsListForUI)
                               :content "/main/games/games.ftl"}))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateArenaPage ""

  [^HTTPEvent evt]

  (let [mf ((GetGamesAsHash) (.getUri evt))]
    (-> (GetDftModel evt)
        (update-in [:metatags]
                   #(merge
                      %
                      (if-not (nil? mf)
                        {:screen-orientation (->> (:layout mf)
                                                  (format "content=\"%s\"")) }
                        {})
                      {:viewport (format "content=\"%s%s%s%s\""
                                         "width=device-width, "
                                         "initial-scale=1.0, "
                                         "maximum-scale=1.0,"
                                         "user-scalable=no")
                       :full-screen "content=\"yes\""
                       :x5-fullscreen "content=\"true\""
                       :360-fullscreen "content=\"true\""
                       :apple-mobile-web-app-capable "content=\"yes\"" }))
        (update-in [:body]
                   #(merge
                      %
                      {:games (GetGamesAsListForUI)
                       :content "/main/games/arena.ftl" }
                      (if-not (nil? mf)
                        {:gameid (:uuid mf)}
                        {}))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolatePicksPage ""

  [^HTTPEvent evt]

  (-> (GetDftModel evt)
      (update-in [:stylesheets]
                 #(-> (conj % "/public/vendors/owl-carousel/owl.carousel.css")
                      (conj "/public/vendors/owl-carousel/owl.theme.css")))
      (update-in [:scripts]
                 #(conj % "/public/vendors/owl-carousel/owl.carousel.min.js"))
      (update-in [:body]
                 #(-> (assoc % :picks (GetGamesAsListForUI))
                      (assoc :content "/main/games/picks.ftl")))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^Activity
  [interpolateFunc]

  (SimPTask
    (fn [^Job j]
      (let [tpl (:template (.getv j EV_OPTS))
            ^HTTPEvent evt (.event j)
            src (.emitter evt)
            ^Container
            co (.container src)
            [rdata ct]
            (.loadTemplate co
                           (nsb tpl)
                           (interpolateFunc evt))
            ^HTTPResult res (.getResultObj evt) ]
        (doto res
          (.setHeader "content-type" ct)
          (.setContent rdata)
          (.setStatus 200))
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype AllGamesPage [] WorkFlow

  (startWith [_]
    (require 'czlab.cocos2d.games.core)
    (doShowPage interpolateBrowsePage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TopPicksPage [] WorkFlow

  (startWith [_]
    (require 'czlab.cocos2d.games.core)
    (doShowPage interpolatePicksPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype GameArenaPage [] WorkFlow

  (startWith [_]
    (require 'czlab.cocos2d.games.core)
    (doShowPage interpolateArenaPage)))



(ns-unmap *ns* '->AllGamesPage)
(ns-unmap *ns* '->TopPicksPage)
(ns-unmap *ns* '->GameArenaPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF


