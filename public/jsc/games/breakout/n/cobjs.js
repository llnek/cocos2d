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
 * @class Ball
 */
var Ball = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Ball
   * @method constructor
   * @param {cc.Sprite}
   */

  constructor: function constructor(sprite) {
    this.ctor(sprite);
  }
});
/**
 * @property {Ball} Ball
 */
xbox.Ball = Ball;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BrickFence
 */
var BrickFence = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~BrickFence
   * @method constructor
   * @param {Array} bricks
   */

  constructor: function constructor(bricks) {
    this.bricks = bricks;
  }
});
/**
 * @property {BrickFence} BrickFence
 */
xbox.BrickFence = BrickFence;

/**
 * @class Brick
 */
var Brick = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Brick
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} value
   * @param {Number} color
   */

  constructor: function constructor(sprite, value, color) {
    this.ctor(sprite, 1, value);
    this.color = color;
  }
});
/**
 * @property {Brick} Brick
 */
xbox.Brick = Brick;

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
 * @class Paddle
 */
var Paddle = _asterix2.default.Ashley.compDef({

  /**
   * @memberof module:n/cobjs~Paddle
   * @method constructor
   * @param {cc.Sprite}
   */

  constructor: function constructor(sprite) {
    this.ctor(sprite);
  }
});
/**
 * @property {Paddle} Paddle
 */
xbox.Paddle = Paddle;

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