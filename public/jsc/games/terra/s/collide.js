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
              * @module s/collide
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
    this.ships = null;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @method collide
   * @private
   */
  collide: function collide(a, b) {
    return _ccsx2.default.collide0(a.sprite, b.sprite);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.ships.head;

    if (this.state.running && !!node) {

      this.checkMissilesAliens();
      this.checkShipAliens(node);
      this.checkShipBombs(node);
      //this.checkMissilesBombs();
    }
  },

  /**
   * @method checkMissilesBombs
   * @private
   */
  checkMissilesBombs: function checkMissilesBombs() {
    var _this = this;

    var bombs = _asterix2.default.pools.Bombs,
        mss = _asterix2.default.pools.Missiles;
    bombs.iter(function (b) {
      mss.iter(function (m) {
        if (b.status && m.status && _this.collide(b, m)) {
          m.hurt();
          b.hurt();
        }
      });
    });
  },

  /**
   * @method checkMissilesAliens
   * @private
   */
  checkMissilesAliens: function checkMissilesAliens() {
    var _this2 = this;

    var enemies = _asterix2.default.pools.Baddies,
        mss = _asterix2.default.pools.Missiles;
    enemies.iter(function (en) {
      mss.iter(function (b) {
        if (en.status && b.status && _this2.collide(en, b)) {
          en.hurt();
          b.hurt();
        }
      });
    });
  },

  /**
   * @checkShipBombs
   * @private
   */
  checkShipBombs: function checkShipBombs(node) {
    var _this3 = this;

    var bombs = _asterix2.default.pools.Bombs,
        ship = node.ship;

    if (!ship.status) {
      return;
    }
    bombs.iter(function (b) {
      if (b.status && _this3.collide(b, ship)) {
        ship.hurt();
        b.hurt();
      }
    });
  },

  /**
   * @method checkShipAliens
   * @private
   */
  checkShipAliens: function checkShipAliens(node) {
    var _this4 = this;

    var enemies = _asterix2.default.pools.Baddies,
        ship = node.ship;

    if (!ship.status) {
      return;
    }
    enemies.iter(function (en) {
      if (en.status && _this4.collide(en, ship)) {
        ship.hurt();
        en.hurt();
      }
    });
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

//////////////////////////////////////////////////////////////////////////////
//EOF