// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

define('zotohlab/p/s/movealiens', ['zotohlab/p/s/utils',
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    MovementAliens = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.alienMotions= undef;
      },

      addToEngine: function(engine) {
        this.alienMotions = engine.getNodeList(gnodes.AlienMotionNode);
      },

      update: function (dt) {
        var node=this.alienMotions.head;

        if (this.state.running &&
           !!node) {
          this.processMovement(node,dt);
          this.processBombs(node,dt);
        }
      },

      processMovement: function(node,dt) {
        var lpr = node.looper,
        sqad= node.aliens;

        if (ccsx.timerDone(lpr.timers[0])) {
          this.maybeShuffleAliens(sqad);
          lpr.timers[0]=ccsx.releaseTimer(lpr.timers[0]);
        }
      },

      processBombs: function(node,dt) {
        var lpr = node.looper,
        sqad= node.aliens;

        if (ccsx.timerDone(lpr.timers[1])) {
          this.checkBomb(sqad);
          lpr.timers[1]=ccsx.releaseTimer(lpr.timers[1]);
        }
      },

      checkBomb: function(sqad) {
        var rc = [],
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

      dropBomb: function(x,y) {
        var bbs = sh.pools.Bombs,
        ent = bbs.get();

        if (! sjs.echt(ent)) {
          sh.factory.createBombs(25);
          ent = bbs.get();
        }

        sjs.loggr.debug('got one bomb from pool');
        ent.inflate({ x: x, y: y});
      },

      maybeShuffleAliens: function(sqad) {
        var b = sqad.stepx > 0 ? this.findMaxX(sqad) : this.findMinX(sqad),
        ok;
        if (!!b && b.status) {
          ok = this.testDirX(b, sqad.stepx) ? this.doShuffle(sqad)
                                       : this.doForward(sqad);
          if (ok) {
            sh.sfxPlay('bugs-march');
          }
        }
      },

      testDirX: function(b, stepx) {
        var sp= b.sprite;
        if (stepx > 0) {
          return ccsx.getRight(sp) + stepx < (csts.GRID_W - 2) * csts.TILE;
        } else {
          return ccsx.getLeft(sp) + stepx > csts.LEFT * csts.TILE;
        }
      },

      shuffleOneAlien: function(a,stepx) {
        var pos= a.sprite.getPosition();
        a.sprite.setPosition(pos.x + stepx, pos.y);
      },

      forwardOneAlien: function(a) {
        var pos= a.sprite.getPosition();
        a.sprite.setPosition(pos.x, pos.y - ccsx.getHeight(a.sprite) - csts.OFF_Y);
      },

      doShuffle: function(sqad) {
        var rc = R.filter(function(a) {
          return a.status;
        }, sqad.aliens.pool);
        R.forEach(function(a) {
          this.shuffleOneAlien(a,sqad.stepx);
        }.bind(this), rc);
        return rc.length > 0;
      },

      doForward: function(sqad) {
        var rc = R.filter(function(a) {
          return a.status;
        }, sqad.aliens.pool);
        R.forEach(function(a) {
          this.forwardOneAlien(a);
        }.bind(this), rc);
        sqad.stepx = - sqad.stepx;
        return rc.length > 0;
      },

      findMinX: function(sqad) {
        return R.minWith(function(a) {
          if (a.status) {
            return ccsx.getLeft(a.sprite);
          } else {
            return Number.MAX_VALUE;
          }
        }, sqad.aliens.pool);
      },

      findMaxX: function(sqad) {
        return R.maxWith(function(a) {
          if (a.status) {
            return ccsx.getLeft(a.sprite);
          } else {
            return 0;
          }
        }, sqad.aliens.pool);
      }

    });

    return MovementAliens;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

