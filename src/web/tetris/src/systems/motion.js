// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/s/motioncontrol",

       ['zotohlab/p/s/priorities',
         'zotohlab/p/components',
       'zotohlab/p/gnodes',
       'zotohlab/p/s/utils',
       'cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx'],

  function (pss, cobjs, gnodes, utils, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MotionCtrlSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.throttleWait= csts.THROTTLEWAIT;
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.arena=null;
      },

      addToEngine: function(engine) {
        this.arena= engine.getNodeList(gnodes.ArenaNode);
        this.ops={};
        this.initKeyOps();
      },

      onXXXEvent: function(node,dt) {
        if (this.state.selQ.length > 0) {
          var evt= this.state.selQ.shift();
          this.processMouse(node, evt, dt);
          this.state.selQ.length=0;
        }
      },

      checkInput: function(node, dt) {
        if (cc.sys.capabilities['touches']) {
          this.onXXXEvent(node, dt);
        }
        else
        if (cc.sys.capabilities['mouse']) {
          this.onXXXEvent(node, dt);
        }
        else
        if (cc.sys.capabilities['keyboard']) {
          this.processKeys(node, dt);
        }
      },

      update: function (dt) {
        var node= this.arena.head;
        if (this.state.running &&
           !!node) {
          this.checkInput(node, dt);
        }
      },

      processMouse: function(node, evt,dt) {
        var hsps= node.cpad.hotspots,
        px= evt.x,
        py= evt.y;

        if (ccsx.pointInBox(hsps.rr, px,py)) {
          this.ops.rotRight(node, dt);
        }

        if (ccsx.pointInBox(hsps.rl, px,py)) {
          this.ops.rotLeft(node, dt);
        }

        if (ccsx.pointInBox(hsps.sr, px,py)) {
          this.ops.sftRight(node, dt);
        }

        if (ccsx.pointInBox(hsps.sl, px,py)) {
          this.ops.sftLeft(node, dt);
        }

        if (ccsx.pointInBox(hsps.cd, px,py)) {
          this.ops.sftDown(node, dt);
        }
      },

      processKeys: function(node, dt) {

        if (this.keyPoll(cc.KEY.right)) {
          this.ops.sftRight(node, dt);
        }
        if (this.keyPoll(cc.KEY.left)) {
          this.ops.sftLeft(node, dt);
        }
        if (this.keyPoll(cc.KEY.down)) {
          this.ops.rotRight(node, dt);
        }
        if (this.keyPoll(cc.KEY.up)) {
          this.ops.rotLeft(node, dt);
        }
        if (this.keyPoll(cc.KEY.space)) {
          this.ops.sftDown(node, dt);
        }

      },

      keyPoll: function(kp) {
        return sh.main.keyPoll(kp);
      },

      shiftRight: function(node, dt) {
        node.motion.right=true;
      },

      shiftLeft: function(node, dt) {
        node.motion.left=true;
      },

      shiftDown: function(node, dt) {
        node.motion.down=true;
      },

      rotateRight: function(node, dt) {
        node.motion.rotr=true;
      },

      rotateLeft: function(node, dt) {
        node.motion.rotl=true;
      },

      bindKey: function(func, fid) {
        this.ops[fid] = sh.throttle(func,
                                    this.throttleWait,
                                    { trailing:false });
      },

      initKeyOps: function() {
        sjs.eachObj(function(v, k) {
          this.bindKey(v,k);
        }.bind(this),
        {'sftRight' : this.shiftRight.bind(this),
         'sftLeft' : this.shiftLeft.bind(this),
         'rotRight' : this.rotateRight.bind(this),
         'rotLeft' : this.rotateLeft.bind(this),
         'sftDown' : this.shiftDown.bind(this)} );
      }

    });

    MotionCtrlSystem.Priority= pss.Motion;
    return MotionCtrlSystem;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

