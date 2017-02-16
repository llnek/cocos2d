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
              * @module s/render
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Render
 */
Render = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/render~Render
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/render~Render
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {},

  /**
   * @memberof module:s/render~Render
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {},

  /**
   * @memberof module:s/render~Render
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (this.state.running) {
      this.processMovement(dt);
    }
  },

  /**
   * @method processMovement
   * @private
   */
  processMovement: function processMovement(dt) {
    // background's moving rate is 16 pixel per second
    var locSkyHeight = this.state.backSkyDim.height,
        locBackSkyRe = this.state.backSkyRe,
        locBackSky = this.state.backSky,
        posy = locBackSky.sprite.getPositionY(),
        movingDist = 16 * dt,
        wz = _ccsx2.default.vrect(),
        currPosY = posy - movingDist;

    if (locSkyHeight + currPosY <= wz.height) {

      if (!!locBackSkyRe) {
        sjs.tne("The memory is leaking at moving background");
      }

      this.state.backSkyRe = this.state.backSky;
      locBackSkyRe = this.state.backSky;

      //create a new background
      this.state.backSky = _asterix2.default.pools.BackSkies.get();
      locBackSky = this.state.backSky;
      locBackSky.inflate({ x: 0,
        y: currPosY + locSkyHeight - 2 });
    } else {
      locBackSky.sprite.setPositionY(currPosY);
    }

    if (!!locBackSkyRe) {
      currPosY = locBackSkyRe.sprite.getPositionY() - movingDist;
      if (currPosY + locSkyHeight < 0) {
        this.state.backSkyRe = null;
        locBackSkyRe.deflate();
      } else {
        locBackSkyRe.sprite.setPositionY(currPosY);
      }
    }
  }
}, {

  /**
   * @memberof module:s/render~Render
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Render
});

/** @alias module:s/render */
var xbox = /** @lends xbox# */{

  /**
   * @property {Render} Render
   */
  Render: Render
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF