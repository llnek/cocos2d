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
    this.paddleMotions = null;
    this.ballMotions = null;
  },

  /**
   * @memberof module:s/move~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ballMotions = engine.getNodeList(_gnodes2.default.BallMotionNode);
    this.paddleMotions = engine.getNodeList(_gnodes2.default.PaddleMotionNode);
  },

  /**
   * @memberof module:s/move~Move
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var balls = this.ballMotions.head,
        pds = this.paddleMotions.head;

    if (this.state.running) {

      if (!!balls) {
        this.processBallMotions(balls, dt);
      }

      if (!!pds) {
        this.processPaddleMotions(pds, dt);
      }
    }
  },

  /**
   * @method processBallMotions
   * @private
   */
  processBallMotions: function processBallMotions(node, dt) {
    var v = node.velocity,
        b = node.ball,
        rc = void 0,
        pos = b.sprite.getPosition(),
        rect = _ccsx2.default.bbox(b.sprite);

    rect.x = pos.x;
    rect.y = pos.y;

    rc = _ccsx2.default.traceEnclosure(dt, this.state.world, rect, v.vel);
    if (rc.hit) {
      v.vel.x = rc.vx;
      v.vel.y = rc.vy;
    }
    b.sprite.setPosition(rc.x, rc.y);
  },

  /**
   * @method processPaddleMotions
   * @private
   */
  processPaddleMotions: function processPaddleMotions(node, dt) {
    var motion = node.motion,
        sv = node.velocity,
        pad = node.paddle,
        pos = pad.sprite.getPosition(),
        x = pos.x,
        y = pos.y;

    if (motion.right) {
      x = pos.x + dt * sv.vel.x;
    }

    if (motion.left) {
      x = pos.x - dt * sv.vel.x;
    }

    pad.sprite.setPosition(x, y);
    this.clamp(pad);

    motion.right = false;
    motion.left = false;
  },

  /**
   * @method clamp
   * @private
   */
  clamp: function clamp(pad) {
    var sz = pad.sprite.getContentSize(),
        pos = pad.sprite.getPosition(),
        wz = _ccsx2.default.vrect();

    if (_ccsx2.default.getRight(pad.sprite) > wz.width - csts.TILE) {
      pad.sprite.setPosition(wz.width - csts.TILE - _asterix2.default.hw(sz), pos.y);
    }
    if (_ccsx2.default.getLeft(pad.sprite) < csts.TILE) {
      pad.sprite.setPosition(csts.TILE + _asterix2.default.hw(sz), pos.y);
    }
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
   * @property {Move} Move
   */
  Move: Move
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF