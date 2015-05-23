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
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movelasers
 */
define('zotohlab/p/s/movelasers',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movelasers */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MovementBombs
     */
    MovementBombs = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/movelasers~MovementBombs
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/movelasers~MovementBombs
       * @method removeFromEngine
       * @param {Object} options
       */
      removeFromEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/movelasers~MovementBombs
       * @method addToEngine
       * @param {Object} options
       */
      addToEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/movelasers~MovementBombs
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        let pos,
        x, y;

        sh.pools.Lasers.iter((b) => {
          if (b.status) {
            pos= b.pos();
            y = pos.y + dt * b.vel.y * b.speed;
            x = pos.x + dt * b.vel.x * b.speed;
            b.setPos(x, y);
          }
        });
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movelasers~MovementBombs
     * @property {Number} Priority
     */
    MovementBombs.Priority = pss.Movement;

    exports= MovementBombs;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

