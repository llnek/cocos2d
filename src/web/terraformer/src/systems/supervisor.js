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
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xpool',
                                  'ash-js'],

  function (cobjs, utils, gnodes, sjs, sh, xcfg, ccsx, xpool,Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    GameSupervisor = Ash.System.extend({

      constructor: function(options) {
        this.factory= options.factory;
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

      onceOnly: function() {
        sh.pools[csts.P_MS] = new xpool.XEntityPool({ entityProto: cobjs.Missile });
        sh.pools[csts.P_BS] = new xpool.XEntityPool({ entityProto: cobjs.Bomb });
        //sh.pools[csts.P_ES] = new xpool.XEntityPool({ entityProto: cobjs.Explosion });
        sh.pools[csts.P_LMS] = {};
        sh.pools[csts.P_LBS] = {};

        this.state.backSky.sprite.setVisible(true);
        this.state.backSky.status=true;

        utils.createMissiles(sh.main.getNode('op-pics'), this.state, 50);
        utils.createBombs(sh.main.getNode('op-pics'), this.state, 50);
        this.factory.createShip(sh.main.getNode('tr-pics'), this.state);

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

