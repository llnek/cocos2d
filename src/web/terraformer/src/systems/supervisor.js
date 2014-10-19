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
                                  'zotohlab/p/gnodes',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xpool'],

  function (cobjs, utils, gnodes, sjs, sh, ccsx, XPool) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    undef,
    GameSupervisor = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
        this.inited=false;
      },

      removeFromEngine: function(engine) {
        this.ships=null;
      },

      addToEngine: function(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.inited=true;
        }
      },

      initBackSkies: function () {
        var bs = sh.pools.BackSkies.get();
        this.state.backSkyRe = null;
        this.state.backSky = bs;
        this.state.backSkyDim = cc.size(bs.size());
      },

      onceOnly: function() {

        this.state.player= sh.factory.createShip();

        sh.pools.Missiles = new XPool();
        sh.pools.Baddies = new XPool();
        sh.pools.Bombs= new XPool();

        sh.pools.BackTiles= new XPool();
        sh.pools.BackSkies= new XPool();

        sh.factory.createBackSkies();
        this.initBackSkies();

        sh.factory.createMissiles();
        sh.factory.createBombs();
        sh.factory.createEnemies();

        var node = this.ships.head;
        if (!!node) {
          utils.bornShip(node.ship);
        }
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

