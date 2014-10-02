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

(function (undef) { "use strict"; var global= this, _ = global._ ;

var Mustache=global.Mustache,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
//
global.ZotohLab.Asterix = {

  l10nInit: function(table) {
    //String.defaultLocale="en-US";
    String.toLocaleString(table || this.xcfg.l10nTable);
    String.defaultLocale= this.lang;
    sjs.loggr.info("loaded l10n strings.  locale = " + String.locale);
  },

  l10n: function(s,pms) {
    var t= s.toLocaleString();
    return _.isObject(pms) ? Mustache.render(t,pms) : t;
  },

  lang: cc.sys.language || 'en',

  // map of main classes
  protos: {},
  // object pools
  pools: {},

  ONLINE_GAME: 3,
  P2_GAME: 2,
  P1_GAME: 1,

  // game application config
  xcfg: undef,
  // main game scene
  main: undef,

  fireEvent: function(topic, msg) {
    var r= cc.director.getRunningScene();
    if (r) {
      r.ebus.fire(topic,msg || {});
    }
  },

  // tests if 2 rectangles intersect.
  isIntersect: function(a1,a2) {
    return ! (a1.left > a2.right ||
              a2.left > a1.right ||
              a1.top < a2.bottom ||
              a2.top < a1.bottom);
  },

  outOfBound: function(a,B) {
    return a.right > B.right    ||
           a.bottom < B.bottom  ||
           a.left < B.left      ||
           a.top > B.top;
  },

  calcXY: function(angle,hypot) {
  // quadrants =  4 | 1
  //             --------
  //              3 | 2
    var theta, q, x, y;
    if (angle >= 0 && angle <= 90) {
      theta = this.degToRad(90 - angle);
      x = Math.cos(theta);
      y = Math.sin(theta);
      q=1;
    }
    else
    if (angle >= 90 && angle <= 180 ) {
      theta = this.degToRad(angle - 90);
      x = Math.cos(theta);
      y =  - Math.sin(theta);
      q=2;
    }
    else
    if (angle >= 180 && angle <= 270) {
      theta = this.degToRad(270 - angle);
      x = - Math.cos(theta);
      y = - Math.sin(theta);
      q=3;
    }
    else
    if (angle >= 270 && angle <= 360) {
      theta= this.degToRad(angle - 270);
      x = - Math.cos(theta);
      y = Math.sin(theta);
      q=4;
    }
    else {
    }

    return [ x * hypot, y * hypot, q ];
  },

  XXXcalcXY: function(angle,hypot) {
  // quadrants =  3 | 4
  //             --------
  //              2 | 1
    var theta, q, x, y;
    if (angle >= 0 && angle <= 90) {
      theta = this.degToRad(90 - angle);
      x = Math.cos(theta);
      y = Math.sin(theta);
      q=1;
    }
    else
    if (angle >= 90 && angle <= 180 ) {
      theta = this.degToRad(angle - 90);
      x = Math.cos(theta);
      y =  - Math.sin(theta);
      q=2;
    }
    else
    if (angle >= 180 && angle <= 270) {
      theta = this.degToRad(270 - angle);
      x = - Math.cos(theta);
      y = - Math.sin(theta);
      q=3;
    }
    else
    if (angle >= 270 && angle <= 360) {
      theta= this.degToRad(angle - 270);
      x = - Math.cos(theta);
      y = Math.sin(theta);
      q=4;
    }
    else {
    }

    return [ x * hypot, y * hypot, q ];
  },

  XXcalcXY: function(angle,hypot) {
  // quadrants =  3 | 4
  //             --------
  //              2 | 1
    var theta, q, x, y;
    if (angle >= 90 && angle <= 180) {
      theta= this.degToRad(180 - angle);
      x = - Math.cos(theta);
      y = Math.sin(theta);
      q=2;
    }
    else
    if (angle >= 180 && angle <= 270) {
      theta = this.degToRad(angle - 180);
      x = - Math.cos(theta);
      y = - Math.sin(theta);
      q=3;
    }
    else
    if (angle >= 270 && angle <= 360) {
      theta = this.degToRad(360 - angle);
      x = Math.cos(theta);
      y = - Math.sin(theta);
      q=4;
    } else {
      theta = this.degToRad(angle);
      x = Math.cos(theta);
      y = Math.sin(theta);
      q=1;
    }
    return [ x * hypot, y * hypot, q ];
  },

  normalizeDeg: function(deg) {
    return (deg > 360) ? deg % 360 : (deg < 0) ? 360 + deg % 360 : deg;
  },

  hh: function(r) {
    return r.height * 0.5;
  },

  hw: function(r) {
    return r.width * 0.5;
  },

  radToDeg: function(rad) {
    return 180 * rad / Math.PI;
  },

  degToRad: function(deg) {
    return deg * Math.PI / 180;
  },

  getImagePath: function(key) {
    return this.fixUrl(this.xcfg.assets.images[key]);
  },

  getPListPath: function(key) {
    return this.fixUrl(this.xcfg.assets.atlases[key]) + '.plist';
  },

  getAtlasPath: function(key) {
    return this.fixUrl(this.xcfg.assets.atlases[key]) + '.png';
  },

  getSfxPath: function(key) {
    return [this.fixUrl(this.xcfg.assets.sounds[key]),
            '.',
            this.xcfg.game.sfx].join('');
  },

  getSpritePath: function(key) {
    return this.fixUrl(this.xcfg.assets.sprites[key](0));
  },

  getTilesPath: function(key) {
    return this.fixUrl(this.xcfg.assets.tiles[key]);
  },

  getFontPath: function(key) {
    var obj= this.xcfg.assets.fonts[key];
    return [this.fixUrl(obj[0]), '/' , obj[2]].join('');
  },

  setGameSize: function(sz) {
    this.xcfg.game.size = _.isString(sz) ? this.xcfg.devices[sz] : _.isObject(sz) ? sz : undef;
  },

  setDeviceSizes: function (obj) {
    if (_.isObject(obj)) { this.xcfg.devices= obj; }
  },

  toggleSfx: function(override) {
    this.xcfg.sound.open = sjs.echt(override) ? override : !this.xcfg.sound.open;
    if (!cc.audioEngine._soundSupported) {
      this.xcfg.sound.open=false;
    }
  },

  sfxPlay: function(key) {
    if (this.xcfg.sound.open) {
      cc.audioEngine.playEffect(this.getSfxPath(key),false);
    }
  },

  sfxInit: function() {
    if (cc.audioEngine._soundSupported) {
      cc.audioEngine.setMusicVolume(this.xcfg.sound.volume);
      this.xcfg.sound.open= true;
    }
  },

  fixUrl: function(url) { return this.sanitizeUrl(url); },

  sanitizeUrl: function(url) {
    if (cc.sys.isNative) {
      return this.sanitizeUrlForDevice(url);
    } else {
      return this.sanitizeUrlForWeb(url);
    }
  },

  sanitizeUrlForDevice: function(url) {
    sjs.loggr.debug('about to sanitize url for jsb: ' + url);
    //ensure we tell mustache not to escape html
    url = url || '';
    if (url.match(/^res/)) {
      //url = 'res' + url.slice(0,3);
    }
    else
    if (url.match(/^game/)) {
      url = 'src' + url.slice(0,4);
    }
    return Mustache.render( url, {
      'border-tiles' : this.xcfg.game.borderTiles,
      'lang' : this.lang,
      'color' : this.xcfg.color,
      'appid' :  this.xcfg.appid
    });
  },

  sanitizeUrlForWeb: function(url) {
    sjs.loggr.debug('about to sanitize url for web: ' + url);
    //ensure we tell mustache not to escape html
    url = url || '';
    if (url.match(/^game/)) {
      url = '{{{gamesource-ref}}}/' + url;
    }
    else
    if (url.match(/^res/)) {
      url = '{{{media-ref}}}/' + url;
    }
    return Mustache.render( url, {
      'border-tiles' : this.xcfg.game.borderTiles,
      'gamesource-ref' : '/public/ig/lib',
      'media-ref' : '/public/ig',
      'lang' : this.lang,
      'color' : this.xcfg.color,
      'appid' :  this.xcfg.appid
    });
  }

};

// monkey patch logger to use cocos2d's log functions.
sjs.loggr= cc;
sjs.loggr.info = cc.log;
sjs.loggr.debug = cc.log;

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF
//
