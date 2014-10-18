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

define('zotohlab/p/s/motions', ['zotohlab/p/gnodes',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    undef,
    Motions = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
      },

      update: function (dt) {
        var node = this.ships.head;
        if (this.state.running &&
           !!node) {
          this.processMotions(node,dt);
        }
      },

      processMotions: function(node,dt) {
        this.scanInput(node, dt);
      },

      scanInput: function(node, dt) {
        if (cc.sys.capabilities['keyboard'] &&
            !cc.sys.isNative) {
          this.processKeys(node,dt);
        }
      },

      processKeys: function(node,dt) {

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

    return Motions;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

