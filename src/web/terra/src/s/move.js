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
 * @requires n/cobjs
 * @requires s/utils
 * @requires n/gnodes
 * @module s/move
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import utils from 's/utils';
import gnodes from 'n/gnodes';


let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R= sjs.ramda,
//////////////////////////////////////////////////////////////////////////
undef,
/**
 * @class MoveXXX
 */
MoveXXX = sh.Ashley.sysDef({
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships = engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node= this.ships.head;
    if (this.state.running &&
       !!node) {
      this.moveMissiles(dt);
      this.moveBombs(dt);
      this.onKeys(node,dt);
    }
  },
  /**
   * @method onKeys
   * @private
   */
  onKeys(node,dt) {
    let ship = node.ship,
    wz= ccsx.vrect(),
    mot= node.motion,
    sp = ship.sprite,
    ok = false,
    pos = ship.pos(),
    x = pos.x,
    y = pos.y;

    if (mot.up && pos.y <= wz.height) {
      y = pos.y + dt * csts.SHIP_SPEED;
      ok= true;
    }
    if (mot.down && pos.y >= 0) {
      y = pos.y - dt * csts.SHIP_SPEED;
      ok= true;
    }
    if (mot.left && pos.x >= 0) {
      x = pos.x - dt * csts.SHIP_SPEED;
      ok= true;
    }
    if (mot.right && pos.x <= wz.width) {
      x = pos.x + dt * csts.SHIP_SPEED;
      ok= true;
    }

    if (ok) { ship.setPos(x,y); }

    mot.right= false;
    mot.left=false;
    mot.down=false;
    mot.up=false;
  },
  /**
   * @method moveOneBomb
   * @private
   */
  moveOneBomb(m, dt) {
    const pos = m.sprite.getPosition();
    m.sprite.setPosition(pos.x + m.vel.x * dt,
                         pos.y + m.vel.y * dt);
  },
  /**
   * @method moveBombs
   * @private
   */
  moveBombs(dt) {
    sh.pools.Bombs.iter( b => {
      if (b.status) {
        this.moveOneBomb(b,dt);
      }
    });
  },
  /**
   * @method moveOneMissile
   * @private
   */
  moveOneMissile(m, dt) {
    const pos = m.sprite.getPosition();
    m.sprite.setPosition(pos.x + m.vel.x * dt,
                         pos.y + m.vel.y * dt);
  },

  /**
   * @method moveMissiles
   * @private
   */
  moveMissiles(dt) {
    sh.pools.Missiles.iter( v => {
      if (v.status) {
        this.moveOneMissile(v,dt);
      }
    });
  }

});

/**
 * @memberof module:s/movebombs~MoveBombs
 * @property {Number} Priority
 */
MoveBombs.Priority = xcfg.ftypes.Move;


/** @alias module:s/movebombs */
const xbox = /** @lends xbox# */{
  /**
   * @property {MoveBombs} MoveBombs
   */
  MoveBombs : MoveBombs
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF


