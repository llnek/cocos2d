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

  cmzlabclj.cocos2d.games.meta

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.nucleus.util.dates :only [ParseDate] ]
        [cmzlabclj.nucleus.util.str :only [nsb hgl? strim] ]
        [cmzlabclj.tardis.core.constants])

  (:import  [org.apache.commons.io FileUtils]
            [com.zotohlab.frwk.io IOUtils]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private GAMES-MNFS (atom []))
(def ^:private GAMES-HASH (atom {}))
(def ^:private GAMES-UUID (atom {}))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ScanGameManifests ""

  [^File appDir]

  (with-local-vars [rc (transient [])
                    uc (transient {})
                    mc (transient {}) ]
    (let [fs (IOUtils/listFiles (File. appDir "public/ig/info")
                                "manifest"
                                true) ]
      (doseq [^File f (seq fs) ]
        (let [json (json/read-str (FileUtils/readFileToString f "utf-8"))
              gid (-> (.getParentFile f)(.getName))
              uid (get json "uuid")
              uri (get json "uri")
              pdt (ParseDate (-> (strim (get json "pubdate"))
                                 (.replace \/ \-))
                             "yyyy-MM-dd")
              info (-> json
                       (assoc "pubdate" pdt)
                       (assoc "gamedir" gid)) ]
          (var-set mc (assoc! @mc uri info))
          (var-set uc (assoc! @uc uid info))
          (var-set rc (conj! @rc info)))))
    (reset! GAMES-MNFS (vec (sort #(compare (.getTime ^Date (get %1 "pubdate"))
                                            (.getTime ^Date (get %2 "pubdate")))
                                  (persistent! @rc))))
    (reset! GAMES-HASH (persistent! @mc))
    (reset! GAMES-UUID (persistent! @uc))
  ))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsList ""

  []

  @GAMES-MNFS)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsHash ""

  []

  @GAMES-HASH)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn GetGamesAsUUID ""

  []

  @GAMES-UUID)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private meta-eof nil)

