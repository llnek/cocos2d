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


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
global.ZotohLab.Asterix = {

  l10nInit: function(table) {
    String.defaultLocale="en-US";
    String.toLocaleString(table ||
                          this.xcfg.l10nTable);
    sjs.loggr.info("loaded l10n strings.  locale = " + String.locale);
  },

  lang: 'en',

  l10n: function(s,pms) {
    var t= s.toLocaleString();
    return _.isObject(pms) ? Mustache.render(t,pms) : t;
  },

  protos: {},

  pools: {},

  xcfg: undef,
  main: undef,

  fireEvent: function(topic, msg) {
    var r= cc.director.getRunningScene();
    if (r) {
      r.ebus.fire(topic,msg);
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
    return a.right > B.right ||
           a.bottom < B.bottom ||
           a.left < 0 ||
           a.top > B.top;
  },

  calcXY: function(angle,hypot) {
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
    if (deg > 360) { return deg % 360; }
    else if (deg < 0) { return 360 + deg % 360; }
    else { return deg; }
  },

  radToDeg: function(rad) {
    return 180 * rad / Math.PI;
  },

  degToRad: function(deg) {
    return deg * Math.PI / 180;
  },

  getImagePath: function(key) {
    var url = this.xcfg.assets.images[key] || '';
    return this.sanitizeUrl(url);
  },

  getPListPath: function(key) {
    var url = this.xcfg.assets.atlases[key] || '';
    return this.sanitizeUrl(url + '.plist');
  },

  getAtlasPath: function(key) {
    var url = this.xcfg.assets.atlases[key] || '';
    return this.sanitizeUrl(url + '.png');
  },

  getSfxPath: function(key) {
    var url = this.xcfg.assets.sounds[key];
    return url ? this.sanitizeUrl( url + '.' + this.xcfg.game.sfx) : '';
  },

  getSpritePath: function(key) {
    var obj = this.xcfg.assets.sprites[key];
    return obj ? this.sanitizeUrl(obj[0]) : '';
  },

  getTilesPath: function(key) {
    var url = this.xcfg.assets.tiles[key] || '';
    return this.sanitizeUrl(url);
  },

  getFontPath: function(key) {
    var obj = this.xcfg.assets.fonts[key];
    return obj ? this.sanitizeUrl(obj[0]) + obj[2] : '';
  },

  setGameSize: function(sz) {
    if (_.isString(sz)) {
      this.xcfg.game.size = this.xcfg.devices[sz];
    }
    else
    if (_.isObject(sz)) {
      this.xcfg.game.size = sz;
    }
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
    var url;
    if (this.xcfg.sound.open) {
      url = this.getSfxPath(key);
      if (url) {
        cc.audioEngine.playEffect( url, false);
      }
    }
  },

  sfxInit: function() {
    if (cc.audioEngine._soundSupported) {
      cc.audioEngine.setMusicVolume(this.xcfg.sound.volume);
      this.xcfg.sound.open= true;
    }
  },

  sanitizeUrl: function(url) {
    // ensure we tell mustache not to escape html
    url = url || '';
    if (url.match(/^media/)) {
      url = '{{{media-ref}}}/' + url;
    }
    else
    if (url.match(/^game/)) {
      url = '{{{gamesource-ref}}}/' + url;
    }
    return Mustache.render( url, {
      'border-tiles' : this.xcfg.game.borderTiles,
      'gamesource-ref' : '/public/ig/lib',
      'media-ref' : '/public/ig',
      'lang' : this.lang,
      'color' : this.xcfg.color,
      'appid' :  this.xcfg.appid
    });
  },

  run: function() {
    var me=this;
    cc.game.onStart= function() {
      sjs.loggr.info("About to create Cocos2D HTML5 Game");
      var app= new me.Cocos2dApp('StartScreen');
      me.l10nInit(),
      me.sfxInit();
      sjs.merge(me.xcfg.game, global.document.ccConfig);
      sjs.loggr.debug(JSON.stringify(me.xcfg.game));
      sjs.loggr.info("registered game start state - " + app.startScene);
      sjs.loggr.info("loaded and running. OK");
    };
    cc.game.run();
  }

};


}).call(this);


