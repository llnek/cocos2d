// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function () { "use strict";

  function configViewAndPaths(isLandscape, wd, ht, cfgFunc, paths) {
    var searchPaths = jsb.fileUtils.getSearchPaths(),
    pcy = cc.ResolutionPolicy.SHOW_ALL,
    eglv = cc.view,
    n,
    fz= eglv.getFrameSize(),
    dim = cfgFunc(isLandscape, fz);

    if (fz.width >= wd && fz.height >= ht) {
      eglv.setDesignResolutionSize(dim[0], dim[1], pcy);
      for (n=0; n < paths.length; ++n) {
        searchPaths.push(paths[n]);
      }
      return searchPaths;
    } else {
      return null;
    }
  }

  function maybeInitResources(isLandscape) {
    var rc;

    //ipad retina
    rc = configViewAndPaths(isLandscape, 1536,1536,
         function(isL, frameSize) {
           return isL ? [2048, 1536] : [1536, 1048];
         },
         ['res/hdr', 'src']);

    if (!rc) {
      // iphone hd & above or android high res
      rc = configViewAndPaths(isLandscape, 640, 640,
           function (isL, frameSize) {
            if (frameSize.width >= 1136 || frameSize.height >= 1136) {
              return isL ? [1136,640] : [640,1136];
            } else {
              return isL ? [960,640] : [640,960];
            }
           },
           ['res/hds', 'src']);
    }

    if (!rc) {
      // default iphone 4, lowest common denominator
      rc = configViewAndPaths(isLandscape, 0, 0,
           function(isL, frameSize) {
             return isL ? [480, 320] : [320, 480];
           },
           ['res/sd', 'src']);
    }

    return rc;
  }


  function initDesignResolution() {
    var pcy = cc.ResolutionPolicy.SHOW_ALL,
    isLandscape= false,
    eglv= cc.view;

    eglv.adjustViewPort(true);

    if (cc.sys.isNative) {
      var paths= maybeInitResources(isLandscape);
      if (!!paths) {
        jsb.fileUtils.setSearchPaths(paths);
      }
    } else {

      if (isLandscape) {
        eglv.setDesignResolutionSize(1280, 720, pcy);
      } else {
        eglv.setDesignResolutionSize(720, 1280, pcy);
      }

      eglv.resizeWithBrowserSize(true);
    }

  }

  cc.game.onStart= function() {
    initDesignResolution();
    supplicate('zotohlab/p/boot');
  };
  cc.game.run();

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

