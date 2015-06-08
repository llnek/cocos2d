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


let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
undef,
R = sjs.ramda,

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
    this.shipMotions = undef;
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
    const node=this.shipMotions.head;

    if (this.state.running &&
       !!node) {
      this.processShipMotions(node,dt);
    }
  },

  /**
   * @method rotateShip
   * @private
   */
  rotateShip(cur,deg) {
    cur += deg;
    if (cur >= 360) {
      cur = cur - 360;
    }
    if (cur < 0) {
      cur = 360 + cur;
    }
    return cur;
  },

  /**
   * @method thrust
   * @private
   */
  thrust(ship, angle,power) {
    const rc= sh.calcXY(angle, power),
    accel = {
      x: rc[0],
      y: rc[1]
    };
    return accel;
  },

  /**
   * @method processShipMotions
   * @private
   */
  processShipMotions(node,dt) {
    let motion = node.motion,
    velo = node.velocity,
    tu = node.thrust,
    rot = node.rotation,
    ship= node.ship,
    sp = ship.sprite,
    pos = sp.getPosition(),
    deg,
    x= pos.x,
    y= pos.y;

    if (motion.right) {
      rot.angle= this.rotateShip(rot.angle, 3);
      ship.sprite.setRotation(rot.angle);
    }

    if (motion.left) {
      rot.angle= this.rotateShip(rot.angle, -3);
      ship.sprite.setRotation(rot.angle);
    }

    if (motion.up) {
      const acc= this.thrust(ship, rot.angle, tu.power);
      sp.setSpriteFrame(ship.frames[1]);
      velo.acc.x= acc.x;
      velo.acc.y= acc.y;
    } else {
      sp.setSpriteFrame(ship.frames[0]);
    }
    this.moveShip(node,dt);

    motion.right=false;
    motion.left=false;
    motion.up=false;
    motion.down=false;
  },

  /**
   * @method clampVelocity
   * @private
   */
  clampVelocity() {
  },

  /**
   * @method moveShip
   * @private
   */
  moveShip(snode, dt) {
    let velo = snode.velocity,
    B = this.state.world,
    ship = snode.ship,
    sp= ship.sprite,
    r,x,y,
    sz = sp.getContentSize(),
    pos= sp.getPosition();

    velo.vel.y = velo.vel.y + dt * velo.acc.y;
    velo.vel.x = velo.vel.x + dt * velo.acc.x;

    if (velo.vel.y > velo.max.y) {
      velo.vel.y = velo.max.y;
    } else if (velo.vel.y < - velo.max.y) {
      velo.vel.y = - velo.max.y;
    }
    if (velo.vel.x > velo.max.x) {
      velo.vel.x = velo.max.x;
    } else if (velo.vel.x < -velo.max.x) {
      velo.vel.x = -velo.max.x;
    }

    y = pos.y + dt * velo.vel.y;
    x = pos.x + dt * velo.vel.x;

    sp.setPosition(x,y);

    //wrap?
    r= ccsx.bbox4(sp);

    if (r.bottom > B.top) {
      if (velo.vel.y > 0) {
        y = B.bottom - sz.height;
      }
    }

    if (r.top < B.bottom) {
      if (velo.vel.y < 0) {
        y = B.top + sz.height;
      }
    }

    if (r.left > B.right) {
      if (velo.vel.x > 0) {
        x = B.left - sz.width;
      }
    }

    if (r.right < B.left) {
      if (velo.vel.x < 0) {
        x = B.right + sz.width;
      }
    }

    sp.setPosition(x,y);
    sp.setRotation(snode.rotation.angle);

  }

});

/**
 * @memberof module:s/moveship~MovementShip
 * @property {Number} Priority
 */
MovementShip.Priority = xcfg.ftypes.Move;

/** @alias module:s/moveship */
const xbox= /** @lends xbox# */{

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

