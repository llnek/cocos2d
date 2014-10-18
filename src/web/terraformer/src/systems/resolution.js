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
    Resolution = Ash.System.extend({

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

      update: function (dt) {
        var node = this.ships.head;

        if (this.state.running &&
           !!node) {

          this.checkMissiles();
          this.checkBombs();
          this.checkAliens();
          this.checkShip(node);
        }
      },

      checkMissiles: function() {
        var box= sh.main.getEnclosureBox(),
        mss= sh.pools[csts.P_MS],
        pos;

        R.forEach(function(m) {
          if (m.status) {
            pos= m.sprite.getPosition();
            if (m.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              m.sprite.setVisible(false);
              m.status= false;
            }
          }
        }, mss);
      },

      checkBombs: function() {
        var box= sh.main.getEnclosureBox(),
        mss= sh.pools[csts.P_BS],
        pos;

        R.forEach(function(m) {
          if (m.status) {
            pos= m.sprite.getPosition();
            if (m.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              m.sprite.setVisible(false);
              m.status= false;
            }
          }
        }, mss);
      },

      checkAliens: function() {
        var box= sh.main.getEnclosureBox(),
        mss= sh.pools[csts.P_BADIES],
        pos;

        R.forEach(function(m) {
          if (m.status) {
            pos= m.sprite.getPosition();
            if (m.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              m.sprite.unscheduleAllCallbacks();
              m.sprite.stopAllActions();
              m.sprite.setVisible(false);
              m.status= false;
              --mss.actives;
              sh.fireEvent('/game/objects/players/earnscore', { score: m.scoreValue});
            }
          }
        }, mss.ens);
      },

      checkShip: function(node) {
        var ship = node.ship;

        if (ship.status) {
          if (ship.HP <= 0) {
            ship.sprite.setVisible(false);
            ship.status=false;
            sh.fireEvent('/game/objects/players/killed');
          }
        }
      }


    });

    return Resolution;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

