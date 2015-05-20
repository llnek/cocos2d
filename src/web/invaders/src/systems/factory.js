// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires zotohlab/p/elements
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xpool
 * @module zotohlab/p/s/factory
 */
define('zotohlab/p/s/factory',

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xpool'],

  function (cobjs, sjs, sh, ccsx, XPool) { "use strict";

    /** @alias module:zotohlab/p/s/factory */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class EntityFactory
     */
    EntityFactory = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method constructor
       * @param {Ash.Engine} engine
       * @param {Object} options
       */
      constructor: function(engine, options) {
        this.engine=engine;
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createMissiles
       * @param {Number} count
       */
      createMissiles: function(count) {
        sh.pools.Missiles.preSet(function() {
          var sp = ccsx.createSpriteFrame('missile.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Missile(sp);
        }, count || 36);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createExplosions
       * @param {Number} count
       */
      createExplosions: function(count) {
        sh.pools.Explosions.preSet(function() {
          var sp = ccsx.createSpriteFrame('boom_0.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Explosion(sp);
        }, count || 24);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBombs
       * @param {Number} count
       */
      createBombs: function(count) {
        sh.pools.Bombs.preSet(function() {
          var sp = ccsx.createSpriteFrame('bomb.png');
          sp.setVisible(false);
          sh.main.addAtlasItem('game-pics', sp);
          return new cobjs.Bomb(sp);
        }, count || 24);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method calcImgSize
       * @param {String} img
       */
      calcImgSize: function(img) {
        return ccsx.createSpriteFrame(img).getContentSize();
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method getRankInfo
       * @param {Number} rank
       */
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

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method fillSquad
       * @param {XPool} pool
       */
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

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createAliens
       */
      createAliens: function() {
        var stepx= this.state.alienSize.width /3,
        ent= sh.Ashley.newEntity(),
        aliens= new XPool(),
        me=this;

        aliens.preSet(function(pool) {
          me.fillSquad(pool);
        },1);

        ent.add(new cobjs.AlienSquad(aliens,stepx));
        ent.add(new cobjs.Looper(2));

        this.engine.addEntity(ent);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method bornShip
       */
      bornShip: function() {
        if (!!this.state.ship) {
          this.state.ship.inflate();
        }
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createShip
       */
      createShip: function() {
        var s= ccsx.createSpriteFrame('ship_1.png'),
        ent= new sh.Ashley.newEntity(),
        wz= ccsx.vrect(),
        wb= ccsx.vbox(),
        y = this.state.shipSize.height +
            wb.bottom +
            (5/60 * wz.height),
        x = wb.left + wz.width * 0.5,
        ship;

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

    exports = EntityFactory;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

