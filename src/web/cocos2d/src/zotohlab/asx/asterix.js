// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

"use strict";/**
 * @requires cherimoia/skaro
 * @requires mustache
 * @requires eligrey/l10njs
 * @requires ash-js
 * @module zotohlab/asx/asterix
 */

import sjs from "cherimoia/skaro";
import Mustache from "mustache";
import LZString from "eligrey/l10njs";
import Ash from "ash-js";

let SEED=0,

/**
 * @class ComObj
 * @mixin
 */
ComObj = {
  /**
   * Take damage, reduce health.
   * @memberof module:zotohlab/asterix~ComObj
   * @method hurt
   * @param {Number} damage
   * @param {Object} from
   */
  hurt(damage, from) {
    this.HP -= sjs.isnum(damage) ? damage : 1;
  },

  /**
   * Reborn from the dead - take from the pool.
   * @memberof module:zotohlab/asterix~ComObj
   * @method inflate
   * @param {Object} options
   */
  inflate(options) {
    options= options || {};
    if (!!this.sprite) {
      if (sjs.hasKey(options, 'x') &&
          sjs.hasKey(options, 'y')) {
        this.sprite.setPosition(options.x,
                                options.y);
      }
      if (sjs.hasKey(options, 'deg')) {
        this.sprite.setRotation(options.deg);
      }
      if (sjs.hasKey(options, 'scale')) {
        this.sprite.setScale(options.scale);
      }
      this.sprite.setVisible(true);
    }
    this.HP= this.origHP;
    this.status=true;
  },

  /**
   * Die and ready to be recycled.
   * @memberof module:zotohlab/asterix~ComObj
   * @method deflate
   */
  deflate() {
    if (!!this.sprite) {
      this.sprite.unscheduleAllCallbacks();
      this.sprite.stopAllActions();
      this.sprite.setVisible(false);
    }
    this.status=false;
  },

  /**
   * Get Sprite's height.
   * @memberof module:zotohlab/asterix~ComObj
   * @method height
   * @return {Number}
   */
  height() {
    if (!!this.sprite) {
      return this.sprite.getContentSize().height;
    }
  },

  /**
   * Get Sprite's width.
   * @memberof module:zotohlab/asterix~ComObj
   * @method width
   * @return {Number}
   */
  width() {
    if (!!this.sprite) {
      return this.sprite.getContentSize().width;
    }
  },

  /**
   * Set Sprite's position.
   * @memberof module:zotohlab/asterix~ComObj
   * @method setPos
   * @param {Number} x
   * @param {Number} y
   */
  setPos(x,y) {
    if (!!this.sprite) {
      this.sprite.setPosition(x,y);
    }
  },

  /**
   * Get the Sprite's position.
   * @memberof module:zotohlab/asterix~ComObj
   * @method pos
   * @return {cc.Point}
   */
  pos() {
    if (!!this.sprite) {
      return this.sprite.getPosition();
    }
  },

  /**
   * Get the Sprite's size.
   * @memberof module:zotohlab/asterix~ComObj
   * @method size
   * @return {cc.Size}
   */
  size() {
    if (!!this.sprite) {
      return this.sprite.getContentSize();
    }
  },

  /**
   * Get the tag value.
   * @memberof module:zotohlab/asterix~ComObj
   * @method rtti
   * @return {String}
   */
  rtti() { return this._name; },

  /**
   * Set tag value.
   * @memberof module:zotohlab/asterix~ComObj
   * @method rego
   * @param {String} n
   */
  rego(n) { this._name = n; },

  /**
   * Get the Sprite's tag value.
   * @memberof module:zotohlab/asterix~ComObj
   * @method pid
   * @return {Number}
   */
  pid() {
    if (!!this.sprite) { return this.sprite.getTag(); }
  },

  /**
   * @private
   */
  ctor(sprite, health, score) {
    this._name= ["co" , ++SEED].join(':');
    this.origHP = health || 1;
    this.sprite = sprite;
    this.HP = this.origHP;
    this.value = score || 0;
    this.status=false;
  }
},

/**
 * @extends module:zotohlab/asterix~ComObj
 * @class SimpleComp
 */
SimpleComp = Ash.Class.extend(sjs.mergeEx(ComObj, {

  /**
   * @memberof module:zotohlab/asterix~SimpleComp
   * @method constructor
   * @param {cc.Sprite}
   */
  constructor(sprite) {
    this.ctor(sprite);
  }
})),

undef,

/**
 * @class Ashley
 * @static
 * @mixin
 */
Ashley= {
  /**
   * Define a Component.
   * @memberof module:zotohlab/asterix~Ashley
   * @method compDef
   * @param {Object} proto
   * @return {Ash.Class}
   */
  compDef(proto) {
    return Ash.Class.extend(sjs.mergeEx(ComObj, proto));
  },
  /**
   * Define a Node.
   * @memberof module:zotohlab/asterix~Ashley
   * @method nodeDef
   * @param {Object} proto
   * @return {Ash.Node}
   */
  nodeDef(proto) {
    return Ash.Node.create(proto);
  },
  /**
   * Define a System.
   * @memberof module:zotohlab/asterix~Ashley
   * @method sysDef
   * @param {Object} proto
   * @return {Ash.System}
   */
  sysDef(proto) {
    return Ash.System.extend(proto);
  },
  /**
   * Enhance this object.
   * @memberof module:zotohlab/asterix~Ashley
   * @method casDef
   * @param {Object} proto
   * @return {Ash.Class}
   */
  casDef(proto) {
    return Ash.Class.extend(proto);
  },
  /**
   * Create a new Entity object.
   * @memberof module:zotohlab/asterix~Ashley
   * @method newEntity
   * @return {Ash.Entity}
   */
  newEntity() {
    return new Ash.Entity();
  },
  /**
   * Create a basic Component.
   * @memberof module:zotohlab/asterix~Ashley
   * @method newObject
   * @param {cc.Sprite}
   * @return {SimpleComp}
   */
  newObject(sprite) {
    return new SimpleComp(sprite);
  }
};

