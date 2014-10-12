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

define("zotohlab/p/boot", ['cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/xcfg',
                           'zotohlab/asx/xloader',
                           'zotohlab/p/config',
                           'zotohlab/p/l10n',
                           'zotohlab/p/protodefs'],

  function (sjs, sh, xcfg, loader) { "use strict";

    var ss1= 'StartScreen',
    R = sjs.ramda,
    undef;


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
      var rc = [],
      f1= function(k) {
        return function(v,n) {
          var a = sjs.reduceObj( function(memo, item, key) {
            var z= k + '.' + n + '.' + key;
            switch (n) {
              case 'sprites':
                memo.push( pvLoadSprite( sh, xcfg, z, item));
                xcfg.assets.sprites[z] = item;
              break;
              case 'images':
                memo.push( pvLoadImage( sh, xcfg, z, item));
                xcfg.assets.images[z] = item;
              break;
              case 'tiles':
                memo.push( pvLoadTile(sh, xcfg,  z, item));
                xcfg.assets.tiles[z] = item;
              break;
            }
            return memo;
          }, [], v);
          rc = rc.concat(a);
        };
      };

      sjs.eachObj(function(v,k) {
        sjs.eachObj(f1(k), v);
      },
      xcfg.levels);

      return rc;
    }

    /////////////////////////////////////////////////////////////////////////////
    //
    function pvGatherPreloads(sjs, sh, xcfg) {
      var assets= xcfg.assets,
      p,
      rc= [

        R.values(R.mapObj.idx(function(v,k) {
          return pvLoadSprite(sh,xcfg,k,v);
        }, assets.sprites)),

        R.values(R.mapObj.idx(function(v,k) {
          return pvLoadImage(sh,xcfg,k,v);
        }, assets.images)),

        R.values(R.mapObj.idx(function(v,k) {
          return pvLoadSound(sh,xcfg,k,v);
        }, assets.sounds)),

        sjs.reduceObj(function(memo, v,k) {
          // value is array of [ path, image , xml ]
          p= sh.sanitizeUrl(v[0]);
          return memo.concat([p+'/'+v[1], p+'/'+v[2]]);
        }, [], assets.fonts),

        sjs.reduceObj(function(memo, v,k) {
          return memo.concat( pvLoadAtlas(sh, xcfg, k,v));
        }, [], assets.atlases),

        R.values(R.mapObj.idx(function(v,k) {
          return pvLoadTile(sh, xcfg, k,v);
        }, assets.tiles)),

        xcfg.game.preloadLevels ? pvLoadLevels(sjs, sh, xcfg) : []
      ];

      return R.reduce(function(memo,v) {
        sjs.loggr.info('Loading ' + v);
        memo.push( v );
        return memo;
      }, [], R.flatten(rc));
    }

    var MyLoaderScene = cc.LoaderScene.extend({

      init: function() {

        if(cc._loaderImage){
            //loading logo
            cc.loader.loadImg(cc._loaderImage,
                              {isCrossOrigin : false },
                              function(err, img){
            });
        }
        return true;
      },
      _startLoading: function () {
          var self = this;
          self.unschedule(self._startLoading);
          var res = self.resources;
          cc.loader.load(res,
              function (result, count, loadedCount) {
              }, function () {
                  if (self.cb)
                      self.cb();
              });
      },

      onExit: function () {
          cc.Node.prototype.onExit.call(this);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    function preLaunchApp(sjs, sh, xcfg, ldr,  ss1) {
      var sz = xcfg.game.size,
      dirc = cc.director,
      eglv = cc.view;

      if (! cc.sys.isNative) {
        eglv.setDesignResolutionSize(sz.width, sz.height,
                                     cc.ResolutionPolicy.SHOW_ALL);
      } else {
        // let size be flexible depends on device.
      }

      cc.director.setProjection(cc.Director.PROJECTION_2D);

      //dirc.setAnimationInterval(1 / sh.xcfg.game.frameRate);
      if (xcfg.game.debug) {
        dirc.setDisplayStats(xcfg.game.showFPS);
      }

      var pfx; if (cc.sys.isNative) { pfx= 'res';  } else { pfx = "/public/ig/res"; }
      var rc= [
        pfx + '/cocos2d/pics/preloader_bar.png',
        pfx + '/cocos2d/pics/ZotohLab.png'
      ];
      // hack to suppress the showing of cocos2d's logo
      cc.loaderScene = new MyLoaderScene();
      cc.loaderScene.init();
      cc.LoaderScene.preload(rc, function() {
        ldr.preload(pvGatherPreloads(sjs, sh, xcfg), function () {
          xcfg.runOnce();
          dirc.runScene( sh.protos[ss1].create() );
        });
      });

    }

    sjs.loggr.info("About to create Cocos2D HTML5 Game");
    preLaunchApp(sjs, sh, xcfg, loader, ss1);

    sh.l10nInit(),
    sh.sfxInit();

    //sjs.merge(me.xcfg.game, global.document.ccConfig);
    sjs.loggr.debug(JSON.stringify(xcfg.game));
    sjs.loggr.info("Registered game start state - " + ss1);
    sjs.loggr.info("Loaded and running. OK");

});

//////////////////////////////////////////////////////////////////////////////
//EOF

