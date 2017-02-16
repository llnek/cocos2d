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
              * @module s/resolve
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
/** * @class Resolve */
Resolve = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/resolve~Resolve
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.nodeList = null;
    this.fauxs = null;
    this.balls = null;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.fauxs = engine.getNodeList(_gnodes2.default.FauxPaddleNode);
    this.nodeList = engine.getNodeList(_gnodes2.default.PaddleNode);
    this.balls = engine.getNodeList(_gnodes2.default.BallNode);
    this.engine = engine;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var bnode = this.balls.head,
        rc = void 0;

    if (this.state.mode === _asterix2.default.gtypes.ONLINE_GAME) {
      return;
    }

    if (this.state.running && !!bnode) {

      rc = this.checkNodes(this.nodeList, bnode);
      if (rc !== false) {
        rc = this.checkNodes(this.fauxs, bnode);
      }
    }

    return rc;
  },

  /**
   * @method checkNodes
   * @private
   */
  checkNodes: function checkNodes(nl, bnode) {
    for (var node = nl.head; node; node = node.next) {
      var winner = this.check(node, bnode);
      if (winner) {
        this.onWin(winner);
        return false;
      }
    }
  },

  /**
   * @method onWin
   * @private
   */
  onWin: function onWin(winner) {
    var bnode = this.balls.head;
    //sjs.loggr.debug("winner ====== " + winner);
    bnode.ball.sprite.setPosition(this.state.ball.x, this.state.ball.y);
    bnode.velocity.vel.x = this.state.ball.speed * sjs.randSign();
    bnode.velocity.vel.y = this.state.ball.speed * sjs.randSign();
    _asterix2.default.fire('/hud/score/update', { score: 1, color: winner });
  },

  //check win
  /**
   * @method check
   * @private
   */
  check: function check(node, bnode) {
    var b = bnode.ball,
        pd = node.paddle,
        pc = pd.color,
        bp = b.sprite.getPosition();

    if (_ccsx2.default.isPortrait()) {

      if (pc === csts.P1_COLOR) {
        return bp.y < _ccsx2.default.getBottom(pd.sprite) ? csts.P2_COLOR : undef;
      } else {
        return bp.y > _ccsx2.default.getTop(pd.sprite) ? csts.P1_COLOR : undef;
      }
    } else {

      if (pc === csts.P1_COLOR) {
        return bp.x < _ccsx2.default.getLeft(pd.sprite) ? csts.P2_COLOR : undef;
      } else {
        return bp.x > _ccsx2.default.getRight(pd.sprite) ? csts.P1_COLOR : undef;
      }
    }
  }
}, {

  /**
   * @memberof module:s/resolve~Resolve
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Resolve
});

/** @alias module:s/resolve */
var xbox = /** @lends xbox# */{
  /**
   * @property {Resolve}  Resolve
   */
  Resolve: Resolve
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF