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

define('zotohlab/p/s/movelasers', ['zotohlab/p/s/utils',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/ccsx'],

  function (utils, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MovementBombs = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        var pos,
        x, y;

        sh.pools.Lasers.iter(function(b) {
          if (b.status) {
            pos= b.pos();
            y = pos.y + dt * b.vel.y * b.speed;
            x = pos.x + dt * b.vel.x * b.speed;
            b.setPos(x, y);
          }
        });
      }

    });

    return MovementBombs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

