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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/resolution
 */
define('zotohlab/p/s/resolution', ['zotohlab/p/elements',
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (cobjs, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/resolution */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class Resolution
     */
    Resolution = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
        this.inited=false;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method update
       * @param {Number} dt
       */
      update(dt) {
      }

    });

    exports= Resolution;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

