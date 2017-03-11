;; Copyright (c) 2013-2017, Kenneth Leung. All rights reserved.
;; The use and distribution terms for this software are covered by the
;; Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
;; which can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any fashion, you are agreeing to be bound by
;; the terms of this license.
;; You must not remove this notice, or any other, from this software.

(ns  ^{:doc ""
       :author "Kenneth Leung"}

  czlab.cocos2d.games.core

  (:require [czlab.basal.logging :as log]
            [czlab.wabbit.plugs.io.mvc :as mvc])

  (:use [czlab.wabbit.base.core]
        [czlab.convoy.net.core]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.flux.wflow.core]
        [czlab.cocos2d.util.core]
        [czlab.convoy.nettio.resp]
        [czlab.cocos2d.games.meta])

  (:import [czlab.flux.wflow Job Workstream]
           [czlab.convoy.net RouteInfo HttpResult]
           [czlab.wabbit.plugs.io HttpMsg]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectBrowsePage "" [^HttpMsg evt]

  (update-in (getDftModel evt)
             [:body]
             merge
             {:games (getGamesAsListForUI)
              :content "/games/games.ftl"}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectArenaPage "" [^HttpMsg evt]

  (let [mf ((getGamesAsHash)
            (:uri (.gist evt)))]
    (-> (getDftModel evt)
        (update-in
          [:metatags]
          #(merge
             %
             (if mf
               {:screen-orientation
                (->> (:layout mf)
                     (format "content=\"%s\""))}
               {})
             {:viewport (format "content=\"%s%s%s%s\""
                                "width=device-width, "
                                "initial-scale=1.0, "
                                "maximum-scale=1.0,"
                                "user-scalable=no")
              :full-screen "content=\"yes\""
              :x5-fullscreen "content=\"true\""
              :360-fullscreen "content=\"true\""
              :apple-mobile-web-app-capable "content=\"yes\""}))
        (update-in
          [:body]
          #(merge
             %
             {:games (getGamesAsListForUI)
              :content "/games/arena.ftl"}
             (if mf {:gameid (:uuid mf)} {}))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectPicksPage "" [^HttpMsg evt]

  (-> (getDftModel evt)
      (update-in
        [:stylesheets]
        #(-> (conj % "/public/ext/owl-carousel/owl.carousel.css")
             (conj "/public/ext/owl-carousel/owl.theme.css")))
      (update-in
        [:scripts]
        #(conj % "/public/ext/owl-carousel/owl.carousel.min.js"))
      (update-in
        [:body]
        #(-> (assoc % :picks (getGamesAsListForUI))
             (assoc :content "/games/picks.ftl")))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" [func]

  #(do->nil
     (let
       [^HttpMsg evt (.origin ^Job %)
        gist (.gist evt)
        ri (get-in gist [:route :info])
        tpl (some-> ^RouteInfo
                    ri .template)
        {:keys [data ctype]}
        (mvc/loadTemplate (.source evt) tpl (func evt))
        res (httpResult<> evt)]
       (doto res
         (.setContentType ctype)
         (.setContent data)
         (replyResult )))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn allGamesPage "" ^Workstream []
  (workstream<> (doShowPage injectBrowsePage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn topPicksPage "" ^Workstream []
  (workstream<> (doShowPage injectPicksPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn gameArenaPage "" ^Workstream []
  (workstream<> (doShowPage injectArenaPage)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

