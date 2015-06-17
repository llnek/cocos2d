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

  czlabclj.cocos2d.games.core

  (:require [clojure.tools.logging :as log])

  (:use [czlabclj.xlib.util.str :only [nsb hgl? strim] ]
        [czlabclj.tardis.core.consts]
        [czlabclj.xlib.util.consts]
        [czlabclj.xlib.util.wfs :only [SimPTask]]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.cocos2d.site.core ])

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

  (let [mf ((GetGamesAsHash) (.getUri evt))
        dm (GetDftModel evt)
        {tags :metatags bd :body} dm]

    (-> dm
        (assoc :metatags
               (merge tags {:viewport "content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\""
                            :full-screen "content=\"yes\""
                            :x5-fullscreen "content=\"true\""
                            :360-fullscreen "content=\"true\""
                            :apple-mobile-web-app-capable "content=\"yes\"" }
                           (if-not (nil? mf)
                             {:screen-orientation
                              (str "content=\"" (:layout mf) "\"") }
                             {})))
        (assoc :body
               (merge bd {:games (GetGamesAsListForUI)
                          :content "/main/games/arena.ftl" }
                      (if-not (nil? mf)
                        {:gameid (:uuid mf)}
                        {}))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolatePicksPage ""

  [^HTTPEvent evt]

  (let [dm (GetDftModel evt)
        {bd :body jss :scripts css :stylesheets} dm]
    (-> dm
        (assoc :stylesheets (-> css
                                (conj "/public/vendors/owl-carousel/owl.carousel.css")
                                (conj "/public/vendors/owl-carousel/owl.theme.css")))
        (assoc :scripts (-> jss
                            (conj "/public/vendors/owl-carousel/owl.carousel.min.js")))
        (assoc :body (-> bd
                         (assoc :picks (GetGamesAsListForUI))
                         (assoc :content "/main/games/picks.ftl"))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^Activity
  [interpolateFunc]

  (SimPTask
    (fn [^Job j]
      (let [tpl (nsb (:template (.getv j EV_OPTS)))
            ^HTTPEvent evt (.event j)
            src (.emitter evt)
            ^Container co (.container src)
            [rdata ct]
            (.loadTemplate co tpl
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
    (require 'czlabclj.cocos2d.games.core)
    (doShowPage interpolateBrowsePage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype TopPicksPage [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.games.core)
    (doShowPage interpolatePicksPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype GameArenaPage [] WorkFlow

  (startWith [_]
    (require 'czlabclj.cocos2d.games.core)
    (doShowPage interpolateArenaPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(ns-unmap *ns* '->AllGamesPage)
(ns-unmap *ns* '->TopPicksPage)
(ns-unmap *ns* '->GameArenaPage)
(def ^:private core-eof nil)


