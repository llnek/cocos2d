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

define('zotohlab/p/s/moveasteroids', ['cherimoia/skarojs',
                                     'zotohlab/asterix',
                                     'zotohlab/asx/xcfg',
                                     'zotohlab/asx/ccsx',
                                     'ash-js'],

  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    MoveAsteroids = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        var p= sh.pools[ csts.P_LAS];
        sjs.eachObj(function(n) {
          this.process(n,dt);
        }.bind(this), p);
      },

      process: function(node, dt) {
        var rot= node.rotation,
        B = this.state.world,
        velo= node.velocity,
        sp= node.astro.sprite,
        sz= sp.getContentSize(),
        pos= sp.getPosition(),
        r,x,y;

        x = pos.x + dt * velo.vel.x;
        y = pos.y + dt * velo.vel.y;

        rot.angle += 0.1;
        if (rot.angle > 360) { rot.angle -= 360; }

        sp.setRotation(rot.angle);
        sp.setPosition(x,y);

        //wrap?
        r= ccsx.bbox4(sp);

        if (r.bottom > B.top) {
          if (velo.vel.y > 0) {
            y = B.bottom - sz.height;
          }
        }

        if (r.top < B.bottom) {
          if (velo.vel.y < 0) {
            y = B.top + sz.height;
          }
        }

        if (r.left > B.right) {
          if (velo.vel.x > 0) {
            x = B.left - sz.width;
          }
        }

        if (r.right < B.left) {
          if (velo.vel.x < 0) {
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

