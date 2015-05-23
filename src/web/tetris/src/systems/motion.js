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
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/motioncontrol
 */
define("zotohlab/p/s/motioncontrol",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, cobjs, gnodes, utils, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/motioncontrol */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MotionCtrlSystem
     */
    MotionCtrlSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/motioncontrol
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.throttleWait= csts.THROTTLEWAIT;
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/motioncontrol
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.arena=null;
      },

      /**
       * @memberof module:zotohlab/p/s/motioncontrol
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.arena= engine.getNodeList(gnodes.ArenaNode);
        this.ops={};
        this.initKeyOps();
      },

      /**
       * @private
       */
      onXXXEvent(node,dt) {
        if (this.state.selQ.length > 0) {
          var evt= this.state.selQ.shift();
          this.processMouse(node, evt, dt);
          this.state.selQ.length=0;
        }
      },

      /**
       * @private
       */
      checkInput(node, dt) {
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

      /**
       * @memberof module:zotohlab/p/s/motioncontrol
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node= this.arena.head;
        if (this.state.running &&
           !!node) {
          this.checkInput(node, dt);
        }
      },

      /**
       * @private
       */
      processMouse(node, evt,dt) {
        const hsps= node.cpad.hotspots,
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

      /**
       * @private
       */
      processKeys(node, dt) {

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

      /**
       * @private
       */
      keyPoll(kp) {
        return sh.main.keyPoll(kp);
      },

      /**
       * @private
       */
      shiftRight(node, dt) {
        node.motion.right=true;
      },

      /**
       * @private
       */
      shiftLeft(node, dt) {
        node.motion.left=true;
      },

      /**
      * @private
      */
      shiftDown(node, dt) {
        node.motion.down=true;
      },

      /**
      * @private
      */
      rotateRight(node, dt) {
        node.motion.rotr=true;
      },

      /**
      * @private
      */
      rotateLeft(node, dt) {
        node.motion.rotl=true;
      },

      /**
      * @private
      */
      bindKey(func, fid) {
        this.ops[fid] = sh.throttle(func,
                                    this.throttleWait,
                                    { trailing:false });
      },

      /**
      * @private
      */
      initKeyOps() {
        sjs.eachObj((v, k) => {
          this.bindKey(v,k);
        },
        {'sftRight' : this.shiftRight.bind(this),
         'sftLeft' : this.shiftLeft.bind(this),
         'rotRight' : this.rotateRight.bind(this),
         'rotLeft' : this.rotateLeft.bind(this),
         'sftDown' : this.shiftDown.bind(this)} );
      }

    });

    /**
     * @memberof module:zotohlab/p/s/motioncontrol~MotionCtrlSystem
     * @property {Number} Priority
     */
    MotionCtrlSystem.Priority= pss.Motion;

    exports= MotionCtrlSystem;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

