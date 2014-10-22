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
                                  'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    CollisionSystem = sh.Ashley.sysDef({

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

          this.checkMissilesRocks();

          if (!!ship) {
            this.checkShipBombs(ship);
            this.checkShipRocks(ship);
          }
        }

      },

      collide: function(a,b) {
        return ccsx.collide0(a.sprite, b.sprite);
      },

      checkMissilesRocks: function() {
        var me=this;
        sh.pools.Missiles.iter(function(m) {
          if (m.status && m.HP > 0) {
            sh.pools.Astros3.iter(function(a) {
              if (a.status && me.collide(m,a)) {
                m.hurt();
                a.hurt();
              }
            });
          }
          if (m.status && m.HP > 0) {
            sh.pools.Astros2.iter(function(a) {
              if (a.status && me.collide(m,a)) {
                m.hurt();
                a.hurt();
              }
            });
          }
          if (m.status && m.HP > 0) {
            sh.pools.Astros1.iter(function(a) {
              if (a.status && me.collide(m,a)) {
                m.hurt();
                a.hurt();
              }
            });
          }
        });
      },

      checkShipBombs: function(node) {
        var ship = node.ship,
        me=this;
        sh.pools.Lasers.iter(function(b) {
          if (b.status &&
              ship.status &&
              me.collide(b,ship)) {
            ship.hurt();
            b.hurt();
          }
        });
      },

      checkShipRocks: function(node) {
        var ship = node.ship,
        me=this;

        if (ship.status && ship.HP > 0) {
          sh.pools.Astros3.iter(function(a) {
            if (a.status && me.collide(ship,a)) {
              ship.hurt();
              a.hurt();
            }
          });
        }
        if (ship.status && ship.HP > 0) {
          sh.pools.Astros2.iter(function(a) {
            if (a.status && me.collide(ship,a)) {
              ship.hurt();
              a.hurt();
            }
          });
        }
        if (ship.status && ship.HP > 0) {
          sh.pools.Astros1.iter(function(a) {
            if (a.status && me.collide(ship,a)) {
              ship.hurt();
              a.hurt();
            }
          });
        }
      }

    });

    return CollisionSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

