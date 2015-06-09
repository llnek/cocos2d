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
 * @module s/moveship
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'nodes/gnodes';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MovementShip
 */
MovementShip = sh.Ashley.sysDef({
  /**
   * @memberof module:s/moveship~MovementShip
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/moveship~MovementShip
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.shipMotions=null;
  },
  /**
   * @memberof module:s/moveship~MovementShip
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.shipMotions = engine.getNodeList(gnodes.ShipMotionNode)
  },
  /**
   * @memberof module:s/moveship~MovementShip
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.shipMotions.head;
    if (this.state.running &&
       !!node) {
      this.processShipMotions(node, dt);
    }
  },
  /**
   * @method processShipMotions
   * @private
   */
  processShipMotions(node,dt) {
    let motion = node.motion,
    sv = node.velocity,
    ship= node.ship,
    pos = ship.pos(),
    x= pos.x,
    y= pos.y;

    if (motion.right) {
      x = pos.x + dt * sv.vel.x;
    }

    if (motion.left) {
      x = pos.x - dt * sv.vel.x;
    }

    ship.setPos(x,y);
    this.clamp(ship);

    motion.right=false;
    motion.left=false;
  },
  /**
   * @method clamp
   * @private
   */
  clamp(ship) {
    const sz= ship.sprite.getContentSize(),
    pos= ship.pos(),
    wz = ccsx.vrect();

    if (ccsx.getRight(ship.sprite) > wz.width - csts.TILE) {
      ship.setPos(wz.width - csts.TILE - sz.width * 0.5, pos.y);
    }
    if (ccsx.getLeft(ship.sprite) < csts.TILE) {
      ship.setPos( csts.TILE + sz.width * 0.5, pos.y);
    }
  }

});

/**
 * @memberof module:s/moveship~MovementShip
 * @property {Number} Priority
 */
MovementShip.Priority= xcfg.ftypes.Move;

/** @alias module:s/moveship */
const xbox = /** @lends xbox# */{

  /**
   * @property {MovementShip}  MovementShip
   */
  MovementShip : MovementShip
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

