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
    undef = void 0,
    ast = {};

//////////////////////////////////////////////////////////////////////////////
var Asteroid = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Asteroid
   * @method constructor
   * @param {cc.Sprite}
   * @param {Number} value
   * @param {Number} rank
   * @param {Number} degA
   * @param {Number} vx
   * @param {Number} vy
   */

  constructor: function constructor(sprite, value, rank, deg, vx, vy) {
    this.ctor(sprite, 1, value);
    this.rotation = deg;
    this.rank = rank;
    this.vel = {
      x: vx,
      y: vy
    };
  }
});
/**
 * @property {Asteroid} Asteroid
 */
xbox.Asteroid = Asteroid;

//////////////////////////////////////////////////////////////////////////////
/**
 * @Cannon
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
   * @param {Number} speed
   */

  constructor: function constructor(sprite, speed) {
    this.speed = speed || 20;
    this.ctor(sprite);
    this.vel = {
      x: 0,
      y: 0
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
    this.up = false;
    this.down = false;
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
   * @memberof module:zotohlab/p/elments~Velocity
   * @method constructor
   * @param {Number} vx
   * @param {Number} vy
   * @param {Number} mx
   * @param {Number} my
   */

  constructor: function constructor(vx, vy, mx, my) {
    this.vel = {
      x: vx || 0,
      y: vy || 0
    };
    this.max = {
      x: mx || 0,
      y: my || 0
    };
    this.acc = {
      x: 0,
      y: 0
    };
  }
});
/**
 * @property {Velocity} Velocity
 */
xbox.Velocity = Velocity;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Rotation
 */
var Rotation = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Rotation
   * @param {Number} deg
   */

  constructor: function constructor(deg) {
    this.angle = deg;
  }
});
/**
 * @property {Rotation} Rotation
 */
xbox.Rotation = Rotation;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Thrust
 */
var Thrust = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Thrust
   * @method constructor
   */

  constructor: function constructor(t) {
    this.power = t;
  }
});
/**
 * @property {Thrust} Thrust
 */
xbox.Thrust = Thrust;

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF