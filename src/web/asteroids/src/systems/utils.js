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

define('zotohlab/p/s/utils', ['zotohlab/p/components',
                             'cherimoia/skarojs',
                             'zotohlab/asterix',
                             'zotohlab/asx/xcfg',
                             'zotohlab/asx/ccsx',
                             'ash-js'],

  function (cobjs, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    SystemUtils = {

      createMissiles: function(layer,options,count) {
        for (var n=0; n < count; ++n) {
          var b= new cobjs.Missile(new cc.Sprite());
          b.sprite.initWithSpriteFrameName('laserGreen.png');
          layer.addItem(b.sprite);
          sh.pools[ csts.P_MS].add(b);
        }
      },

      killBomb: function(bb,explode) {
        sh.fireEvent('/game/objects/players/earnscore', {score: bb.value});
        var pos= bb.sprite.getPosition(),
        tag= bb.sprite.getTag(),
        x= pos.x,
        y= pos.y,
        p = sh.pools[csts.P_LBS];

        delete p[tag];
        sh.pools[csts.P_BS].add(bb);

        if (explode) {
        }
      },

      killMissile: function(mm,explode) {
        var pos= mm.sprite.getPosition(),
        tag= mm.sprite.getTag(),
        x= pos.x,
        y= pos.y,
        p = sh.pools[csts.P_LMS];

        delete p[tag];
        sh.pools[csts.P_MS].add(mm);

        if (explode) {
        }
        sjs.loggr.debug("missile killed - pid = " + tag);
      },

      killShip: function(ship, explode) {
        sh.fireEvent('/game/objects/players/killed');
        //sh.sfxPlay('xxx-explode');
      },

      killRock: function(rock,explode) {
        var ps= sh.pools[ csts.P_LAS],
        sp= rock.sprite,
        pid= sp.getTag(),
        r= ps[pid];

        sh.main.removeItem(sp);
        delete ps[pid];

        sjs.loggr.debug("rock killed - " + rock.rank);
        sh.fireEvent('/game/objects/players/earnscore',
                     {score: rock.value});
        //rock.status=false;
        //rock.sfxPlay('xxx-explode');
      }

    };

    return SystemUtils;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

