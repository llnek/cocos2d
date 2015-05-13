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

/**
 *@requires module:cherimoia/skarojs
 *@requires module:mustache
 *@requires module:eligrey/l10njs
 *@requires module:ash-js
 *@module zotohlab/asterix
 */
define("zotohlab/asterix",

       ['cherimoia/skarojs',
       'mustache',
       'eligrey/l10njs',
       'ash-js'],

  function (sjs, Mustache, LZString, Ash) { "use strict";

    var SEED=0,
    /**
     * @class ComObj
     * @static
     */
    ComObj = {

      /**
       * Take damage, reduce health.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method hurt
       * @param {Number} damage
       * @param {Object} from
       */
      hurt: function(damage, from) {
        this.HP -= sjs.isNumber(damage) ? damage : 1;
      },

      /**
       * Reborn from the dead - take from the pool.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method inflate
       * @param {Object} options
       */
      inflate: function(options) {
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
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method deflate
       */
      deflate: function() {
        if (!!this.sprite) {
          this.sprite.unscheduleAllCallbacks();
          this.sprite.stopAllActions();
          this.sprite.setVisible(false);
        }
        this.status=false;
      },

      /**
       * Get Sprite's height.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method height
       * @return {Number}
       */
      height: function() {
        if (!!this.sprite) {
          return this.sprite.getContentSize().height;
        }
      },

      /**
       * Get Sprite's width.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method width
       * @return {Number}
       */
      width: function() {
        if (!!this.sprite) {
          return this.sprite.getContentSize().width;
        }
      },

      /**
       * Set Sprite's position.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method setPos
       * @param {Number} x
       * @param {Number} y
       */
      setPos: function(x,y) {
        if (!!this.sprite) {
          this.sprite.setPosition(x,y);
        }
      },

      /**
       * Get the Sprite's position.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method pos
       * @return {cc.Point}
       */
      pos: function() {
        if (!!this.sprite) {
          return this.sprite.getPosition();
        }
      },

      /**
       * Get the Sprite's size.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method size
       * @return {cc.Size}
       */
      size: function() {
        if (!!this.sprite) {
          return this.sprite.getContentSize();
        }
      },

      /**
       * Get the tag value.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method rtti
       * @return {Number}
       */
      rtti: function() { return this._tag; },

      /**
       * Set tag value.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method rego
       * @param {Number} n
       */
      rego: function(n) { this._tag = n; },

      /**
       * Get the Sprite's tag value.
       *
       * @memberof module:zotohlab/asterix~ComObj
       * @method pid
       * @return {Number}
       */
      pid: function() {
        if (!!this.sprite) { return this.sprite.getTag(); }
      },

      /**
       * @private
       */
      ctor: function(sprite, health, score) {
        this.origHP = health || 1;
        this.sprite = sprite;
        this.HP = this.origHP;
        this.value = score || 0;
        this._tag= ["component" , ++SEED].join(':');
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
      constructor: function(sprite) {
        this.ctor(sprite);
      }
    })),

    undef,

    /**
     * @class Ashley
     * @static
     */
    Ashley= {
      /**
       * Define a Component.
       *
       * @memberof module:zotohlab/asterix~Ashley
       * @method compDef
       * @param {Object} proto
       * @return {Ash.Class}
       */
      compDef : function(proto) {
        return Ash.Class.extend(sjs.mergeEx(ComObj, proto));
      },
      /**
       * Define a Node.
       *
       * @memberof module:zotohlab/asterix~Ashley
       * @method nodeDef
       * @param {Object} proto
       * @return {Ash.Node}
       */
      nodeDef: function(proto) {
        return Ash.Node.create(proto);
      },
      /**
       * Define a System.
       *
       * @memberof module:zotohlab/asterix~Ashley
       * @method sysDef
       * @param {Object} proto
       * @return {Ash.System}
       */
      sysDef: function(proto) {
        return Ash.System.extend(proto);
      },
      /**
       * Enhance this object.
       *
       * @memberof module:zotohlab/asterix~Ashley
       * @method casDef
       * @param {Object} proto
       * @return {Ash.Class}
       */
      casDef: function(proto) {
        return Ash.Class.extend(proto);
      },
      /**
       * Create a new Entity object.
       *
       * @memberof module:zotohlab/asterix~Ashley
       * @method newEntity
       * @return {Ash.Entity}
       */
      newEntity: function() {
        return new Ash.Entity();
      },
      /**
       * Create a basic Component.
       *
       * @memberof module:zotohlab/asterix~Ashley
       * @method newObject
       * @param {cc.Sprite}
       * @return {SimpleComp}
       */
      newObject: function(sprite) {
        return new SimpleComp(sprite);
      }
    };

    /** @alias module:zotohlab/asterix */
    var asterix = {

      /**
       * @property Ashley - for ash-js framework
       * @type Object
       */
      Ashley: Ashley,

      /**
       * Initialize the l10n module with the string table.
       *
       * @method l10nInit
       * @param {Object} table
       */
      l10nInit: function(table) {
        LZString.toLocaleString(table || this.xcfg.l10nTable);
        LZString.locale = cc.sys.language ;
        LZString.defaultLocale= "en";
        sjs.loggr.info("Loaded l10n strings.  locale = " + LZString.locale);
      },

      /**
       * Localize the string.
       *
       * @method l10n
       * @param {String} s
       * @param {Object} pms
       * @return {String} - rendered string.
       */
      l10n: function(s,pms) {
        var t= s.toLocaleString();
        return sjs.isObject(pms) ? Mustache.render(t,pms) : t;
      },

      /**
       * @property lang
       * @type String
       */
      lang: cc.sys.language || 'en',

      /**
       * Map of main classes.
       *
       * @property protos
       * @type Object
       */
      protos: {},

      /**
       * Object pools
       *
       * @property pools
       * @type Object
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
       * Game application config.
       *
       * @property xcfg
       * @type Object
       */
      xcfg: undef,

      /**
       * Main game scene.
       *
       * @property main
       * @type String
       */
      main: undef,

      /**
       * Entity factory.
       *
       * @property factory
       * @type Object
       */
      factory: undef,

      /**
       * Trigger an event on this topic.
       *
       * @method fireEvent
       * @param {String} topic
       * @param {Object} msg
       */
      fireEvent: function(topic, msg) {
        var r= cc.director.getRunningScene();
        if (r) {
          r.ebus.fire(topic, msg || {});
        }
      },

      /**
       * Get the config for this level.
       *
       * @method getLevelCfg
       * @param {Number} level
       * @return {Object} the config.
       */
      getLevelCfg: function(level) {
        return this.xcfg.levels['gamelevel' + level]['cfg'];
      },

      /**
       * Test if 2 rectangles intersect.
       *
       * @method isIntersect
       * @param {Object} a1
       * @param {Object} a2
       * @return {Boolean}
       */
      isIntersect: function(a1,a2) {
        return ! (a1.left > a2.right ||
                  a2.left > a1.right ||
                  a1.top < a2.bottom ||
                  a2.top < a1.bottom);
      },

      /**
       * Test if the rectangle is out of bound.  B is
       * the enclosing world rectangle.
       *
       * @method outOfBound
       * @param {Object} a
       * @param {Object} B
       */
      outOfBound: function(a,B) {
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
       *
       * @method calcXY
       * @param {Number} angle
       * @param {Number} hypot
       * @param {Array} [x, y, quadrant]
       */
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

      /**
       * Normalize the degree - modulo 360.
       *
       * @method normalizeDeg
       * @param {Number} deg
       * @return {Number}
       */
      normalizeDeg: function(deg) {
        return (deg > 360) ? deg % 360 : (deg < 0) ? 360 + deg % 360 : deg;
      },

      /**
       * Divide the height of the rectangle by half.
       *
       * @method hh
       * @param {Object} r
       * @return {Number}
       */
      hh: function(r) {
        return r.height * 0.5;
      },

      /**
       * Divide the width of the rectangle by half.
       *
       * @method hw
       * @param {Object} r
       * @return {Number}
       */
      hw: function(r) {
        return r.width * 0.5;
      },

      /**
       * Convert from radian to degree.
       *
       * @method radToDeg
       * @param {Number} rad
       * @return {Number}
       */
      radToDeg: function(rad) {
        return 180 * rad / Math.PI;
      },

      /**
       * Convert from degree to radian.
       *
       * @method degToRad
       * @param {Number} deg
       * @return {Number}
       */
      degToRad: function(deg) {
        return deg * Math.PI / 180;
      },

      /**
       * Get the image path mapped to this key.
       *
       * @method getImagePath
       * @param {String} key
       * @return {String}
       */
      getImagePath: function(key) {
        //cc.log('getSpritePath for key : ' + key);
        return this.fixUrl(this.xcfg.assets.images[key]);
      },

      /**
       * Get the *atlas* plist mapped to this key.
       *
       * @method getPListPath
       * @param {String} key
       * @return {String}
       */
      getPListPath: function(key) {
        return this.fixUrl(this.xcfg.assets.atlases[key]) + '.plist';
      },

      /**
       * Get the *atlas* image path mapped to this key.
       *
       * @method getAtlasPath
       * @param {String} key
       * @return {String}
       */
      getAtlasPath: function(key) {
        return this.fixUrl(this.xcfg.assets.atlases[key]) + '.png';
      },

      /**
       * Get the sound file path mapped to this key.
       *
       * @method getSfxPath
       * @param {String} key
       */
      getSfxPath: function(key) {
        return [this.fixUrl(this.xcfg.assets.sounds[key]),
                '.',
                this.xcfg.game.sfx].join('');
      },

      /**
       * Get the *sprite* image path mapped to this key.
       *
       * @method getSpritePath
       * @param {String} key
       */
      getSpritePath: function(key) {
        //cc.log('getSpritePath for key : ' + key);
        return this.fixUrl(this.xcfg.assets.sprites[key](0));
      },

      /**
       * Get the *tile* file path mapped to this key.
       *
       * @method getTilesPath
       * @param {String} key
       * @return {String}
       */
      getTilesPath: function(key) {
        return this.fixUrl(this.xcfg.assets.tiles[key]);
      },

      /**
       * Get the *font* file path mapped to this key.
       *
       * @method getFontPath
       * @param {String} key
       * @return {String}
       */
      getFontPath: function(key) {
        var obj= this.xcfg.assets.fonts[key];
        return [this.fixUrl(obj[0]), '/' , obj[2]].join('');
      },

      /**
       * Toggle sound on or off.  Override by forcing a value.
       *
       * @method toggleSfx
       * @param {Boolean} override
       */
      toggleSfx: function(override) {
        this.xcfg.sound.open = sjs.echt(override) ? override : !this.xcfg.sound.open;
      },

      /**
       * Play music mapped to this key, repeat if necessary.
       *
       * @method sfxPlayMusic
       * @param {String} key
       * @param {Boolean} repeat
       */
      sfxPlayMusic: function(key,repeat) {
        if (this.xcfg.sound.open) {
          cc.audioEngine.playMusic(this.getSfxPath(key),
                                   repeat===true);
        }
      },

      /**
       * Play sound effect mapped to this key, repeat if necessary.
       *
       * @method sfxPlay
       * @param {String} key
       * @param {Boolean} repeat
       */
      sfxPlay: function(key,repeat) {
        if (this.xcfg.sound.open) {
          cc.audioEngine.playEffect(this.getSfxPath(key),
                                    repeat===true);
        }
      },

      /**
       * Initialize the sound system.
       *
       * @method sfxInit
       */
      sfxInit: function() {
        cc.audioEngine.setMusicVolume(this.xcfg.sound.volume);
        this.xcfg.sound.open= true;
      },

      /**
       * @private
       */
      fixUrl: function(url) { return this.sanitizeUrl(url); },

      /**
       * Sanitize this url differently for web and for devices.
       * @method sanitizeUrl
       * @param {String} url
       * @return {String}
       */
      sanitizeUrl: function(url) {
        sjs.loggr.debug('About to sanitize url: ' + url);
        var rc;
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
       *
       * @method sanitizeUrlForDevice
       * @param {String} url
       * @return {String}
       */
      sanitizeUrlForDevice: function(url) {
        if (url.match(/^res\//)) {
          if (url.indexOf('/sfx/') > 0) {
            var ss= url.split("/"), t = ss[1];
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
       *
       * @method sanitizeUrlForWeb
       * @param {String} url
       * @return {String}
       */
      sanitizeUrlForWeb: function(url) {
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
       *
       * @method throttle
       * @param {Function} func
       * @param {Number} wait
       * @param {Object} options
       * @return {Function} wrapped function.
       */
      throttle: function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
          previous = options.leading === false ? 0 : sjs.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };
        return function() {
          var now = sjs.now();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
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
      sjs.loggr.info('Monkey patched skarojs#loggr to cc.log');
    }

    return asterix;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

