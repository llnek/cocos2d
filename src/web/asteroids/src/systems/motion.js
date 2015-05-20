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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/motions
 */
define('zotohlab/p/s/motions',

       ['zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/motions */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MotionControls
     */
    MotionControls = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/motions~MotionControls
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.throttleWait= 80;
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/motions~MotionControls
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.ships=null;
      },

      /**
       * @memberof module:zotohlab/p/s/motions~MotionControls
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.ops={};
        this.initKeyOps();
      },

      /**
       * @memberof module:zotohlab/p/s/motions~MotionControls
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var node= this.ships.head;

        if (this.state.running &&
           !!node) {
          this.scanInput(node, dt);
        }
      },

      /**
       * @private
       */
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

      /**
       * @private
       */
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

      /**
       * @private
       */
      shiftDown: function(node, dt) {
        node.motion.down=true;
      },

      /**
       * @private
       */
      shiftUp: function(node, dt) {
        node.motion.up=true;
      },

      /**
       * @private
       */
      rotateRight: function(node, dt) {
        node.motion.right=true;
      },

      /**
       * @private
       */
      rotateLeft: function(node, dt) {
        node.motion.left=true;
      },

      /**
       * @private
       */
      initKeyOps: function() {
        this.ops.rotRight = sh.throttle(this.rotateRight.bind(this), this.throttleWait, {trailing:false});
        this.ops.rotLeft = sh.throttle(this.rotateLeft.bind(this), this.throttleWait, {trailing:false});
        this.ops.sftDown= sh.throttle(this.shiftDown.bind(this), this.throttleWait, {trailing:false});
        this.ops.sftUp= sh.throttle(this.shiftUp.bind(this), this.throttleWait, {trailing:false});
      }

    });

    exports= MotionControls;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

