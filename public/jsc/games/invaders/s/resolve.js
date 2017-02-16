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
              * @module s/resolve
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

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
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
    this.aliens = undef;
    this.ships = undef;
    this.engine = undef;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.aliens = engine.getNodeList(_gnodes2.default.AlienMotionNode);
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
    this.engine = engine;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var aliens = this.aliens.head,
        ship = this.ships.head;

    this.checkMissiles();
    this.checkBombs();
    this.checkAliens(aliens);
    this.checkShip(ship);
  },

  /**
   * @method checkMissiles
   * @private
   */
  checkMissiles: function checkMissiles() {
    var mss = _asterix2.default.pools.Missiles,
        ht = _ccsx2.default.vrect().height;

    mss.iter(function (m) {
      if (m.status) {
        if (m.pos().y >= ht || m.HP <= 0) {
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
    var bbs = _asterix2.default.pools.Bombs,
        bt = 0;

    bbs.iter(function (b) {
      if (b.status) {
        if (b.pos().y <= bt || b.HP <= 0) {
          b.deflate();
        }
      }
    });
  },

  /**
   * @method checkAliens
   * @private
   */
  checkAliens: function checkAliens(node) {
    var sqad = node.aliens;

    R.forEach(function (en) {
      if (en.status) {
        if (en.HP <= 0) {
          _asterix2.default.fire('/game/players/earnscore', {
            score: en.value });
          en.deflate();
        }
      }
    }, sqad.aliens.pool);
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
   * @property {Resolve}  Resolve
   */
  Resolve: Resolve
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF