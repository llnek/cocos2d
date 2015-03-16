// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define('zotohlab/p/s/supervisor', ['zotohlab/p/components',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx',
                                  'zotohlab/asx/xpool'],

  function (cobjs, sjs, sh, ccsx, XPool) { "use strict";

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

      update: function (dt) {
        if (! this.inited) {
          this.onceOnly();
          this.inited=true;
        } else {
        }
      },

      onceOnly: function() {

        sh.pools.Missiles = new XPool();
        sh.pools.Lasers = new XPool();

        sh.pools.Astros3 = new XPool();
        sh.pools.Astros2 = new XPool();
        sh.pools.Astros1 = new XPool();

        this.initAsteroidSizes();
        this.initPlayerSize();
        this.initUfoSize();

        sh.factory.createAsteroids(csts.P_AS1);
        sh.factory.createShip();
      },

      initAsteroidSizes: function() {
        this.state.astro3 = ccsx.createSpriteFrame('rock_small.png').getContentSize();
        this.state.astro2 = ccsx.createSpriteFrame('rock_med.png').getContentSize();
        this.state.astro1 = ccsx.createSpriteFrame('rock_large.png').getContentSize();
      },

      initPlayerSize: function() {
        this.state.playerSize = ccsx.createSpriteFrame('rship_0.png').getContentSize();
      },

      initUfoSize: function() {
        this.state.ufoSize = ccsx.createSpriteFrame('ufo.png').getContentSize();
      }

    });

    return GameSupervisor;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

