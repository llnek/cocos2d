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
        var s= new cc.Sprite();
        s.initWithSpriteFrameName( 'green_bug_0.png');
        return this.state.alienSize= s.getContentSize();
      },

      initShipSize: function() {
        var s= new cc.Sprite();
        s.initWithSpriteFrameName( 'ship_0.png');
        return this.state.shipSize= s.getContentSize();
      },

      spawnAliens: function() {
        sh.factory.createAliens();
      },

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.spawnAliens();
          this.inited=true;
        }
      },

      onceOnly: function() {
        sh.pools.Missiles = new XPool();
        sh.pools.Bombs = new XPool();
        sh.pools.Explosions = new XPool();

        this.initAlienSize();
        this.initShipSize();

        sh.factory.createMissiles(sh.main,this.state,50);
        sh.factory.createBombs(sh.main,this.state,50);
        sh.factory.createExplosions(sh.main,this.state,50);
        sh.factory.createShip(sh.main,this.state);

      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

