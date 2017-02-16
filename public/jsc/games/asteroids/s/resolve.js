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
              * @requires n/gnodes
              * @requires ash-js
              * @module s/Resolve
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
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
    this.ships = undef;
    this.engine = undef;
  },


  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
    this.engine = engine;
  },


  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var ship = this.ships.head;

    if (this.state.running) {
      this.checkMissiles();
      this.checkLasers();
      this.checkAstros();
      this.checkShip(ship);
    }
  },


  /**
   * @method checkMissiles
   * @private
   */
  checkMissiles: function checkMissiles() {
    var world = this.state.world;
    _asterix2.default.pools.Missiles.iter(function (m) {
      if (m.status) {
        if (m.HP <= 0 || _asterix2.default.outOfBound(_ccsx2.default.bbox4(m.sprite), world)) {
          m.deflate();
        }
      }
    });
  },


  /**
   * @method checkLasers
   * @private
   */
  checkLasers: function checkLasers() {
    var world = this.state.world;
    _asterix2.default.pools.Lasers.iter(function (b) {
      if (b.status) {
        if (b.HP <= 0 || _asterix2.default.outOfBound(_ccsx2.default.bbox4(b.sprite), world)) {
          b.deflate();
        }
      }
    });
  },


  /**
   * @method checkAstros
   * @private
   */
  checkAstros: function checkAstros() {
    _asterix2.default.pools.Astros1.iter(function (a) {
      if (a.status && a.HP <= 0) {
        _asterix2.default.fire('/game/players/earnscore', { score: a.value });
        _asterix2.default.factory.createAsteroids(a.rank + 1);
        a.deflate();
      }
    });
    _asterix2.default.pools.Astros2.iter(function (a) {
      if (a.status && a.HP <= 0) {
        _asterix2.default.fire('/game/players/earnscore', { score: a.value });
        _asterix2.default.factory.createAsteroids(a.rank + 1);
        a.deflate();
      }
    });
    _asterix2.default.pools.Astros3.iter(function (a) {
      if (a.status && a.HP <= 0) {
        _asterix2.default.fire('/game/players/earnscore', { score: a.value });
        a.deflate();
      }
    });
  },


  /**
   * @method checkShip
   * @private
   */
  checkShip: function checkShip(node) {
    var ship = node.ship;

    if (ship.status && ship.HP <= 0) {
      ship.deflate();
      _asterix2.default.fire('/game/players/killed');
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