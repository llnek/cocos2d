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

define('zotohlab/p/s/collisions', ['zotohlab/p/s/utils',
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (utils, gnodes, sjs, sh, xcfg, ccsx, Ash ) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    CollisionSystem = Ash.System.extend({

      constructor: function(options) {
        this.factory= options.factory;
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.ships= undef;
        this.engine=undef;
      },

      addToEngine: function(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.engine=engine;
      },

      update: function (dt) {
        var p = sh.pools[ csts.P_LAS],
        m= sh.pools[ csts.P_LMS],
        ship = this.ships.head;

        if (this.state.running &&
           !!ship) {

          // 1. get rid of all colliding bombs & missiles.
          //this.checkMissilesBombs();
          // 2. kill aliens
          this.checkMissilesRocks(p,m);

          // 3. ship ok?
          //this.checkShipBombs(ship);
          // 4. overruned by aliens ?
          this.checkShipRocks(p, ship);
        }

      },

      checkMissilesBombs: function() {
        var mss = sh.pools[csts.P_LMS],
        bbs = sh.pools[csts.P_LAS],
        k, a, m, b;

        R.forEach(function(z) {
          a= R.keys(mss);
          b= bbs[z];
          for (k = 0; k < a.length; ++k) {
            m = mss[ a[k] ];
            if ( ccsx.collide0(m.sprite, b.sprite)) {
              utils.killBomb(b,true);
              utils.killMissile(m);
              break;
            }
          }
        }, R.keys(bbs));
      },

      checkMissilesRocks: function(ps, mss) {
        var arr= R.values(ps),
        sz= arr.length,
        a,r,
        m,n;

        R.forEach(function(z) {
          m = mss[z];
          for (n=0; n < sz; ++n) {
            a= arr[n].astro;
            if (a.status !== true) { continue; }
            if (ccsx.collide0(m.sprite, a.sprite)) {
              r=a.rank;
              utils.killMissile(m);
              utils.killRock(a,true);
              this.factory.createAsteroids(sh.main,this.state,r+1);
              break;
            }
          }
        }.bind(this), R.keys(mss));
      },

      checkShipBombs: function(node) {
        var b, n, ship=node.ship,
        pos= ship.sprite.getPosition(),
        x= pos.x,
        y= pos.y,
        p= sh.pools[csts.P_LBS],
        a= R.keys(p);

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
        sh.main.removeItem(node.ship.sprite);
        this.ships.remove(node);
        this.engine.removeEntity(node.entity);
        utils.killShip(node.ship,true);
      },

      checkShipRocks: function(p,snode) {
        var n, rocks= R.values(p),
        ship = snode.ship,
        a,r,
        sz= rocks.length;

        for (n=0; n < sz; ++n) {
          a=rocks[n].astro;
          r= a.rank;
          if (a.status !== true) { continue; }
          if (ccsx.collide0(ship.sprite,
                            a.sprite)) {
            utils.killRock(a,true);
            this.eraseShip(snode);
            this.factory.createAsteroids(sh.main,this.state,r+1);
            break;
          }
        }
      }

    });

    return CollisionSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

