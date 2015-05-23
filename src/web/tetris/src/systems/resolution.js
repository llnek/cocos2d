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
 * @module zotohlab/p/s/resolution
 */
define("zotohlab/p/s/resolution",

       ['zotohlab/p/s/priorities',
        "zotohlab/p/s/utils",
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/resolution */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class ResolutionSystem
     */
    ResolutionSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.arena=null;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.arena = engine.getNodeList(gnodes.ArenaNode);
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node= this.arena.head;
        if (this.state.running &&
           !!node) {

          const cmap= node.collision.tiles,
          motion = node.motion,
          layer=sh.main,
          shape= node.shell.shape;

          if (!!shape) {
            if (motion.right) {
              utils.shiftRight(layer, cmap, shape);
            }
            if (motion.left) {
              utils.shiftLeft(layer, cmap, shape);
            }
            if (motion.rotr) {
              utils.rotateRight(layer, cmap, shape);
            }
            if (motion.rotl) {
              utils.rotateLeft(layer, cmap, shape);
            }
            if (motion.down) {
              this.fastDrop(layer, node);
            }
          }
          motion.right = false;
          motion.left = false;
          motion.rotr = false;
          motion.rotl = false;
          motion.down = false;
        }
      },

      /**
       * @private
       */
      fastDrop(layer, node) {
        const dp= node.dropper;
        dp.timer=null;
        utils.setDropper(layer, dp, dp.dropRate, 9000);
      }

    });

    /**
     * @memberof module:zotohlab/p/s/resolution~ResolutionSystem
     * @property {Number} Priority
     */
    ResolutionSystem.Priority= pss.Resolve;

    exports= ResolutionSystem;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

