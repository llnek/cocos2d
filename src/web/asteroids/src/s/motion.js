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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/ccsx
 * @requires n/gnodes
 * @module s/motion
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'n/gnodes';


let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
undef,

/**
 * @class MotionControls
 */
MotionControls = sh.Ashley.sysDef({

  /**
   * @memberof module:s/motion~MotionControls
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.throttleWait= 80;
    this.state = options;
  },

  /**
   * @memberof module:s/motion~MotionControls
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },

  /**
   * @memberof module:s/motion~MotionControls
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships= engine.getNodeList(gnodes.ShipMotionNode);
    this.ops={};
    this.initKeyOps();
  },

  /**
   * @memberof module:s/motion~MotionControls
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node= this.ships.head;

    if (this.state.running &&
       !!node) {
      this.scanInput(node, dt);
    }
  },

  /**
   * @method scanInput
   * @private
   */
  scanInput(node, dt) {
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
   * @method processKeys
   * @private
   */
  processKeys(node,dt) {
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
   * @method shiftDown
   * @private
   */
  shiftDown(node, dt) {
    node.motion.down=true;
  },

  /**
   * @method shiftUp
   * @private
   */
  shiftUp(node, dt) {
    node.motion.up=true;
  },

  /**
   * @method rotateRight
   * @private
   */
  rotateRight(node, dt) {
    node.motion.right=true;
  },

  /**
   * @method rotateLeft
   * @private
   */
  rotateLeft(node, dt) {
    node.motion.left=true;
  },

  /**
   * @method initKeyOps
   * @private
   */
  initKeyOps() {
    this.ops.rotRight = sh.throttle(this.rotateRight.bind(this), this.throttleWait, {trailing:false});
    this.ops.rotLeft = sh.throttle(this.rotateLeft.bind(this), this.throttleWait, {trailing:false});
    this.ops.sftDown= sh.throttle(this.shiftDown.bind(this), this.throttleWait, {trailing:false});
    this.ops.sftUp= sh.throttle(this.shiftUp.bind(this), this.throttleWait, {trailing:false});
  }

});

/**
 * @memberof module:s/motion~MotionControls
 * @property {Number} Priority
 */
MotionControls.Priority = xcfg.ftypes.Motion;

/** @alias module:s/motion */
const xbox = /** @lends xbox# */{
  /**
   * @property {MotionControls} MotionControls
   */
  MotionControls : MotionControls
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

