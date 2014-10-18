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

define("zotohlab/p/s/utils", ['zotohlab/p/components',
                             'cherimoia/skarojs',
                             'zotohlab/asterix',
                             'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    undef,
    SystemUtils = {

      fireMissiles: function(ship, dt) {
        var po1= sh.pools.Missiles,
        ssp= ship.sprite,
        sz= ssp.getContentSize(),
        pos= ssp.getPosition(),
        m2= po1.get(),
        m1= po1.get(),
        offset=13;

        if (!!m1 && !!m2) {} else {
          this.createMissiles(sh.main.getNode('op-pics'));
        }
        if (!m2) { m2 = po1.get(); }
        if (!m1) { m1 = po1.get(); }

        m1.inflate({ x: pos.x + offset, y: pos.y + 3 + sz.height * 0.3});
        m2.inflate({ x: pos.x - offset, y: pos.y + 3 + sz.height * 0.3});
      },

      bornShip: function(ship) {
        var me=this, makeBeAttack = cc.callFunc(function () {
          ship.bornSprite.setVisible(false);
          ship.canBeAttack = true;
          ship.sprite.schedule(function(dt) {
            me.fireMissiles(ship, dt);
          }, 1/6);
          ship.inflate();
        });

        ship.bornSprite.scale = 8;
        ship.canBeAttack = false;
        ship.bornSprite.setVisible(true);
        ship.bornSprite.runAction(cc.scaleTo(0.5, 1, 1));

        ship.sprite.runAction(cc.sequence(cc.delayTime(0.5),
                                          cc.blink(3,9),
                                          makeBeAttack));
      },

      createMissiles: function(layer) {
        sh.pools.Missiles.preSet(function() {
          var b= new cobjs.Missile(ccsx.createSpriteFrame('W1.png'));
          b.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          layer.addItem(b.sprite, csts.SHIP_ZX);
          return b;
        });
      },

      createBombs: function(layer) {
        sh.pools.Bombs.preSet(function() {
          var b= new cobjs.Bomb(ccsx.createSpriteFrame('W2.png'));
          b.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          layer.addItem(b.sprite, csts.SHIP_ZX);
          return b;
        });
      },

      createEnemies: function(layer, options, count) {
        var ts = xcfg.EnemyTypes,
        fac=options.factory;
        sh.pools.Baddies.preSet(function(pool) {
          for (var j = 0; j < ts.length; ++j) {
            pool.push(fac.createEnemy(layer, ts[j]));
          }
        }, 3);
      },

      processTouch: function(ship, delta) {
        var pos = ship.sprite.getPosition(),
        wz= ccsx.screen(),
        cur= cc.pAdd(pos, delta);
        cur= cc.pClamp(cur, cc.p(0, 0), cc.p(wz.width, wz.height));
        ship.sprite.setPosition(cur.x, cur.y);
        cur=null;
      }

    };

    return SystemUtils;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

