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
 * @module zotohlab/p/s/factory
 */
define('zotohlab/p/s/factory',

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    const BackTileMap= ["lvl1_map1.png", "lvl1_map2.png",
                      "lvl1_map3.png", "lvl1_map4.png"];
    /** @alias module:zotohlab/p/s/factory */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R=sjs.ramda,
    undef,
    /**
     * @class EntityFactory
     */
    EntityFactory = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method constructor
       * @param {Ash.Engine} engine
       */
      constructor(engine) {
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createShip
       * @return {Object} a ship
       */
      createShip() {
        let sp= ccsx.createSpriteFrame('ship01.png'),
        ent= sh.Ashley.newEntity(),
        sz= sp.getContentSize(),
        bs, player,
        cw= ccsx.center(),
        wz= ccsx.vrect();
        sp.setPosition(cw.x, sz.height);

        // set frame
        let fr0 = cc.spriteFrameCache.getSpriteFrame("ship01.png"),
        fr1 = cc.spriteFrameCache.getSpriteFrame("ship02.png"),
        animFrames = [fr0, fr1],
        animation = new cc.Animation(animFrames, 0.1),
        animate = cc.animate(animation);
        sp.runAction(animate.repeatForever());

        sh.main.addAtlasItem('tr-pics', sp, csts.SHIP_ZX);

        bs = ccsx.createSpriteFrame("ship03.png");
        bs.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        bs.setPosition(sz.width * 0.5, 12);
        bs.setVisible(false);
        sp.addChild(bs, csts.SHIP_ZX, 99999);

        player = new cobjs.Ship(sp, bs);
        ent.add(player);
        ent.add(new cobjs.Motion());
        this.engine.addEntity(ent);
        return player;
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBackSkies
       * @param {cc.Layer} layer
       */
      createBackSkies(layer) {
        //let layer= sh.main.getBackgd();
        sh.pools.BackSkies.preSet(() => {
          const bg = ccsx.createSpriteFrame('bg01.png');
          bg.setAnchorPoint(0,0);
          bg.setVisible(false);
          layer.addAtlasItem('tr-pics', bg, -10);
          return sh.Ashley.newObject(bg);
        }, 2);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createMissiles
       * @param {Number} count
       */
      createMissiles(count) {
        sh.pools.Missiles.preSet(() => {
          const sp= ccsx.createSpriteFrame('W1.png');
          sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          sp.setVisible(false);
          sh.main.addAtlasItem('op-pics', sp, csts.SHIP_ZX);
          return new cobjs.Missile(sp);
        }, count);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBombs
       * @param {Number} count
       */
      createBombs(count) {
        sh.pools.Bombs.preSet(() => {
          const sp= ccsx.createSpriteFrame('W2.png');
          sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          sp.setVisible(false);
          sh.main.addAtlasItem('op-pics', sp, csts.SHIP_ZX);
          return new cobjs.Bomb(sp);
        }, count);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createExplosions
       * @param {Number} count
       */
      createExplosions(count) {
        sh.pools.Explosions.preSet(() => {
          const sp = ccsx.createSpriteFrame("explosion_01.png");
          sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          sp.setVisible(false);
          sh.main.addAtlasItem('explosions', sp);
          return new cobjs.Explosion(sp);
        }, count || 6);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createHitEffects
       * @param {Number} count
       */
      createHitEffects(count) {
        sh.pools.HitEffects.preSet(() => {
          const sp = ccsx.createSpriteFrame("hit.png");
          sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          sp.setVisible(false);
          sh.main.addAtlasItem('op-pics', sp);
          return new cobjs.HitEffect(sp);
        }, count || 10);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createSparks
       * @param {Number} count
       */
      createSparks(count) {
        sh.pools.Sparks.preSet(() => {
          const sp = [ccsx.createSpriteFrame("explode2.png"),
                      ccsx.createSpriteFrame("explode3.png")];
          R.forEach((s) => {
            s.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            s.setVisible(false);
            sh.main.addAtlasItem('op-pics', s);
          }, sp);
          return new cobjs.Spark(sp[0], sp[1]);
        }, count || 6);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createEnemies
       * @param {Number} count
       */
      createEnemies(count) {
        const cr= (arg) => {
          const sp= ccsx.createSpriteFrame(arg.textureName);
          sp.setVisible(false);
          sh.main.addAtlasItem('tr-pics', sp,
                               csts.SHIP_ZX - 1); // why?
          return new cobjs.Enemy(sp, arg);
        },
        ts = xcfg.EnemyTypes;

        sh.pools.Baddies.preSet((pool) => {
          for (let j = 0; j < ts.length; ++j) {
            pool.push( cr( ts[j]));
          }
        }, count||3);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBackTiles
       * @param {Number} count
       */
      createBackTiles(count) {
        let layer= sh.main.getBackgd(),
        rc, sp,
        cr=(name) => {
          sp = ccsx.createSpriteFrame(name);
          sp.setAnchorPoint(0.5,0);
          sp.setVisible(false);
          layer.addAtlasItem('back-tiles', sp, -9);
          return sh.Ashley.newObject(sp);
        };

        let tm= BackTileMap,
        tn= tm.length,
        sz= count || 1;

        sh.pools.BackTiles.preSet((pool) => {
          for (let n=0; n < tn; ++n) {
            pool.push(cr(tm[sjs.rand(tn)]));
          }
        }, sz);
      }

    });

    exports= EntityFactory;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

