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
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (utils, gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    MovementAliens = Ash.System.extend({

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
          lpr.timers[0]=null;
        }
      },

      processBombs: function(node,dt) {
        var lpr = node.looper,
        sqad= node.aliens;

        if (ccsx.timerDone(lpr.timers[1])) {
          this.checkBomb(sqad);
          lpr.timers[1]=null;
        }
      },

      checkBomb: function(sqad) {
        var rc = [],
        pos,
        n;
        for (n=0; n < sqad.aliens.length; ++n) {
          if (sqad.aliens[n].status) {
            rc.push(n);
          }
        }
        if (rc.length > 0) {
          n = rc.length === 1 ? 0 : sjs.rand(rc.length);
          pos= sqad.aliens[n].sprite.getPosition();
          this.dropBomb(pos.x, pos.y-4);
        }
      },

      dropBomb: function(x,y) {
        var ent = sh.pools[csts.P_BS].get(),
        tag;

        if (! sjs.echt(ent)) {
          utils.createBombs(sh.main,this.state,25);
          ent = sh.pools[csts.P_BS].get();
        }
        sjs.loggr.debug('got one bomb from pool');
        ent.inflate(x,y);
        tag= ent.sprite.getTag();

        sh.pools[csts.P_LBS][tag] = ent;
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
        a.sprite.setPosition(pos.x, pos.y - ccsx.getHeight(a.sprite) - sh.xcfg.csts.OFF_Y);
      },

      doShuffle: function(sqad) {
        var rc = R.filter(function(a) {
          return a.status;
        }, sqad.aliens);
        R.forEach(function(a) {
          this.shuffleOneAlien(a,sqad.stepx);
        }.bind(this), rc);
        return rc.length > 0;
      },

      doForward: function(sqad) {
        var rc = R.filter(function(a) {
          return a.status;
        }, sqad.aliens);
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
        }, sqad.aliens);
      },

      findMaxX: function(sqad) {
        return R.maxWith(function(a) {
          if (a.status) {
            return ccsx.getLeft(a.sprite);
          } else {
            return 0;
          }
        }, sqad.aliens);
      }

    });

    return MovementAliens;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

