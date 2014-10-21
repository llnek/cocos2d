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
                               'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    EntityFactory = sh.Ashley.casDef({

      constructor: function(engine) {
        this.engine=engine;
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
      },

      killShip: function(ship, explode) {
        sh.fireEvent('/game/objects/players/killed');
        sh.sfxPlay('xxx-explode');
      },

      killAlien: function(alien,explode) {
        sh.fireEvent('/game/objects/players/earnscore', {score: alien.value});
        alien.sprite.setVisible(false);
        alien.sprite.setPosition(0,0);
        alien.status=false;
        sh.sfxPlay('xxx-explode');
      },

      resetPools: function() {
        sh.pools[csts.P_MS].drain();
        sh.pools[csts.P_BS].drain();
        sh.pools[csts.P_ES].drain();
        sh.pools[csts.P_LMS] = {};
        sh.pools[csts.P_LBS] = {};
      }

      eraseShip: function(node) {
        sh.main.removeItem(node.ship.sprite);
        this.ships.remove(node);
        this.engine.removeEntity(node.entity);
        utils.killShip(node.ship,true);
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

      createAliens: function() {
        var stepx= this.state.alienSize.width /3,
        az= this.state.alienSize,
        cw= ccsx.center(),
        info,
        aliens=[],
        n, x,y,
        aa, row = 0,
        ent= sh.Ashley.newEntity();

        for (n=0; n < csts.CELLS; ++n) {
          if (n % csts.COLS === 0) {
            y = n === 0 ? (csts.GRID_H - csts.TOP) * csts.TILE : y - az.height - csts.OFF_Y;
            x = csts.LEFT * csts.TILE + sh.hw(az);
            row += 1;
          }
          info= this.getRankInfo(row);
          aa= ccsx.createSpriteFrame(info[1][0]);
          aa.setPosition( x + sh.hw(az), y - sh.hh(az));
          aa.runAction(new cc.RepeatForever(
            new cc.Animate( new cc.Animation(
                [ccsx.getSpriteFrame(info[1][0]),
                 ccsx.getSpriteFrame(info[1][1]) ], 1))));
          sh.main.addAtlasItem('game-pics', aa);
          aliens.push(new cobjs.Alien(aa,info[0],row));
          x += az.width + csts.OFF_X;
        }

        ent.add(new cobjs.AlienSqad(aliens,stepx));
        ent.add(new cobjs.Looper(2));

        this.engine.addEntity(ent);
      },

      createShip: function() {
        var ent= new sh.Ashley.newEntity(),
        y = this.state.shipSize.height +
            5 * csts.TILE,
        x = ccsx.center().x,
        s= ccsx.createSpriteFrame('ship_1.png');
        s.setPosition(x,y);
        sh.main.addAtlasItem('game-pics', s);

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

