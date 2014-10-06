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

//////////////////////////////////////////////////////////////////////////////
//
function nativeInit() {
  if (cc.sys.isNative) {
      var searchPaths = jsb.fileUtils.getSearchPaths();
      searchPaths.push('script');
      if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) {
          searchPaths.push("res");
          searchPaths.push("src");
      }
      jsb.fileUtils.setSearchPaths(searchPaths);
  }
}

function pvLoadSound(sh, xcfg, k,v) { return sh.sanitizeUrl( v + '.' + xcfg.game.sfx ); }
function pvLoadSprite(sh, xcfg, k, v) { return sh.sanitizeUrl(v[0]); }
function pvLoadImage(sh, xcfg, k,v) { return sh.sanitizeUrl(v); }
function pvLoadTile(sh, xcfg, k,v) { return sh.sanitizeUrl(v); }
function pvLoadAtlas(sh, xcfg, k,v) {
  return [sh.sanitizeUrl( v + '.plist'),
          sh.sanitizeUrl( v + '.png') ];
}

//////////////////////////////////////////////////////////////////////////////
//
function pvLoadLevels(sjs, sh, xcfg) {
  var R = sjs.ramda,
  rc = [],
  f1= function(k) {
    return function(arr) {
      var a = R.reduce( function(memo, item) {
        var z= k + '.' + arr[0] + '.' + item[0];
        switch (arr[0]) {
          case 'sprites':
            memo.push( pvLoadSprite( sh, xcfg, z, item[1]));
            xcfg.assets.sprites[z] = item[1];
          break;
          case 'images':
            memo.push( pvLoadImage( sh, xcfg, z, item[1]));
            xcfg.assets.images[z] = item[1];
          break;
          case 'tiles':
            memo.push( pvLoadTile(sh, xcfg,  z, item[1]));
            xcfg.assets.tiles[z] = item[1];
          break;
        }
        return memo;
      }, [], R.toPairs(arr[1]));
      rc = rc.concat(a);
    };
  };

  R.forEach(function (a) {
    R.forEach(f1(a[0]), R.toPairs(a[1]));
  },
  R.toPairs(xcfg.levels));

  return rc;
}

/////////////////////////////////////////////////////////////////////////////
//
function pvGatherPreloads(sjs, sh, xcfg) {
  var assets= xcfg.assets,
  R= sjs.ramda,
  p,
  rc= [
    R.map(function(v,k) { return pvLoadSprite(sh,xcfg,k,v); }, assets.sprites),
    R.map(function(v,k) { return pvLoadImage(sh,xcfg,k,v); }, assets.images),
    R.map(function(v,k) { return pvLoadSound(sh,xcfg,k,v); }, assets.sounds),

    R.reduce(function(memo, v,k) {
      // value is array of [ path, image , xml ]
      p= sh.sanitizeUrl(v[0]);
      return memo.concat([p+'/'+v[1], p+'/'+v[2]]);
    }, [], assets.fonts),

    R.reduce(function(memo, v,k) {
      return memo.concat( pvLoadAtlas(sh, xcfg, k,v));
    }, [], assets.atlases),

    R.map(function(v,k) {
      return pvLoadTile(sh, xcfg, k,v);
    }, assets.tiles),

    xcfg.game.preloadLevels ? pvLoadLevels(sjs, sh, xcfg) : []
  ];

  return R.reduce(function(memo,v) {
    sjs.loggr.info('Loading ' + v);
    memo.push( v );
    return memo;
  }, [], R.flatten(rc));
}

//////////////////////////////////////////////////////////////////////////////
//
function preLaunchApp(sjs, sh, xcfg, ldr,  ss1) {
  var sz = xcfg.game.size,
  dirc = cc.director,
  eglv = cc.view;

  eglv.setDesignResolutionSize(sz.width, sz.height,
                               cc.ResolutionPolicy.SHOW_ALL);
  eglv.resizeWithBrowserSize(true);
  eglv.adjustViewPort(true);

  cc.director.setProjection(cc.Director.PROJECTION_2D);

  //dirc.setAnimationInterval(1 / sh.xcfg.game.frameRate);
  if (xcfg.game.debug) {
    dirc.setDisplayStats(xcfg.game.showFPS);
  }

  ldr.preload(pvGatherPreloads(sjs, sh,xcfg), function () {
    xcfg.runOnce();
    dirc.runScene( sh.protos[ss1].create() );
  });

}

//////////////////////////////////////////////////////////////////////////////
//
function moduleFactory(sjs, asterix, xcfg, xloader) { "use strict";

  cc.game.onStart= function() {
    var STARTSCREEN= 'StartScreen',
    sh = asterix;
    nativeInit();

    sjs.loggr.info("About to create Cocos2D HTML5 Game");
    preLaunchApp(sjs, sh, xcfg, xloader, STARTSCREEN);
    sh.l10nInit(),
    sh.sfxInit();

    //sjs.merge(me.xcfg.game, global.document.ccConfig);
    sjs.loggr.debug(JSON.stringify(xcfg.game));
    sjs.loggr.info("Registered game start state - " + STARTSCREEN);
    sjs.loggr.info("Loaded and running. OK");
  };

  cc.game.run();
}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("cherimoia/games/main",
            ['cherimoia/skarojs',
             'cherimoia/zlab/asterix',
             'cherimoia/zlab/asterix/xcfg',
             'cherimoia/zlab/asterix/xloader',
             'cherimoia/games/config',
             'cherimoia/games/l10n',
             'cherimoia/games/protodefs'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

  require('cherimoia/games/main');

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

