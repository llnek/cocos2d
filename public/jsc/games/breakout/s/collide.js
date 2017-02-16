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
              * @module s/collide
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
    csts = xcfg.xcsts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class Collide */
Collide = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/collide~Collide
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.paddles = null;
    this.balls = null;
    this.fences = undef;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.paddles = engine.getNodeList(_gnodes2.default.PaddleMotionNode);
    this.balls = engine.getNodeList(_gnodes2.default.BallMotionNode);
    this.fences = engine.getNodeList(_gnodes2.default.BricksNode);
    this.engine = engine;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var bnode = this.balls.head,
        pnode = this.paddles.head,
        fnode = this.fences.head;

    if (this.state.running && !!bnode && !!pnode && !!fnode) {

      if (!this.onPlayerKilled(pnode, bnode)) {
        this.checkNodes(pnode, bnode);
        this.checkBricks(fnode, bnode, dt);
      }
    }
  },

  /**
   * @method onPlayerKilled
   * @private
   */
  onPlayerKilled: function onPlayerKilled(pnode, bnode) {
    var pos = bnode.ball.sprite.getPosition();

    if (pos.y < _ccsx2.default.getBottom(pnode.paddle.sprite)) {
      _asterix2.default.fire('/game/players/killed');
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method checkNodes
   * @private
   */
  checkNodes: function checkNodes(pnode, bnode) {
    if (_ccsx2.default.collide0(pnode.paddle.sprite, bnode.ball.sprite)) {
      this.check(pnode, bnode);
    }
  },

  //ball hits paddle
  /**
   * @method check
   * @private
   */
  check: function check(pnode, bnode) {
    var ball = bnode.ball,
        pad = pnode.paddle,
        hh = ball.sprite.getContentSize().height * 0.5,
        pos = ball.sprite.getPosition(),
        bv = bnode.velocity,
        top = _ccsx2.default.getTop(pad.sprite);

    ball.sprite.setPosition(pos.x, top + hh);
    bv.vel.y = -bv.vel.y;
  },

  /**
   * @method checkBricks
   * @private
   */
  checkBricks: function checkBricks(fence, bnode, dt) {
    var bss = fence.fence.bricks,
        m = bnode.ball;

    for (var n = 0; n < bss.length; ++n) {
      if (bss[n].status !== true) {
        continue;
      }
      if (_ccsx2.default.collide0(m.sprite, bss[n].sprite)) {
        this.onBrick(bnode, bss[n]);
        break;
      }
    }
  },

  /**
   * @method onBrick
   * @private
   */
  onBrick: function onBrick(bnode, brick) {
    var bz = bnode.ball.sprite.getContentSize(),
        kz = brick.sprite.getContentSize(),
        velo = bnode.velocity,
        ks = brick.sprite,
        bs = bnode.ball.sprite,
        ka = { L: _ccsx2.default.getLeft(ks), T: _ccsx2.default.getTop(ks),
      R: _ccsx2.default.getRight(ks), B: _ccsx2.default.getBottom(ks) },
        ba = { L: _ccsx2.default.getLeft(bs), T: _ccsx2.default.getTop(bs),
      R: _ccsx2.default.getRight(bs), B: _ccsx2.default.getBottom(bs) };

    // ball coming down from top?
    if (ba.T > ka.T && ka.T > ba.B) {
      velo.vel.y = -velo.vel.y;
    } else
      // ball coming from bottom?
      if (ba.T > ka.B && ka.B > ba.B) {
        velo.vel.y = -velo.vel.y;
      } else
        // ball coming from left?
        if (ka.L > ba.L && ba.R > ka.L) {
          velo.vel.x = -velo.vel.x;
        } else
          // ball coming from right?
          if (ka.R > ba.L && ba.R > ka.R) {
            velo.vel.x = -velo.vel.x;
          } else {
            sjs.loggr.error("Failed to determine the collide of ball and brick.");
            return;
          }
    _asterix2.default.fire('/game/players/earnscore', {
      value: brick.value
    });
    brick.sprite.setVisible(false);
    brick.status = false;
  }
}, {

  /**
   * @memberof module:s/collide~Collide
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Collide
});

/** @alias module:s/collide */
var xbox = /** @lends xbox# */{
  /**
   * @property {Collide} Collide
   */
  Collide: Collide
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF