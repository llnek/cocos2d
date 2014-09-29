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

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ivs= sh.Invaders;


//////////////////////////////////////////////////////////////////////////////
//

ivs.MotionCtrlSystem = Ash.System.extend({

  constructor: function(options) {
    this.state= options;
    return this;
  },

  removeFromEngine: function(engine) {
  },

  addToEngine: function(engine) {
    this.alienMotions = engine.getNodeList(ivs.AlienMotionNode)
  },

  update: function (dt) {
    var node;
    for (node=this.alienMotions.head;node;node=node.next) {
      this.processAlienMotions(node,dt);
    }
  },

  processAlienMotions: function(node,dt) {
    var lpr = node.looper,
    sqad= node.aliens;

    if (! sjs.echt(lpr.timer)) {
      lpr.timer=lpr.timerFunc();
    }
    else
    if (ccsx.timerDone(lpr.timer)) {
      this.maybeShuffleAliens(sqad);
      lpr.timer=null; //lpr.timerFunc();
    }

  },

  maybeShuffleAliens: function(sqad) {
    var b = sqad.stepx > 0 ? this.findMaxX(sqad) : this.findMinX(sqad),
    ok;
    if (sjs.echt(b) && b.status) {
      ok = this.testDirX(b, sqad.stepx) ? this.doShuffle(sqad)
                                   : this.doForward(sqad);
      if (ok) {
        sh.sfxPlay('bugs-march');
      }
    }
  },

  testDirX: function(b, stepx) {
    var csts = sh.xcfg.csts,
    sp= b.sprite;
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
    var rc = _.filter(sqad.aliens, function(a) {
      return a.status;
    });
    _.each(rc, function(a) {
      this.shuffleOneAlien(a,sqad.stepx);
    },this);
    return rc.length > 0;
  },

  doForward: function(sqad) {
    var rc = _.filter(sqad.aliens, function(a) {
      return a.status;
    });
    _.each(rc, function(a) {
      this.forwardOneAlien(a);
    },this);
    sqad.stepx = - sqad.stepx;
    return rc.length > 0;
  },

  findMinX: function(sqad) {
    return _.min(sqad.aliens, function(a) {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return Number.MAX_VALUE;
      }
    });
  },

  findMaxX: function(sqad) {
    return _.max(sqad.aliens, function(a) {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return 0;
      }
    });
  },



});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