/** @alias module:zotohlab/asterix */
let xbox = /** @lends xbox# */{

  /**
   * @property {Object} Ashley ash-js framework
   */
  Ashley: Ashley,

  /**
   * @property {Object} skarojs back-ref to skaro
   */
  skarojs: sjs,

  /**
   * Initialize the l10n module with the string table.
   * @method
   * @param {Object} table
   */
  l10nInit(table) {
    LZString.toLocaleString(table || this.xcfg.l10nTable);
    LZString.locale = cc.sys.language ;
    LZString.defaultLocale= "en";
    sjs.loggr.info("Loaded l10n strings.  locale = " + LZString.locale);
  },

  /**
   * Localize the string.
   * @method
   * @param {String} s
   * @param {Object} pms
   * @return {String} rendered string
   */
  l10n(s,pms) {
    const t= s.toLocaleString();
    return sjs.isobj(pms) ? Mustache.render(t,pms) : t;
  },

  /**
   * @property {String} lang
   */
  lang: cc.sys.language || 'en',

  /**
   * @property {Object} protos scene classes
   */
  protos: {},

  /**
   * @property {Object} pools object pools
   */
  pools: {},

  /**
   * @enum {Number}
   * @readonly
   */
  gtypes: {
    ONLINE_GAME: 3,
    P2_GAME: 2,
    P1_GAME: 1
  },

  /**
   * @property {Object} xcfg application config
   */
  xcfg: undef,

  /**
   * @property {Object} main main game
   */
  main: undef,

  /**
   * @property {Object} factory entity factory
   */
  factory: undef,

  /**
   * @property {String} wsUri uri for network games
   */
  wsUri: '/network/odin/websocket',

  /**
   * @property {Object} ptypes
   */
  ptypes: {
    start: 'StartScreen',
    mmenu: 'MainMenu',
    online: 'OnlinePlay',
    game: 'GameArena',
    hud: 'HUD',
    mbox: 'MsgBox',
    yn: 'YesNo'
  },

  /**
   * Trigger an event on this topic.
   * @method
   * @param {String} topic
   * @param {Object} msg
   */
  fire(topic, msg) {
    const r= cc.director.getRunningScene();
    if (!!r) {
      r.ebus.fire(topic, msg || {});
    }
  },

  /**
   * Get the config for this level.
   * @method
   * @param {Number} level
   * @return {Object} the config
   */
  getLevelCfg(level) {
    return this.xcfg.levels['' + level]['cfg'];
  },

  /**
   * Test if 2 rectangles intersect.
   * @method
   * @param {Object} a1
   * @param {Object} a2
   * @return {Boolean}
   */
  isIntersect(a1,a2) {
    return ! (a1.left > a2.right ||
              a2.left > a1.right ||
              a1.top < a2.bottom ||
              a2.top < a1.bottom);
  },

  /**
   * Test if the rectangle is out of bound.  B is
   * the enclosing world rectangle.
   * @method
   * @param {Object} a
   * @param {Object} B
   * @return {Boolean}
   */
  outOfBound(a,B) {
    if (a && B) {
      return a.left > B.right    ||
             a.top < B.bottom  ||
             a.right < B.left      ||
             a.bottom > B.top;
    } else {
      return false;
    }
  },

  /**
   * Find the corresponding x, y lengths based on the
   * provided angle and length of the hypotenuse.
   * @method
   * @param {Number} angle
   * @param {Number} hypot
   * @return {Array} [x, y, quadrant]
   */
  calcXY(angle,hypot) {
  // quadrants =  4 | 1
  //             --------
  //              3 | 2
    let theta, q, x, y;
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

  /**
   * Normalize the degree - modulo 360.
   * @method
   * @param {Number} deg
   * @return {Number}
   */
  normalizeDeg(deg) {
    return (deg > 360) ? deg % 360 : (deg < 0) ? 360 + deg % 360 : deg;
  },

  /**
   * Divide the height of the rectangle by half.
   * @method
   * @param {Object} r
   * @return {Number}
   */
  hh(r) {
    return r.height * 0.5;
  },

  /**
   * Divide the width of the rectangle by half.
   * @method
   * @param {Object} r
   * @return {Number}
   */
  hw(r) {
    return r.width * 0.5;
  },

  /**
   * Convert from radian to degree.
   * @method
   * @param {Number} rad
   * @return {Number}
   */
  radToDeg(rad) {
    return 180 * rad / Math.PI;
  },

  /**
   * Convert from degree to radian.
   * @method
   * @param {Number} deg
   * @return {Number}
   */
  degToRad(deg) {
    return deg * Math.PI / 180;
  },

  /**
   * Get the image path mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getImage(key) {
    //cc.log('getSprite for key : ' + key);
    return this.fixUrl(this.xcfg.assets.images[key]);
  },

  /**
   * Get the *atlas* plist mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getPList(key) {
    return this.fixUrl(this.xcfg.assets.atlases[key]) + '.plist';
  },

  /**
   * Get the *atlas* image path mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getAtlas(key) {
    return this.fixUrl(this.xcfg.assets.atlases[key]) + '.png';
  },

  /**
   * Get the sound file path mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getSfx(key) {
    return [this.fixUrl(this.xcfg.assets.sounds[key]),
            '.',
            this.xcfg.game.sfx].join('');
  },

  /**
   * Get the *sprite* image path mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getSprite(key) {
    //cc.log('getSprite for key : ' + key);
    return this.fixUrl(this.xcfg.assets.sprites[key](0));
  },

  /**
   * Get the *tile* file path mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getTiles(key) {
    return this.fixUrl(this.xcfg.assets.tiles[key]);
  },

  /**
   * Get the *font* file path mapped to this key.
   * @method
   * @param {String} key
   * @return {String} path
   */
  getFont(key) {
    const obj= this.xcfg.assets.fonts[key];
    return [this.fixUrl(obj[0]), '/' , obj[2]].join('');
  },

  /**
   * Toggle sound on or off.  Override by forcing a value.
   * @method
   * @param {Boolean} override
   */
  toggleSfx(override) {
    this.xcfg.sound.open = sjs.echt(override) ? override : !this.xcfg.sound.open;
  },

  /**
   * Play music mapped to this key, repeat if necessary.
   * @method
   * @param {String} key
   * @param {Object} options
   */
  sfxPlayMusic(key,options) {
    if (this.xcfg.sound.open) {
      options= options || {};
      this.sfxMusicVol(options.vol);
      cc.audioEngine.playMusic(this.getSfx(key),
                               options.repeat===true);
    }
  },

  /**
   * Play sound effect mapped to this key, repeat if necessary.
   * @method
   * @param {String} key
   * @param {Object} options
   */
  sfxPlay(key,options) {
    if (this.xcfg.sound.open) {
      options = options || {};
      this.sfxMusicVol(options.vol);
      cc.audioEngine.playEffect(this.getSfx(key),
                                options.repeat===true);
    }
  },

  /**
   * Set Music volume.
   * @method sfxMusicVol
   */
  sfxMusicVol(v) {
    if (this.xcfg.sound.open && sjs.isnum(v)) {
      cc.audioEngine.setMusicVolume(v);
    }
  },

  /**
   * Cancel all sounds.
   * @method sfxCancel
   */
  sfxCancel() {
    cc.audioEngine.stopAllEffects();
    cc.audioEngine.stopMusic();
  },

  /**
   * Initialize the sound system.
   * @method sfxInit
   */
  sfxInit() {
    this.xcfg.sound.open= true;
    this.sfxMusicVol(this.xcfg.sound.volume);
  },

  /**
   * @private
   */
  fixUrl(url) { return this.sanitizeUrl(url); },

  /**
   * Sanitize this url differently for web and for devices.
   * @method
   * @param {String} url
   * @return {String} path
   */
  sanitizeUrl(url) {
    sjs.loggr.debug('About to sanitize url: ' + url);
    let rc;
    if (cc.sys.isNative) {
      rc= this.sanitizeUrlForDevice(url);
    } else {
      rc= this.sanitizeUrlForWeb(url);
    }
    sjs.loggr.debug('Sanitized url: ' + rc);
    return rc;
  },

  /**
   * Sanitize this url for devices.
   * @method
   * @param {String} url
   * @return {String} path
   */
  sanitizeUrlForDevice(url) {
    if (url.match(/^res\//)) {
      if (url.indexOf('/sfx/') > 0) {
        const ss= url.split("/"),
        t = ss[1];
        ss[1]='sfx';
        ss[2]=t;
        url = ss.join("/");
      } else {
        url = url.slice(4);
      }
    }
    else
    if (url.match(/^game/)) {
      url = 'src' + url.slice(4);
    }
    return Mustache.render( url, {
      'border-tiles' : this.xcfg.game.borderTiles,
      'lang' : this.lang,
      'color' : this.xcfg.color,
      'appid' :  this.xcfg.appid
    });
  },

  /**
   * Sanitize this url for web.
   * @method
   * @param {String} url
   * @return {String}
   */
  sanitizeUrlForWeb(url) {
    //ensure we tell mustache not to escape html
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
  },

  /**
   * Throttle this function, with some delay.
   * (from underscore.js)
   * @method
   * @param {Function} func
   * @param {Number} wait
   * @param {Object} options
   * @return {Function} wrapped function.
   */
  throttle(func, wait, options) {
    let context, args, result,
    timeout = null,
    previous = 0;
    options = options || {};
    const later = () => {
      previous = options.leading === false ? 0 : sjs.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) { context = args = null; }
    };
    return function() {
      const now = sjs.now();
      if (!previous && options.leading === false) { previous = now; }
      let remaining = wait - (now - previous);
      args = arguments;
      context = this;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) { context = args = null; }
      }
      else
      if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

};

// monkey patch logger to use cocos2d's log functions.
if (!!cc) {
  sjs.logger= cc;
  sjs.loggr= cc;
  sjs.loggr.info = cc.log;
  sjs.loggr.debug = cc.log;
  sjs.loggr.info('Monkey patched skaro#loggr to cc.log');
}

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

