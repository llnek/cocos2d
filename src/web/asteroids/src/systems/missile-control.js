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
ast= sh.Asteroids,
utils= ast.SystemUtils;


//////////////////////////////////////////////////////////////////////////////
//

ast.MissileControl = Ash.System.extend({

  constructor: function () {
    return this;
  },

  addToEngine: function (engine) {
    this.nodeList = engine.getNodeList(ast.CannonCtrlNode);
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
    ship= node.ship,
    gun= node.cannon,
    sz= ship.sprite.getContentSize(),
    pos= ship.sprite.getPosition(),
    top= ccsx.getTop(ship.sprite),
    deg= ship.sprite.getRotation(),
    tag,
    ent= p.get();

    if (!ent) {
      utils.createMissiles(sh.main,this.state,30);
      ent= p.get();
    }

    tag= ent.sprite.getTag();
    sh.pools[csts.P_LMS][tag] = ent;

    var rc= sh.calcXY(deg, sz.height * 0.5);
    ent.vel.x = rc[0];
    ent.vel.y = rc[1];
    ent.revive( pos.x + rc[0], pos.y + rc[1]);
    ent.sprite.setRotation(deg);

    lpr.timers[0] = ccsx.createTimer(sh.main, gun.coolDownWindow);
    gun.hasAmmo=false;
    //sh.sfxPlay('ship-missile');

  }

});

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

