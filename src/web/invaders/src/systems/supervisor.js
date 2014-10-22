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

define("zotohlab/p/s/supervisor", ['zotohlab/p/components',
                                  'zotohlab/p/s/utils',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xpool'],

  function (cobjs, utils, sjs, sh, ccsx, XPool) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    GameSupervisor = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
        this.inited=false;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      initAlienSize: function() {
        this.state.alienSize= ccsx.createSpriteFrame('green_bug_0.png').getContentSize();
      },

      initShipSize: function() {
        this.state.shipSize= ccsx.createSpriteFrame( 'ship_0.png').getContentSize();
      },

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.inited=true;
        }
      },

      onceOnly: function() {
        sh.pools.Missiles = new XPool();
        sh.pools.Bombs = new XPool();
        sh.pools.Explosions = new XPool();

        this.initAlienSize();
        this.initShipSize();

        sh.factory.createMissiles();
        sh.factory.createBombs();
        sh.factory.createExplosions();

        sh.factory.createAliens();
        sh.factory.createShip();
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

