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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movemissiles
 */
define('zotohlab/p/s/movemissiles',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movemissiles */
    var exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class MovementMissiles
     */
    MovementMissiles = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MovementMissiles
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MovementMissiles
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MovementMissiles
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/movemissiles~MovementMissiles
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var mss= sh.pools.Missiles,
        pos,
        y;

        mss.iter(function(m) {
          pos= m.pos();
          y = pos.y + dt * m.vel.y;
          m.setPos(pos.x, y);
        });
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movemissiles~MovementMissiles
     * @property {Number} Priority
     */
    MovementMissiles.Priority= pss.Movement;

    exports= MovementMissiles;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

