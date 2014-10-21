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

define("zotohlab/p/s/resolution", ["zotohlab/p/s/utils",
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    ResolutionSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.arena=null;
      },

      addToEngine: function(engine) {
        this.arena = engine.getNodeList(gnodes.ArenaNode);
      },

      update: function (dt) {
        var node= this.arena.head;
        if (this.state.running &&
           !!node) {

          var cmap= node.collision.tiles,
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

      fastDrop: function(layer, node) {
        var dp= node.dropper;
        dp.timer=null;
        utils.setDropper(layer, dp, dp.dropRate, 9000);
      }

    });

    return ResolutionSystem;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

