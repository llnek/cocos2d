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

    var BackTileMap= ["lvl1_map1.png", "lvl1_map2.png",
                      "lvl1_map3.png", "lvl1_map4.png"];
    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    EntityFactory = sh.Ashley.casDef({

      constructor: function(engine) {
        this.engine=engine;
      },

      createShip: function() {
        var sp= ccsx.createSpriteFrame('ship01.png'),
        ent= sh.Ashley.newEntity(),
        sz= sp.getContentSize(),
        bs, player,
        cw= ccsx.center(),
        wz= ccsx.screen();
        sp.setPosition(cw.x, sz.height);

        // set frame
        var fr0 = cc.spriteFrameCache.getSpriteFrame("ship01.png"),
        fr1 = cc.spriteFrameCache.getSpriteFrame("ship02.png"),
        animFrames = [fr0, fr1],
        animation = new cc.Animation(animFrames, 0.1),
        animate = cc.animate(animation);
        sp.runAction(animate.repeatForever());

        sh.main.addItemEx('tr-pics', sp, csts.SHIP_ZX);

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

      createBackSkies: function(layer) {
        var layer= sh.main.getBackgd();
        sh.pool.BackSkies.preSet(function() {
          var bg = ccsx.createSpriteFrame('bg01.png');
          bg.setAnchorPoint(0,0);
          bg.setVisible(false);
          layer.addItemEx('tr-pics', bg, -10);
          return sh.Ashley.newObject(bg);
        }, 2);
      },

      createMissiles: function(count) {
        sh.pools.Missiles.preSet(function() {
          var sp= ccsx.createSpriteFrame('W1.png');
          sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          sh.main.addItemEx('op-pics', sp, csts.SHIP_ZX);
          return new cobjs.Missile(sp);
        }, count);
      },

      createBombs: function(count) {
        sh.pools.Bombs.preSet(function() {
          var sp= ccsx.createSpriteFrame('W2.png');
          sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          sh.main.addItemEx('op-pics', sp, csts.SHIP_ZX);
          return new cobjs.Bomb(sp);
        }, count);
      },

      createEnemies: function(count) {
        var sp, cr= function(arg) {
          sp= ccsx.createSpriteFrame(arg.textureName);
          sp.setVisible(false);
          sh.main.addItemEx('tr-pics', sp,
                            csts.SHIP_ZX - 1); // why?
          return new cobjs.Enemy(sp, arg);
        },
        ts = xcfg.EnemyTypes;

        sh.pools.Baddies.preSet(function(pool) {
          for (var j = 0; j < ts.length; ++j) {
            pool.push( cr( ts[j]));
          }
        }, count||3);
      },

      createBackTiles: function(count) {
        var layer= sh.main.getBackgd(),
        rc, sp,
        cr=function (name) {
          sp = ccsx.createSpriteFrame(name);
          sp.setAnchorPoint(0.5,0);
          sp.setVisible(false);
          layer.addItemEx('back-tiles', sp, -9);
          return sh.Ashley.newObject(sp);
        };

        var tm= BackTileMap,
        tn= tm.length,
        sz= count || 1;

        sh.pools.BackTiles.preSet(function(pool) {
          for (var n=0; n < tn; ++n) {
            pool.push(cr(tm[sjs.rand(tn)]));
          }
        }, sz);
      }

    });

    return EntityFactory;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

