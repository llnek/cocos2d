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

define('zotohlab/p/s/movebombs', ['zotohlab/p/components',
                                    'zotohlab/p/s/utils',
                                    'zotohlab/p/gnodes',
                                    'cherimoia/skarojs',
                                    'zotohlab/asterix',
                                    'zotohlab/asx/ccsx'],

  function (cobjs, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    MoveBombs = sh.Ashley.sysDef({

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

      moveBomb: function(m, dt) {
        var pos = m.sprite.getPosition();
        m.sprite.setPosition(pos.x + m.vel.x * dt,
                             pos.y + m.vel.y * dt);
      },

      processMovement: function(dt) {
        var me=this;
        sh.pools.Bombs.iter(function (b) {
          if (b.status) {
            me.moveBomb(b,dt);
          }
        });
      }

    });

    return MoveBombs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

