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

define('zotohlab/p/s/resolution', ['zotohlab/p/components',
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (cobjs, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    Resolution = sh.Ashley.sysDef({

      constructor: function(options) {
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
        var ship = this.ships.head;

        if (this.state.running) {
          this.checkMissiles();
          this.checkLasers();
          this.checkAstros();
          this.checkShip();
        }

      },

      checkMissiles: function() {
        sh.pools.Missiles.iter(function(m) {
          if (m.status) {
            if (m.HP <= 0 ||
                ccsx.
            m.deflate();
          }
        });
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

    return Resolution;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

