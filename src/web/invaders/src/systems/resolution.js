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
                                  'zotohlab/asx/ccsx'],

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

        this.checkMissiles();
        this.checkBombs();
        this.checkAliens(aliens);
        this.checkShip(ship);
      },

      checkMissiles: function() {
        var mss = sh.pools.Missiles,
        ht = ccsx.screenHeight(),
        me=this;

        mss.iter(function(m) {
          if (m.status) {
            if (m.pos().y >= ht ||
                m.HP <= 0) {
              m.deflate();
            }
          }
        });
      },

      checkBombs: function() {
        var bbs = sh.pools.Bombs,
        bt = 0,
        me=this;

        bbs.iter(function(b) {
          if (b.status) {
            if (b.pos().y <= bt ||
                b.HP <= 0) {
              b.deflate();
            }
          }
        });
      },

      checkAliens: function(node) {
        var sqad= node.aliens,
        me=this;

        R.forEach(function(en) {
          if (en.status) {
            if (en.HP <= 0) {
              sh.fireEvent('/game/objects/players/earnscore', {
                score: en.value });
              en.deflate();
            }
          }
        }, sqad.aliens.pool);
      },

      checkShip: function(node) {
        var ship = node.ship;

        if (ship.status &&
            ship.HP <= 0) {
          ship.deflate();
          sh.fireEvent('/game/objects/players/killed');
        }
      }

    });

    return Resolution;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

