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
              * @requires n/cobjs
              * @requires s/utils
              * @requires n/gnodes
              * @module s/move
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,

//////////////////////////////////////////////////////////////////////////
undef = void 0,

/**
 * @class MoveXXX
 */
MoveXXX = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/move~move
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/move~move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.ships = null;
  },

  /**
   * @memberof module:s/move~move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @memberof module:s/move~move
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.ships.head;
    if (this.state.running && !!node) {
      this.moveMissiles(dt);
      this.move(dt);
      this.onKeys(node, dt);
    }
  },

  /**
   * @method onKeys
   * @private
   */
  onKeys: function onKeys(node, dt) {
    var ship = node.ship,
        wz = _ccsx2.default.vrect(),
        mot = node.motion,
        sp = ship.sprite,
        ok = false,
        pos = ship.pos(),
        x = pos.x,
        y = pos.y;

    if (mot.up && pos.y <= wz.height) {
      y = pos.y + dt * csts.SHIP_SPEED;
      ok = true;
    }
    if (mot.down && pos.y >= 0) {
      y = pos.y - dt * csts.SHIP_SPEED;
      ok = true;
    }
    if (mot.left && pos.x >= 0) {
      x = pos.x - dt * csts.SHIP_SPEED;
      ok = true;
    }
    if (mot.right && pos.x <= wz.width) {
      x = pos.x + dt * csts.SHIP_SPEED;
      ok = true;
    }

    if (ok) {
      ship.setPos(x, y);
    }

    mot.right = false;
    mot.left = false;
    mot.down = false;
    mot.up = false;
  },

  /**
   * @method moveOneBomb
   * @private
   */
  moveOneBomb: function moveOneBomb(m, dt) {
    var pos = m.sprite.getPosition();
    m.sprite.setPosition(pos.x + m.vel.x * dt, pos.y + m.vel.y * dt);
  },

  /**
   * @method move
   * @private
   */
  move: function move(dt) {
    var _this = this;

    _asterix2.default.pools.Bombs.iter(function (b) {
      if (b.status) {
        _this.moveOneBomb(b, dt);
      }
    });
  },

  /**
   * @method moveOneMissile
   * @private
   */
  moveOneMissile: function moveOneMissile(m, dt) {
    var pos = m.sprite.getPosition();
    m.sprite.setPosition(pos.x + m.vel.x * dt, pos.y + m.vel.y * dt);
  },


  /**
   * @method moveMissiles
   * @private
   */
  moveMissiles: function moveMissiles(dt) {
    var _this2 = this;

    _asterix2.default.pools.Missiles.iter(function (v) {
      if (v.status) {
        _this2.moveOneMissile(v, dt);
      }
    });
  }
}, {

  /**
   * @memberof module:s/move~move
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Move
});

/** @alias module:s/move */
var xbox = /** @lends xbox# */{
  /**
   * @property {MoveXXX} MoveXXX
   */
  MoveXXX: MoveXXX
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF