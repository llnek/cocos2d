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

  (:require
    [czlab.xlib.util.str :refer [hgl? strim] ]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.wfs :refer [SimPTask]])

  (:use [czlab.skaro.core.consts]
        [czlab.xlib.util.consts]
        [czlab.cocos2d.games.meta]
        [czlab.cocos2d.site.core ])

  (:import
    [com.zotohlab.skaro.core Container]
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
    (->> {:games (GetGamesAsListForUI)
          :content "/main/games/games.ftl"}
         (merge bd )
         (assoc dm :body ))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- interpolateArenaPage ""

  [^HTTPEvent evt]

  (let [mf ((GetGamesAsHash) (.getUri evt))]
    (-> (GetDftModel evt)
        (update-in
          [:metatags]
          #(merge
             %
             (if (some? mf)
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
        (update-in
          [:body]
          #(merge
             %
             {:games (GetGamesAsListForUI)
              :content "/main/games/arena.ftl" }
             (if (some? mf)
               {:gameid (:uuid mf)}
               {}))))))

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
                      (assoc :content "/main/games/picks.ftl")))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowPage ""

  ^Activity
  [func]

  (SimPTask
    (fn [^Job j]
      (let [tpl (:template (.getv j EV_OPTS))
            ^HTTPEvent evt (.event j)
            src (.emitter evt)
            co (.container src)
            {:keys [data ctype]}
            (-> ^Container co
                (.loadTemplate tpl
                               (func evt)))
            res (.getResultObj evt) ]
        (doto ^HTTPResult res
          (.setHeader "content-type" ctype)
          (.setContent data)
          (.setStatus 200))
        (.replyResult evt)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn AllGamesPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage interpolateBrowsePage))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn TopPicksPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage interpolatePicksPage))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GameArenaPage ""

  ^WorkFlow
  []

  (reify WorkFlow
    (startWith [_]
      (doShowPage interpolateArenaPage))))


;;(ns-unmap *ns* '->AllGamesPage)
;;(ns-unmap *ns* '->TopPicksPage)
;;(ns-unmap *ns* '->GameArenaPage)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF


