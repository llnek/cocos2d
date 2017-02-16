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
              * @module s/resolve
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
 * @class Resolve
 */
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
    this.ships = null;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.ships.head;

    if (this.state.running && !!node) {

      this.checkMissiles();
      this.checkBombs();
      this.checkAliens();
      this.checkShip(node);
    }
  },

  /**
   * @method onBulletDeath
   * @private
   */
  onBulletDeath: function onBulletDeath(b) {
    var pe = _asterix2.default.pools.HitEffects,
        pos = b.pos(),
        e = pe.get();

    if (!e) {
      _asterix2.default.factory.createHitEffects();
      e = pe.get();
    }
    e.inflate({ x: pos.x, y: pos.y });
  },

  /**
   * @method checkMissiles
   * @private
   */
  checkMissiles: function checkMissiles() {
    var _this = this;

    var box = _asterix2.default.main.getEnclosureBox(),
        pos = void 0;

    _asterix2.default.pools.Missiles.iter(function (m) {
      if (m.status) {
        pos = m.sprite.getPosition();
        if (m.HP <= 0 || !_ccsx2.default.pointInBox(box, pos)) {
          _this.onBulletDeath(m);
          m.deflate();
        }
      }
    });
  },

  /**
   * @method checkBombs
   * @private
   */
  checkBombs: function checkBombs() {
    var _this2 = this;

    var box = _asterix2.default.main.getEnclosureBox(),
        pos = void 0;

    _asterix2.default.pools.Bombs.iter(function (b) {
      if (b.status) {
        pos = b.sprite.getPosition();
        if (b.HP <= 0 || !_ccsx2.default.pointInBox(box, pos)) {
          _this2.onBulletDeath(b);
          b.deflate();
        }
      }
    });
  },

  /**
   * @method onEnemyDeath
   * @private
   */
  onEnemyDeath: function onEnemyDeath(alien) {
    var pe = _asterix2.default.pools.Explosions,
        ps = _asterix2.default.pools.Sparks,
        pos = alien.pos(),
        e = pe.get(),
        s = ps.get();
    if (!e) {
      _asterix2.default.factory.createExplosions();
      e = pe.get();
    }
    e.inflate({ x: pos.x, y: pos.y });
    if (!s) {
      _asterix2.default.factory.createSparks();
      s = ps.get();
    }
    s.inflate({ x: pos.x, y: pos.y });
    _asterix2.default.sfxPlay('explodeEffect');
  },

  /**
   * @method onShipDeath
   * @private
   */
  onShipDeath: function onShipDeath(ship) {
    var pe = _asterix2.default.pools.Explosions,
        pos = ship.pos(),
        e = pe.get();

    if (!e) {
      _asterix2.default.factory.createExplosions();
      e = pe.get();
    }
    e.inflate({ x: pos.x, y: pos.y });
    _asterix2.default.sfxPlay('shipDestroyEffect');
  },

  /**
   * @method checkAliens
   * @private
   */
  checkAliens: function checkAliens() {
    var _this3 = this;

    var box = _asterix2.default.main.getEnclosureBox(),
        pos = void 0;

    _asterix2.default.pools.Baddies.iter(function (a) {
      if (a.status) {
        pos = a.sprite.getPosition();
        if (a.HP <= 0 || !_ccsx2.default.pointInBox(box, pos)) {
          _this3.onEnemyDeath(a);
          a.deflate();
          _asterix2.default.fire('/game/players/earnscore', { score: a.value });
        }
      }
    });
  },

  /**
   * @method checkShip
   * @private
   */
  checkShip: function checkShip(node) {
    var ship = node.ship;
    if (ship.status) {
      if (ship.HP <= 0) {
        this.onShipDeath(ship);
        ship.deflate();
        _asterix2.default.fire('/game/players/killed');
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
   * @property {Resolve} Resolve
   */
  Resolve: Resolve
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF