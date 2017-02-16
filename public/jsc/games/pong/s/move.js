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
              * @requires zotohlab/asx/odin
              * @requires n/gnodes
              * @module s/move
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _odin = require('zotohlab/asx/odin');

var _odin2 = _interopRequireDefault(_odin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evts = _odin2.default.Events,
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Move
 */
Move = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/moves~Move
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/moves~Move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.fauxpads = null;
    this.paddles = null;
    this.balls = null;
  },

  /**
   * @memberof module:s/moves~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.fauxs = engine.getNodeList(_gnodes2.default.FauxPaddleNode);
    this.paddles = engine.getNodeList(_gnodes2.default.PaddleNode);
    this.balls = engine.getNodeList(_gnodes2.default.BallNode);
  },

  /**
   * @memberof module:s/moves~Move
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var bnode = this.balls.head,
        node = void 0;

    if (this.state.running && !!bnode) {

      for (node = this.paddles.head; node; node = node.next) {
        this.doit(node, dt);
      }

      for (node = this.fauxs.head; node; node = node.next) {
        if (node.player.category === csts.BOT) {
          this.moveRobot(node, bnode, dt);
        } else if (node.player.category === csts.NETP) {
          this.simuMove(node, bnode, dt);
        }
      }

      this.processBall(bnode, dt);
    }
  },

  /**
   * @method simuMove
   * @private
   */
  simuMove: function simuMove(node, bnode, dt) {
    var hw2 = _ccsx2.default.halfHW(node.paddle.sprite),
        pos = node.paddle.sprite.getPosition(),
        world = this.state.world,
        lastpos = node.lastpos,
        x = undef,
        y = undef,
        delta = dt * this.state.paddle.speed;

    if (lastpos.lastDir > 0) {
      if (_ccsx2.default.isPortrait()) {
        x = pos.x + delta;
      } else {
        y = pos.y + delta;
      }
    } else if (lastpos.lastDir < 0) {
      if (_ccsx2.default.isPortrait()) {
        x = pos.x - delta;
      } else {
        y = pos.y - delta;
      }
    }

    if (sjs.echt(x)) {
      node.paddle.sprite.setPosition(x, pos.y);
      this.clamp(node.paddle.sprite);
    }
    if (sjs.echt(y)) {
      node.paddle.sprite.setPosition(pos.x, y);
      this.clamp(node.paddle.sprite);
    }
  },

  //TODO: better AI please
  /**
   * @method moveRobot
   * @private
   */
  moveRobot: function moveRobot(node, bnode, dt) {
    var bp = bnode.ball.sprite.getPosition(),
        pos = node.paddle.sprite.getPosition(),
        speed = this.state.paddle.speed,
        velo = bnode.velocity,
        y = undef,
        x = undef;

    if (_ccsx2.default.isPortrait()) {

      if (bp.x > pos.x) {
        if (velo.vel.x > 0) {
          x = pos.x + dt * speed;
        }
      } else {
        if (velo.vel.x < 0) {
          x = pos.x - dt * speed;
        }
      }
    } else {

      if (bp.y > pos.y) {
        if (velo.vel.y > 0) {
          y = pos.y + dt * speed;
        }
      } else {
        if (velo.vel.y < 0) {
          y = pos.y - dt * speed;
        }
      }
    }

    if (sjs.echt(x)) {
      node.paddle.sprite.setPosition(x, pos.y);
      this.clamp(node.paddle.sprite);
    }

    if (sjs.echt(y)) {
      node.paddle.sprite.setPosition(pos.x, y);
      this.clamp(node.paddle.sprite);
    }
  },

  /**
   * @method processBall
   * @private
   */
  processBall: function processBall(node, dt) {
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
    } else {}
    b.sprite.setPosition(rc.x, rc.y);
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(node, dt) {
    var p = node.paddle,
        s = p.speed * dt,
        m = node.motion,
        nv = void 0,
        x = void 0,
        y = void 0,
        ld = node.lastpos.lastDir,
        lp = node.lastpos.lastP,
        pos = p.sprite.getPosition();

    if (m.right) {
      if (_ccsx2.default.isPortrait()) {
        x = pos.x + s;
        y = pos.y;
      } else {
        y = pos.y + s;
        x = pos.x;
      }
      p.sprite.setPosition(x, y);
    }

    if (m.left) {
      if (_ccsx2.default.isPortrait()) {
        x = pos.x - s;
        y = pos.y;
      } else {
        y = pos.y - s;
        x = pos.x;
      }
      p.sprite.setPosition(x, y);
    }

    m.right = false;
    m.left = false;

    this.clamp(p.sprite);

    // below is really for wsock stuff

    if (_ccsx2.default.isPortrait()) {
      nv = p.sprite.getPosition().x;
    } else {
      nv = p.sprite.getPosition().y;
    }

    var delta = Math.abs(nv - lp),
        dir = 0;
    if (delta >= 1) {
      if (nv > lp) {
        dir = 1;
        // moving up or right
      } else if (nv < lp) {
          dir = -1;
        }
    }
    node.lastpos.lastP = nv;
    if (ld !== dir) {
      if (this.state.wsock) {
        this.notifyServer(node, dir);
      }
      node.lastpos.lastDir = dir;
    }
  },

  /**
   * Inform the server that paddle has changed direction: up , down or stopped.
   * @method notifyServer
   * @private
   */
  notifyServer: function notifyServer(node, direction) {
    var vv = direction * this.state.paddle.speed,
        pos = node.paddle.sprite.getPosition(),
        pnum = this.state.pnum,
        src = void 0,
        cmd = {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
      dir: direction,
      pv: vv
    };
    if (pnum === 2) {
      src = { p2: cmd };
    } else {
      src = { p1: cmd };
    }
    this.state.wsock.send({
      source: sjs.jsonfy(src),
      type: evts.MSG_SESSION,
      code: evts.PLAY_MOVE
    });
  },

  /**
   * @method clamp
   * @private
   */
  clamp: function clamp(sprite) {
    var pos = sprite.getPosition(),
        world = this.state.world,
        x = undef,
        y = undef,
        hw2 = _ccsx2.default.halfHW(sprite),
        bb4 = _ccsx2.default.bbox4(sprite);

    if (_ccsx2.default.isPortrait()) {
      if (bb4.right > world.right) {
        x = world.right - hw2[0];
      }
      if (bb4.left < world.left) {
        x = world.left + hw2[0];
      }
    } else {
      if (bb4.top > world.top) {
        y = world.top - hw2[1];
      }
      if (bb4.bottom < world.bottom) {
        y = world.bottom + hw2[1];
      }
    }

    if (sjs.echt(x)) {
      sprite.setPosition(x, pos.y);
    }

    if (sjs.echt(y)) {
      sprite.setPosition(pos.x, y);
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
   * @property {Move}  Move
   */
  Move: Move
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF