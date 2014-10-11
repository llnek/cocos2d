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

define('zotohlab/p/s/supervisor', ['zotohlab/p/components',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xpool',
                                  'ash-js'],

  function (cobjs, sjs, sh, xcfg, ccsx, xpool, Ash) { "use strict";

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

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.inited=true;
        } else {
        }
      },

      onceOnly: function() {

        sh.pools[csts.P_MS] = new xpool.XEntityPool({ entityProto: cobjs.Missile });
        sh.pools[csts.P_LS] = new xpool.XEntityPool({ entityProto: cobjs.Laser });

        sh.pools[csts.P_AS3] = new xpool.XEntityPool({ entityProto: cobjs.Asteroid });
        sh.pools[csts.P_AS2] = new xpool.XEntityPool({ entityProto: cobjs.Asteroid });
        sh.pools[csts.P_AS1] = new xpool.XEntityPool({ entityProto: cobjs.Asteroid });

        sh.pools[csts.P_LMS] = {};
        sh.pools[csts.P_LLS] = {};
        sh.pools[csts.P_LAS] = {};

        this.initAsteroidSizes();
        this.initPlayerSize();
        this.initUfoSize();
        this.factory.createAsteroids(sh.main,this.state, csts.P_AS1);
        this.factory.createShip(sh.main,this.state);
      },

      initAsteroidSizes: function() {
        var s = new cc.Sprite();
        s.initWithSpriteFrameName('rock_small.png');
        this.state.astro3 = s.getContentSize();

        s = new cc.Sprite();
        s.initWithSpriteFrameName('rock_med.png');
        this.state.astro2 = s.getContentSize();

        s = new cc.Sprite();
        s.initWithSpriteFrameName('rock_large.png');
        this.state.astro1 = s.getContentSize();
      },

      initPlayerSize: function() {
        var s = new cc.Sprite();
        s.initWithSpriteFrameName('rship_0.png');
        this.state.playerSize = s.getContentSize();
      },

      initUfoSize: function() {
        var s = new cc.Sprite();
        s.initWithSpriteFrameName('ufo.png');
        this.state.ufoSize = s.getContentSize();
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

