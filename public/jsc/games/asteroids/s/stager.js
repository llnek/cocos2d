// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires zotohlab/asx/ccsx
              * @requires zotohlab/asx/pool
              * @requires n/cobjs
              * @module s/stager
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _pool = require('zotohlab/asx/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
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
  removeFromEngine: function removeFromEngine(engine) {},


  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {},


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
    _asterix2.default.pools.Lasers = _pool2.default.reify();

    _asterix2.default.pools.Astros3 = _pool2.default.reify();
    _asterix2.default.pools.Astros2 = _pool2.default.reify();
    _asterix2.default.pools.Astros1 = _pool2.default.reify();

    this.initAsteroidSizes();
    this.initPlayerSize();
    this.initUfoSize();

    _asterix2.default.factory.createAsteroids(csts.P_AS1);
    _asterix2.default.factory.createShip();

    //ccsx.onTouchOne(this.ebus);
    //ccsx.onMouse(this.ebus);
    _asterix2.default.main.pkInput();
  },

  /**
   * @method initAsteroidSizes
   * @private
   */
  initAsteroidSizes: function initAsteroidSizes() {
    this.state.astro3 = _ccsx2.default.csize('rock_small.png');
    this.state.astro2 = _ccsx2.default.csize('rock_med.png');
    this.state.astro1 = _ccsx2.default.csize('rock_large.png');
  },

  /**
   * @method initPlayerSize
   * @private
   */
  initPlayerSize: function initPlayerSize() {
    this.state.playerSize = _ccsx2.default.csize('rship_0.png');
  },

  /**
   * @method initUfoSize
   * @private
   */
  initUfoSize: function initUfoSize() {
    this.state.ufoSize = _ccsx2.default.csize('ufo.png');
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