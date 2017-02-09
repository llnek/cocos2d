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
//////////////////////////////////////////////////////////////////////////////
/** * @class Motions */
Motions = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motion~Motions
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.throttleWait= 80;
    this.state = options;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.cannons=null;
    this.ships=null;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.cannons = engine.getNodeList(gnodes.CannonCtrlNode);
    this.ships= engine.getNodeList(gnodes.ShipMotionNode);

    this.ops={};
    this.initKeyOps();
  },

  /**
   * @memberof module:s/motion~Motions
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const ships= this.ships.head,
    cns = this.cannons.head;

    if (this.state.running) {
      if (!!ships) {
        this.scanInput(ships, dt);
      }
      if (!!cns) {
        this.controlCannon(cns,dt);
      }
    }
  },
  /**
   * @method controlCannon
   * @private
   */
  controlCannon(node,dt) {
    const gun = node.cannon,
    ship=node.ship,
    lpr= node.looper,
    t= lpr.timers[0];

    if (! gun.hasAmmo) {
      if (ccsx.timerDone(t)) {
        gun.hasAmmo=true;
        lpr.timers[0]=null;
      }
      return;
    }
    else
    if ( sh.main.keyPoll(cc.KEY.space)) {
      this.fireMissile(node,dt);
    }
  },
  /**
   * @method fireMissile
   * @private
   */
  fireMissile(node,dt) {
    let p= sh.pools.Missiles,
    lpr= node.looper,
    ship= node.ship,
    gun= node.cannon,
    sz= ship.sprite.getContentSize(),
    pos= ship.sprite.getPosition(),
    top= ccsx.getTop(ship.sprite),
    deg= ship.sprite.getRotation(),
    tag,
    ent= p.get();

    if (!ent) {
      sh.factory.createMissiles(30);
      ent= p.get();
    }

    let rc= sh.calcXY(deg, sz.height * 0.5);
    ent.vel.x = rc[0];
    ent.vel.y = rc[1];
    ent.inflate({ x: pos.x + rc[0], y: pos.y + rc[1]});
    ent.sprite.setRotation(deg);

    lpr.timers[0] = ccsx.createTimer(sh.main, gun.coolDownWindow);
    gun.hasAmmo=false;
    //sh.sfxPlay('ship-missile');
  },
  /**
   * @method scanInput
   * @private
   */
  scanInput(node, dt) {
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

}, {

/**
 * @memberof module:s/motion~Motions
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Motion
});


/** @alias module:s/motion */
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
///////////////////////////////////////////////////////////////////////////////
//EOF

