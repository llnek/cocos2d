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

//////////////////////////////////////////////////////////////////////////////
//
def doCleanPublic() {
  ant.delete (includeemptydirs: true) {
    fileset (erroronmissingdir: false, dir: "${basedir}/public/scripts", includes: '**/*')
    fileset (erroronmissingdir: false, dir: "${basedir}/public/styles", includes: '**/*')
    fileset (erroronmissingdir: false, dir: "${basedir}/public/pages", includes: '**/*')
    fileset (erroronmissingdir: false, dir: "${basedir}/public/ig", includes: '**/*')
  }
  ant.mkdir (dir: "${basedir}/public/ig")
}

//////////////////////////////////////////////////////////////////////////////
//
def doBuildWebApps() {
  new File("${webDir}").eachDir( { f ->
    doBuildOneWebApp(f)
  });
  //doBuildForCC2DX()
}

//////////////////////////////////////////////////////////////////////////////
//
def doBuildOneWebApp (dir) {
  final wappid= dir.getName()

  ant.mkdir (dir: "${websrc}/${wappid}")
  ant.mkdir (dir: "${webcss}/${wappid}")

  if ("clojurescript" == "${jslang}") {
    doCompileCljScript(wappid)
  }
  if ("typescript" == "${jslang}") {
    doCompileTypeScript(wappid)
  }
  doCompileJS(wappid)
  if ("less" == "${csslang}") {
    doCompileLESS(wappid)
  }
  if ("scss" == "${csslang}") {
    doCompileSCSS(wappid)
  }
  doCompileMedia(wappid)
  doCompileInfo(wappid)
  doCompilePages(wappid)
  doFinzApp(wappid)
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompileCljScript(wappid) {
  final sdir= "${webDir}/${wappid}/src"
  ant.copy (todir: "${websrc}/${wappid}") {
    fileset (dir: "${sdir}") {
      include (name: '**/*.cljs')
    }
  }
  ant.java (
        classname: 'clojure.main',
        fork: true,
        failonerror: true,
        maxmemory: '2048m',
        classpathref: 'compile.path.id') {
    arg (value: "${basedir}/conf/cljsc.clj")
    arg (value: "${sdir}")
    arg (value: true)
    // advanced none whitespace simple
    arg (value: 'none')
    arg (value: "${websrc}/${wappid}")
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doFinzBuild() {
    /*
      <fileset file="${basedir}/public/vendors/fsm/state-machine.min.js"/>
      <fileset file="${basedir}/public/vendors/zepto/zepto.min.js"/>
      <fileset file="${basedir}/public/vendors/modernizr/modernizr.custom.js"/>
      */
  ant.delete (file: "${basedir}/public/c/webcommon.js", quiet: true)
  concat (destfile: "${basedir}/public/c/webcommon.js", append: true) {
    //fileset (file: "${basedir}/public/vendors/jquery/jquery-2.1.1.min.js")
    fileset (file: "${basedir}/public/vendors/almond/almond.js")
    fileset (file: "${basedir}/public/vendors/ramda/ramda.js")
    fileset (file: "${basedir}/public/vendors/l10njs/l10n.js")
    fileset (file: "${basedir}/public/vendors/mustache/mustache.js")
    fileset (file: "${basedir}/public/vendors/helpers/dbg.js")
    fileset (file: "${basedir}/public/vendors/js-signals/signals.js")
    fileset (file: "${basedir}/public/vendors/ash-js/ash.js")
    fileset (file: "${basedir}/public/vendors/jquery-plugins/detectmobilebrowser.js")
    //fileset (file: "${basedir}/public/vendors/jquery-plugins/jquery.cookie.js")
    fileset (file: "${basedir}/public/vendors/crypto-js/components/core-min.js")
    fileset (file: "${basedir}/public/vendors/crypto-js/components/enc-utf16-min.js")
    fileset (file: "${basedir}/public/vendors/crypto-js/components/enc-base64-min.js")
    fileset (file: "${basedir}/public/vendors/cherimoia/skaro.js")
    fileset (file: "${basedir}/public/vendors/cherimoia/caesar.js")
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doBuildForCC2DX() {
  ant.delete (file: "${basedir}/public/c/ztlcommon.js", quiet: true)
  concat (destfile: "${basedir}/public/c/ztlcommon.js", append: true) {
    fileset (file: "${basedir}/public/vendors/underscore/underscore-min.js")
    fileset (file: "${basedir}/public/vendors/l10njs/l10n.min.js")
    fileset (file: "${basedir}/public/vendors/mustache/mustache.js")
    fileset (file: "${basedir}/public/vendors/helpers/dbg.js")
    fileset (file: "${basedir}/public/vendors/cherimoia/skaro.js")
    fileset (file: "${basedir}/public/vendors/cherimoia/caesar.js")
    fileset (file: "${basedir}/public/vendors/cherimoia/zlab.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/asterix.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/bus.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xcfg.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/cs2dx.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/odin.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xscene.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xlayer.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xentity.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xlives.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xhud.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xigg.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/ext/xloader.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/gui/startscreen.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/gui/msgbox.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/gui/ynbox.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/gui/online.js")
    fileset (file: "${webDir}/cocos2d/src/zotohlab/gui/mainmenu.js")

  }
}


//////////////////////////////////////////////////////////////////////////////
//
def doCompileTypeScript(wappid) {
  ant.copy (todir: "${websrc}/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/src") {
      include (name: '**/*.ts')
    }
  }
  ant.exec (executable: 'tsc', dir: "${websrc}/${wappid}") {
    arg (value: '--outDir')
    arg (value: '--output')
    arg (value: "${websrc}/${wappid}")
    arg (value: '**/*.ts')
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompileCoffeeScript(wappid) {
  ant.copy (todir: "${websrc}/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/src") {
      include (name: '**/*.coffee')
    }
  }
  ant.exec (executable: 'coffee') {
    arg (value: '--bare')
    arg (value: '--output')
    arg (value: "${websrc}/${wappid}")
    arg (value: '--compile')
    arg (value: "${websrc}/${wappid}")
  }
}

target (poo: '') {
  doCompileJS('main')
}

//////////////////////////////////////////////////////////////////////////////
//
def jsWalkTree(wappid, stk,seed) {
  top=null;if (seed != null) { top=seed } else { top=stk.peek() }
  skip="${bldDir}";path=null;fid="";mid="";
  top.eachFile { f ->
    if (skip == f.getName()) {}
    else
    if (f.isDirectory()) {
      stk.push(f)
      jsWalkTree(wappid, stk,null)
    } else {
      if (stk.empty()) { path="" } else {
        path = stk.collect({ c -> c.getName() }).toArray(new ArrayList()).join('/')
      }
      mid= fid= f.getName()
      if (path.length() > 0) {
        mid=path + "/" + fid
      }
      babelFile(wappid,mid)
      //println "f = " + f.getName()
      //println "path = " + path + "/" + fid
    }
  }
  if (!stk.empty()) { stk.pop(); }
}

//////////////////////////////////////////////////////////////////////////////
//
def babelFile(wappid, mid) {
  dir="${webDir}/${wappid}/src"
  out="${websrc}/${wappid}"
  if (mid.endsWith(".js") && !mid.startsWith("cc")) {
    ant.exec (executable: 'babel', dir: "${dir}") {
      arg(value: '--modules')
      arg(value: 'amd')
      arg(value: '--module-ids')
      arg(value: "${mid}")
      arg(value: '--out-dir')
      arg(value: "${bldDir}")
    }
    ant.replace(file: "${dir}/${bldDir}/${mid}",token:"/*@@",value:"")
    ant.replace(file: "${dir}/${bldDir}/${mid}",token:"@@*/",value:"")
  } else {
    des=new File(dir, "${bldDir}/${mid}").getParentFile()
    des2=des.toString()
    ant.copy(file:"${dir}/${mid}", todir: "${des2}")
  }
  des=new File(out, mid).getParentFile()
  des.mkdirs()
  des2=des.toString()
  ant.move(file: "${dir}/${bldDir}/${mid}",todir: "${des2}")
}

//////////////////////////////////////////////////////////////////////////////
//
def cleanLocalJs(wappid) {
  ant.delete ( dir: "${webDir}/${wappid}/src/${bldDir}", quiet: true)
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompileJS(wappid) {

  root=new File("${webDir}/${wappid}/src")

  cleanLocalJs(wappid)
  jsWalkTree(wappid, new Stack(),root)
  cleanLocalJs(wappid)

  if (true) {
    ant.exec(executable: "jsdoc", dir: "${basedir}",spawn:true) {
      arg(value: "${basedir}/${bldDir}/${prj}/${wjs}/${wappid}")
      arg(value:"-c")
      arg(value:"${basedir}/jsdoc.json")
      arg(value:"-d")
      arg(value:"${docs}/${wappid}")
    }
  }

  ant.mkdir (dir: "${basedir}/public/ig/lib/game")
  ant.mkdir (dir: "${basedir}/public/scripts")
  switch (wappid) {
    case "cocos2d":
      ant.copy (todir: "${basedir}/public/ig/lib") {
        fileset (dir: "${websrc}/${wappid}")
      }
    break
    case "main":
      ant.copy (todir: "${basedir}/public/scripts") {
        fileset (dir: "${websrc}/${wappid}")
      }
    break
    default:
      ant.copy (file: "${srcDir}/resources/main.js", todir: "${basedir}/public/ig/lib/game/${wappid}")
      ant.copy (todir: "${basedir}/public/ig/lib/game/${wappid}") {
        fileset (dir: "${websrc}/${wappid}")
      }
    break
  }
}

//////////////////////////////////////////////////////////////////////////////
//

//////////////////////////////////////////////////////////////////////////////
//
def doCompileLESS(wappid) {
  ant.copy (todir: "${webcss}/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/styles", erroronmissingdir: false) {
      include (name: '**/*.less')
    }
  }
  ant.apply (executable: "lessc", parallel: false) {
    fileset (dir: "${webcss}/${wappid}") {
      include (name: '**/*.less')
    }
    srcfile ()
    chainedmapper () {
      mapper (type: 'glob', from: '*.less', to: '*.css')
      globmapper (from: '*', to: "${webcss}/${wappid}/*")
    }
    targetfile ()
  }
  ant.copy (todir: "${webcss}/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/styles", erroronmissingdir: false) {
      include (name: '**/*.css')
    }
  }
  ant.mkdir (dir: "${basedir}/public/styles/${wappid}")
  ant.copy (todir: "${basedir}/public/styles/${wappid}") {
    fileset (dir: "${webcss}/${wappid}") {
      include (name: '**/*.css')
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompileSCSS(wappid) {
  ant.copy (todir: "${webcss}/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/styles", erroronmissingdir: false){
      include (name: '**/*.scss')
    }
  }
  ant.apply (executable: 'sass', parallel: false) {
    fileset (dir: "${webcss}/${wappid}") {
      include (name: '**/*.scss')
    }
    arg (value: '--sourcemap=none')
    srcfile ()
    chainedmapper() {
      mapper (type: 'glob', from: '*.scss', to: '*.css')
      globmapper (from: '*', to: "${webcss}/${wappid}/*")
    }
    targetfile ()
  }
  ant.copy (todir: "${webcss}/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/styles", erroronmissingdir: false) {
      include (name: '**/*.css')
    }
  }
  ant.mkdir (dir: "${basedir}/public/styles/${wappid}")
  ant.copy (todir: "${basedir}/public/styles/${wappid}") {
    fileset (dir: "${webcss}/${wappid}") {
      include (name: '**/*.css')
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompileMedia(wappid) {
  ant.mkdir (dir: "${basedir}/public/ig/res/${wappid}")
  ant.copy (todir: "${basedir}/public/ig/res/${wappid}") {
    fileset (dir: "${webDir}/${wappid}/res/sd") {
      include (name: '**/*')
    }
    fileset (dir: "${webDir}/${wappid}/res") {
      include (name: 'sfx/**/*')
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompileInfo(wappid) {
  switch (wappid) {
    case "cocos2d":
    break
    case "main":
    break
    default:
      ant.mkdir (dir: "${basedir}/public/ig/info/${wappid}")
      ant.copy (todir: "${basedir}/public/ig/info/${wappid}") {
        fileset (dir: "${webDir}/${wappid}/info") {
          include (name: '**/*')
        }
      }
    break
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doCompilePages(wappid) {

  if ("main" == wappid || "cocos2d" == wappid) {
    ant.copy (todir: "${basedir}/public/pages/${wappid}") {
      fileset (dir: "${webDir}/${wappid}/pages") {
        include (name: '**/*')
      }
    }
    return;
  }

  doJiggleTheIndexFile(wappid, "${basedir}/public/pages/${wappid}", false)
}

//////////////////////////////////////////////////////////////////////////////
//
def doJiggleTheIndexFile(wappid,des,cocos) {
  ant.copy (file: "${srcDir}/resources/index.html", todir: "${des}")
  final json= new JsonParser().parse(FileUtils.readFileToString(
      new File("${webDir}/${wappid}/info/game.json"),"utf-8"))
  def html= FileUtils.readFileToString(new File("${des}/index.html"), "utf-8")
  html= StringUtils.replace(html, "@@DESCRIPTION@@", json.get("description").getAsString())
  html= StringUtils.replace(html, "@@KEYWORDS@@", json.get("keywords").getAsString())
  html= StringUtils.replace(html, "@@TITLE@@", json.get("name").getAsString())
  html= StringUtils.replace(html, "@@LAYOUT@@", json.get("layout").getAsString())
  html= StringUtils.replace(html, "@@HEIGHT@@", json.get("height").getAsString())
  html= StringUtils.replace(html, "@@WIDTH@@", json.get("width").getAsString())
  html= StringUtils.replace(html, "@@UUID@@", json.get("uuid").getAsString())

  def bdir= "/public/ig/lib/game/${wappid}/"
  def ccdir= "/public/extlibs/"
  def almond= "<script src=\"/public/vendors/almond/almond.js\"></script>"
  def cfg= ""

  if (cocos || "${pmode}" == "release") {
    ccdir= "frameworks/"
    bdir= ""
    almond=""
    cfg= FileUtils.readFileToString(new File("${srcDir}/resources/cocos2d.js"), "utf-8")
  } else {
    cfg= FileUtils.readFileToString(new File("${webDir}/${wappid}/src/ccconfig.js"), "utf-8")
  }

  html= StringUtils.replace(html, "@@AMDREF@@", almond)
  html= StringUtils.replace(html, "@@BOOTDIR@@", bdir)
  html= StringUtils.replace(html, "@@CCDIR@@", ccdir)
  html= StringUtils.replace(html, "@@CCCONFIG@@", cfg)

  FileUtils.writeStringToFile(new File("${des}/index.html"), html, "utf-8")
}

//////////////////////////////////////////////////////////////////////////////
//
def doFinzApp(wappid) {
  def des= "${basedir}/public/ig/lib/game/${wappid}"
  if ("${pmode}" == "release") {
  } else {
    ant.copy (todir: "${des}", file: "${srcDir}/resources/project.json")
    ant.copy (todir: "${des}", file: "${srcDir}/resources/main.js")
  }

}

//////////////////////////////////////////////////////////////////////////////
//
def doYuiCSS() {
  ant.apply (executable: 'java', parallel: false) {
    fileset (dir: "${basedir}/public/styles") {
      exclude (name: '**/*.min.css')
      include (name: '**/*.css')
    }
    arg (line: '-jar')
    arg (path: "${skaroHome}/lib/yuicompressor-2.4.8.jar")
    srcfile ()
    arg (line: '-o')
    chainedmapper () {
      mapper (type: 'glob', from: '*.css', to: '*.min.css')
      globmapper (from: '*', to: "${basedir}/public/styles/*")
    }
    targetfile ()
  }
}

//////////////////////////////////////////////////////////////////////////////
//
def doYuiJS() {
  ant.apply (executable: 'java', parallel: false) {
    fileset (dir: "${basedir}/public/scripts") {
      exclude (name: '**/*.min.js')
      include (name: '**/*.js')
    }
    arg (line: '-jar')
    arg (path: "${skaroHome}/lib/yuicompressor-2.4.8.jar")
    srcfile ()
    arg (line: '-o')
    chainedmapper () {
      mapper (type: 'glob', from: '*.js', to: '*.min.js')
      globmapper (from: '*', to: "${basedir}/public/scripts/*")
    }
    targetfile ()
  }
}

//////////////////////////////////////////////////////////////////////////////
//
  /*
       public TARGETS
       */

target (game: '') {
  property( name: 'pmode' , value: 'release')
  input(message:'Enter game: ', addproperty: 'gamename')
  new File("${webDir}").eachDir { f ->
    if (f.getName() == "${gamename}") {
      doBuildOneWebApp(f);
    }
  }
}

target (fast: '') {
  property( name: 'pmode' , value: 'release')
  //depends (buildr)
  doBuildWebApps()
  doYuiCSS()
  doYuiJS()
  doFinzBuild()
}

target (release: '') {
  property( name: 'pmode' , value: 'release')
  depends (buildr)
  doYuiCSS()
  doYuiJS()
  doFinzBuild()
}

target (devmode: '') {
  property( name: 'pmode' , value: 'dev')
  depends (buildr)
  doFinzBuild()
}

target (test: '') {
  depends(testBuild)
}

target (newapp: '') {
  ant.input (message: "Enter app-name: ", addproperty: 'appid')
  println "Creating new game: ${appid}"
  ant.mkdir (dir: "${webDir}/${appid}")
  [ "src/nodes", "src/s",
   "src/i18n", "src/p", "res/sfx"].each { s ->
    ant.mkdir (dir: "${webDir}/${appid}/${s}")
  }
  ["hdr", "hds", "sd"].each { s ->
    ant.mkdir (dir: "${webDir}/${appid}/res/${s}/pics")
    ant.mkdir (dir: "${webDir}/${appid}/res/${s}/fon")
  }
  ["info" , "pages" , "styles"].each { s ->
    ant.mkdir (dir: "${webDir}/${appid}/${s}")
  }
  ant.copy (file: "${srcDir}/resources/game.json", todir: "${webDir}/${appid}/info")
  ant.copy (file: "${srcDir}/resources/game.mf", todir: "${webDir}/${appid}/info")
  final appkey= UUID.randomUUID()
  tstamp () {
    format (property: "pubtime", pattern: "yyyy-MM-dd")
  }
  ant.replace (file: "${webDir}/${appid}/info/game.mf", token: "@@PUBDATE@@", value: "${pubtime}")
  ant.replace (file: "${webDir}/${appid}/info/game.mf", token: "@@APPID@@", value: "${appid}")
  ant.replace (file: "${webDir}/${appid}/info/game.json", token: "@@UUID@@", value: "${appkey}")
  ["game.js", "splash.js", "mmenu.js", "hud.js","config.js","protos.js"].each { s ->
    ant.copy (file: "${srcDir}/resources/${s}", todir: "${webDir}/${appid}/src/p")
  }
  ant.copy (file: "${srcDir}/resources/gnodes.js", todir: "${webDir}/${appid}/src/nodes")
  ant.copy (file: "${srcDir}/resources/cobjs.js", todir: "${webDir}/${appid}/src/nodes")
  ["supervisor.js", "factory.js", "motion.js",
   "resolution.js", "utils.js", "sysobjs.js"].each { s ->
    ant.copy (file: "${srcDir}/resources/${s}", todir: "${webDir}/${appid}/src/s")
  }

  ant.replace (file: "${webDir}/${appid}/src/p/config.js", token: "@@UUID@@", value: "${appkey}")
  ant.copy (file: "${srcDir}/resources/l10n.js", tofile: "${webDir}/${appid}/src/i18n/l10n.js")
  ant.copy (file: "${srcDir}/resources/ccconfig.js", todir: "${webDir}/${appid}/src")
  ant.copy (file: "${srcDir}/resources/proj.json", tofile: "${webDir}/${appid}/src/project.json")

  ant.replace (file: "${webDir}/${appid}/src/project.json", token: "@@APPID@@", value: "${appid}")
  ant.replace (file: "${webDir}/${appid}/src/ccconfig.js", token: "@@APPID@@", value: "${appid}")

  //cocos_new("${appid}");
}

def cocos_new(appid) {
  ant.mkdir (dir: "${basedir}/cocos")
  ant.exec (executable: 'cocos') {
    arg (value: 'new')
    arg (value: '-l')
    arg (value: 'js')
    arg (value: '-t')
    arg (value: 'runtime')
    arg (value: '--ios-bundleid')
    arg (value: "com.zotohlab.p.${appid}")
    arg (value: '-d')
    arg (value: "${basedir}/cocos")
    arg (value: "${appid}")
  }
}

target (deployapp: '') {
  ant.input (message: "Enter app-name: ", addproperty: 'appid')
  final vendors= "${basedir}/public/vendors"
  final despath= "${basedir}/cocos/${appid}"
  final srcpath= "${webDir}/${appid}"
  final des= new File("${despath}")
  final src= new File("${srcpath}")
  final dd2 = new File(des, "res")
  final dd1 = new File(des, "src")
  final dd2path= dd2.getCanonicalPath()
  final dd1path= dd1.getCanonicalPath()

  if ( ! src.exists()) {
    println "Invalid game: ${appid}"
    return
  }
  if ( ! des.exists()) {
    cocos_new("${appid}")
  }

  println "Deploying game: ${appid}"
  dd2.deleteDir()
  dd1.deleteDir()
  dd2.mkdirs()
  dd1.mkdirs()
  // resources
  ['hdr','hds','sd','sfx'].each { s ->
    ant.copy (todir: dd2path+"/${s}/cocos2d") {
      fileset (dir: "${webDir}/cocos2d/res/${s}", erroronmissingdir: false)
    }
    ant.copy (todir: dd2path+"/${s}/${appid}") {
      fileset (dir: "${srcpath}/res/${s}", erroronmissingdir: false)
    }
  }
  // js code
  ant.copy (todir: "${dd1path}/zotohlab") {
    fileset (dir: "${webDir}/cocos2d/src/zotohlab")
  }
  ant.copy (todir: "${dd1path}/${appid}") {
    fileset (dir: "${srcpath}/src")
  }
  ant.copy (todir: "${dd1path}/helpers") {
    fileset (dir: "${vendors}/helpers") {
      include (name: 'dbg.js')
    }
  }
  ['almond','js-signals','ash-js','rxjs','ramda','cherimoia', 'l10njs', 'cookies','mustache'].each { d ->
    ant.copy (todir: "${dd1path}/${d}") {
      fileset (dir: "${vendors}/${d}")
    }
  }
  // boot stuff
  ant.copy (todir: "${despath}", overwrite: true) {
    fileset (dir: "${srcDir}/resources") {
      include (name: 'project.json')
      include (name: 'main.js')
      include (name: 'index.html')
    }
  }
  final j1= new JsonParser().parse(FileUtils.readFileToString(
    new File("${srcDir}/resources/project.json"),"utf-8"))
  final j2= new JsonParser().parse(FileUtils.readFileToString(
    new File("${srcpath}/src/project.json"),"utf-8"))
  j1.getAsJsonArray('jsList').addAll( j2.getAsJsonArray('jsList'))
  FileUtils.writeStringToFile(new File("${despath}/project.json"),
  new GsonBuilder().setPrettyPrinting().create().toJson(j1), "utf-8")
  doJiggleTheIndexFile(appid,"${basedir}/cocos/${appid}",true)

}

//////////////////////////////////////////////////////////////////////////////
//
target (android: '') {
input (message: "Enter app-name: ", addproperty: 'appid')
final despath= "${basedir}/cocos/${appid}"
final des= new File("${despath}")
if ( ! des.exists()) {
  println "Invalid game: ${appid}"
} else {
  ant.exec (executable: 'cocos') {
    arg (value: 'deploy')
    arg (value: '-s')
    arg (value: "${despath}")
    arg (value: '-p')
    arg (value: 'android')
    arg (value: '-m')
    arg (value: 'release')
  }
  }
}


//////////////////////////////////////////////////////////////////////////////
// EOF
