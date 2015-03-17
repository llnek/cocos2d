// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define('zotohlab/p/s/moveasteroids', ['cherimoia/skarojs',
                                     'zotohlab/asterix',
                                     'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    MoveAsteroids = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        var me=this;
        sh.pools.Astros3.iter(function(a) {
          if (a.status) { me.process(a, dt); }
        });
        sh.pools.Astros2.iter(function(a) {
          if (a.status) { me.process(a, dt); }
        });
        sh.pools.Astros1.iter(function(a) {
          if (a.status) { me.process(a, dt); }
        });
      },

      process: function(astro, dt) {
        var rot= astro.rotation,
        B = this.state.world,
        velo= astro.vel,
        sp= astro.sprite,
        sz= sp.getContentSize(),
        pos= sp.getPosition(),
        r,x,y;

        x = pos.x + dt * velo.x;
        y = pos.y + dt * velo.y;

        rot += 0.1;
        if (rot > 360) { rot -= 360; }

        astro.rotation= rot;
        sp.setRotation(rot);
        sp.setPosition(x,y);

        //wrap?
        r= ccsx.bbox4(sp);

        if (r.bottom > B.top) {
          if (velo.y > 0) {
            y = B.bottom - sz.height;
          }
        }

        if (r.top < B.bottom) {
          if (velo.y < 0) {
            y = B.top + sz.height;
          }
        }

        if (r.left > B.right) {
          if (velo.x > 0) {
            x = B.left - sz.width;
          }
        }

        if (r.right < B.left) {
          if (velo.x < 0) {
            x = B.right + sz.width;
          }
        }

        sp.setPosition(x,y);
      }

    });

    return MoveAsteroids;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

