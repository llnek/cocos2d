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

define('zotohlab/p/s/movemissiles', ['zotohlab/p/s/utils',
                                    'zotohlab/p/gnodes',
                                    'cherimoia/skarojs',
                                    'zotohlab/asterix',
                                    'zotohlab/asx/xcfg',
                                    'zotohlab/asx/ccsx',
                                    'ash-js'],

  function (utils, gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    MovementMissiles = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        var h = ccsx.screen().height - csts.TILE,
        aa=[],
        pos,
        y;
        sjs.eachObj(function(b) {
          pos= b.sprite.getPosition();
          y = pos.y + dt * b.vel.y;
          b.sprite.setPosition(pos.x, y);
          if (ccsx.getTop(b.sprite) >= h) {
            pos= b.sprite.getPosition();
            b.sprite.setPosition(pos.x,h);
            aa.push(b);
          }
        }, sh.pools[csts.P_LMS]);

        R.forEach(function(b) {
          this.killMissile(b);
        }.bind(this), aa);
      },

      killMissile: function(b) {
        var p = sh.pools[csts.P_LMS],
        ent,
        tag= b.sprite.getTag(),
        pos = b.sprite.getPosition();

        delete p[tag];
        sjs.loggr.debug('put back one missile into pool');
        sh.pools[csts.P_MS].add(b);
        // explosion?
        if (false) {
          this.showExplosion(pos.x,pos.y);
        }
      },

      showExplosion: function(x,y) {
        var p= sh.pools[csts.P_ES],
        ent = p.get();

        if (! sjs.echt(ent)) {
          utils.createExplosions();
          ent= p.get();
        }
        ent.inflate(x,y);
        sh.sfxPlay('xxx-explode');
      }

    });

    return MovementMissiles;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

