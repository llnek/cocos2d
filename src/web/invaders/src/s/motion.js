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
import gnodes from 'n/gnodes';
import ccsx from 'zotohlab/asx/ccsx';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MotionCtrlSystem
 */
MotionCtrlSystem = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motion~MotionCtrlSystem
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/motion~MotionCtrlSystem
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.alienMotions = undef;
    this.shipMotions = undef;
  },
  /**
   * @memberof module:s/motion~MotionCtrlSystem
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.alienMotions = engine.getNodeList(gnodes.AlienMotionNode);
    this.shipMotions = engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @memberof module:s/motion~MotionCtrlSystem
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    let node = this.alienMotions.head;
    if (this.state.running &&
       !!node) {
      this.processAlienMotions(node,dt);
    }

    node=this.shipMotions.head;
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
  },
  /**
   * @method processAlienMotions
   * @private
   */
  processAlienMotions(node,dt) {
    const lpr = node.looper,
    sqad= node.aliens;

    if (! sjs.echt(lpr.timers[0])) {
      lpr.timers[0]= ccsx.createTimer(sh.main,1);
    }

    if (! sjs.echt(lpr.timers[1])) {
      lpr.timers[1]= ccsx.createTimer(sh.main,2);
    }
  },
  /**
   * @method processKeys
   * @private
   */
  processKeys(node,dt) {
    const s= node.ship,
    m= node.motion;

    if (sh.main.keyPoll(cc.KEY.right)) {
      m.right=true;
    }
    if (sh.main.keyPoll(cc.KEY.left)) {
      m.left=true;
    }
  }

});

/**
 * @memberof module:s/motion~MotionCtrlSystem
 * @property {Number} Priority
 */
MotionCtrlSystem.Priority= xcfg.ftypes.Motion;

/** @alias module:s/motion */
const xbox = /** @lends xbox# */{

  /**
   * @property {MotionCtrlSystem}  MotionCtrlSystem
   */
  MotionCtrlSystem : MotionCtrlSystem
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

