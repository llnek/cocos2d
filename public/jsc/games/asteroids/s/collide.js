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

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
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
    this.ships = undef;
    this.engine = undef;
  },


  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
    this.engine = engine;
  },


  /**
   * @memberof module:s/collide~Collide
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var ship = this.ships.head;

    if (this.state.running) {

      this.checkMissilesRocks();

      if (!!ship) {
        this.checkShipBombs(ship);
        this.checkShipRocks(ship);
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
   * @method checkMissilesRocks
   * @private
   */
  checkMissilesRocks: function checkMissilesRocks() {
    var me = this;
    _asterix2.default.pools.Missiles.iter(function (m) {
      if (m.status && m.HP > 0) {
        _asterix2.default.pools.Astros3.iter(function (a) {
          if (a.status && me.collide(m, a)) {
            m.hurt();
            a.hurt();
          }
        });
      }
      if (m.status && m.HP > 0) {
        _asterix2.default.pools.Astros2.iter(function (a) {
          if (a.status && me.collide(m, a)) {
            m.hurt();
            a.hurt();
          }
        });
      }
      if (m.status && m.HP > 0) {
        _asterix2.default.pools.Astros1.iter(function (a) {
          if (a.status && me.collide(m, a)) {
            m.hurt();
            a.hurt();
          }
        });
      }
    });
  },


  /**
   * @method checkShipBombs
   * @private
   */
  checkShipBombs: function checkShipBombs(node) {
    var ship = node.ship,
        me = this;
    _asterix2.default.pools.Lasers.iter(function (b) {
      if (b.status && ship.status && me.collide(b, ship)) {
        ship.hurt();
        b.hurt();
      }
    });
  },


  /**
   * @method checkShipRocks
   * @private
   */
  checkShipRocks: function checkShipRocks(node) {
    var ship = node.ship,
        me = this;

    if (ship.status && ship.HP > 0) {
      _asterix2.default.pools.Astros3.iter(function (a) {
        if (a.status && me.collide(ship, a)) {
          ship.hurt();
          a.hurt();
        }
      });
    }
    if (ship.status && ship.HP > 0) {
      _asterix2.default.pools.Astros2.iter(function (a) {
        if (a.status && me.collide(ship, a)) {
          ship.hurt();
          a.hurt();
        }
      });
    }
    if (ship.status && ship.HP > 0) {
      _asterix2.default.pools.Astros1.iter(function (a) {
        if (a.status && me.collide(ship, a)) {
          ship.hurt();
          a.hurt();
        }
      });
    }
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