// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define('zotohlab/p/s/collisions',

       ['zotohlab/p/s/priorities',
         'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    CollisionSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
        this.inited=false;
      },

      removeFromEngine: function(engine) {
        this.aliens= undef;
        this.ships= undef;
        this.engine=undef;
      },

      addToEngine: function(engine) {
        this.aliens= engine.getNodeList(gnodes.AlienMotionNode);
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.engine=engine;
      },

      update: function (dt) {
        var aliens= this.aliens.head,
        ship = this.ships.head;

        // 1. get rid of all colliding bombs & missiles.
        //this.checkMissilesBombs();
        // 2. kill aliens
        this.checkMissilesAliens(aliens);

        if (!!ship) {
          // 3. ship ok?
          this.checkShipBombs(ship);
          // 4. overruned by aliens ?
          if (!!aliens) {
            this.checkShipAliens(aliens, ship);
          }
        }
      },

      collide: function(a, b) {
        return ccsx.collide0(a.sprite, b.sprite);
      },

      checkMissilesBombs: function() {
        var mss = sh.pools.Missiles,
        bbs = sh.pools.Bombs,
        me=this;

        mss.iter(function(m) {
          bbs.iter(function(b) {
            if (b.status &&
                m.status &&
                me.collide(m,b)) {
              b.hurt();
              m.hurt();
            }
          });
        });
      },

      checkMissilesAliens: function(node) {
        var mss = sh.pools.Missiles,
        sqad= node.aliens,
        me=this;

        R.forEach(function(en) {
          if (en.status) {
            mss.iter(function(m){
              if (m.status &&
                  me.collide(en,m)) {
                en.hurt();
                m.hurt();
              }
            });
          }
        }, sqad.aliens.pool);
      },

      checkShipBombs: function(node) {
        var bbs= sh.pools.Bombs,
        me= this,
        ship=node.ship;

        bbs.iter(function(b) {
          if (ship.status &&
              b.status &&
              me.collide(ship, b)) {
            ship.hurt();
            b.hurt();
          }
        });
      },

      checkShipAliens: function(anode,snode) {
        var n, sqad= anode.aliens,
        ship = snode.ship,
        me=this,
        sz= sqad.aliens.length;

        R.forEach(function(en) {
          if (ship.status &&
              en.status &&
              me.collide(ship, en)) {
            ship.hurt();
            en.hurt();
          }
        }, sqad.aliens.pool);
      }

    });

    CollisionSystem.Priority = pss.Collision;
    return CollisionSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

