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

define('zotohlab/p/s/factory', ['zotohlab/p/components',
                               'cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'ash-js'],

  function (cobjs, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    EntityFactory = Ash.Class.extend({

      constructor: function(engine) {
        this.engine=engine;
      },

      getRankInfo: function(rank) {
        if (rank < 3) {
          return [100, [ 'blue_bug_1.png', 'blue_bug_0.png' ] ];
        }
        else
        if (rank < 5) {
          return [50, [ 'green_bug_1.png', 'green_bug_0.png' ] ];
        }
        else {
          return [30,  [ 'purple_bug_0.png', 'purple_bug_1.png' ]];
        }
      },

      createAliens: function(layer, options) {
        var stepx= options.alienSize.width /3,
        az= options.alienSize,
        cw= ccsx.center(),
        info,aliens=[],
        n, x,y,
        aa, row = 0,
        ent= new Ash.Entity();

        for (n=0; n < csts.CELLS; ++n) {
          if (n % csts.COLS === 0) {
            y = n === 0 ? (csts.GRID_H - csts.TOP) * csts.TILE : y - az.height - csts.OFF_Y;
            x = csts.LEFT * csts.TILE + sh.hw(az);
            row += 1;
          }
          info= this.getRankInfo(row);
          aa= new cc.Sprite();
          aa.initWithSpriteFrameName(info[1][0]);
          aa.setPosition( x + sh.hw(az), y - sh.hh(az));
          aa.runAction(new cc.RepeatForever(
            new cc.Animate( new cc.Animation(
                [ccsx.getSpriteFrame(info[1][0]),
                 ccsx.getSpriteFrame(info[1][1]) ], 1))));
          layer.addItem(aa);
          aliens.push(new cobjs.Alien(aa,info[0],row));
          x += az.width + csts.OFF_X;
        }

        ent.add(new cobjs.AlienSqad(aliens,stepx));
        ent.add(new cobjs.Looper(2));

        this.engine.addEntity(ent);
      },

      createShip: function(layer,options) {
        var ent= new Ash.Entity(),
        x = ccsx.center().x,
        y = 5 * csts.TILE + options.shipSize.height,
        s= new cc.Sprite();

        s.initWithSpriteFrameName('ship_1.png');
        s.setPosition(x,y);
        layer.addItem(s);
        ent.add(new cobjs.Ship(s, ['ship_1.png', 'ship_0.png']));
        ent.add(new cobjs.Velocity(150,0));
        ent.add(new cobjs.Looper(1));
        ent.add(new cobjs.Cannon());
        ent.add(new cobjs.Motion());
        this.engine.addEntity(ent);
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

