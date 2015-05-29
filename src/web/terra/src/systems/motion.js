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
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/motions
 */
define('zotohlab/p/s/motions',

       ['zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/motions */
    let exports = {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
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
        this.ships=null;
      },
      /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
      },
      /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node = this.ships.head;
        if (this.state.running &&
           !!node) {
          this.processMotions(node,dt);
        }
      },
      /**
       * @method processMotions
       * @private
       */
      processMotions(node,dt) {
        this.scanInput(node, dt);
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
      },
      /**
       * @method processKeys
       * @private
       */
      processKeys(node,dt) {

        if (sh.main.keyPoll(cc.KEY.right)) {
          node.motion.right = true;
        }
        if (sh.main.keyPoll(cc.KEY.left)) {
          node.motion.left= true;
        }

        if (sh.main.keyPoll(cc.KEY.down)) {
          node.motion.down = true;
        }
        if (sh.main.keyPoll(cc.KEY.up)) {
          node.motion.up= true;
        }
      }

    });

    /**
       * @memberof module:zotohlab/p/s/motions~Motions
       * @property {Number} Priority
       */
    Motions.Priority = sh.ftypes.Motion;

    exports = Motions;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

