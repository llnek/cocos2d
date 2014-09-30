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
ivs= sh.Invaders,
utils=ivs.SystemUtils;


//////////////////////////////////////////////////////////////////////////////
//

ivs.CollisionSystem = Ash.System.extend({

  constructor: function(options) {
    this.factory= options.factory;
    this.state= options;
    this.inited=false;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.aliens= engine.getNodeList(ivs.AlienMotionNode);
    this.ships= engine.getNodeList(ivs.ShipMotionNode);
    this.engine=engine;
  },

  update: function (dt) {
    var aliens= this.aliens.head,
    ship = this.ships.head;

    // 1. get rid of all colliding bombs & missiles.
    this.checkMissilesBombs();
    // 2. kill aliens
    this.checkMissilesAliens(aliens);

    if (ship) {
      // 3. ship ok?
      this.checkShipBombs(ship);
      // 4. overruned by aliens ?
      this.checkShipAliens(aliens, ship);
    }

  },

  checkMissilesBombs: function() {
    var k, a, m, b, csts= sh.xcfg.csts,
    mss = sh.pools[csts.P_LMS],
    bbs = sh.pools[csts.P_LBS];

    _.each(_.keys(bbs), function(z) {
      a= _.keys(mss);
      b= bbs[z];
      for (k = 0; k < a.length; ++k) {
        m = mss[ a[k] ];
        if ( ccsx.collide0(m.sprite, b.sprite)) {
          utils.killBomb(b,true);
          utils.killMissile(m);
          break;
        }
      }
    });
  },

  checkMissilesAliens: function(node) {
    var m, n, csts= sh.xcfg.csts,
    mss = sh.pools[csts.P_LMS],
    sqad= node.aliens,
    sz= sqad.aliens.length;

    _.each(_.keys(mss), function(z) {
      m = mss[z];
      for (n=0; n < sz; ++n) {
        if (sqad.aliens[n].status !== true) {
          continue;
        }
        if (ccsx.collide0(m.sprite, sqad.aliens[n].sprite)) {
          utils.killMissile(m);
          utils.killAlien(sqad.aliens[n],true);
          break;
        }
      }
    });
  },

  checkShipBombs: function(node) {
    var b, n, csts = sh.xcfg.csts,
    ship=node.ship,
    pos= ship.sprite.getPosition(),
    x= pos.x,
    y= pos.y,
    p= sh.pools[csts.P_LBS],
    a= _.keys(p);

    for (n=0; n < a.length; ++n) {
      b = p[ a[n] ];
      if (ccsx.collide0(b.sprite, ship.sprite)) {
        utils.killBomb(b);
        this.eraseShip(node);
        break;
      }
    }
  },

  eraseShip: function(node) {
    //node.ship.sprite.getParent().removeChild(node.sprite);
    sh.main.removeItem(node.ship.sprite);
    this.ships.remove(node);
    this.engine.removeEntity(node.entity);
    utils.killShip(node.ship,true);
  },

  checkShipAliens: function(anode,snode) {
    var n, sqad= anode.aliens,
    ship = snode.ship,
    sz= sqad.aliens.length;

    for (n=0; n < sz; ++n) {
      if (sqad.aliens[n].status !== true) {
        continue;
      }
      if (ccsx.collide0(ship.sprite,
                        sqad.aliens[n].sprite)) {
        utils.killAlien(sqad.aliens[n]);
        this.eraseShip(snode);
        break;
      }
    }
  }


});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




