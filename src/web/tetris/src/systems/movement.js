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
 * @requires zotohlab/p/components
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movement
 */
define("zotohlab/p/s/movement",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/components',
        'zotohlab/p/gnodes',
        'zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, cobjs, gnodes, utils, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movement */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MovementSystem
     */
    MovementSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.arena=null;
      },

      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.arena = engine.getNodeList(gnodes.ArenaNode);
      },

      /**
       * @memberof module:zotohlab/p/s/movement~MovementSystem
       * @method update
       * @param {Number} dt
       */
      update: function(dt) {
        var node= this.arena.head;
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
       * @private
       */
      doFall: function(layer, node) {
        var cmap= node.collision.tiles,
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
    MovementSystem.Priority= pss.Move;

    exports = MovementSystem;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

