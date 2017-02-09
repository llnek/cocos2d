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
/** * @class Motions */
Motions = sh.Ashley.sysDef({
  /**
   * @memberof module:s/motion~Motions
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/motion~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.alienMotions = null;
    this.shipMotions = null;
    this.cannons= null;
  },
  /**
   * @memberof module:s/motion~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.alienMotions = engine.getNodeList(gnodes.AlienMotionNode);
    this.shipMotions = engine.getNodeList(gnodes.ShipMotionNode);
    this.cannons = engine.getNodeList(gnodes.CannonCtrlNode);
  },
  /**
   * @memberof module:s/motion~Motions
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const aliens = this.alienMotions.head,
    ships=this.shipMotions.head,
    cns= this.cannons.head;
    if (this.state.running) {
      if (!!aliens) {
        this.processAlienMotions(aliens,dt);
      }
      if (!!cns) {
        this.controlCannon(cns,dt);
      }
      if (!!ships) {
        this.scanInput(ships,dt);
      }
    }
  },
  /**
   * @method controlCannon
   * @private
   */
  controlCannon(node,dt) {
    const gun = node.cannon,
    lpr= node.looper,
    ship=node.ship,
    t= lpr.timers[0];

    if (! gun.hasAmmo) {
      if (ccsx.timerDone(t)) {
        ship.sprite.setSpriteFrame(ship.frames[0]);
        gun.hasAmmo=true;
        lpr.timers[0]=ccsx.undoTimer(t);
      }
    } else {
      if (sh.main.keyPoll(cc.KEY.space)) {
        this.fireMissile(node,dt);
      }
    }
  },
  /**
   * @method fireMissile
   * @private
   */
  fireMissile(node,dt) {
    let top= ccsx.getTop(node.ship.sprite),
    p= sh.pools.Missiles,
    ship=node.ship,
    pos= ship.pos(),
    lpr= node.looper,
    gun= node.cannon,
    ent= p.get();

    if (!ent) {
      sh.factory.createMissiles(36);
      ent= p.get();
    }

    ent.inflate({ x: pos.x, y: top+4 });

    lpr.timers[0] = ccsx.createTimer(sh.main, gun.coolDownWindow);
    gun.hasAmmo=false;
    ship.sprite.setSpriteFrame(ship.frames[1]);
    sh.sfxPlay('ship-missile');
  },
  /**
   * @method scanInput
   * @private
   */
  scanInput(node, dt) {
    const s= node.ship,
    m= node.motion;

    if (sh.main.keyPoll(cc.KEY.right)) {
      m.right=true;
    }
    if (sh.main.keyPoll(cc.KEY.left)) {
      m.left=true;
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
  }

}, {

/**
 * @memberof module:s/motion~Motions
 * @property {Number} Priority
 */
Priority: xcfg.ftypes.Motion
});


/** @alias module:s/motion */
const xbox = /** @lends xbox# */{
  /**
   * @property {Motions}  Motions
   */
  Motions : Motions
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

