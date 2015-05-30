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
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movemissiles
 */
define('zotohlab/p/s/movemissiles',

       ['zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (utils, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movemissiles */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    R= sjs.ramda,

    /**
     * @class MoveMissiles
     */
    MoveMissiles = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MoveMissiles
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MoveMissiles
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MoveMissiles
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MoveMissiles
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        let pos,
        x,y;

        sh.pools.Missiles.iter((m) => {
          if (m.status) {
            pos= m.pos();
            y = pos.y + dt * m.vel.y * m.speed;
            x = pos.x + dt * m.vel.x * m.speed;
            m.setPos(x, y);
          }
        });
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movemissiles~MoveMissiles
     * @property {Number} Priority
     */
    MoveMissiles.Priority = xcfg.ftypes.Move;

    exports= MoveMissiles;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

