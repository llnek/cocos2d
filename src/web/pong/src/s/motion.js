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
 * @requires nodes/gnodes
 * @module s/motion
 */

import gnodes from 'zotohlab/p/gnodes';
import sh from 'zotohlab/asx/asterix';

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
    this.state = options;
  },
  /**
   * @memberof module:s/motion~MotionCtrlSystem
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.nodeList=null;
  },
  /**
   * @memberof module:s/motion~MotionCtrlSystem
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.nodeList= engine.getNodeList(gnodes.PaddleNode);
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
   * @memberof module:s/motion~MotionCtrlSystem
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    for (let node= this.nodeList.head; node; node=node.next) {
      this.scanInput(node, dt);
    }
  },
  /**
   * @method processKeys
   * @private
   */
  processKeys(node, dt) {
    const p= node.paddle,
    m= node.motion,
    cs = p.kcodes;

    if (sh.main.keyPoll(cs[0])) {
      m.left=true;
    }

    if (sh.main.keyPoll(cs[1])) {
      m.right=true;
    }

  }

});

/**
 * @memberof module:s/motion~MotionCtrlSystem
 * @property {Number} Priority
 * @static
 */
MotionCtrlSystem.Priority = xcfg.ftypes.Motion;


/** @alias module:s/motion */
const xbox = /** @lends xbox# */{

  /**
   * @property {MotionCtrlSystem} MotionCtrlSystem
   */
  MotionCtrlSystem : MotionCtrlSystem
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

