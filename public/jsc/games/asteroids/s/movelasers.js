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
              * @module s/movelasers
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


/**
 * @class MovementBombs
 */
MovementBombs = _asterix2.default.Ashley.sysDef({

  /**
   * @memberof module:s/movelasers~MovementBombs
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },


  /**
   * @memberof module:s/movelasers~MovementBombs
   * @method removeFromEngine
   * @param {Object} options
   */
  removeFromEngine: function removeFromEngine(engine) {},


  /**
   * @memberof module:s/movelasers~MovementBombs
   * @method addToEngine
   * @param {Object} options
   */
  addToEngine: function addToEngine(engine) {},


  /**
   * @memberof module:s/movelasers~MovementBombs
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var pos = void 0,
        x = void 0,
        y = void 0;

    _asterix2.default.pools.Lasers.iter(function (b) {
      if (b.status) {
        pos = b.pos();
        y = pos.y + dt * b.vel.y * b.speed;
        x = pos.x + dt * b.vel.x * b.speed;
        b.setPos(x, y);
      }
    });
  }
});

/**
 * @memberof module:s/movelasers~MovementBombs
 * @property {Number} Priority
 */
MovementBombs.Priority = xcfg.ftypes.Move;

/** @alias module:s/movelasers */
var xbox = /** @lends xbox# */{

  /**
   * @property {MovementBombs}  MovementBombs
   */
  MovementBombs: MovementBombs
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF