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
    Resolution = sh.Ashley.sysDef({

      constructor: function(options) {
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
        pos;

        sh.pools.Missiles.iter(function(m){
          if (m.status) {
            pos= m.sprite.getPosition();
            if (m.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              m.deflate();
            }
          }
        });
      },

      checkBombs: function() {
        var box= sh.main.getEnclosureBox(),
        pos;

        sh.pools.Bombs.iter(function(b) {
          if (b.status) {
            pos= b.sprite.getPosition();
            if (b.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              b.deflate();
            }
          }
        });
      },

      checkAliens: function() {
        var box= sh.main.getEnclosureBox(),
        pos;

        sh.pools.Baddies.iter(function(a) {
          if (a.status) {
            pos= a.sprite.getPosition();
            if (a.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              a.deflate();
              sh.fireEvent('/game/objects/players/earnscore', { score: a.value });
            }
          }
        });
      },

      checkShip: function(node) {
        var ship = node.ship;

        if (ship.status) {
          if (ship.HP <= 0) {
            ship.deflate();
            sh.fireEvent('/game/objects/players/killed');
          }
        }
      }


    });

    return Resolution;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

