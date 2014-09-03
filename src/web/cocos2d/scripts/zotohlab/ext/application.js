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
asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// main application.
//////////////////////////////////////////////////////////////////////////////

asterix.Cocos2dApp = SkaroJS.Class.xtends({

  // get resource directory (SD, HD or HDR)
  getResDir: function() {
    if (typeof this._resourceDir === "undefined") {
      var self = this,
        winSize = this.getWinSize(),
        maxDimension = Math.max(winSize.width, winSize.height),
        minDimension = Math.min(winSize.width, winSize.height),
        setResourceDir = function(dir, contentScaleFactor, scaleFactor){
          self._resourceDir = dir;
          self._contentScaleFactor = contentScaleFactor;
          self._scaleFactor = scaleFactor;
        };

      if (this.isHtml5()) {
        if (minDimension >= 1200 && this._pixelRatio > 1) {
          setResourceDir("res/hdr", 1, 2);
        } else if (minDimension >= 600) {
          setResourceDir("res/hd", 1, 1);
        } else {
          setResourceDir("res/sd", 1, .5);
        }
      } else {
        if (maxDimension > 1600) {
          setResourceDir("res/hdr", 1, 2);
        } else if (maxDimension >= 960) {
          setResourceDir("res/hd", 1, 1);
        } else {
          setResourceDir("res/sd", 1, .5);
        }
      }
    }

    return this._resourceDir;
  },

  isDesktop: function() {
    return this.isHtml5() ? false : (cc.sys.os === cc.sys.OS_WINDOWS ||
                                     cc.sys.os === cc.sys.OS_LINUX ||
                                     cc.sys.os === cc.sys.OS_OSX);
  },

  isNative: function() { return cc.sys.isNative; },
  isHtml5: function() { return ! this.isNative; },

  getFPS: function() {
    return this.isHtml5() ? 30 : 60;
  },

  scale: function(n) {
    return this.scaleRatio * n;
  },

  // Return a point relative to the center of the screen and scaled.
  centralize: function(x, y) {
    var ce = ccsx.center();
    return cc.p(ce.x + this.scale(x),
                ce.y + this.scale(y));
  },

  getLocale: function() {
    return cc.sys.language;
  },

  canToggleFullScreen: function() {
    return this.isHtml5() ?
      _.isObject(screenfull) && screenfull.enabled :
      this.isDesktop();
  },

  isFullScreen: function() {
    //TODO:
    return this.isHtml5() ?
      _.isObject(screenfull) && screenfull.isFullscreen :
      this._fullscreenEnabled;
  },

  toggleFullScreen: function(t) {
    if (this.canToggleFullScreen() &&
        this.isHtml5()) {
      var cv= document.getElementById("gameDiv"),
      wz= ccsx.screen();
      if (t) {
        this.setCanvasSize(cv, wz.width, wz.height);
        screenfull.request();
      }
      else {
        this.setCanvasSize(cv, this.origCanvas.width, this.origCanvas.height);
        screenfull.exit();
      }
    }
  },

  setCanvasSize: function(w, h, cv) {
    var allowHtmlRetina = false;
    this.pixelRatio = (allowHtmlRetina ? window.devicePixelRatio || 1 : 1);

    cv = cv || document.getElementById(cc.game.config[cc.game.CONFIG_KEY.id]);
    w = w || document.body.clientWidth; // or scrollWidth
    h = h || document.body.clientHeight;

    cv.height = h * this.pixelRatio;
    cv.width = w * this.pixelRatio;
    cv.style.height = h + "px";
    cv.style.width = w + "px";

    sjs.loggr.debug("Set #" + cv.getAttribute("id") + " pixel ratio " + this.pixelRatio +
      ", size " + cv.width + "x" + cv.height +
      ", style " + cv.style.width + " x " + cv.style.height +
      ", fullscreen " + this.isFullScreen() +
      ", parent " + cv.parentNode.getAttribute("id"));

    if (! sjs.echt(this.origCanvas)) {
      this.origCanvas = {width: w, height: h};
    }
  },

  loadSoundEnabled: function() {
    var ok = cc.sys.localStorage.getItem("soundEnabled");
    if (ok === null || ok === "") {
      this.enableSound(true);
    } else {
      this.soundEnabled = (ok === "true" || ok === true);
    }
  },

  enableSound: function(ok) {
    cc.sys.localStorage.setItem("soundEnabled", ok);
    this.soundEnabled = ok;
    var me= this;
    if (!ok) {
      cc.audioEngine.stopMusic();
      // check that the music stopped (Chrome bug)
      cc.director.getRunningScene().schedule(function() {
        if (!me.isSoundEnabled()) {
          cc.audioEngine.stopMusic();
        }
      }, 1, 15);
    }
  },

  isSoundEnabled: function() {
    return this.soundEnabled ? true : false;
  },

  ctor: function (scene) {
    //cc.COCOS2D_DEBUG = sh.xcfg.game.debugLevel;
    this.startScene= scene;
    this.applicationDidFinishLaunching();
  },

  applicationDidFinishLaunching: function () {

    var sz = sh.xcfg.game.size,
    dirc = cc.director,
    eglv = cc.view,
    me = this;

    eglv.setDesignResolutionSize(sz.width, sz.height,
                                 cc.ResolutionPolicy.SHOW_ALL);
    eglv.resizeWithBrowserSize(true);
    eglv.adjustViewPort(true);

    //dirc.setAnimationInterval(1 / sh.xcfg.game.frameRate);
    if (sh.xcfg.game.debug) {
      dirc.setDisplayStats(sh.xcfg.game.showFPS);
    }

    asterix.XLoader.preload( this.pvGatherPreloads(), function () {
      sh.xcfg.runOnce();
      dirc.runScene( sh.protos[ this.startScene ].create() );
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
      SkaroJS.loggr.info('Loading ' + v);
      memo.push( v );
      return memo;
    }, []);
  },

  pvLoadLevels: function() {
    var rc=[],
    arr,
    z;

    _.each(sh.xcfg.levels, function(v,k) {
      _.each(v, function(obj,n){
        rc = rc.concat( _.reduce(obj, function(memo, item, x) {
          z=  k + '.' + n + '.' + x;
          arr=undef;
          switch (n) {
            case 'sprites':
              memo.push( this.pvLoadSprite( z,item));
              sh.xcfg.assets.sprites[z] = item;
            break;
            case 'images':
              memo.push( this.pvLoadImage( z, item));
              sh.xcfg.assets.images[z] = item;
            break;
            case 'tiles':
              memo.push( this.pvLoadTile( z, item));
              sh.xcfg.assets.tiles[z] = item;
            break;
          }
          return memo;
        },[], this));
      }, this);
    }, this);
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


}).call(this);

