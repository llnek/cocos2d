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

(set-env!

  :buildVersion "0.9.0-SNAPSHOT"
  :buildDebug true
  :buildType "web"

  :DOMAIN "czlab.cocos2d"
  :PID "cocos2d"

  :source-paths #{"src/main/clojure"
                  "src/main/java"}

  :dependencies '[[org.flatland/useful "0.11.3"
                   :exclusions [org.clojure/clojure]]] )

(require '[czlab.tpcl.boot :as b
           :refer :all
           :exclude [clean4build dev]]
         '[clojure.data.json :as js]
         '[clojure.java.io :as io]
         '[clojure.string :as cs]
         '[boot.core :as bc]
         '[czlab.tpcl.antlib :as a])

(import '[java.io File])

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(b/BootEnvVars
  {:wjs "scripts"
   :wcs "styles"
   :websrc #(set-env! %2 (fp! (ge :wzzDir) (ge :wjs)))
   :webcss #(set-env! %2 (fp! (ge :wzzDir) (ge :wcs)))
   :webDir #(set-env! %2 (fp! (ge :basedir) "src/web"))})

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(b/BootEnvPaths)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- cleanLocalJs ""

  [wappid]

  (a/DeleteDir (fp! (ge :webDir) wappid "src" (ge :bld))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- cleanPublic ""

  []

  (a/CleanDir (fp! (ge :basedir) "public"))
  (a/CleanDir (fp! (ge :websrc)))
  (a/CleanDir (fp! (ge :webcss))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- onbabel ""

  [wappid f & {:keys [postgen dir paths]
               :or {:postgen false
                    :dir false
                    :paths []}
               :as args }]

  (let [dir (io/file (ge :webDir) wappid "src")
        out (io/file (ge :websrc) wappid)
        mid (cs/join "/" paths)
        des (-> (io/file out mid)
                (.getParentFile)) ]
    (cond
      (true? postgen)
      (let [bf (io/file dir (ge :bld) mid)]
        (b/ReplaceFile bf
                       #(-> (cs/replace % "/*@@" "")
                            (cs/replace "@@*/" "")))
        (a/MoveFile bf des))

      (.isDirectory f)
      (if (= (ge :bld) (.getName f)) nil {})

      :else
      (if (and (not (.startsWith mid "cc"))
               (.endsWith mid ".js"))
        {:work-dir dir
         :args ["--modules" "amd"
                "--module-ids" mid
                "--out-dir" (ge :bld) ]}
        (do
          (a/CopyFile (io/file dir mid) des)
          nil)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileJS ""

  [wappid]

  (let [root (io/file (ge :webDir) wappid "src")
        tks (atom []) ]
    (try
      (cleanLocalJs wappid)
      (b/BabelTree root (partial onbabel wappid))
    (finally
      (cleanLocalJs wappid)))

    (when false
      (a/RunTasks*
        (a/AntExec
          {:executable "jsdoc"
           :dir (ge :basedir)
           :spawn true}
          [[:argvalues [(fp! (ge :websrc) wappid)
                         "-c"
                         (fp! (ge :basedir)
                              "jsdoc.json")
                         "-d"
                         (fp! (ge :docs) wappid)]]])))

    (->> (a/AntCopy
           {:todir (fp! (ge :basedir) "public/scripts") }
           [[:fileset {:dir (fp! (ge :websrc) wappid) } ]])
         (conj @tks)
         (reset! tks))

    (apply a/RunTasks* (reverse @tks))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileSCSS ""

  [wappid]

  (a/RunTasks*
    (a/AntCopy
      {:todir (io/file (ge :webcss) wappid)}
      [[:fileset {:dir (fp! (ge :webDir) wappid "styles")
                  :includes "**/*.scss"}]])
    (a/AntApply
      {:executable "sass" :parallel false}
      [[:fileset {:dir (fp! (ge :webcss) wappid)
                  :includes "**/*.scss"}]
       [:arglines ["--sourcemap=none"]]
       [:srcfile {}]
       [:chainedmapper
        {}
        [{:type :glob :from "*.scss" :to "*.css"}
         {:type :glob :from "*" :to (fp! (ge :webcss) wappid "*")}]]
       [:targetfile {}]])
    (a/AntCopy
      {:todir (io/file (ge :webcss) wappid)}
      [[:fileset {:dir (fp! (ge :webDir) wappid "styles")
                  :includes "**/*.css"}]])
    (a/AntMkdir {:dir (fp! (ge :basedir)
                           "public/styles" wappid)})
    (a/AntCopy
      {:todir (fp! (ge :basedir)
                   "public/styles" wappid)}
      [[:fileset {:dir (fp! (ge :webcss) wappid)
                  :includes "**/*.css"}]])))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compilePages ""

  [wappid]

  (a/RunTasks*
    (a/AntCopy
      {:todir (fp! (ge :basedir) "public/pages" wappid)}
      [[:fileset {:dir (fp! (ge :webDir) wappid "pages")}]])))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- buildOneWebApp ""

  [^File dir]

  (let [wappid (.getName dir)]
    (.mkdirs (io/file (fp! (ge :websrc) wappid)))
    (.mkdirs (io/file (fp! (ge :webcss) wappid)))
    (doto wappid
      (compileJS)
      (compileSCSS)
      (compilePages))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- buildWebApps ""

  []

  (let [isDir? #(.isDirectory %)
        dirs (->> (.listFiles (io/file (ge :webDir)))
                  (filter isDir?))]
    (doall (map #(buildOneWebApp %) dirs))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- yuiCSS ""

  []

  (a/RunTasks*
    (a/AntApply
      {:executable "java" :parallel false}
      [[:fileset {:dir (fp! (ge :basedir) "public/styles")
                  :excludes "**/*.min.css"
                  :includes "**/*.css"}]
       [:arglines ["-jar"]]
       [:argpaths [(str (ge :skaroHome)
                        "/lib/yuicompressor-2.4.8.jar")]]
       [:srcfile {}]
       [:arglines ["-o"]]
       [:chainedmapper {}
        [{:type :glob :from "*.css"
                      :to "*.min.css"}
         {:type :glob :from "*"
                      :to (fp! (ge :basedir) "public/styles/*")}]]
       [:targetfile {}]])))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- yuiJS ""
  []
  (a/RunTasks*
    (a/AntApply
      {:executable "java" :parallel false}
      [[:fileset {:dir (fp! (ge :basedir) "public/scripts")
                  :excludes "**/*.min.js"
                  :includes "**/*.js"}]
       [:arglines ["-jar"]]
       [:argpaths [(str (ge :skaroHome)
                        "/lib/yuicompressor-2.4.8.jar")]]
       [:srcfile {}]
       [:arglines ["-o"]]
       [:chainedmapper {}
        [{:type :glob :from "*.js"
                      :to "*.min.js"}
         {:type :glob :from "*"
                      :to (fp! (ge :basedir) "public/scripts/*")}]]
       [:targetfile {}]])))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
;; task definitions ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask clean4build "clean,pre-build"

  []

  (bc/with-pre-wrap fileset
    (Clean4Build)
    (PreBuild)
    fileset))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask dev "clean,resolve,build"

  []

  (comp (clean4build)
        (libjars)
        (buildr)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask web ""

  []

  (bc/with-pre-wrap fileset
    (CleanPublic)
    (cleanPublic)
    (buildWebApps)
    fileset))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask rel ""

  []

  (bc/with-pre-wrap fileset
    (buildWebApps)
    (yuiCSS)
    (yuiJS)
    fileset))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask release ""
  []

  (set-env! :pmode "release")
  (comp (dev) (rel)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

