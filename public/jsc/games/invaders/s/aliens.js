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
              * @requires s/utils
              * @requires n/gnodes
              * @module s/aliens
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
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class Aliens */
Aliens = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/aliens~Aliens
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.alienMotions = undef;
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.alienMotions = engine.getNodeList(_gnodes2.default.AlienMotionNode);
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.alienMotions.head;

    if (this.state.running && !!node) {
      this.processMovement(node, dt);
      this.processBombs(node, dt);
    }
  },

  /**
   * @method processMovement
   * @private
   */
  processMovement: function processMovement(node, dt) {
    var lpr = node.looper,
        sqad = node.aliens,
        tm = lpr.timers[0];

    if (_ccsx2.default.timerDone(tm)) {
      this.maybeShuffleAliens(sqad);
      lpr.timers[0] = _ccsx2.default.undoTimer(tm);
    }
  },

  /**
   * @method processBombs
   * @private
   */
  processBombs: function processBombs(node, dt) {
    var lpr = node.looper,
        sqad = node.aliens,
        tm = lpr.timers[1];

    if (_ccsx2.default.timerDone(tm)) {
      this.checkBomb(sqad);
      lpr.timers[1] = _ccsx2.default.undoTimer(tm);
    }
  },

  /**
   * @method checkBomb
   * @private
   */
  checkBomb: function checkBomb(sqad) {
    var rc = [],
        pos = void 0,
        n = void 0;
    for (n = 0; n < sqad.aliens.pool.length; ++n) {
      if (sqad.aliens.pool[n].status) {
        rc.push(n);
      }
    }
    if (rc.length > 0) {
      n = rc.length === 1 ? 0 : sjs.rand(rc.length);
      pos = sqad.aliens.pool[n].sprite.getPosition();
      this.dropBomb(pos.x, pos.y - 4);
    }
  },

  /**
   * @method dropBomb
   * @private
   */
  dropBomb: function dropBomb(x, y) {
    var bbs = _asterix2.default.pools.Bombs,
        ent = bbs.get();

    if (!sjs.echt(ent)) {
      _asterix2.default.factory.createBombs(25);
      ent = bbs.get();
    }

    sjs.loggr.debug('got one bomb from pool');
    ent.inflate({ x: x, y: y });
  },

  /**
   * @method maybeShuffleAliens
   * @private
   */
  maybeShuffleAliens: function maybeShuffleAliens(sqad) {
    var b = sqad.stepx > 0 ? this.findMaxX(sqad) : this.findMinX(sqad),
        ok = void 0;
    if (!!b && b.status) {
      ok = this.testDirX(b, sqad.stepx) ? this.doShuffle(sqad) : this.doForward(sqad);
      if (ok) {
        _asterix2.default.sfxPlay('bugs-march');
      }
    }
  },

  /**
   * @method testDirX
   * @private
   */
  testDirX: function testDirX(b, stepx) {
    var wz = _ccsx2.default.vrect(),
        wb = _ccsx2.default.vbox(),
        sp = b.sprite;
    if (stepx > 0) {
      return _ccsx2.default.getRight(sp) + stepx < wb.right - 2 / 40 * wz.width;
    } else {
      return _ccsx2.default.getLeft(sp) + stepx > wb.left + 2 / 40 * wz.width;
    }
  },

  /**
   * @method shuffleOneAlien
   * @private
   */
  shuffleOneAlien: function shuffleOneAlien(a, stepx) {
    var pos = a.sprite.getPosition();
    a.sprite.setPosition(pos.x + stepx, pos.y);
  },

  /**
   * @method forwardOneAlien
   * @private
   */
  forwardOneAlien: function forwardOneAlien(a, delta) {
    var pos = a.sprite.getPosition(),
        wz = _ccsx2.default.vrect(),
        wb = _ccsx2.default.vbox();
    a.sprite.setPosition(pos.x, pos.y - delta);
  },

  /**
   * @method doShuffle
   * @private
   */
  doShuffle: function doShuffle(sqad) {
    var _this = this;

    var rc = R.filter(function (a) {
      return a.status;
    }, sqad.aliens.pool);
    R.forEach(function (a) {
      _this.shuffleOneAlien(a, sqad.stepx);
    }, rc);
    return rc.length > 0;
  },

  /**
   * @method doForward
   * @private
   */
  doForward: function doForward(sqad) {
    var _this2 = this;

    var rc = R.filter(function (a) {
      return a.status;
    }, sqad.aliens.pool),
        delta = Math.abs(sqad.stepx);
    R.forEach(function (a) {
      _this2.forwardOneAlien(a, delta);
    }, rc);
    sqad.stepx = -sqad.stepx;
    return rc.length > 0;
  },

  /**
   * @method findMinX
   * @private
   */
  findMinX: function findMinX(sqad) {
    return R.minBy(function (a) {
      if (a.status) {
        return _ccsx2.default.getLeft(a.sprite);
      } else {
        return Number.MAX_VALUE;
      }
    }, sqad.aliens.pool);
  },

  /**
   * @method finxMaxX
   * @private
   */
  findMaxX: function findMaxX(sqad) {
    return R.maxBy(function (a) {
      if (a.status) {
        return _ccsx2.default.getRight(a.sprite);
      } else {
        return 0;
      }
    }, sqad.aliens.pool);
  }
}, {

  /**
   * @memberof module:s/aliens~Aliens
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Motion
});

/** @alias module:s/aliens */
var xbox = /** @lends xbox# */{
  /**
   * @property {Aliens} Aliens
   */
  Aliens: Aliens
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF