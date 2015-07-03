// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013, Ken Leung. All rights reserved.

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; external tools
import org.apache.commons.lang3.StringUtils
import org.apache.commons.io.FileUtils
import com.google.gson.GsonBuilder
import com.google.gson.JsonParser
import com.google.gson.JsonObject
import com.google.gson.JsonArray
import com.google.gson.Gson
import java.util.UUID

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; global properties
(def skaroHome (atom "/wdrive/myspace/skaro/b.out/0/pack"))
(def bldDir (atom "b.out"))
(def prj (atom "0"))
(def wjs (atom "webscripts"))
(def wcs (atom "webstyles"))
(def basedir (atom ))

(def cljBuildDir (atom (str @basedir "/" @bldDir "/clojure.org")))
(def buildDir (atom (str @basedir "/" @bldDir "/" @prj)))
(def reportDir (atom (str @buildDir "/reports")))
(def podDir (atom (str @basedir "/POD-INF")))
(def libDir (atom (str @podDir "/lib")))

(def buildVersion (atom "0.9.0"))
(def PID (atom "cocos2d"))

(def buildDebug (atom true))
(def buildType (atom "web"))

(def testDir (atom (str @basedir "/src/test")))
(def srcDir (atom (str @basedir "/src/main")))
(def webDir (atom (str @basedir "/src/web")))

(def outTestDir (atom (str @podDir "/test-classes")))
(def outJarDir (atom (str @podDir "/classes")))

(def csslang (atom "scss"))
(def jslang (atom "js"))

(def websrc (atom (str @buildDir "/" @wjs)))
(def webcss (atom (str @buildDir "/" @wcs)))
(def docs (atom (str @buildDir "/docs")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; language compilers
(def CZPATH [[:location (str @srcDir "/clojure")]
             [:location @outJarDir]
             [:location @cljBuildDir]
             [:location @buildDir]
             [:fileset {:dir @libDir} []]
             [:fileset {:dir (str @skaroHome "/dist")} []]
             [:fileset {:dir (str @skaroHome "/lib")} []]] )

(def TZPATH (concat [[:location (str @testDir "/clojure")]
                     [:location @outTestDir]]
                    CZPATH))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- cleanLocalJs ""

  [wappid]

  (ant/DeleteDir (io/file @webDir wappid "src" @bldDir)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; (called by skaro)
(defn buildr ""
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
(defn- preBuild ""
  []
  (doseq [s [(str @basedir "/POD-INF/classes")
             (str @basedir "/POD-INF/lib")
             (str @basedir "/POD-INF/patch")
             @buildDir
             (str @buildDir "/webscripts")
             (str @buildDir "/webstyles")]]
    (.mkdirs (io/file s))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileClj ""

  [^Project pj dir]

  (->> [[:sysprops {:clojure.compile.warn-on-reflection true
                    :clojure.compile.path @buildDir} ]
        [:classpath CZPATH]
        [:args (FmtCljNsps dir)]]
       (ant/AntJava pj
                    {:classname "clojure.lang.Compile"
                     :fork true
                     :failonerror true
                     :maxmemory "2048m"})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileAndJar ""
  []
  (let [pj (ant/AntProject)
        t1  (->> [[:compilerarg {:line "-Xlint:deprecation -Xlint:unchecked"}]
                  [:files [[:include "**/*.java"]]]
                  [:classpath CZPATH]]
                 (ant/AntJavac pj
                               {:srcdir (str @srcDir "/java")
                                :destdir @outJarDir
                                :includeantruntime false
                                :target "1.8"
                                :debug @buildDebug
                                :debugLevel "lines,vars,source"}))
        t2  (compileClj pj
                        "czlabclj.odin.event"
                        "czlabclj.odin.system"
                        "czlabclj.odin.game")

        t3  (compileClj pj
                        "czlabclj.frigga.core"
                        "czlabclj.frigga.tttoe"
                        "czlabclj.frigga.pong")

        t4  (compileClj pj
                        "czlabclj.cocos2d.games"
                        "czlabclj.cocos2d.site"
                        "czlabclj.cocos2d.users"
                        "czlabclj.cocos2d.util")

        t5  (->> [[:fileset {:dir @buildDir} []]]
                 (ant/AntCopy pj {:todir @outJarDir}))

        ;;-- copy over other resources

        t6  (->> [[:fileset {:dir (str @srcDir "/clojure") }
                            [[:exclude "**/*.clj"]]]
                  [:fileset {:dir (str @srcDir "/java") }
                            [[:exclude "**/*.java"]]]]
                 (ant/AntCopy pj {:todir @outJarDir}))

        t7  (->> [[:fileset {:dir @cljBuildDir} []]
                  [:fileset {:dir @outJarDir} []]]
                 (ant/AntJar pj
                             {:destFile (str @libDir
                                             "/"
                                             @PID
                                             "-"
                                             @buildVersion
                                             ".jar")})) ]
    (-> (ant/ProjAntTasks pj
                          "compile-&-jar"
                          t1 t2 t3 t4 t5 t6 t7)
        (ant/ExecTarget))
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
(defn- cleanPublic ""
  []

  (let [pj (ant/AntProject)
        t1 (->> [[:fileset {:errorOnMissingDir false
                            :dir (str @basedir "/public/scripts")
                            :includes "**/*"} []]
                 [:fileset {:errorOnMissingDir false
                            :dir (str @basedir "/public/styles")
                            :includes "**/*"} []]
                 [:fileset {:errorOnMissingDir false
                            :dir (str @basedir "/public/pages")
                            :includes "**/*"} []]
                 [:fileset {:errorOnMissingDir false
                            :dir (str @basedir "/public/ig")
                            :includes "**/*"} []]]
                (ant/AntDelete pj
                               {:includeEmptyDirs true}))
        t2 (ant/AntMkdir {:dir (str @basedir "/public/ig")}) ]
    (-> (ant/ProjAntTasks pj "clean-public!" t1 t2)
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- clean ""
  []
  (let [pj  (ant/AntProject)
        t1  (->> [[:fileset {:errorOnMissingDir false
                             :dir @outJarDir
                             :includes "**/*"} []]
                  [:fileset {:errorOnMissingDir false
                             :dir @buildDir
                             :includes "**/*"} []]
                  [:fileset {:errorOnMissingDir false
                             :dir @libDir
                             :includes "**/*.jar"} []]]
                 (ant/AntDelete pj {:includeEmptyDirs true})) ]
    (-> (ant/ProjAntTasks pj "clean!" t1)
        (ant/ExecTarget))
    (cleanPublic)
  ))

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
(defn- compileJS ""

  [wappid]

  (let [root (io/file @webDir wappid "src")
        pj (ant/AntProject)
        tks (atom []) ]

    (cleanLocalJs wappid)
    (jsWalkTree wappid
                (Stack.) root)
    (cleanLocalJs wappid)

    (when true
      (->> [[:argvalues [(str @basedir "/"
                              @bldDir "/"
                              @prj "/"
                              @wjs "/" wappid)
                         "-c"
                         (str @basedir "/jsdoc.json")
                         "-d"
                         (str @docs "/" wappid)]]]
           (ant/AntExec pj {:executable "jsdoc"
                            :dir @basedir
                            :spawn true})
           (ant/ProjAntTasks pj "")
           (ant/ExecTarget)))

    (.mkdirs (io/file @basedir "public" "ig" "lib" "game"))
    (.mkdirs (io/file @basedir "public" "scripts"))

    (case wappid
      "cocos2d"
      (->> [[:fileset {:dir (str @websrc "/" wappid)} []]]
           (ant/AntCopy pj {:todir (str @basedir "/public/ig/lib") })
           (conj @tks)
           (reset! tks))
      "main"
      (->> [[:fileset {:dir (str @websrc "/" wappid) } []]]
           (ant/AntCopy pj {:todir (str @basedir "/public/scripts") })
           (conj @tks)
           (reset! tks))
      (do
        (->> (ant/AntCopy pj
                          {:file (str @srcDir
                                      "/resources/main.js")
                           :todir (str @basedir
                                       "/public/ig/lib/game/" wappid)} [])
             (conj @tks)
             (reset! tks))
        (->> [[:fileset {:dir (str @websrc "/" wappid)} []]]
             (ant/AntCopy pj
                          {:todir (str @basedir
                                       "/public/ig/lib/game/" wappid)})
             (conj @tks)
             (reset! tks))))
    (-> (apply ant/ProjAntTasks pj "" (reverse @tks))
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- buildOneWebApp ""

  [^File dir]

  (let [wappid (.getName dir)
        pj (ant/AntProject)]
    (.mkdirs (io/file (str @websrc "/" wappid)))
    (.mkdirs (io/file (str @webcss "/" wappid)))
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
        ps (str @basedir "/public/vendors/")
        t1 (ant/AntDelete pj {:file (str @basedir
                                         "/public/c/webcommon.js")} [])
        t2 (->> [[:fileset {:file (str ps "almond/almond.js")} []]
                 [:fileset {:file (str ps "ramda/ramda.js") } []]
                 [:fileset {:file (str ps "l10njs/l10n.js")} []]
                 [:fileset {:file (str ps "mustache/mustache.js")} []]
                 [:fileset {:file (str ps "helpers/dbg.js") } []]
                 [:fileset {:file (str ps "js-signals/signals.js") } []]
                 [:fileset {:file (str ps "ash-js/ash.js")} []]
                 [:fileset {:file (str ps "jquery-plugins/detectmobilebrowser.js")} []]
                 [:fileset {:file (str ps "crypto-js/components/core-min.js")} []]
                 [:fileset {:file (str ps "crypto-js/components/enc-utf16-min.js")} []]
                 [:fileset {:file (str ps "crypto-js/components/enc-base64-min.js")} []]
                 [:fileset {:file (str ps "cherimoia/skaro.js")} []]
                 [:fileset {:file (str ps "cherimoia/caesar.js")} []]]
                (ant/AntConcat pj {:destFile (str @basedir "/public/c/webcommon.js")
                                   :append true})) ]
    (-> (ant/ProjAntTasks pj "finz-build" t1 t2)
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- jsWalkTree ""

  [^Stack stk ^String wappid seed]

  (let [^File top (if-not (nil? seed) seed (.peek stk))]
    (doseq [f (.listFiles top)]
      (cond
        (= @bldDir (.getName f))
        nil
        (.isDirectory f)
        (do
          (.push stk f)
          (jsWalkTree stk wappid nil))
        :else
        (let [path (if (.empty stk)
                       ""
                       (cstr/join "/" (for [x (.toArray stk)] (.getName x))))
              fid (.getName f)
              mid (if (> (.length path) 0)
                    (str path "/" fid)
                    fid)]
          (babelFile wappid mid))))
    (when-not (.empty stk) (.pop stk))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- babelFile ""

  [wappid mid]

  (let [dir (str @webDir "/" wappid "/src")
        out (str @websrc "/" wappid)
        pj (ant/AntProject) ]

    (if (and (not (.startsWith mid "cc"))
             (.endsWith mid ".js"))
      (let [t1 (->> [[:args ["--modules" "amd" "--module-ids"
                             mid "--out-dir" @bldDir]]]
                    (ant/AntExec pj {:executable "babel"
                                     :dir dir}))
            t2 (ant/AntReplace {:file (str dir "/" @bldDir "/" mid)
                                :token "/*@@"
                                :value ""} [])
            t3 (ant/AntReplace {:file (str dir "/" @bldDir "/" mid)
                                :token "@@*/"
                                :value ""} []) ]
        (-> (ant/ProjAntTasks pj "babel" t1 t2 t3)
            (ant/ExecTarget)))
      (let [des2 (-> (io/file dir @bldDir mid)
                     (.getParentFile)) ]
        (->> (ant/AntCopy {:file (str dir "/" mid)
                           :todir des2} [])
             (ant/ProjAntTasks pj "")
             (ant/ExecTarget))))
    (let [des2 (doto (-> (io/file out mid)
                         (.getParentFile))
                     (.mkdirs))]
      (->> (ant/AntMove {:file (str dir "/" @bldDir "/" mid)
                         :todir des2} [])
           (ant/ProjAntTasks pj "")
           (ant/ExecTarget)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileSCSS ""

  [wappid]

  (let [pj (ant/AntProject)
        t1 (->> [[:fileset {:dir (str @webDir "/" wappid "/styles")
                            :errorOnMissingDir false}
                           [[:include "**/*.scss"]]]]
             (ant/AntCopy pj {:todir (str @webcss "/" wappid)}))
        t2 (->> [[:fileset {:dir (str @webcss "/" wappid)}
                           [[:include "**/*.scss"]]]
                 [:arglines ["--sourcemap=none"]]
                 [:srcfile {}]
                 [:chainedmapper
                  [[:glob {:from "*.scss" :to "*.css"}
                   [:glob {:from "*" :to (str @webcss"/" wappid "/*")}]]]]
                 [:targetfile {}]]
             (ant/AntApply pj {:executable "sass"
                               :parallel false}))
        t3 (->> [[:fileset {:dir (str @webDir "/" wappid "/styles")
                            :errorOnMissingDir false}
                           [[:include "**/*.css"]]]]
             (ant/AntCopy pj {:todir (str @webcss "/" wappid)}))
        t4 (ant/AntMkdir pj {:dir (str @basedir "/public/styles/" wappid)})
        t5 (->> [[:fileset {:dir (str @webcss "/" wappid)}
                           [[:include "**/*.css"]]]]
                 (ant/AntCopy pj {:todir (str @basedir
                                              "/public/styles/" wappid)})) ]
    (-> (ant/ProjAntTasks pj "compile-scss" t1 t2 t3 t4 t5)
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileMedia ""

  [wappid]

  (let [pj (ant/AntProject)
        t1 (ant/AntMkdir pj {:dir (str @basedir
                                       "/public/ig/res/" wappid)})
        t2 (->> [[:fileset {:dir (str @webDir "/" wappid "/res/sd")}
                           [[:include "**/*"]]]
                 [:fileset {:dir (str @webDir "/" wappid "/res")}
                           [[:include "sfx/**/*"]]]]
                (ant/AntCopy pj {:todir (str @basedir
                                             "/public/ig/res/" wappid)})) ]
    (-> (ant/ProjAntTasks pj "compile-media" t1 t2)
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compileInfo ""

  [wappid]

  (case wappid
    "cocos2d" nil
    "main" nil
    (let [pj (ant/AntProject)
          t1 (ant/AntMkdir {:dir (str @basedir
                                      "/public/ig/info/" wappid)})
          t2 (->> [[:fileset {:dir (str @webDir "/" wappid "/info")}
                             [[:include "**/*"]]]]
                  (ant/AntCopy pj {:todir (str @basedir
                                               "/public/ig/info/"
                                               wappid)})) ]
      (-> (ant/ProjAntTasks pj "compile-info" t1 t2)
          (ant/ExecTarget)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- compilePages ""

  [wappid]

  (case wappid
    ("main" "cocos2d")
    (let [pj (ant/AntProject)]
      (->> [[:fileset {:dir (str @webDir "/" wappid "/pages")}
                      [[:include "**/*"]]]]
           (ant/AntCopy pj {:todir (str @basedir
                                        "/public/pages/" wappid)})
           (ant/ProjAntTasks pj "")
           (ant/ExecTarget)))
    (do
      (jiggleTheIndexFile wappid
                          (str @basedir
                               "/public/pages/" wappid)
                          false))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doJiggleTheIndexFile

  [wappid des cocos]

  (let [pj (ant/AntProject)]
    (->> (ant/AntCopy {:file (str @srcDir
                                  "/resources/index.html")
                       :todir des} [])
         (ant/ProjAntTasks pj "")
         (ant/ExecTarget))
    (let [json (-> (slurp (str @webDir "/"
                               wappid "/info/game.json") :encoding "utf-8")
                   (js-read-str :key-fn keyword))
          html (-> (slurp (str des "/index.html") :encoding "utf-8")
                   (cstr/replace "@@DESCRIPTION@@" (:description json))
                   (cstr/replace "@@KEYWORDS@@" (:keywords json))
                   (cstr/replace "@@TITLE@@" (:name json))
                   (cstr/replace "@@LAYOUT@@" (:layout json))
                   (cstr/replace "@@HEIGHT@@" (:height json))
                   (cstr/replace "@@WIDTH@@" (:width json))
                   (cstr/replace "@@UUID@@" (:uuid json)))
          bdir (atom (str "/public/ig/lib/game/" wappid))
          ccdir (atom "/public/extlibs/")
          almond (atom "<script src=\"/public/vendors/almond/almond.js\"></script>")
          cfg (atom "")]
      (if (or (= @pmode "release")
              cocos)
        (do
          (reset! ccdir "frameworks/")
          (reset! bdir "")
          (reset! almond "")
          (reset! cfg (slurp (str @srcDir "/resources/cocos2d.js") :encoding "utf-8")))
        (do
          (reset! cfg (slurp (str @webDir wappid "/src/ccconfig.js") :encoding "utf-8"))))

      (spit (str des "/index.html")
            (-> html
                (cstr/replace "@@AMDREF@@" almond)
                (cstr/replace "@@BOOTDIR@@" bdir)
                (cstr/replace "@@CCDIR@@" ccdir)
                (cstr/replace "@@CCCONFIG@@" cfg))
            :encoding "utf-8"))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- finzApp ""

  [wappid]

  (when (not= @pmode "release")
    (let [des (str @basedir "/public/ig/lib/game/" wappid)
          pj (ant/AntProject)
          t1 (ant/AntCopy pj {:todir des
                              :file (str @srcDir "/resources/project.json")} [])
          t2 (ant/AntCopy pj {:todir des
                              :file (str @srcDir "/resources/main.js")} []) ]
      (-> (ant/ProjAntTasks pj "finz-app" t1 t2)
          (ant/ExecTarget)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- yuiCSS ""
  []
  (let [pj (ant/AntProject)
        t1 (->> [[:fileset {:dir (str @basedir "/public/styles") }
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
                                :to (str @basedir "/public/styles/*")}]]]
                 [:targetfile {}]]
                (ant/AntApply pj {:executable "java"
                                  :parallel false})) ]
    (-> (ant/ProjAntTasks pj "yui-css" t1)
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- yuiJS ""
  []
  (let [pj (ant/AntProject)
        t1 (->> [[:fileset {:dir (str @basedir "/public/scripts") }
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
                                :to (str @basedir "/public/scripts/*")}]]]
                 [:targetfile {}]]
                (ant/AntApply pj {:executable "java"
                                  :parallel false})) ]
    (-> (ant/ProjAntTasks pj "yui-css" t1)
        (ant/ExecTarget))
  ))

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

  (let [pubtime (-> (SimpleDateFormat. "yyyy-MM-dd")
                    (.format (-> (GregorianCalendar.)
                                 (.getTimeInMillis)
                                 (Date.))))
        appkey (UUID/randomUUID)
        pj (ant/AntProject)
        ts (atom [])]

    ;;(format "Creating new game: %s" appid)
    (.mkdirs (io/file @webDir appid))

    (doseq [s ["src/n" "src/s" "src/i18n" "src/p" "res/sfx"]]
      (.mkdirs (io/file @webDir appid s)))

    (doseq [s ["hdr" "hds" "sd"]]
      (.mkdirs (io/file @webDir appid "res" s "pics"))
      (.mkdirs (io/file @webDir appid "res" s "fon")))

    (doseq [s ["info" "pages" "styles"]]
      (.mkdirs (io/file @webDir appid s)))

    (-> (ant/ProjAntTasks
          pj
          "new-app"
          (ant/AntCopy pj {:file (str @srcDir "/resources/game.json")
                           :todir (str @webDir "/" appid "/info")} [])
          (ant/AntCopy pj {:file (str @srcDir "/resources/game.mf")
                           :todir (str @webDir "/" appid "/info")} [])
          (ant/AntReplace pj {:file (str @webDir "/" appid "/info/game.mf")
                              :token "@@PUBDATE@@"
                              :value pubtime} [])
          (ant/AntReplace pj {:file (str @webDir "/" appid "/info/game.mf")
                              :token "@@APPID@@"
                              :value appid} [])
          (ant/AntReplace pj {:file (str @webDir "/" appid "/info/game.json")
                              :token "@@UUID@@"
                              :value appkey} []))
        (ant/ExecTarget))

    (doseq [s ["game.js" "splash.js" "mmenu.js" "hud.js" "config.js" "protos.js"]]
      (->> (ant/AntCopy pj {:file (str @srcDir "/resources/" s)
                            :todir (str @webDir "/" appid "/src/p")} [])
           (conj @ts)
           (reset! ts)))

    (->> (ant/AntCopy pj {:file (str @srcDir "/resources/gnodes.js")
                          :todir (str @webDir "/" appid "/src/n")} [])
         (conj @ts)
         (reset! ts))
    (->> (ant/AntCopy pj {:file (str @srcDir "/resources/cobjs.js")
                          :todir (str @webDir "/" appid "/src/n")} [])
         (conj @ts)
         (reset! ts))

    (doseq [s ["stager.js" "factory.js"
               "motion.js" "resolve.js" "sysobjs.js"]]
      (->> (ant/AntCopy pj {:file (str @srcDir "/resources/" s)
                            :todir (str @webDir "/" appid "/src/s") } [])
           (conj @ts)
           (reset! ts)))

    (->> (ant/AntReplace pj {:file (str @webDir "/" appid "/src/p/config.js")
                             :token "@@UUID@@"
                             :value appkey} [])
         (conj @ts)
         (reset! ts))
    (->> (ant/AntCopy pj {:file (str @srcDir "/resources/l10n.js")
                          :tofile (str @webDir "/" appid "/src/i18n/l10n.js")} [])
         (conj @ts)
         (reset! ts))
    (->> (ant/AntCopy pj {:file (str @srcDir "/resources/ccconfig.js")
                          :todir (str @webDir "/" appid "/src")} [])
         (conj @ts)
         (reset! ts))
    (->> (ant/AntCopy pj {:file (str @srcDir "/resources/proj.json")
                          :tofile (str @webDir "/" appid "/src/project.json")} [])
         (conj @ts)
         (reset! ts))
    (->> (ant/AntReplace pj {:file (str @webDir "/" appid "/src/project.json")
                             :token "@@APPID@@"
                             :value appid} [])
         (conj @ts)
         (reset! ts))
    (->> (ant/AntReplace pj {:file (str @webDir "/" appid "/src/ccconfig.js")
                             :token "@@APPID@@"
                             :value appid} [])
         (conj @ts)
         (reset! ts))

    (-> (apply ant/ProjAntTasks pj "new-app" (reverse @ts))
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask cocos+new ""
  [appid]
  (let [pj (ant/AntProject)
        t1 (ant/AntMkdir pj {:dir (str @basedir "/cocos")})
        t2 (->> [[:argvalues ["new"
                              "-l"
                              "js"
                              "-t"
                              "runtime"
                              "--ios-bundleid"
                              (str "com.zotohlab.p." appid)
                              "-d"
                              (str @basedir "/cocos")
                              appid]]]
                (ant/AntExec pj {:executable "cocos"} )) ]
    (-> (ant/ProjAntTasks pj "cocos+new" t1 t2)
        (ant/ExecTarget))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftask deployapp ""
  []
  (let [srcpath (str @webDir "/" appid)
        src (io/file srcpath)]
    (if-not (.exists src)
      (format "Invalid game: %s" appid)
      (deploy->app appid))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- deploy->app ""

  [appid]

  (let [vendors (str @basedir "/public/vendors")
        despath (str @basedir "/cocos/" appid)
        srcpath (str @webDir "/" appid)
        des (io/file despath)
        src (io/file srcpath)
        dd2 (io/file des "res")
        dd1 (io/file des "src")
        dd2path (.getCanonicalPath dd2)
        dd1path (.getCanonicalPath dd1) ]

    (when-not (.exists des) (cocos+new appid))
    (format "Deploying game: %s" appid)
    (ant/CleanDir dd2)
    (ant/CleanDir dd1)
    ;; resources
    (doseq [s ["hdr" "hds" "sd" "sfx"]]
      (->> [[:fileset {:dir (str @webDir "/cocos2d/res/" s)
                       :errorOnMissingDir false} []]]
           (ant/AntCopy pj {:todir (str dd2path "/" s "/cocos2d") } [])
           (conj @ts)
           (reset! ts))
      (->> [[:fileset {:dir (str @srcpath "/res/" s)
                       :errorOnMissingDir false} []]]
           (ant/AntCopy pj {:todir (str dd2path "/" s "/" appid)} [])
           (conj @ts)
           (reset! ts)))
    ;; js code
    (->> [[:fileset {:dir (str @webDir "/cocos2d/src/zotohlab")} []]]
      (ant/AntCopy pj {:todir (str dd1path "/zotohlab")} )
      (conj @ts)
      (reset! ts))
    (->> [[:fileset {:dir (str srcpath "/src")} []]]
      (ant/AntCopy pj {:todir (str dd1path "/" appid)} )
      (conj @ts)
      (reset! ts))
    (->> [[:fileset {:dir (str vendors "/helpers")}
                    [[:include "dbg.js"]]]]
      (ant/AntCopy pj {:todir (str dd1path "/helpers")})
      (conj @ts)
      (reset! ts))

    (doseq [s ["almond" "js-signals" "ash-js"
               "rxjs" "ramda" "cherimoia"
               "l10njs" "cookies" "mustache"]]
      (->> [[:fileset {:dir (str vendors "/" s)} []]]
        (ant/AntCopy pf {:todir (str dd1path "/" s)})
        (conj @ts)
        (reset! ts)))
    ;; boot stuff
    (->> [[:fileset {:dir (str @srcDir "/resources")}
                    [[:include "project.json"]
                     [:include "main.js"]
                     [:include "index.html"]]]]
      (ant/AntCopy pf {:todir despath
                       :overwrite true})
      (conj @ts)
      (reset! ts))

    (let [j1 (-> (slurp (str @srcDir "/resources/project.json") :encoding "utf-8")
                        (js/read-str :key-fn keyword))
          j2 (-> (slurp (str srcpath "/src/project.json") :encoding "utf-8")
                        (js-read-str :key-fn keyword)) ]
      (->> (update-in j1
                      [:jsList]
                      #(concat % (:jsList j2)))
           (js/write-str )
           (spit (str despath "/project.json"))))
    (jiggleTheIndexFile appid (str @basedir "/cocos/" appid) true)
  ))

//////////////////////////////////////////////////////////////////////////////
// EOF
