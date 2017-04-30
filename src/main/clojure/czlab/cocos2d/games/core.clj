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
            [czlab.wabbit.plugs.mvc :as mvc])

  (:use [czlab.wabbit.base]
        [czlab.wabbit.xpis]
        [czlab.convoy.core]
        [czlab.basal.core]
        [czlab.basal.str]
        [czlab.cocos2d.util.core]
        [czlab.cocos2d.games.meta])

  (:import [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectBrowsePage "" [evt]
  (update-in (getDftModel evt)
             [:body]
             merge
             {:games (getGamesAsListForUI)
              :content "/games/games.ftl"}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectArenaPage "" [evt]
  (let [mf ((getGamesAsHash)
            (:uri evt))]
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
(defn- injectPicksPage "" [evt]
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
(defn- doShowPage "" [evt res func]
  (let [ri (get-in evt [:route :info])
        tpl (:template ri)
        plug (get-pluglet evt)
        {:keys [data ctype]}
        (mvc/loadTemplate plug tpl (func evt))]
    (reply-result
      (-> (set-res-header res "content-type" ctype)
          (assoc :body data)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn allGamesPage "" [evt res]
  (doShowPage evt res injectBrowsePage))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn topPicksPage "" [evt res]
  (doShowPage evt res injectPicksPage))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn gameArenaPage "" [evt res]
  (doShowPage evt res injectArenaPage))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

