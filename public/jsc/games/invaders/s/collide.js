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
    this.aliens = undef;
    this.ships = undef;
    this.engine = undef;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.aliens = engine.getNodeList(_gnodes2.default.AlienMotionNode);
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
    this.engine = engine;
  },

  /**
   * @memberof module:s/collide~Collide
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var aliens = this.aliens.head,
        ship = this.ships.head;

    // 1. get rid of all colliding bombs & missiles.
    //this.checkMissilesBombs();
    // 2. kill aliens
    this.checkMissilesAliens(aliens);

    if (!!ship) {
      // 3. ship ok?
      this.checkShipBombs(ship);
      // 4. overruned by aliens ?
      if (!!aliens) {
        this.checkShipAliens(aliens, ship);
      }
    }
  },

  /**
   * @method collide
   * @private
   */
  collide: function collide(a, b) {
    return _ccsx2.default.collide0(a.sprite, b.sprite);
  },

  /**
   * @method checkMissilesBombs
   * @private
   */
  checkMissilesBombs: function checkMissilesBombs() {
    var mss = _asterix2.default.pools.Missiles,
        bbs = _asterix2.default.pools.Bombs,
        me = this;

    mss.iter(function (m) {
      bbs.iter(function (b) {
        if (b.status && m.status && me.collide(m, b)) {
          b.hurt();
          m.hurt();
        }
      });
    });
  },

  /**
   * @method checkMissilesAliens
   * @private
   */
  checkMissilesAliens: function checkMissilesAliens(node) {
    var mss = _asterix2.default.pools.Missiles,
        sqad = node.aliens,
        me = this;

    R.forEach(function (en) {
      if (en.status) {
        mss.iter(function (m) {
          if (m.status && me.collide(en, m)) {
            en.hurt();
            m.hurt();
          }
        });
      }
    }, sqad.aliens.pool);
  },

  /**
   * @method checkShipBombs
   * @private
   */
  checkShipBombs: function checkShipBombs(node) {
    var bbs = _asterix2.default.pools.Bombs,
        me = this,
        ship = node.ship;

    bbs.iter(function (b) {
      if (ship.status && b.status && me.collide(ship, b)) {
        ship.hurt();
        b.hurt();
      }
    });
  },

  /**
   * @method checkShipAliens
   * @private
   */
  checkShipAliens: function checkShipAliens(anode, snode) {
    var sqad = anode.aliens,
        ship = snode.ship,
        me = this,
        sz = sqad.aliens.length;

    R.forEach(function (en) {
      if (ship.status && en.status && me.collide(ship, en)) {
        ship.hurt();
        en.hurt();
      }
    }, sqad.aliens.pool);
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