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

define('zotohlab/p/s/movemissiles', ['zotohlab/p/components',
                                    'zotohlab/p/s/utils',
                                    'zotohlab/p/gnodes',
                                    'cherimoia/skarojs',
                                    'zotohlab/asterix',
                                    'zotohlab/asx/xcfg',
                                    'zotohlab/asx/ccsx',
                                    'ash-js'],

  function (cobjs, utils, gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    MoveMissiles = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        if (this.state.running) {
          this.processMovement(dt);
        }
      },

      moveMissile: function(m, dt) {
        var pos = m.sprite.getPosition(),
        wz= ccsx.screen();
        var x = pos.x + m.vel.x * dt;
        var y = pos.y + m.vel.y * dt;
        m.sprite.setPosition(x,y);
      },

      processMovement: function(dt) {
        var po2 = sh.pools[csts.P_MS];

        R.forEach(function(v) {
          if (v.status) {
            this.moveMissile(v,dt);
          }
        }.bind(this), po2);

      }

    });

    return MoveMissiles;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

