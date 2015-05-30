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
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movebombs
 */
define('zotohlab/p/s/movebombs',

       ['zotohlab/p/elements',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, utils, gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movebombs */
    let exports = {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    //////////////////////////////////////////////////////////////////////////
    undef,
    /**
     * @class MoveBombs
     */
    MoveBombs = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/movebombs~MoveBombs
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },
      /**
       * @memberof module:zotohlab/p/s/movebombs~MoveBombs
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
      },
      /**
       * @memberof module:zotohlab/p/s/movebombs~MoveBombs
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
      },
      /**
       * @memberof module:zotohlab/p/s/movebombs~MoveBombs
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        if (this.state.running) {
          this.processMovement(dt);
        }
      },
      /**
       * @method moveBomb
       * @private
       */
      moveBomb(m, dt) {
        const pos = m.sprite.getPosition();
        m.sprite.setPosition(pos.x + m.vel.x * dt,
                             pos.y + m.vel.y * dt);
      },
      /**
       * @method processMovement
       * @private
       */
      processMovement(dt) {
        sh.pools.Bombs.iter((b) => {
          if (b.status) {
            this.moveBomb(b,dt);
          }
        });
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movebombs~MoveBombs
     * @property {Number} Priority
     */
    MoveBombs.Priority = xcfg.ftypes.Move;

    exports= MoveBombs;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF
