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

cc.game.onStart= function() { "use strict"; var global=window, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
STARTSCREEN= 'StartScreen',
sh = asterix,
sjs = global.SkaroJS;

if (cc.sys.isNative) {
    var searchPaths = jsb.fileUtils.getSearchPaths();
    searchPaths.push('script');
    if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) {
        searchPaths.push("res");
        searchPaths.push("src");
    }
    jsb.fileUtils.setSearchPaths(searchPaths);
}
//////////////////////////////////////////////////////////////////////////////
//
function preLaunchApp(ss1) {
  var sz = sh.xcfg.game.size,
  dirc = cc.director,
  eglv = cc.view;

  eglv.setDesignResolutionSize(sz.width, sz.height,
                               cc.ResolutionPolicy.SHOW_ALL);
  eglv.resizeWithBrowserSize(true);
  eglv.adjustViewPort(true);


  cc.director.setProjection(cc.Director.PROJECTION_2D);

  //dirc.setAnimationInterval(1 / sh.xcfg.game.frameRate);
  if (sh.xcfg.game.debug) {
    dirc.setDisplayStats(sh.xcfg.game.showFPS);
  }

  sh.XLoader.preload(pvGatherPreloads(), function () {
    sh.xcfg.runOnce();
    dirc.runScene( sh.protos[ss1].create() );
  });

}

//////////////////////////////////////////////////////////////////////////////
//
function pvGatherPreloads() {
  var assets= sh.xcfg.assets,
  p,
  rc= [
    _.map(assets.sprites, function(v,k) { return pvLoadSprite(k,v); }),
    _.map(assets.images, function(v,k) { return pvLoadImage(k,v); }),
    _.map(assets.sounds, function(v,k) { return pvLoadSound(k,v); }),

    _.reduce(assets.fonts, function(memo, v,k) {
      // value is array of [ path, image , xml ]
      p= sh.sanitizeUrl(v[0]);
      return memo.concat([p+'/'+v[1], p+'/'+v[2]]);
    }, []),

    _.reduce(assets.atlases, function(memo, v,k) {
      return memo.concat( pvLoadAtlas(k,v));
    }, []),

    _.map(assets.tiles, function(v,k) {
      return pvLoadTile(k,v);
    }),

    sh.xcfg.game.preloadLevels ? pvLoadLevels() : []
  ];

  return _.reduce(_.flatten(rc), function(memo,v) {
    sjs.loggr.info('Loading ' + v);
    memo.push( v );
    return memo;
  }, []);
}

function pvLoadLevels() {
  var rc = [],
  f1= function(k) {
    return function(obj,n) {
      var a = _.reduce(obj, function(memo, item, x) {
            var z= k + '.' + n + '.' + x;
            switch (n) {
              case 'sprites':
                memo.push( pvLoadSprite( z,item));
                sh.xcfg.assets.sprites[z] = item;
              break;
              case 'images':
                memo.push( pvLoadImage( z, item));
                sh.xcfg.assets.images[z] = item;
              break;
              case 'tiles':
                memo.push( pvLoadTile( z, item));
                sh.xcfg.assets.tiles[z] = item;
              break;
            }
            return memo;
      }, []);
      rc = rc.concat(a);
    };
  };

  _.each(sh.xcfg.levels, function(v,k) {
    _.each(v, f1(k));
  });

  return rc;
}

function pvLoadSprite(k, v) {
  return sh.sanitizeUrl(v[0]);
}

function pvLoadImage(k,v) {
  return sh.sanitizeUrl(v);
}

function pvLoadSound(k,v) {
  return sh.sanitizeUrl( v + '.' + sh.xcfg.game.sfx );
}

function pvLoadAtlas(k,v) {
  return [sh.sanitizeUrl( v + '.plist'),
          sh.sanitizeUrl( v + '.png') ];
}

function pvLoadTile(k,v) {
  return sh.sanitizeUrl(v);
}

//////////////////////////////////////////////////////////////////////////////
//
  cc.log("About to create Cocos2D HTML5 Game");
  preLaunchApp(STARTSCREEN);
  sh.l10nInit(),
  sh.sfxInit();
  //sjs.merge(me.xcfg.game, global.document.ccConfig);
  cc.log(JSON.stringify(sh.xcfg.game));
  cc.log("registered game start state - " + STARTSCREEN);
  cc.log("loaded and running. OK");
};
cc.game.run();





