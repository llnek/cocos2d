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

/**
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asterix
 * @module zotohlab/p/s/rendering
 */
define('zotohlab/p/s/rendering',

       ['zotohlab/asx/ccsx',
        'zotohlab/asterix'],

  function (ccsx, sh) { "use strict";

    /** @alias module:zotohlab/p/s/rendering */
    let exports = {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class Rendering
     */
    Rendering = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/rendering~Rendering
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },
      /**
       * @memberof module:zotohlab/p/s/rendering~Rendering
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
      },
      /**
       * @memberof module:zotohlab/p/s/rendering~Rendering
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
      },
      /**
       * @memberof module:zotohlab/p/s/rendering~Rendering
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        if (this.state.running) {
          this.processMovement(dt);
        }
      },
      /**
       * @method processMovement
       * @private
       */
      processMovement(dt) {
        // background's moving rate is 16 pixel per second
        let locSkyHeight = this.state.backSkyDim.height,
        locBackSkyRe = this.state.backSkyRe,
        locBackSky = this.state.backSky,
        posy= locBackSky.sprite.getPositionY(),
        movingDist = 16 * dt,
        wz = ccsx.vrect(),
        currPosY = posy - movingDist;

        if (locSkyHeight + currPosY <= wz.height) {

          if (!!locBackSkyRe) {
            sjs.tne("The memory is leaking at moving background");
          }

          this.state.backSkyRe = this.state.backSky;
          locBackSkyRe = this.state.backSky;

          //create a new background
          this.state.backSky = sh.pools.BackSkies.get();
          locBackSky = this.state.backSky;
          locBackSky.inflate({ x: 0,
                               y: currPosY + locSkyHeight - 2});
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

    });

    /**
     * @memberof module:zotohlab/p/s/rendering~Rendering
     * @property {Number} Priority
     */
    Rendering.Priority = xcfg.ftypes.Render;

    exports = Rendering;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

