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
              * @module s/stager
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
/** * @class Stager */
Stager = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/stager~Stager
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.paddleMotions = null;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.paddles = engine.getNodeList(_gnodes2.default.PaddleMotionNode);
  },

  /**
   * @memberof module:s/stager~Stager
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (_ccsx2.default.isTransitioning()) {
      return false;
    }
    if (!this.inited) {
      this.onceOnly();
      this.inited = true;
    }
  },

  /**
   * @memberof module:s/stager~Stager
   * @method initBrickSize
   */
  initBrickSize: function initBrickSize() {
    this.state.candySize = _ccsx2.default.csize('red_candy.png');
  },

  /**
   * @memberof module:s/stager~Stager
   * @method initBallSize
   */
  initBallSize: function initBallSize() {
    this.state.ballSize = _ccsx2.default.csize('ball.png');
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly() {
    this.initBrickSize();
    this.initBallSize();
    _asterix2.default.factory.createBricks();
    _asterix2.default.factory.createPaddle();
    _asterix2.default.factory.createBall();

    _ccsx2.default.onTouchOne(this);
    _ccsx2.default.onMouse(this);
    _asterix2.default.main.pkInput();
  },

  /**
   * @method fire
   * @private
   */
  fire: function fire(t, evt) {
    if ('/touch/one/move' === t || '/mouse/move' === t) {} else {
      return;
    }
    if (this.state.running && !!this.paddles.head) {
      var p = this.paddles.head.paddle,
          pos = p.pos(),
          x = pos.x,
          y = pos.y,
          wz = _ccsx2.default.vrect(),
          cur = cc.pAdd(pos, cc.p(evt.delta.x, 0));
      cur = cc.pClamp(cur, cc.p(0, 0), cc.p(wz.width, wz.height));
      p.setPos(cur.x, cur.y);
    }
  }
}, {

  /**
   * @memberof module:s/stager~Stager
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.PreUpdate
});

/** @alias module:s/stager */
var xbox = /** @lends xbox# */{

  /**
   * @property {Stager} Stager
   */
  Stager: Stager
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF