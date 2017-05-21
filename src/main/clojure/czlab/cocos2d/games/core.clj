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

  (:require [czlab.wabbit.plugs.mvc :as mvc]
            [czlab.wabbit.base :as b]
            [czlab.wabbit.xpis :as xp]
            [czlab.convoy.core :as cc]
            [czlab.basal.log :as log]
            [czlab.basal.core :as c]
            [czlab.basal.str :as s]
            [czlab.cocos2d.util.core :as u]
            [czlab.cocos2d.games.meta :as m])

  (:import [java.io File]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectBrowsePage "" [evt]
  (update-in (u/getDftModel evt)
             [:body]
             merge
             {:games (m/getGamesAsListForUI)
              :content "/games/games.ftl"}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectArenaPage "" [evt]
  (let [mf ((m/getGamesAsHash) (:uri evt))]
    (-> (u/getDftModel evt)
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
             {:games (m/getGamesAsListForUI)
              :content "/games/arena.ftl"}
             (if mf {:gameid (:uuid mf)} {}))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- injectPicksPage "" [evt]
  (-> (u/getDftModel evt)
      (update-in
        [:stylesheets]
        #(-> (conj % "/public/ext/owl-carousel/owl.carousel.css")
             (conj "/public/ext/owl-carousel/owl.theme.css")))
      (update-in
        [:scripts]
        #(conj % "/public/ext/owl-carousel/owl.carousel.min.js"))
      (update-in
        [:body]
        #(-> (assoc % :picks (m/getGamesAsListForUI))
             (assoc :content "/games/picks.ftl")))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage "" [evt res func]
  (let [ri (get-in evt [:route :info])
        tpl (:template ri)
        plug (xp/get-pluglet evt)
        {:keys [data ctype]}
        (mvc/loadTemplate plug tpl (func evt))]
      (-> (cc/set-res-header res
                             "content-type" ctype)
          (assoc :body data)
          cc/reply-result)))

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

