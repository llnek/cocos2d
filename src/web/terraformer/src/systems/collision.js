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

define('zotohlab/p/s/collisions', ['zotohlab/p/components',
                                  'zotohlab/p/s/utils',
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (cobjs, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    Collisions = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      collide: function (a, b) {
        return ccsx.collide0(a.sprite, b.sprite);
      },

      update: function (dt) {
        var node = this.ships.head;

        if (this.state.running &&
            !!node) {

          this.checkMissilesAliens();
          this.checkShipAliens(node);
          this.checkShipBombs(node);
          //this.checkMissilesBombs();
        }

      },

      checkMissilesBombs: function() {
        var bombs = sh.pools.Bombs,
        mss = sh.pools.Missiles,
        me=this;
        bombs.iter(function(b) {
          mss.iter(function(m) {
            if (b.status &&
                m.status &&
                me.collide(b, m)) {
              m.hurt();
              b.hurt();
            }
          });
        });
      },

      checkMissilesAliens: function() {
        var enemies= sh.pools.Baddies,
        mss= sh.pools.Missiles,
        me=this;
        enemies.iter(function(en) {
          mss.iter(function(b) {
            if (en.status &&
                b.status &&
                me.collide(en, b)) {
              en.hurt();
              b.hurt();
            }
          });
        });
      },

      checkShipBombs: function(node) {
        var bombs = sh.pools.Bombs,
        me=this,
        ship= node.ship;

        if (!ship.status) { return; }
        bombs.iter(function(b) {
          if (b.status &&
              me.collide(b, ship)) {
            ship.hurt();
            b.hurt();
          }
        });
      },

      checkShipAliens: function(node) {
        var enemies= sh.pools.Baddies,
        me=this,
        ship= node.ship;

        if (! ship.status) { return; }
        enemies.iter(function(en) {
          if (en.status &&
              me.collide(en, ship)) {
            ship.hurt();
            en.hurt();
          }
        });
      }

    });

    return Collisions;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

