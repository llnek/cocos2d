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
        [czlabclj.xlib.util.wfs :only [SimPTask]]
        [czlabclj.cocos2d.games.meta]
        [czlabclj.cocos2d.site.core ])

  (:import  [com.zotohlab.skaro.core Container]
            [com.zotohlab.wflow Activity
             Job PTask]
            [com.zotohlab.skaro.io HTTPEvent HTTPResult Emitter]
            [com.zotohlab.server WorkFlow]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateBrowsePage ""

  ^Map
  [^HTTPEvent evt]

  (let [dm (GetDftModel evt)
        {css "stylesheets"
         bd "body"
         jss "scripts"} dm]
    (doto ^Map bd
      (.put "games" (GetGamesAsListForUI))
      (.put "content" "/main/games/games.ftl"))
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateArenaPage ""

  ^Map
  [^HTTPEvent evt]

  (let [mf ((GetGamesAsHash) (.getUri evt))
        dm (GetDftModel evt)
        {tags "metatags"
         bd  "body"
         jss "scripts"
         css "stylesheets"} dm]
    (doto ^Map tags
      (.put "viewport" "content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\"")
      (.put "full-screen" "content=\"yes\"")
      (.put "x5-fullscreen" "content=\"true\"")
      (.put "360-fullscreen" "content=\"true\"")
      (.put "apple-mobile-web-app-capable" "content=\"yes\""))
    (doto ^Map bd
      (.put "games" (GetGamesAsListForUI))
      (.put "content" "/main/games/arena.ftl"))
    (when-not (nil? mf)
      (.put tags
            "screen-orientation"
            (str "content=\"" (:layout mf) "\""))
      (.put bd "gameid" (:uuid mf)))
    dm
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolatePicksPage ""

  ^Map
  [^HTTPEvent evt]

  (let [dm (GetDftModel evt)
        {bd "body"
         jss "scripts"
         css "stylesheets"} dm]
    (doto ^List css
      (.add "/public/vendors/owl-carousel/owl.carousel.css")
      (.add "/public/vendors/owl-carousel/owl.theme.css"))
    (doto ^List jss
      (.add "/public/vendors/owl-carousel/owl.carousel.min.js"))
    (doto ^Map bd
      (.put "picks" (GetGamesAsListForUI))
      (.put "content" "/main/games/picks.ftl"))
    dm
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
            ^Emitter src (.emitter evt)
            co (.container src)
            [rdata ct]
            (.loadTemplate co tpl
                           (interpolateFunc evt))
            ^HTTPResult res (.getResultObj evt) ]
        (.setHeader res "content-type" ct)
        (.setContent res rdata)
        (.setStatus res 200)
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
(def ^:private core-eof nil)


