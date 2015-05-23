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
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movemissiles
 */
define('zotohlab/p/s/movemissiles',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/elements',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, cobjs, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movemissiles */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
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
        if (this.state.running) {
          this.processMovement(dt);
        }
      },

      /**
       * @private
       */
      moveMissile(m, dt) {
        const pos = m.sprite.getPosition();
        m.sprite.setPosition(pos.x + m.vel.x * dt,
                             pos.y + m.vel.y * dt);
      },

      /**
       * @private
       */
      processMovement(dt) {
        const me=this;
        sh.pools.Missiles.iter((v) => {
          if (v.status) {
            me.moveMissile(v,dt);
          }
        });
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movemissiles~MoveMissiles
     * @property {Number} Priority
     */
    MoveMissiles.Priority = pss.Movement;

    exports= MoveMissiles;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

