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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/motions
 */
define('zotohlab/p/s/motions', ['zotohlab/p/gnodes',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class Motions
     */
    Motions = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
      },

      /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node = this.nodeList.head;
        if (this.state.running &&
           !!node) {
          this.processMotions(node,dt);
        }
      },

      /**
       * @method scanInput
       * @private
       */
      scanInput(node, dt) {
        if (cc.sys.capabilities['keyboard'] &&
            !cc.sys.isNative) {
          this.processKeys(node,dt);
        }
        else
        if (cc.sys.capabilities['mouse']) {
        }
        else
        if (cc.sys.capabilities['touches']) {
        }
      },

      /**
       * @method processMotions
       * @private
       */
      processMotions(node,dt) {
      },

      /**
       * @method processKeys
       * @private
       */
      processKeys(node,dt) {

        if (sh.main.keyPoll(cc.KEY.right)) {
        }
        if (sh.main.keyPoll(cc.KEY.left)) {
        }

        if (sh.main.keyPoll(cc.KEY.down)) {
        }
        if (sh.main.keyPoll(cc.KEY.up)) {
        }

      }

    });

    exports = Motions;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

