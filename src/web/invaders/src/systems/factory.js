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

define('zotohlab/p/s/factory',

       ['zotohlab/p/components',
       'cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xpool'],

  function (cobjs, sjs, sh, ccsx, XPool) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    EntityFactory = sh.Ashley.casDef({

      constructor: function(engine, options) {
        this.engine=engine;
        this.state= options;
      },

      createMissiles: function(count) {
        sh.pools.Missiles.preSet(function() {
          var sp = ccsx.createSpriteFrame('missile.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Missile(sp);
        }, count || 36);
      },

      createExplosions: function(count) {
        sh.pools.Explosions.preSet(function() {
          var sp = ccsx.createSpriteFrame('boom_0.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Explosion(sp);
        }, count || 24);
      },

      createBombs: function(count) {
        sh.pools.Bombs.preSet(function() {
          var sp = ccsx.createSpriteFrame('bomb.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Bomb(sp);
        }, count || 24);
      },

      calcImgSize: function(img) {
        return ccsx.createSpriteFrame(img).getContentSize();
      },

      getRankInfo: function(rank) {
        if (rank < 3) {
          return [100, [ 'blue_bug_0.png', 'blue_bug_1.png' ] ,
            this.calcImgSize('blue_bug_0.png') ];
        }
        else
        if (rank < 5) {
          return [50, [ 'green_bug_0.png', 'green_bug_1.png' ] ,
            this.calcImgSize('green_bug_0.png') ];
        }
        else {
          return [30,  [ 'purple_bug_0.png', 'purple_bug_1.png' ] ,
            this.calcImgSize('purple_bug_0.png') ];
        }
      },

      fillSquad: function(pool) {
        var az= this.state.alienSize,
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        row = 0,
        info,
        aa,
        n,x,y;

        info= this.getRankInfo(row);
        az= info[2];
        for (n=0; n < csts.CELLS; ++n) {
          if (n % csts.COLS === 0) {
            y = n === 0 ? wb.top * 0.9
                        : y - az.height - wz.height * 4/480;
            x = wb.left + (8/320 * wz.width) + sh.hw( az);
            row += 1;
            info= this.getRankInfo(row);
            az= info[2];
          }
          aa= ccsx.createSpriteFrame(info[1][0]);
          aa.setPosition( x + sh.hw(az), y - sh.hh(az));
          aa.runAction(new cc.RepeatForever(
            new cc.Animate( new cc.Animation(
                [ccsx.getSpriteFrame(info[1][0]),
                 ccsx.getSpriteFrame(info[1][1]) ], 1))));
          sh.main.addAtlasItem('game-pics', aa);
          x += az.width + (8/320 * wz.width);
          aa= new cobjs.Alien(aa,info[0],row);
          aa.status=true;
          pool.push(aa);
        }
      },

      createAliens: function() {
        var stepx= this.state.alienSize.width /3,
        aliens= new XPool(),
        me=this,
        ent= sh.Ashley.newEntity();

        aliens.preSet(function(pool) {
          me.fillSquad(pool);
        },1);

        ent.add(new cobjs.AlienSquad(aliens,stepx));
        ent.add(new cobjs.Looper(2));

        this.engine.addEntity(ent);
      },

      bornShip: function() {
        if (!!this.state.ship) {
          this.state.ship.inflate();
        }
      },

      createShip: function() {
        var wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        y = this.state.shipSize.height + wb.bottom + (5/60 * wz.height),
        x = wb.left + wz.width * 0.5,
        ship,
        s= ccsx.createSpriteFrame('ship_1.png'),
        ent= new sh.Ashley.newEntity();

        sh.main.addAtlasItem('game-pics', s);

        ship = new cobjs.Ship(s, ['ship_1.png', 'ship_0.png']);
        this.state.ship= ship;
        ship.inflate({ x: x, y: y});
        ent.add(ship);

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

