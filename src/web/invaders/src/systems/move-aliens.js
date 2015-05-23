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

/**
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/movealiens
 */
define('zotohlab/p/s/movealiens',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movealiens */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class MovementAiens
     */
    MovementAliens = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/movealiens~MovementAliens
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/movealiens~MovementAliens
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.alienMotions= undef;
      },

      /**
       * @memberof module:zotohlab/p/s/movealiens~MovementAliens
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.alienMotions = engine.getNodeList(gnodes.AlienMotionNode);
      },

      /**
       * @memberof module:zotohlab/p/s/movealiens~MovementAliens
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
       * @private
       */
      processMovement(node,dt) {
        const lpr = node.looper,
        sqad= node.aliens;

        if (ccsx.timerDone(lpr.timers[0])) {
          this.maybeShuffleAliens(sqad);
          lpr.timers[0]=ccsx.releaseTimer(lpr.timers[0]);
        }
      },

      /**
       * @private
       */
      processBombs(node,dt) {
        const lpr = node.looper,
        sqad= node.aliens;

        if (ccsx.timerDone(lpr.timers[1])) {
          this.checkBomb(sqad);
          lpr.timers[1]=ccsx.releaseTimer(lpr.timers[1]);
        }
      },

      /**
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
       * @private
       */
      shuffleOneAlien(a,stepx) {
        const pos= a.sprite.getPosition();
        a.sprite.setPosition(pos.x + stepx, pos.y);
      },

      /**
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
     * @memberof module:zotohlab/p/s/movealiens~MovementAliens
     * @property {Number} Priority
     */
    MovementAliens.Priority= pss.Movement;

    exports= MovementAliens;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

