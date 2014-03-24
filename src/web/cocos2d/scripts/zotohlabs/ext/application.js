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

(function(undef) { "use strict"; var global= this, _ = global._,
asterix= global.ZotohLabs.Asterix,
doc= global.document,
sh= asterix.Shell,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// main application.
//////////////////////////////////////////////////////////////////////////////

asterix.Cocos2dApp = cc.Application.extend({

  ctor: function (scene) {
    cc.COCOS2D_DEBUG = sh.xcfg.game.debugLevel;
    this.startScene= scene;
    this._super();
    cc.initDebugSetting();
    cc.setup(sh.xcfg.game.tag);
    cc.AppController.shareAppController().didFinishLaunchingWithOptions();
  },

  applicationDidFinishLaunching: function () {

    if (cc.RenderDoesnotSupport()) {
      alert("Browser doesn't support WebGL");
      return false;
    }

    var director = cc.Director.getInstance(),
    eglv= cc.EGLView.getInstance(),
    me=this,
    sz = sh.xcfg.game.size;

    eglv.adjustViewPort(true);
    eglv.setDesignResolutionSize(sz.width, sz.height, cc.RESOLUTION_POLICY.SHOW_ALL);
    eglv.resizeWithBrowserSize(true);

    director.setAnimationInterval(1 / sh.xcfg.game.frameRate);
    if (sh.xcfg.game.debug) {
      director.setDisplayStats(sh.xcfg.game.showFPS);
    }

    asterix.XLoader.preload( this.pvGatherPreloads(), function () {
      sh.xcfg.runOnce();
      director.replaceScene( sh.protos[ this.startScene ].create() );
    }, this);

    return true;
  },

  pvGatherPreloads: function() {
    var assets= sh.xcfg.assets,
    me=this,
    p,

    rc= [
    _.map(assets.sprites, function(v,k) { return me.pvLoadSprite(k,v); }),
    _.map(assets.images, function(v,k) { return me.pvLoadImage(k,v); }),
    _.map(assets.sounds, function(v,k) { return me.pvLoadSound(k,v); }),
    _.reduce(assets.fonts, function(memo, v,k) {
      // value is array of [ path, image , xml ]
      p= sh.sanitizeUrl(v[0]);
      return memo.concat([ p + v[1], p + v[2] ]);
    }, []),
    _.reduce(assets.atlases, function(memo, v,k) {
      return memo.concat( me.pvLoadAtlas(k,v));
    }, []),
    _.map(assets.tiles, function(v,k) {
      return me.pvLoadTile(k,v);
    }),
    sh.xcfg.game.preloadLevels ? this.pvLoadLevels() : []
    ];

    return _.reduce(_.flatten(rc), function(memo,v) {
      loggr.info('Loading ' + v);
      memo.push( { src: v } );
      return memo;
    }, []);
  },

  pvLoadLevels: function() {
    var rc=[],
    arr,
    z,
    me=this;
    _.each(sh.xcfg.levels, function(v,k) {
      _.each(v, function(obj,n){
        rc = rc.concat( _.reduce(obj, function(memo, item, x) {
          z=  k + '.' + n + '.' + x;
          arr=undef;
          switch (n) {
            case 'sprites':
              memo.push( me.pvLoadSprite( z,item));
              sh.xcfg.assets.sprites[z] = item;
            break;
            case 'images':
              memo.push( me.pvLoadImage( z, item));
              sh.xcfg.assets.images[z] = item;
            break;
            case 'tiles':
              memo.push( me.pvLoadTile( z, item));
              sh.xcfg.assets.tiles[z] = item;
            break;
          }
          return memo;
        },[]));
      });
    });
    return rc;
  },

  pvLoadSprite: function(k, v) {
    return sh.sanitizeUrl(v[0]);
  },

  pvLoadImage: function(k,v) {
    return sh.sanitizeUrl(v);
  },

  pvLoadSound: function(k,v) {
    return sh.sanitizeUrl( v + '.' + sh.xcfg.game.sfx );
  },

  pvLoadAtlas: function(k,v) {
    return [ sh.sanitizeUrl( v + '.plist'),
             sh.sanitizeUrl( v + '.png') ];
  },

  pvLoadTile: function(k,v) {
    return sh.sanitizeUrl(v);
  }

});

sh.xcfg.newApplication().run();

}).call(this);

