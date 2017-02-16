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
              * @requires n/gnodes
              * @module s/move
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class Move */
Move = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/move~Move
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/move~Move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.shipMotions = null;
  },

  /**
   * @memberof module:s/move~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.shipMotions = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @memberof module:s/move~Move
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.shipMotions.head;
    if (this.state.running) {
      if (!!node) {
        this.processShipMotions(node, dt);
      }
      this.moveMissiles(dt);
      this.moveBombs(dt);
    }
  },

  /**
   * @method processShipMotions
   * @private
   */
  processShipMotions: function processShipMotions(node, dt) {
    var motion = node.motion,
        sv = node.velocity,
        ship = node.ship,
        pos = ship.pos(),
        x = pos.x,
        y = pos.y;

    if (motion.right) {
      x = pos.x + dt * sv.vel.x;
    }

    if (motion.left) {
      x = pos.x - dt * sv.vel.x;
    }

    ship.setPos(x, y);
    this.clamp(ship);

    motion.right = false;
    motion.left = false;
  },

  /**
   * @method clamp
   * @private
   */
  clamp: function clamp(ship) {
    var sz = ship.sprite.getContentSize(),
        pos = ship.pos(),
        wz = _ccsx2.default.vrect();

    if (_ccsx2.default.getRight(ship.sprite) > wz.width - csts.TILE) {
      ship.setPos(wz.width - csts.TILE - sz.width * 0.5, pos.y);
    }
    if (_ccsx2.default.getLeft(ship.sprite) < csts.TILE) {
      ship.setPos(csts.TILE + sz.width * 0.5, pos.y);
    }
  },

  /**
   * @memberof module:s/move~Move
   * @method moveBombs
   * @param {Number} dt
   */
  moveBombs: function moveBombs(dt) {
    var bbs = _asterix2.default.pools.Bombs,
        pos = void 0,
        y = void 0;

    bbs.iter(function (b) {
      if (b.status) {
        pos = b.pos();
        y = pos.y + dt * b.vel.y;
        b.setPos(pos.x, y);
      }
    });
  },

  /**
   * @memberof module:s/move~Move
   * @method moveMissiles
   * @param {Number} dt
   */
  moveMissiles: function moveMissiles(dt) {
    var mss = _asterix2.default.pools.Missiles,
        pos = void 0,
        y = void 0;

    mss.iter(function (m) {
      pos = m.pos();
      y = pos.y + dt * m.vel.y;
      m.setPos(pos.x, y);
    });
  }
}, {

  /**
   * @memberof module:s/move~Move
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Move
});

/** @alias module:s/move */
var xbox = /** @lends xbox# */{
  /**
   * @property {Move}  Move
   */
  Move: Move
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF