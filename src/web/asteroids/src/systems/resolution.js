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
          this.checkShip(ship);
        }

      },

      checkMissiles: function() {
        var world = this.state.world;
        sh.pools.Missiles.iter(function(m) {
          if (m.status) {
            if (m.HP <= 0 ||
                sh.outOfBound(ccsx.bbox4(m.sprite), world)) {
            m.deflate();
          }}
        });
      },

      checkLasers: function() {
        var world = this.state.world;
        sh.pools.Lasers.iter(function(b) {
          if (b.status) {
            if (b.HP <= 0 ||
                sh.outOfBound(ccsx.bbox4(b.sprite), world)) {
            b.deflate();
          }}
        });
      },

      checkAstros: function() {
        sh.pools.Astros1.iter(function(a) {
          if (a.status &&
              a.HP <= 0) {
              sh.fireEvent('/game/objects/players/earnscore', {score: a.value});
              sh.factory.createAsteroids(a.rank +1);
              a.deflate();
            }
        });
        sh.pools.Astros2.iter(function(a) {
          if (a.status &&
              a.HP <= 0) {
              sh.fireEvent('/game/objects/players/earnscore', {score: a.value});
              sh.factory.createAsteroids(a.rank +1);
              a.deflate();
            }
        });
        sh.pools.Astros3.iter(function(a) {
          if (a.status &&
              a.HP <= 0) {
              sh.fireEvent('/game/objects/players/earnscore', {score: a.value});
              a.deflate();
            }
        });
      },

      checkShip: function(node) {
        var ship=node.ship;

        if (ship.status && ship.HP <= 0) {
          ship.deflate();
          sh.fireEvent('/game/objects/players/killed');
        }
      }

    });

    return Resolution;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

