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

(function(undef) { "use strict"; var global= this; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var doc= global.document;
var sh= asterix.Shell;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

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

    var director = cc.Director.getInstance();
    var eglv= cc.EGLView.getInstance();
    var me=this;
    var sz = sh.xcfg.game.size;

    eglv.adjustViewPort(true);
    eglv.setDesignResolutionSize(sz.width, sz.height, cc.RESOLUTION_POLICY.SHOW_ALL);
    eglv.resizeWithBrowserSize(true);

    director.setAnimationInterval(1 / sh.xcfg.game.frameRate);
    if (sh.xcfg.game.debug) {
      director.setDisplayStats(sh.xcfg.game.showFPS);
    }

    asterix.XLoader.preload( this.pvGatherPreloads(), function () {
      director.replaceScene( sh.protos[ this.startScene ].create() );
    }, this);

    return true;
  },


  pvGatherPreloads: function() {
    var p, me=this;
    var a1= _.map(sh.xcfg.assets.sprites, function(v,k) { return me.pvLoadSprite(k,v); });
    var a2= _.map(sh.xcfg.assets.images, function(v,k) { return me.pvLoadImage(k,v); });
    var a3= _.map(sh.xcfg.assets.sounds, function(v,k) { return me.pvLoadSound(k,v); });
    var a4= _.reduce(sh.xcfg.assets.fonts, function(memo, v,k) {
      // value is array of [ path, image , xml ]
      p= sh.sanitizeUrl(v[0]);
      return memo.concat([ p + v[1], p + v[2] ]);
    }, []);
    var a5= _.map(sh.xcfg.assets.tiles, function(v,k) {
      return me.pvLoadTile(k,v);
    });
    var a6 = sh.xcfg.game.preloadLevels ? this.pvLoadLevels() : [];
    var rc= [].concat(a1).concat(a2).concat(a3).concat(a4).concat(a5).concat(a6);
    var res=  _.reduce(rc, function(memo,v) {
      loggr.info('Loading ' + v);
      memo.push( { src: v } );
      return memo;
    }, []);
    return res;
  },

  pvLoadLevels: function() {
    var rc=[], arr, z, me=this;
    _.each(sh.xcfg.levels, function(v,k) {
      _.each(v,function(obj,n){
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

  pvLoadTile: function(k,v) {
    return sh.sanitizeUrl(v);
  }

});

sh.xcfg.newApplication().run();

}).call(this);


