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

define('zotohlab/p/s/movelasers', ['zotohlab/p/s/utils',
                                  'cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'zotohlab/asx/xcfg',
                                  'zotohlab/asx/ccsx',
                                  'ash-js'],

  function (utils, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    MovementBombs = Ash.System.extend({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
      },

      addToEngine: function(engine) {
      },

      update: function (dt) {
        var aa=[],
        pos,
        y;

        sjs.eachObj(function(b) {
          pos= b.sprite.getPosition();
          y = pos.y + dt * b.vel.y;
          b.sprite.setPosition(pos.x, y);
          if (ccsx.getBottom(b.sprite) <= csts.TILE) {
            pos= b.sprite.getPosition();
            b.sprite.setPosition(pos.x,csts.TILE);
            aa.push(b);
          }
        }, sh.pools[csts.P_LBS] );

        R.forEach(function(b) {
          this.killBomb(b);
        }.bind(this), aa);
      },

      killBomb: function(b) {
        var p = sh.pools[csts.P_LBS],
        ent,
        tag= b.sprite.getTag(),
        pos = b.sprite.getPosition();

        delete p[tag];
        sjs.loggr.debug('put back one bomb into pool');
        sh.pools[csts.P_BS].add(b);
        // explosion?
        if (true) {
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

    return MovementBombs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

