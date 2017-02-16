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
              * @module s/movemissiles
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    undef = void 0,
    R = sjs.ramda,


/**
 * @class MoveMissiles
 */
MoveMissiles = _asterix2.default.Ashley.sysDef({

  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },


  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {},


  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {},


  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var pos = void 0,
        x = void 0,
        y = void 0;

    _asterix2.default.pools.Missiles.iter(function (m) {
      if (m.status) {
        pos = m.pos();
        y = pos.y + dt * m.vel.y * m.speed;
        x = pos.x + dt * m.vel.x * m.speed;
        m.setPos(x, y);
      }
    });
  }
});

/**
 * @memberof module:s/movemissiles~MoveMissiles
 * @property {Number} Priority
 */
MoveMissiles.Priority = xcfg.ftypes.Move;

/** @alias module:s/movemissiles */
var xbox = /** @lends xbox# */{

  /**
   * @property {MoveMissiles} MoveMissiles
   */
  MoveMissiles: MoveMissiles
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF