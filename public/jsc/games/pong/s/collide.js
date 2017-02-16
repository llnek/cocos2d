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

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Collide
 */
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
    this.nodeList = null;
    this.fauxs = null;
    this.balls = null;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.fauxs = engine.getNodeList(_gnodes2.default.FauxPaddleNode);
    this.nodeList = engine.getNodeList(_gnodes2.default.PaddleNode);
    this.balls = engine.getNodeList(_gnodes2.default.BallNode);
  },

  /**
   * @memberof module:s/collide~Collide
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var bnode = this.balls.head;

    if (this.state.running && !!bnode) {
      this.checkNodes(this.nodeList, bnode);
      this.checkNodes(this.fauxs, bnode);
    }
  },

  /**
   * @method checkNodes
   * @private
   */
  checkNodes: function checkNodes(nl, bnode) {
    for (var node = nl.head; node; node = node.next) {
      if (_ccsx2.default.collide0(node.paddle.sprite, bnode.ball.sprite)) {
        this.check(node, bnode);
      }
    }
  },

  /**
   * Ball hits paddle.
   * @method check
   * @private
   */
  check: function check(node, bnode) {
    var pos = bnode.ball.sprite.getPosition(),
        bb4 = _ccsx2.default.bbox4(node.paddle.sprite),
        velo = bnode.velocity,
        x = pos.x,
        y = pos.y,
        hw2 = _ccsx2.default.halfHW(bnode.ball.sprite);

    if (_ccsx2.default.isPortrait()) {
      velo.vel.y = -velo.vel.y;
    } else {
      velo.vel.x = -velo.vel.x;
    }

    if (node.paddle.color === csts.P1_COLOR) {
      if (_ccsx2.default.isPortrait()) {
        y = bb4.top + hw2[1];
      } else {
        x = bb4.right + hw2[0];
      }
    } else {
      if (_ccsx2.default.isPortrait()) {
        y = bb4.bottom - hw2[1];
      } else {
        x = bb4.left - hw2[0];
      }
    }

    bnode.ball.sprite.setPosition(x, y);
    _asterix2.default.sfxPlay(node.paddle.snd);
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