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
              * @requires zotohlab/asx/pool
              * @requires n/gnodes
              * @requires n/cobjs
              * @module s/stager
              */

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _pool = require('zotohlab/asx/pool');

var _pool2 = _interopRequireDefault(_pool);

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
    this.shipMotions = null;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @memberof module:s/stager~Stager
   * @method initAlienSize
   */
  initAlienSize: function initAlienSize() {
    //pick purple since it is the largest
    this.state.alienSize = _ccsx2.default.csize('purple_bug_0.png');
  },

  /**
   * @memberof module:s/stager~Stager
   * @method initShipSize
   */
  initShipSize: function initShipSize() {
    this.state.shipSize = _ccsx2.default.csize('ship_0.png');
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
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly() {
    _asterix2.default.pools.Missiles = _pool2.default.reify();
    _asterix2.default.pools.Bombs = _pool2.default.reify();
    _asterix2.default.pools.Explosions = _pool2.default.reify();

    this.initAlienSize();
    this.initShipSize();

    _asterix2.default.factory.createMissiles();
    _asterix2.default.factory.createBombs();
    _asterix2.default.factory.createExplosions();

    _asterix2.default.factory.createAliens();
    _asterix2.default.factory.createShip();

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
    if (this.state.running && !!this.ships.head) {
      var ship = this.ships.head.ship,
          pos = ship.pos(),
          x = pos.x,
          y = pos.y,
          wz = _ccsx2.default.vrect(),
          cur = cc.pAdd(pos, cc.p(evt.delta.x, 0));
      cur = cc.pClamp(cur, cc.p(0, 0), cc.p(wz.width, wz.height));
      ship.setPos(cur.x, cur.y);
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