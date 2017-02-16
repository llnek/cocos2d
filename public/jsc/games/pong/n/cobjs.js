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
   * @constructor
   * @param {cc.Sprite} sprite
   * @param {Number} speed
   */

  constructor: function constructor(sprite, speed) {
    this.ctor(sprite);
    this.speed = speed;
  }
});
/**
 * @property {Ball} Ball
 */
xbox.Ball = Ball;

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
   * @method p1Keys
   * @return {Array}
   */

  p1Keys: function p1Keys() {
    return _ccsx2.default.isPortrait() ? [cc.KEY.left, cc.KEY.right] : [cc.KEY.down, cc.KEY.up];
  },


  /**
   * @memberof module:n/cobjs~Paddle
   * @method p2Keys
   * @return {Array}
   */
  p2Keys: function p2Keys() {
    return _ccsx2.default.isPortrait() ? [cc.KEY.a, cc.KEY.d] : [cc.KEY.s, cc.KEY.w];
  },


  /**
   * @memberof module:n/cobjs~Paddle
   * @method onColor
   * @param {Array} keycodes
   * @param {String} snd
   */
  onColor: function onColor(keycodes, snd) {
    this.kcodes = keycodes;
    this.snd = snd;
  },


  /**
   * @memberof module:n/cobjs~Paddle
   * @method constructor
   * @param {cc.Sprite} sprite
   * @param {Number} color
   * @param {Number} speed
   */
  constructor: function constructor(sprite, color, speed) {

    this.ctor(sprite);
    this.color = color;
    this.speed = speed;

    if (this.color === csts.P1_COLOR) {
      this.onColor(this.p1Keys(), 'x_hit');
    } else {
      this.onColor(this.p2Keys(), 'o_hit');
    }
  }
});
/**
 * @property {Paddle} Paddle
 */
xbox.Paddle = Paddle;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Player
 */
var Player = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Player
   * @method constructor
   * @param {Number} category
   * @param {Number} value
   * @param {Number} id
   * @param {Number} color
   */

  constructor: function constructor(category, value, id, color) {
    this.color = color;
    this.pnum = id;
    this.category = category;
    this.value = value;
  }
});
/**
 * @property {Player} Player
 */
xbox.Player = Player;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Faux
 */
var Faux = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Faux
   * @method constructor
   */

  constructor: function constructor() {}
});
/**
 * @property {Faux} Faux
 */
xbox.Faux = Faux;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Position
 */
var Position = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Position
   * @method constructor
   * @param {cc.Point} lp
   */

  constructor: function constructor(lp) {
    this.lastDir = 0;
    this.lastP = lp;
  }
});
/**
 * @property {Position} Position
 */
xbox.Position = Position;

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
      x: vx,
      y: vy
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