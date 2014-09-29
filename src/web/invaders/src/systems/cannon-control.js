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

ivs.CannonControl = Ash.System.extend({

  constructor: function () {
    return this;
  },

  addToEngine: function (engine) {
    this.nodeList = engine.getNodeList(ivs.CannonCtrlNode);
  },

  removeFromEngine: function (engine) {
    this.nodeList = null;
  },

  update: function (dt) {
    for(var node = this.nodeList.head; node; node = node.next) {
      this.process(node, dt);
    }
  },

  process: function(node,dt) {
    var gun = node.cannon,
    ship=node.ship,
    lpr= node.looper,
    t= lpr.timers[0];

    if (! gun.hasAmmo) {
      if (ccsx.timerDone(t)) {
        ship.sprite.setSpriteFrame(ship.frames[0]);
        gun.hasAmmo=true;
        lpr.timers[0]=null;
      }
      return;
    } else {
      this.processKeys(node,dt);
    }
  },

  processKeys: function (node, dt) {
    var hit=false;

    if (cc.sys.capabilities['keyboard']) {
      hit= sh.main.keyboard[cc.KEY.space];
    }
    else
    if (cc.sys.capabilities['mouse']) {
    }
    else
    if (cc.sys.capabilities['touches']) {
    }

    if (!hit) {
      return;
    }

    this.fireMissile(node,dt);
  },

  fireMissile: function(node,dt) {
    var csts= sh.xcfg.csts,
    p= sh.pools[csts.P_MS],
    lpr= node.looper,
    sp= node.ship,
    gun= node.cannon,
    pos= sp.sprite.getPosition(),
    top= ccsx.getTop(sp.sprite),
    tag,
    ent= p.get();

    if (!ent) {
      utils.createMissiles(sh.main,this.state,30);
      ent= p.get();
    }

    tag= ent.sprite.getTag();
    ent.revive(pos.x, top + 4);
    sh.pools[csts.P_LMS][tag] = ent;

    lpr.timers[0] = ccsx.createTimer(sh.main, gun.coolDownWindow);
    gun.hasAmmo=false;
    sp.sprite.setSpriteFrame(sp.frames[1]);
  }

});

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

