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
 * @requires s/utils
 * @requires n/gnodes
 * @module s/movealiens
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import utils from 's/utils';
import gnodes from 'n/gnodes';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MovementAiens
 */
MovementAliens = sh.Ashley.sysDef({
  /**
   * @memberof module:s/movealiens~MovementAliens
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/movealiens~MovementAliens
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.alienMotions= undef;
  },
  /**
   * @memberof module:s/movealiens~MovementAliens
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.alienMotions = engine.getNodeList(gnodes.AlienMotionNode);
  },
  /**
   * @memberof module:s/movealiens~MovementAliens
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node=this.alienMotions.head;

    if (this.state.running &&
       !!node) {
      this.processMovement(node,dt);
      this.processBombs(node,dt);
    }
  },
  /**
   * @method processMovement
   * @private
   */
  processMovement(node,dt) {
    const lpr = node.looper,
    sqad= node.aliens;

    if (ccsx.timerDone(lpr.timers[0])) {
      this.maybeShuffleAliens(sqad);
      lpr.timers[0]=ccsx.undoTimer(lpr.timers[0]);
    }
  },
  /**
   * @method processBombs
   * @private
   */
  processBombs(node,dt) {
    const lpr = node.looper,
    sqad= node.aliens;

    if (ccsx.timerDone(lpr.timers[1])) {
      this.checkBomb(sqad);
      lpr.timers[1]=ccsx.undoTimer(lpr.timers[1]);
    }
  },
  /**
   * @method checkBomb
   * @private
   */
  checkBomb(sqad) {
    let rc = [],
    pos,
    n;
    for (n=0; n < sqad.aliens.pool.length; ++n) {
      if (sqad.aliens.pool[n].status) {
        rc.push(n);
      }
    }
    if (rc.length > 0) {
      n = rc.length === 1 ? 0 : sjs.rand(rc.length);
      pos= sqad.aliens.pool[n].sprite.getPosition();
      this.dropBomb(pos.x, pos.y-4);
    }
  },
  /**
   * @method dropBomb
   * @private
   */
  dropBomb(x,y) {
    let bbs = sh.pools.Bombs,
    ent = bbs.get();

    if (! sjs.echt(ent)) {
      sh.factory.createBombs(25);
      ent = bbs.get();
    }

    sjs.loggr.debug('got one bomb from pool');
    ent.inflate({ x: x, y: y});
  },
  /**
   * @method maybeShuffleAliens
   * @private
   */
  maybeShuffleAliens(sqad) {
    let b = sqad.stepx > 0 ?
      this.findMaxX(sqad) : this.findMinX(sqad),
    ok;
    if (!!b && b.status) {
      ok = this.testDirX(b, sqad.stepx) ?
        this.doShuffle(sqad) : this.doForward(sqad);
      if (ok) {
        sh.sfxPlay('bugs-march');
      }
    }
  },
  /**
   * @method testDirX
   * @private
   */
  testDirX(b, stepx) {
    const wz= ccsx.vrect(),
    wb= ccsx.vbox(),
    sp= b.sprite;
    if (stepx > 0) {
      return ccsx.getRight(sp) + stepx < (wb.right - (2/40 * wz.width));
    } else {
      return ccsx.getLeft(sp) + stepx > (wb.left + (2/40 * wz.width));
    }
  },
  /**
   * @method shuffleOneAlien
   * @private
   */
  shuffleOneAlien(a,stepx) {
    const pos= a.sprite.getPosition();
    a.sprite.setPosition(pos.x + stepx, pos.y);
  },
  /**
   * @method forwardOneAlien
   * @private
   */
  forwardOneAlien(a, delta) {
    const pos= a.sprite.getPosition(),
    wz= ccsx.vrect(),
    wb= ccsx.vbox();
    a.sprite.setPosition(pos.x,  pos.y - delta);
                         //pos.y - ccsx.getHeight(a.sprite) - (2/480 * wz.height));
  },
  /**
   * @method doShuffle
   * @private
   */
  doShuffle(sqad) {
    const rc = R.filter((a) => {
      return a.status; }, sqad.aliens.pool);
    R.forEach((a) => {
      this.shuffleOneAlien(a,sqad.stepx); }, rc);
    return rc.length > 0;
  },
  /**
   * @method doForward
   * @private
   */
  doForward(sqad) {
    const rc = R.filter((a) => {
      return a.status; }, sqad.aliens.pool),
    delta= Math.abs(sqad.stepx);
    R.forEach((a) => {
      this.forwardOneAlien(a, delta); }, rc);
    sqad.stepx = - sqad.stepx;
    return rc.length > 0;
  },
  /**
   * @method findMinX
   * @private
   */
  findMinX(sqad) {
    return R.minBy((a) => {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return Number.MAX_VALUE;
      }
    }, sqad.aliens.pool);
  },
  /**
   * @method finxMaxX
   * @private
   */
  findMaxX(sqad) {
    return R.maxBy((a) => {
      if (a.status) {
        return ccsx.getRight(a.sprite);
      } else {
        return 0;
      }
    }, sqad.aliens.pool);
  }

});

/**
 * @memberof module:s/movealiens~MovementAliens
 * @property {Number} Priority
 */
MovementAliens.Priority= xcfg.ftypes.Move;


/** @alias module:s/movealiens */
const xbox = /** @lends xbox# */{

  /**
   * @property {MovementAliens} MovementAliens
   */
  MovementAliens : MovementAliens
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

