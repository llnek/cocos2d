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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires zotohlab/asx/ccsx
              * @module n/cobjs
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @alias module:n/cobjs */
var xbox = {},
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class AlienSquad
 */
var AlienSquad = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~AlienSquad
   * @method constructor
   * @param {Array} aliens
   * @param {Number} step
   */

  constructor: function constructor(aliens, step) {
    this.aliens = aliens;
    this.stepx = step;
  }
});
/**
 * @property {AlienSquad} AlienSquad
 */
xbox.AlienSquad = AlienSquad;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Alien
 */
var Alien = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Alien
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} value
   * @param {Number} rank
   */

  constructor: function constructor(sprite, value, rank) {
    this.ctor(sprite, 1, value);
    this.rank = rank;
  }
});
/**
 * @property {Alien} Alien
 */
xbox.Alien = Alien;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Bomb
 */
var Bomb = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Bomb
   * @method constructor
   * @param {cc.Sprite}
   */

  constructor: function constructor(sprite) {
    var wz = _ccsx2.default.vrect();
    this.ctor(sprite);
    this.vel = {
      x: 0,
      y: -50 * wz.height / 480
    };
  }
});
/**
 * @property {Bomb} Bomb
 */
xbox.Bomb = Bomb;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Cannon
 */
var Cannon = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Cannon
   * @method constructor
   * @param {Number} coolDownWindow
   */

  constructor: function constructor(coolDownWindow) {
    this.coolDownWindow = coolDownWindow || 0.8;
    this.hasAmmo = true;
  }
});
/**
 * @property {Cannon} Cannon
 */
xbox.Cannon = Cannon;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Explosion
 */
var Explosion = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Explosion
   * @method constructor
   * @param {cc.Sprite}
   */

  constructor: function constructor(sprite) {
    this.ctor(sprite);
    this.frameTime = 0.1;
  },


  /**
   * @protected
   */
  inflate: function inflate(options) {
    var _this = this;

    var frames = [_ccsx2.default.getSprite('boom_0.png'), _ccsx2.default.getSprite('boom_1.png'), _ccsx2.default.getSprite('boom_2.png'), _ccsx2.default.getSprite('boom_3.png')],
        anim = new cc.Animation(frames, this.frameTime);

    this.sprite.setPosition(options.x, options.y);
    this.status = true;

    this.sprite.runAction(new cc.Sequence(new cc.Animate(anim), new cc.CallFunc(function () {
      sjs.loggr.debug('explosion done.!');
      _this.deflate();
    }, this)));
  }
});
/**
 * @property {Explosion} Explosion
 */
xbox.Explosion = Explosion;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Looper
 */
var Looper = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Looper
   * @method constructor
   * @param {Number} count
   */

  constructor: function constructor(count) {
    this.timers = sjs.makeArray(count, null);
  }
});
/**
 * @property {Looper} Looper
 */
xbox.Looper = Looper;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Missile
 */
var Missile = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Missile
   * @method constructor
   * @param {cc.Sprite} sprite
   */

  constructor: function constructor(sprite) {
    var wz = _ccsx2.default.vrect();
    this.ctor(sprite);
    this.vel = {
      x: 0,
      y: 150 * wz.height / 480
    };
  }
});
/**
 * @property {Missile} Missile
 */
xbox.Missile = Missile;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Motion
 */
var Motion = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Motion
   * @method constructor
   */

  constructor: function constructor() {
    this.right = false;
    this.left = false;
  }
});
/**
 * @property {Motion} Motion
 */
xbox.Motion = Motion;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Ship
 */
var Ship = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Ship
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Array} frames
   */

  constructor: function constructor(sprite, frames) {
    this.ctor(sprite);
    this.frames = frames;
  }
});
/**
 * @property {Ship} Ship
 */
xbox.Ship = Ship;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Velocity
 */
var Velocity = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Velocity
   * @method constructor
   * @param {Number} vx
   * @param {Number} vy
   */

  constructor: function constructor(vx, vy) {
    this.vel = {
      x: vx || 0,
      y: vy || 0
    };
  }
});
/**
 * @property {Velocity} Velocity
 */
xbox.Velocity = Velocity;

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF