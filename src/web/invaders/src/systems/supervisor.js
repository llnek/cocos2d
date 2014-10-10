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
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xpool'],

  function (cobjs, utils, sjs, sh, xcfg, ccsx, xpool) { "use strict";

    var csts = xcfg.csts,
    undef,
    GameSupervisor = Ash.System.extend({

      constructor: function(options) {
        this.factory= options.factory;
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
        this.factory.createAliens(sh.main,this.state);
      },

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.spawnAliens();
          this.inited=true;
        }
      },

      onceOnly: function() {
        sh.pools[csts.P_MS] = new xpool.XEntityPool({ entityProto: cobjs.Missile });
        sh.pools[csts.P_BS] = new xpool.XEntityPool({ entityProto: cobjs.Bomb });
        sh.pools[csts.P_ES] = new xpool.XEntityPool({ entityProto: cobjs.Explosion });
        sh.pools[csts.P_LMS] = {};
        sh.pools[csts.P_LBS] = {};
        this.initAlienSize();
        this.initShipSize();
        utils.createMissiles(sh.main,this.state,50);
        utils.createBombs(sh.main,this.state,50);
        utils.createExplosions(sh.main,this.state,50);
        this.factory.createShip(sh.main,this.state);
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

