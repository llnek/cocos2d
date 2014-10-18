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
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (cobjs, utils, gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    Collisions = Ash.System.extend({

      constructor: function(options) {
        this.factory= options.factory;
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      collide: function (a, b) {
        /*
        var pos_a = a.getPosition(),
        pos_b = b.getPosition();

        if (Math.abs(pos_a.x - pos_b.x) > csts.CONSTRAINT_WD ||
            Math.abs(pos_a.y - pos_b.y) > csts.CONSTRAINT_HT) {
          return false;
        }
*/
        return ccsx.collide0(a.sprite, b.sprite);
      },

      update: function (dt) {

        checkMissilesAliens(node);
        checkShipAliens(node);
        checkShipBombs(node);
        checkMissilesBombs();

      },

      checkMissilesBombs: function() {

        var bombs = sh.pools[csts.P_LBS],
        mss = sh.pools[csts.P_LMS],
        me=this;

        sjs.eachObj(function(b) {

          sjs.eachObj(function(m) {

            if (b.status && m.status &&
                me.collide(b, m)) {
              m.hurt();
              b.hurt();
            }

          }, mss);

        }, bombs);
      },

      checkMissilesAliens: function(node) {
        var enemies= sh.pools[csts.P_BADIES],
        bullets= sh.pool[csts.P_LMS],
        me=this;

        R.forEach(function(en) {
          if (!en.status) { return; }
          sjs.eachObj(function(b) {
            if (b.status &&
                me.collide(en, b)) {
              en.hurt();
              b.hurt();
            }
          }, bullets);
        }, enemies);

      },

      checkShipBombs: function(node) {
        var bombs = sh.pools[csts.P_LBS],
        me=this,
        ship= node.ship;

        if (!ship.status) {
          return;
        }

        sjs.eachObj(function(b) {
          if (b.status &&
              me.collide(b, ship)) {
            ship.hurt();
            b.hurt();
          }
        }, bombs);

      },

      checkShipAliens: function(node) {
        var enemies= sh.pools[csts.P_BADIES],
        me=this,
        ship= node.ship;

        if (! ship.status) {
          return;
        }

        R.forEach(function(en) {
          if (en.status &&
              me.collide(en, ship)) {
            ship.hurt();
            en.hurt();
          }
        }, enemies);

      }

    });

    return Collisions;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

