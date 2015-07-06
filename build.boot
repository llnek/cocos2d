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

(set-env!
  :dependencies '[]

  :source-paths #{"src/main/java" "src/main/clojure"}
  :buildVersion "0.9.0-SNAPSHOT"
  :buildDebug true
  :basedir (System/getProperty "user.dir"))

(require '[clojure.data.json :as js]
         '[clojure.string :as cstr]
         '[boot.core :as bcore]
         '[czlabclj.tpcl.boot :as b]
         '[czlabclj.tpcl.antlib :as ant])

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; global properties
(def skaroHome (atom "/wdrive/myspace/skaro/b.out/0/pack"))
(def bldDir (atom "b.out"))
(def prj (atom "0"))
(def wjs (atom "webscripts"))
(def wcs (atom "webstyles"))
(def basedir (atom (get-env :basedir)))

(def buildDir (atom (b/fp! @basedir @bldDir @prj)))
(def reportDir (atom (b/fp! @buildDir "reports")))
(def podDir (atom (b/fp! @basedir "POD-INF")))
(def libDir (atom (b/fp! @podDir "lib")))

(def buildVersion (atom "0.9.0"))
(def PID (atom "cocos2d"))

(def buildDebug (atom true))
(def buildType (atom "web"))

(def testDir (atom (b/fp! @basedir "src/test")))
(def srcDir (atom (b/fp! @basedir "src/main")))
(def webDir (atom (b/fp! @basedir "src/web")))

(def outTestDir (atom (b/fp! @podDir "test-classes")))
(def outJarDir (atom (b/fp! @podDir "classes")))

(def csslang (atom "scss"))
(def jslang (atom "js"))

(def websrc (atom (b/fp! @buildDir @wjs)))
(def webcss (atom (b/fp! @buildDir @wcs)))
(def docs (atom (b/fp! @buildDir "docs")))

(def pj (atom (ant/AntProject)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; language compilers
(def CZPATH [[:location (b/fp! @srcDir "clojure")]
             [:location @outJarDir]
             [:location @buildDir]
             [:fileset {:dir @libDir} []]
             [:fileset {:dir (b/fp! @skaroHome "dist")} []]
             [:fileset {:dir (b/fp! @skaroHome "lib")} []]] )

(def TZPATH (concat [[:location (b/fp! @testDir "clojure")]
                     [:location @outTestDir]]
                    CZPATH))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- cleanLocalJs ""

  [wappid]

  (ant/DeleteDir (io/file @webDir wappid "src" @bldDir)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- cleanPublic ""

  []

  (ant/RunAntTasks*
    @pj
    "clean-public"
    (ant/AntDelete
      @pj {}
      [[:fileset {:dir (b/fp! @basedir "public/scripts")
                  :includes "**/*"} ]
       [:fileset {:dir (b/fp! @basedir "public/styles")
                  :includes "**/*"} ]
       [:fileset {:dir (b/fp! @basedir "public/pages")
                  :includes "**/*"} ]
       [:fileset {:dir (b/fp! @basedir "public/ig")
                  :includes "**/*"} ]])
    (ant/AntMkdir {:dir (b/fp! @basedir "public/ig")})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- clean ""
  []
  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "clean"
      (ant/AntDelete pj {}
        [[:fileset {:dir @outJarDir
                    :includes "**/*"} ]
         [:fileset {:dir @buildDir
                    :includes "**/*"} ]
         [:fileset {:dir @libDir
                    :includes "**/*.jar"} ]]))
    (cleanPublic)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- preBuild ""
  []
  (doseq [s [(b/fp! @basedir "POD-INF/classes")
             (b/fp! @basedir "POD-INF/lib")
             (b/fp! @basedir "POD-INF/patch")
             @buildDir
             (b/fp! @buildDir "webscripts")
             (b/fp! @buildDir "webstyles")]]
    (.mkdirs (io/file s))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileClj ""

  [pj & paths]

  (ant/AntJava
    pj
    {:classname "clojure.lang.Compile"
     :fork true
     :failonerror true
     :maxmemory "2048m"}
    [[:sysprops {:clojure.compile.warn-on-reflection true
                 :clojure.compile.path @buildDir} ]
     [:classpath CZPATH]
     [:argvalues (apply b/FmtCljNsps
                        (io/file @srcDir "clojure") paths)]]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileAndJar ""
  []
  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "compile+jar"
      (ant/AntJavac
        pj
        {:srcdir (b/fp! @srcDir "java")
         :destdir @outJarDir
         :includeantruntime false
         :target "1.8"
         :debug @buildDebug
         :debugLevel "lines,vars,source"}
        [[:compilerarg {:line "-Xlint:deprecation -Xlint:unchecked"}]
         [:include "**/*.java"]
         [:classpath CZPATH]])

      (compileClj pj "czlabclj.odin.event"
                     "czlabclj.odin.system"
                     "czlabclj.odin.game")

      (compileClj pj "czlabclj.frigga.core"
                     "czlabclj.frigga.tttoe"
                     "czlabclj.frigga.pong")

      (compileClj pj "czlabclj.cocos2d.games"
                     "czlabclj.cocos2d.site"
                     "czlabclj.cocos2d.users"
                     "czlabclj.cocos2d.util")

      (ant/AntCopy pj
                   {:todir @outJarDir}
                   [[:fileset {:dir @buildDir} ]])

        ;;-- copy over other resources

      (ant/AntCopy pj
                   {:todir @outJarDir}
                   [[:fileset {:dir (b/fp! @srcDir "clojure") }
                              [[:exclude "**/*.clj"]]]
                    [:fileset {:dir (b/fp! @srcDir "java") }
                              [[:exclude "**/*.java"]]]])

      (ant/AntJar pj
                  {:destFile (b/fp! @libDir
                                    (str @PID
                                         "-" @buildVersion ".jar"))}
                  [[:fileset {:dir @outJarDir} ]]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileTestCode ""
  []
  (.mkdirs (io/file @outTestDir))
  (.mkdirs (io/file @reportDir)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- runTestCode "" [])

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn testBuild ""
  []
  (buildr)
  (compileTestCode)
  (runTesTCode)
  (println "Test called - OK"))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- buildWebApps ""
  []
  (let [isDir? #(.isDirectory %)
        dirs (->> (.listFiles (io/file @webDir))
                  (filter dir?))]
    (map #(buildOneWebApp %) dirs)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- babel->cb ""

  [wappid f & {:keys [postgen dir paths]
               :or {:postgen false
                    :dir false
                    :paths []}
               :as args }]

  (let [dir (io/file @webDir wappid "src")
        out (io/file @websrc wappid)
        mid (cstr/join "/" paths)
        des (-> (io/file out mid)
                (.getParentFile)) ]
    (cond
      postgen
      (let [bf (io/file dir @bldDir mid)]
        (spit bf
              (-> (slurp bf)
                  (.replaceAll "\\/\\*@@" "")
                  (.replaceAll "@@\\*\\/" "")))
        (ant/MoveFile bf (doto des (.mkdirs))))

      (.isDirectory f)
      (if (= @bldDir (.getName f))
        nil
        {})

      :else
      (if (and (not (.startsWith mid "cc"))
               (.endsWith mid ".js"))
        {:work-dir dir
         :args ["--modules"
                "amd"
                "--module-ids"
                mid
                "--out-dir"
                @bldDir] }
        (do
          (ant/CopyFile (io/file dir mid)
                        (doto des (.mkdirs)))
          nil)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileJS ""

  [wappid]

  (let [root (io/file @webDir wappid "src")
        pj (ant/AntProject)
        tks (atom []) ]

    (cleanLocalJs wappid)
    (try
      (bt/BabelTree root (partial babel->cb wappid))
    (finally
      (cleanLocalJs wappid)))

    (when true
      (ant/RunAntTasks* pj ""
        (ant/AntExec
          pj
          {:executable "jsdoc"
           :dir @basedir
           :spawn true}
          [[:argvalues [(b/fp! @basedir
                               @bldDir @prj @wjs wappid)
                         "-c"
                         (b/fp! @basedir "jsdoc.json")
                         "-d"
                         (b/fp! @docs wappid)]]])))

    (.mkdirs (io/file @basedir "public" "ig" "lib" "game"))
    (.mkdirs (io/file @basedir "public" "scripts"))

    (case wappid

      "cocos2d"
      (->> [[:fileset {:dir (b/fp! @websrc wappid)}]]
           (ant/AntCopy pj {:todir (b/fp! @basedir "public/ig/lib") })
           (conj @tks)
           (reset! tks))

      "main"
      (->> [[:fileset {:dir (b/fp! @websrc wappid) } ]]
           (ant/AntCopy pj {:todir (b/fp! @basedir "public/scripts") })
           (conj @tks)
           (reset! tks))
      ;;else
      (do
        (->> (ant/AntCopy
               pj
               {:file (b/fp! @srcDir "resources/main.js")
                :todir (b/fp! @basedir
                              "public/ig/lib/game/" wappid)} )
             (conj @tks)
             (reset! tks))
        (->> [[:fileset {:dir (b/fp! @websrc wappid)} ]]
             (ant/AntCopy pj
                          {:todir (b/fp! @basedir
                                         "public/ig/lib/game/" wappid)})
             (conj @tks)
             (reset! tks))))

    (apply ant/RunAntTasks pj "" (reverse @tks))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- buildOneWebApp ""

  [^File dir]

  (let [wappid (.getName dir)
        pj (ant/AntProject)]
    (.mkdirs (io/file (b/fp! @websrc  wappid)))
    (.mkdirs (io/file (b/fp! @webcss  wappid)))
    (compileJS wappid)
    (when (= "scss" @csslang)
      (compileSCSS wappid))
    (compileMedia wappid)
    (compileInfo wappid)
    (compilePages wappid)
    (finzApp wappid)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- finzBuild ""

  []

  (let [pj (ant/AntProject)
        ps (b/fp! @basedir "public/vendors/")
        t1 (ant/AntDelete pj
                          {:file (b/fp! @basedir
                                        "public/c/webcommon.js")} )
        t2 (->> [[:fileset {:file (b/fp! ps "almond/almond.js")} ]
                 [:fileset {:file (b/fp! ps "ramda/ramda.js") } ]
                 [:fileset {:file (b/fp! ps "l10njs/l10n.js")} ]
                 [:fileset {:file (b/fp! ps "mustache/mustache.js")} ]
                 [:fileset {:file (b/fp! ps "helpers/dbg.js") } ]
                 [:fileset {:file (b/fp! ps "js-signals/signals.js") } ]
                 [:fileset {:file (b/fp! ps "ash-js/ash.js")} ]
                 [:fileset {:file (b/fp! ps "jquery-plugins/detectmobilebrowser.js")} ]
                 [:fileset {:file (b/fp! ps "crypto-js/components/core-min.js")} ]
                 [:fileset {:file (b/fp! ps "crypto-js/components/enc-utf16-min.js")} ]
                 [:fileset {:file (b/fp! ps "crypto-js/components/enc-base64-min.js")} ]
                 [:fileset {:file (b/fp! ps "cherimoia/skaro.js")} ]
                 [:fileset {:file (b/fp! ps "cherimoia/caesar.js")} ]]
                (ant/AntConcat pj {:destFile (b/fp! @basedir "public/c/webcommon.js")
                                   :append true})) ]
    (ant/RunAntTasks* pj "finz-build" t1 t2)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileSCSS ""

  [wappid]

  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "compile->scss"
      (ant/AntCopy
        pj
        {:todir (b/fp! @webcss wappid)}
        [[:fileset {:dir (b/fp! @webDir wappid "styles")}
                   [[:include "**/*.scss"]]]])

      (ant/AntApply
        pj
        {:executable "sass" :parallel false}
        [[:fileset {:dir (b/fp! @webcss wappid)}
                   [[:include "**/*.scss"]]]
         [:arglines ["--sourcemap=none"]]
         [:srcfile {}]
         [:chainedmapper
          [[:glob {:from "*.scss" :to "*.css"}
           [:glob {:from "*" :to (b/fp! @webcss wappid "*")}]]]]
         [:targetfile {}]])

      (ant/AntCopy
        pj
        {:todir (b/fp! @webcss wappid)}
        [[:fileset {:dir (b/fp! @webDir wappid "styles")}
                   [[:include "**/*.css"]]]])

      (ant/AntMkdir pj {:dir (b/fp! @basedir "public/styles" wappid)})

      (ant/AntCopy
        pj
        {:todir (b/fp! @basedir "public/styles" wappid)}
        [[:fileset {:dir (b/fp! @webcss wappid)}
                   [[:include "**/*.css"]]]]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileMedia ""

  [wappid]

  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "compile->media"
      (ant/AntMkdir pj {:dir (b/fp! @basedir "public/ig/res" wappid)})
      (ant/AntCopy
        pj
        {:todir (b/fp! @basedir "public/ig/res" wappid)}
        [[:fileset {:dir (b/fp! @webDir wappid "res/sd")}
                   [[:include "**/*"]]]
         [:fileset {:dir (b/fp! @webDir wappid "res")}
                   [[:include "sfx/**/*"]]]]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileInfo ""

  [wappid]

  (when-not (or (= "cocos2d" wappid)
                (= "main" wappid))
    (let [pj (ant/AntProject)]
      (ant/RunAntTasks*
        pj
        "compile->info"
        (ant/AntMkdir pj {:dir (b/fp! @basedir
                                      "public/ig/info" wappid)})
        (ant/AntCopy
          pj
          {:todir (b/fp! @basedir "public/ig/info" wappid)}
          [[:fileset {:dir (b/fp! @webDir wappid "info")}
                     [[:include "**/*"]]]])))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(declare jiggleTheIndexFile)
(defn- compilePages ""

  [wappid]

  (case wappid
    ("main" "cocos2d")
    (let [pj (ant/AntProject)]
      (ant/RunAntTasks*
        pj
        ""
        (ant/AntCopy
          pj
          {:todir (b/fp! @basedir "public/pages" wappid)}
          [[:fileset {:dir (b/fp! @webDir wappid "pages")}
                     [[:include "**/*"]]]])))

    ;;else
    (jiggleTheIndexFile wappid
                        (b/fp! @basedir
                               "public/pages" wappid)
                        false)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doJiggleTheIndexFile

  [wappid des cocos]

  (ant/CopyFile (io/file @srcDir "resources" "index.html") (io/file des))
  (let [almond (atom "<script src=\"/public/vendors/almond/almond.js\"></script>")
        bdir (atom (str "/public/ig/lib/game/" wappid))
        ccdir (atom "/public/extlibs/")
        cfg (atom "")
        json (-> (slurp (b/fp! @webDir
                               wappid "info/game.json") :encoding "utf-8")
                 (js/read-str :key-fn keyword))
        html (-> (slurp (b/fp! des "index.html") :encoding "utf-8")
                 (cstr/replace "@@DESCRIPTION@@" (:description json))
                 (cstr/replace "@@KEYWORDS@@" (:keywords json))
                 (cstr/replace "@@TITLE@@" (:name json))
                 (cstr/replace "@@LAYOUT@@" (:layout json))
                 (cstr/replace "@@HEIGHT@@" (:height json))
                 (cstr/replace "@@WIDTH@@" (:width json))
                 (cstr/replace "@@UUID@@" (:uuid json))) ]
    (if (or (= @pmode "release")
            cocos)
      (do
        (reset! ccdir "frameworks/")
        (reset! bdir "")
        (reset! almond "")
        (reset! cfg (slurp (b/fp! @srcDir "resources/cocos2d.js") :encoding "utf-8")))
      (do
        (reset! cfg (slurp (b/fp! @webDir wappid "src/ccconfig.js") :encoding "utf-8"))))

    (spit (str des "/index.html")
          (-> html
              (cstr/replace "@@AMDREF@@" almond)
              (cstr/replace "@@BOOTDIR@@" bdir)
              (cstr/replace "@@CCDIR@@" ccdir)
              (cstr/replace "@@CCCONFIG@@" cfg))
            :encoding "utf-8")
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- finzApp ""

  [wappid]

  (when (not= @pmode "release")
    (let [des (b/fp! @basedir "public/ig/lib/game" wappid)]
      (ant/CopyFile (io/file @srcDir "resources" "project.json")
                    (io/file des))

      (ant/CopyFile (io/file @srcDir "resources" "main.js")
                    (io/file des)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- yuiCSS ""
  []
  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "yui->css"
      (ant/AntApply
        pj
        {:executable "java" :parallel false}
        [[:fileset {:dir (b/fp! @basedir "public/styles") }
                   [[:exclude "**/*.min.css"]
                    [:include "**/*.css"]]]
         [:arglines ["-jar"]]
         [:argpaths [(str @skaroHome "/lib/yuicompressor-2.4.8.jar")]]
         [:srcfile {}]
         [:arglines ["-o"]]
         [:chainedmapper
          [[:type glob {:from "*.css"
                        :to "*.min.css"}]
           [:type glob {:from "*"
                        :to (b/fp! @basedir "public/styles/*")}]]]
         [:targetfile {}]]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- yuiJS ""
  []
  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "yui->js"
      (ant/AntApply
        pj
        {:executable "java" :parallel false}
        [[:fileset {:dir (b/fp! @basedir "public/scripts") }
                   [[:exclude "**/*.min.js"]
                    [:include "**/*.js"]]]
         [:arglines ["-jar"]]
         [:argpaths [(str @skaroHome "/lib/yuicompressor-2.4.8.jar")]]
         [:srcfile {}]
         [:arglines ["-o"]]
         [:chainedmapper
          [[:type glob {:from "*.js"
                        :to "*.min.js"}]
           [:type glob {:from "*"
                        :to (b/fp! @basedir "public/scripts/*")}]]]
         [:targetfile {}]]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; (called by skaro)
(defn- buildr ""
  []
  (clean)
  (preBuild)
  (println "##############################################################################")
  (format  "# building: %s\n" @PID)
  (format  "# type: %s\n" @buildType)
  (println "##############################################################################")
  (compileAndJar)
  (buildWebApps))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask fast ""
  []
  (set-env! :pmode "release")
  (buildWebApps)
  (yuiCSS)
  (yuiJS)
  (finzBuild))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask release ""
  []
  (set-env! :pmode "release")
  (buildr)
  (yuiCSS)
  (yuiJS)
  (finzBuild))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask devmode ""
  []
  (set-env! :pmode "dev")
  (buildr)
  (finzBuild))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask test ""
  []
  (testBuild))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask newapp ""
  []
  (let [pubtime (b/FmtTime "yyyy-MM-dd")
        appkey (b/RandUUID)]

    ;;(format "Creating new game: %s" appid)
    (.mkdirs (io/file @webDir appid))

    (doseq [s ["src/n" "src/s" "src/i18n" "src/p" "res/sfx"]]
      (.mkdirs (io/file (b/fp! @webDir appid s))))

    (doseq [s ["hdr" "hds" "sd"]]
      (.mkdirs (io/file @webDir appid "res" s "pics"))
      (.mkdirs (io/file @webDir appid "res" s "fon")))

    (doseq [s ["info" "pages" "styles"]]
      (.mkdirs (io/file @webDir appid s)))

    (ant/CopyFile (io/file @srcDir "resources" "game.json")
                  (io/file @webDir appid "info"))
    (ant/CopyFile (io/file @srcDir "resources" "game.mf")
                  (io/file @webDir appid "info"))

    (b/ReplaceFile (b/fp! @webDir appid "info" "game.mf")
                   #(-> %
                        (cstr/replace "@@PUBDATE@@" pubtime)
                        (cstr/replace "@@APPID@@" appid)))

    (b/ReplaceFile (b/fp! @webDir appid "info" "game.json")
                   #(cstr/replace % "@@UUID@@" appkey))

    (doseq [s ["game.js" "splash.js" "mmenu.js"
               "hud.js" "config.js" "protos.js"]]
      (ant/CopyFile (io/file @srcDir "resources" s)
                    (io/file @webDir appid "src" "p")))

    (ant/CopyFile (io/file @srcDir "resources" "gnodes.js")
                  (io/file @webDir appid "src" "n"))

    (ant/CopyFile (io/file @srcDir "resources" "cobjs.js")
                  (io/file @webDir appid "src" "n"))

    (doseq [s ["stager.js" "factory.js"
               "motion.js" "resolve.js" "sysobjs.js"]]
      (ant/CopyFile (io/file @srcDir "resources" s)
                    (io/file @webDir appid "src" "s")))

    (b/ReplaceFile (b/fp! @webDir appid "src" "p" "config.js")
                   #(cstr/replace % "@@UUID@@" appkey))

    (ant/CopyFile (io/file @srcDir "resources" "l10n.js")
                  (io/file @webDir appid "src" "i18n""l10n.js"))

    (ant/CopyFile (io/file @srcDir "resources" "ccconfig.js")
                  (io/file @webDir appid "src"))

    (ant/CopyFile (io/file @srcDir "resources" "proj.json")
                  (io/file @webDir appid "src" "project.json"))

    (b/ReplaceFile (b/fp! @webDir appid "src" "project.json")
                   #(cstr/replace % "@@APPID@@" appid))

    (b/ReplaceFile (b/fp! @webDir appid "src" "ccconfig.js")
                   #(cstr/replace % "@@APPID@@" appid))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- cocos->new ""
  []
  (let [pj (ant/AntProject)]
    (ant/RunAntTasks*
      pj
      "cocos+new"
      (ant/AntMkdir pj {:dir (b/fp! @basedir "cocos")})
      (ant/AntExec
        pj
        {:executable "cocos"}
        [[:argvalues ["new" "-l" "js" "-t"
                      "runtime" "--ios-bundleid"
                      (str "com.zotohlab.p." appid)
                      "-d" (str @basedir "/cocos") appid]]]))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask cocos+new ""
  [appid]
  (cocos->new))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask deployapp ""
  []
  (let [srcpath (b/fp! @webDir appid)
        src (io/file srcpath)]
    (if-not (.exists src)
      (format "Invalid game: %s" appid)
      (deploy->app appid))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- deploy->app ""

  [appid]

  (let [vendors (b/fp! @basedir "public/vendors")
        despath (b/fp! @basedir "cocos" appid)
        srcpath (b/fp! @webDir appid)
        des (io/file despath)
        src (io/file srcpath)
        dd2 (io/file des "res")
        dd1 (io/file des "src")
        pj (ant/AntProject)
        dd2path (.getCanonicalPath dd2)
        dd1path (.getCanonicalPath dd1) ]

    (when-not (.exists des) (cocos->new appid))
    (format "Deploying game: %s" appid)
    (ant/CleanDir dd2)
    (ant/CleanDir dd1)
    ;; resources
    (doseq [s ["hdr" "hds" "sd" "sfx"]]
      (ant/RunAntTasks*
        pj
        ""
        (ant/AntCopy pj
                     {:todir (io/file dd2 s "cocos2d") }
                     [[:fileset {:dir (io/file @webDir "cocos2d" "res" s)} ]])
        (ant/AntCopy pj
                     {:todir (io/file dd2 s appid)}
                     [[:fileset {:dir (io/file @srcpath "res" s)} ]])))
    ;; js code
    (ant/RunAntTasks*
      pj
      ""
      (ant/AntCopy pj
                   {:todir (io/file dd1 "zotohlab")}
                   [[:fileset {:dir (io/file @webDir
                                             "cocos2d"
                                             "src" "zotohlab")} ]])
      (ant/AntCopy pj
                   {:todir (io/file dd1 appid)}
                   [[:fileset {:dir (io/file srcpath "src")} ]])
      (ant/AntCopy pj
                   {:todir (io/file dd1 "helpers")}
                   [[:fileset {:dir (io/file vendors "helpers")}
                    [[:include "dbg.js"]]]]))

    (doseq [s ["almond" "js-signals" "ash-js"
               "rxjs" "ramda" "cherimoia"
               "l10njs" "cookies" "mustache"]]
      (ant/RunAntTasks*
        pj
        ""
        (ant/AntCopy pf
                     {:todir (io/file dd1  s)}
                     [[:fileset {:dir (io/file vendors s)} ]])))

    ;; boot stuff
    (ant/RunAntTasks*
      pj
      ""
      (ant/AntCopy pf
                   {:todir despath
                    :overwrite true}
                   [[:fileset {:dir (io/file @srcDir "resources")}
                              [[:include "project.json"]
                               [:include "main.js"]
                               [:include "index.html"]]]]))

    (let [j1 (-> (slurp (io/file @srcDir
                                 "resources" "project.json")
                        :encoding "utf-8")
                 (js/read-str :key-fn keyword))
          j2 (-> (slurp (io/file srcpath "src" "project.json")
                        :encoding "utf-8")
                 (js/read-str :key-fn keyword)) ]
      (->> (update-in j1
                      [:jsList]
                      #(concat % (:jsList j2)))
           (js/write-str )
           (spit (io/file despath "project.json"))))

    (jiggleTheIndexFile appid (io/file @basedir "cocos" appid) true)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF
