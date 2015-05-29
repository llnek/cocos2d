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
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movement
 */
define("zotohlab/p/s/movement",

       ['zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'zotohlab/p/s/utils',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, gnodes, utils, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movement */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @class MovementSystem
     */
    MovementSystem = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state = options;
      },
      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.arena=null;
      },
      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.arena = engine.getNodeList(gnodes.ArenaNode);
      },
      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node= this.arena.head;
        if (this.state.running &&
           !!node) {

          if (ccsx.timerDone(node.dropper.timer) &&
              !!node.shell.shape) {
            node.dropper.timer= ccsx.releaseTimer(node.dropper.timer);
            this.doFall(sh.main, node);
          }

        }
      },
      /**
       * @method doFall
       * @private
       */
      doFall(layer, node) {
        const cmap= node.collision.tiles,
        shape= node.shell.shape,
        emap= node.blocks.grid,
        pu= node.pauser,
        dp= node.dropper;

        if (!!shape) {
          if (! utils.moveDown(layer, cmap, shape)) {

            // lock shape in place
            utils.lock(node, shape);

            // what is this???
            if (! pu.timer) {
              node.shell.shape= null;
              shape.bricks=[];
            }

            node.shell.shape= null;
            shape.bricks=[];

          } else {
            utils.initDropper(layer, dp);
          }
        }
      }

    });

    /**
     * @memberof module:zotohlab/p/s/movement~MovementSystem
     * @property {Number} Priority
     */
    MovementSystem.Priority= sh.ftypes.Move;

    exports = MovementSystem;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

