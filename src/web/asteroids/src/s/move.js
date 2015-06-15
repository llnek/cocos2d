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
 * @module s/move
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'n/gnodes';

let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////////
/** * @class Move */
Move = sh.Ashley.sysDef({
  /**
   * @memberof module:s/move~Move
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },

  /**
   * @memberof module:s/move~Move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.shipMotions= null;

  },

  /**
   * @memberof module:s/move~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.shipMotions = engine.getNodeList(gnodes.ShipMotionNode)
  },


  /**
   * @memberof module:s/move~Move
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    let ships=this.shipMotions.head,
    pos, x,y;

    if (this.state.running) {

      sh.pools.Astros3.iter( a => {
        if (a.status) { this.moveAstros(a, dt); }
      });
      sh.pools.Astros2.iter( a => {
        if (a.status) { this.moveAstros(a, dt); }
      });
      sh.pools.Astros1.iter( a => {
        if (a.status) { this.moveAstros(a, dt); }
      });

      if (!!ships) {
        this.processShipMotions(ships,dt);
      }

      sh.pools.Missiles.iter( m => {
        if (m.status) {
          pos= m.pos();
          y = pos.y + dt * m.vel.y * m.speed;
          x = pos.x + dt * m.vel.x * m.speed;
          m.setPos(x, y);
        }
      });

      sh.pools.Lasers.iter( b => {
        if (b.status) {
          pos= b.pos();
          y = pos.y + dt * b.vel.y * b.speed;
          x = pos.x + dt * b.vel.x * b.speed;
          b.setPos(x, y);
        }
      });

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

  },

  /**
   * @method moveAstros
   * @private
   */
  moveAstros(astro, dt) {
    let rot= astro.rotation,
    B = this.state.world,
    velo= astro.vel,
    sp= astro.sprite,
    sz= sp.getContentSize(),
    pos= sp.getPosition(),
    r,x,y;

    x = pos.x + dt * velo.x;
    y = pos.y + dt * velo.y;

    rot += 0.1;
    if (rot > 360) { rot -= 360; }

    astro.rotation= rot;
    sp.setRotation(rot);
    sp.setPosition(x,y);

    //wrap?
    r= ccsx.bbox4(sp);

    if (r.bottom > B.top) {
      if (velo.y > 0) {
        y = B.bottom - sz.height;
      }
    }

    if (r.top < B.bottom) {
      if (velo.y < 0) {
        y = B.top + sz.height;
      }
    }

    if (r.left > B.right) {
      if (velo.x > 0) {
        x = B.left - sz.width;
      }
    }

    if (r.right < B.left) {
      if (velo.x < 0) {
        x = B.right + sz.width;
      }
    }

    sp.setPosition(x,y);
  }

}, {

/**
 * @memberof module:s/move~Move
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Move
});


/** @alias module:s/move */
const xbox = /** @lends xbox# */{

  /**
   * @property {Move} Move
   */
  Move : Move
};





sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF


