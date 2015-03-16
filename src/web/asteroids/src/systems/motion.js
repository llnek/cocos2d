// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define('zotohlab/p/s/motions', ['zotohlab/p/gnodes',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MotionControls = sh.Ashley.sysDef({

      constructor: function(options) {
        this.throttleWait= 80;
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.ops={};
        this.initKeyOps();
      },

      update: function (dt) {
        var node= this.ships.head;

        if (this.state.running &&
           !!node) {
          this.scanInput(node, dt);
        }
      },

      scanInput: function(node, dt) {
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

      processKeys: function(node,dt) {
        if (sh.main.keyPoll(cc.KEY.right)) {
          this.ops.rotRight(node, dt);
        }
        if (sh.main.keyPoll(cc.KEY.left)) {
          this.ops.rotLeft(node, dt);
        }
        if (sh.main.keyPoll(cc.KEY.down)) {
          this.ops.sftDown(node, dt);
        }
        if (sh.main.keyPoll(cc.KEY.up)) {
          this.ops.sftUp(node, dt);
        }
      },

      shiftDown: function(node, dt) {
        node.motion.down=true;
      },

      shiftUp: function(node, dt) {
        node.motion.up=true;
      },

      rotateRight: function(node, dt) {
        node.motion.right=true;
      },

      rotateLeft: function(node, dt) {
        node.motion.left=true;
      },

      initKeyOps: function() {
        this.ops.rotRight = sh.throttle(this.rotateRight.bind(this), this.throttleWait, {trailing:false});
        this.ops.rotLeft = sh.throttle(this.rotateLeft.bind(this), this.throttleWait, {trailing:false});
        this.ops.sftDown= sh.throttle(this.shiftDown.bind(this), this.throttleWait, {trailing:false});
        this.ops.sftUp= sh.throttle(this.shiftUp.bind(this), this.throttleWait, {trailing:false});
      }

    });

    return MotionControls;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

