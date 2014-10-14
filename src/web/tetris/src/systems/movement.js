// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

define("zotohlab/p/s/movement", ["zotohlab/p/components",
                                "zotohlab/p/gnodes",
                                'zotohlab/p/s/utils',
                                'cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/xcfg',
                                'zotohlab/asx/ccsx',
                                'ash-js'],

  function (cobjs, gnodes, utils, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    MovementSystem = Ash.System.extend({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.nodeList=null;
      },

      addToEngine: function(engine) {
        this.nodeList = engine.getNodeList(gnodes.ArenaNode);
      },

      update: function(dt) {
        var node= this.nodeList.head;
        if (this.state.running &&
           !!node) {

          if (ccsx.timerDone(node.dropper.timer) &&
              !!node.shell.shape) {
            node.dropper.timer= ccsx.releaseTimer(node.dropper.timer);
            this.doFall(sh.main, node);
          }

        }
      },

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

            //
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

    return MovementSystem;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

