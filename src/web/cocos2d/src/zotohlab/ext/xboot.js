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

    //////////////////////////////////////////////////////////////////////////////
    //

    function maybeInitResources() {
      var searchPaths = jsb.fileUtils.getSearchPaths(),
      fsz= cc.view.getFrameSize(),
      landscape,
      ps;

      sjs.loggr.info("Sorting out resource search paths...");

      // need to prefix "assets" for andriod
      if (fsz.width >= 1536 && fsz.height >= 1536) {
      //ipad retina
        //lanscape ? [2048, 1536] : [1536, 1048]
        ps = ['assets/res/hdr', 'res/hdr'];
      }
      else
      if (fsz.width >= 640 && fsz.height >= 640) {
      // iphone hd & above or android high res
        if (fsz.width >= 1136 ||
            fsz.height >= 1136) {
          //landscape ? [1136,640] : [640,1136]
        } else {
          //landscape ? [960,640] : [640,960]
        }
        ps = ['assets/res/hds', 'res/hds'];
      }
      else {
      // default iphone 4, lowest common denominator
        //landscape ? [480, 320] : [320, 480]
        ps = ['assets/res/sd', 'res/sd'];
      }

      ps= ps.concat(['assets/src', 'src']);

      for (var n=0; n < ps.length; ++n) {
        searchPaths.push(ps[n]);
      }

      sjs.loggr.info("Resource search paths: " + searchPaths);
      return searchPaths;
    }

    //////////////////////////////////////////////////////////////////////////////
    //

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

    var MyLoaderScene = cc.Scene.extend({

      init: function() {
        return true;
      },

      _startLoading: function () {
        var res, self = this;
        self.unschedule(self._startLoading);
        res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
            }, function () {
                if (self.cb)
                    self.cb();
            });
      },

      initWithResources: function (resources, cb) {
        this.resources = resources || [];
        this.cb = cb;
      },

      onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
      },

      onExit: function () {
        cc.Node.prototype.onExit.call(this);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    function preLaunchApp(sjs, sh, xcfg, ldr,  ss1) {
      var fz= cc.view.getFrameSize(),
      sz = xcfg.game.size,
      pfx,
      rs, pcy;

      if (cc.sys.isNative) {
        pcy = cc.ResolutionPolicy.NO_BORDER;
      } else {
        pcy = cc.ResolutionPolicy.SHOW_ALL;
      }

      cc.view.setDesignResolutionSize(sz.width, sz.height, pcy);
      rs= cc.view.getDesignResolutionSize();
      sjs.loggr.info('DesignResolution, = [' +
                     rs.width + ", " + rs.height + "]");

      cc.director.setProjection(cc.Director.PROJECTION_2D);
      if (cc.sys.isNative) {
        pfx= "";
      } else {
        cc.view.resizeWithBrowserSize(true);
        cc.view.adjustViewPort(true);
        pfx = "/public/ig/res/";
      }

      //cc.director.setAnimationInterval(1 / sh.xcfg.game.frameRate);
      if (xcfg.game.debug) {
        cc.director.setDisplayStats(xcfg.game.showFPS);
      }

      rs= [
        pfx + 'cocos2d/pics/preloader_bar.png',
        pfx + 'cocos2d/pics/ZotohLab.png'
      ];
      // hack to suppress the showing of cocos2d's logo
      cc.loaderScene = new MyLoaderScene();
      cc.loaderScene.init();
      cc.loaderScene.initWithResources(rs,
      function() {
        ldr.preload(pvGatherPreloads(sjs, sh, xcfg), function () {
          xcfg.runOnce();
          cc.director.runScene( sh.protos[ss1].create() );
        });
      });
      cc.director.runScene(cc.loaderScene);
    }

    sjs.loggr.info("About to create Cocos2D HTML5 Game");
    if (cc.sys.isNative) {
      var paths= maybeInitResources();
      if (!!paths) {
        jsb.fileUtils.setSearchPaths(paths);
      }
    }

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

