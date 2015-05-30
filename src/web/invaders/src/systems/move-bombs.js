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
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movebombs
 */
define('zotohlab/p/s/movebombs',

       ['zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (utils, gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movebombs */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class MovementBombs
     */
    MovementBombs = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/movebombs~MovementBombs
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },
      /**
       * @memberof module:zotohlab/p/s/movebombs~MovementBombs
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
      },
      /**
       * @memberof module:zotohlab/p/s/movebombs~MovementBombs
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
      },
      /**
       * @memberof module:zotohlab/p/s/movebombs~MovementBombs
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        let bbs= sh.pools.Bombs,
        pos,
        y;

        bbs.iter((b) => {
          if (b.status) {
            pos= b.pos();
            y = pos.y + dt * b.vel.y;
            b.setPos(pos.x, y);
          }
        });
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movebombs~MovementBombs
     * @property {Number} Priority
     */
    MovementBombs.Priority= xcfg.ftypes.Move;

    exports= MovementBombs;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF




