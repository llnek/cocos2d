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
 * @requires nodes/gnodes
 * @module s/motions
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'nodes/gnodes';


let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class Motions
 */
Motions = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motions~Motions
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/motions~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },
  /**
   * @memberof module:s/motions~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships= engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @memberof module:s/motions~Motions
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.ships.head;
    if (this.state.running &&
       !!node) {
      this.processMotions(node,dt);
    }
  },
  /**
   * @method processMotions
   * @private
   */
  processMotions(node,dt) {
    this.scanInput(node, dt);
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
   * @method processKeys
   * @private
   */
  processKeys(node,dt) {

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

/**
   * @memberof module:s/motions~Motions
   * @property {Number} Priority
   */
Motions.Priority = xcfg.ftypes.Motion;


/** @alias module:s/motions */
const xbox = /** @lends xbox# */{
  /**
   * @property {Motions} Motions
   */
  Motions : Motions
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

