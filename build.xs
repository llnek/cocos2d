skaroHome=/wdrive/myspace/skaro/a.out/0/pack
bldDir=a.out
prj=0
wjs=webscripts
wcs=webstyles

cljBuildDir=${basedir}/${bldDir}/clojure.org
buildDir=${basedir}/${bldDir}/${prj}

reportDir=${buildDir}/reports
podDir=${basedir}/POD-INF

ivyRoot=${skaroHome}/.ivyroot
ivyLCacheDir=${ivyRoot}/cache
ivyLRepoDir=${ivyRoot}/repos


buildVersion=0.9.0
buildDebug=true
buildType=web

ivyLibDir=${basedir}/lib
libDir=${podDir}/lib

testDir=${basedir}/src/test
srcDir=${basedir}/src/main
webDir=${basedir}/src/web

outTestDir=${podDir}/test-classes
outJarDir=${podDir}/classes

#jslang=typescript
#jslang=clojurescript
#jslang=coffee
jslang=js

#csslang=less
csslang=scss








