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
                             'zotohlab/asx/xcfg',
                             'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, xcfg, ccsx) { "use strict";

    var csts = xcfg.csts,
    undef,
    SystemUtils = {

      maybeGetMissile: function(mss, start) {
        for (var n=start; n < mss.length; ++n){
          if (!mss[n].status) {
            return [ mss[n], n+1 ];
          }
        }
      },

      fireMissiles: function(ship, dt) {
        //this === ship sprite
        var po1= sh.pools[csts.P_MS],
        plen= po1.length,
        ssp= ship.sprite,
        sz= ssp.getContentSize(),
        pos= ssp.getPosition(),
        m1, m2,
        offset=13;

        m1= this.maybeGetMissile(po1, 0);
        if (!!m1) {
          m2= this.maybeGetMissile(po1, m1[1]);
        }
        if (!!m1 && !!m2) {} else {
          this.createMissiles(sh.main.getNode('op-pics'),
                              sh.main.options, 50);
          if (!m1) {
            m1= this.maybeGetMissile(po1, 0);
          }
          if (!m2) {
            m2= this.maybeGetMissile(po1, m1[1]);
          }
        }

        m1[0].inflate(pos.x + offset, pos.y + 3 + sz.height * 0.3);
        m2[0].inflate(pos.x - offset, pos.y + 3 + sz.height * 0.3);
      },

      bornShip: function(ship) {
        ship.bornSprite.scale = 8;
        ship.canBeAttack = false;
        ship.bornSprite.setVisible(true);
        ship.bornSprite.runAction(cc.scaleTo(0.5, 1, 1));

        var me=this, makeBeAttack = cc.callFunc(function () {
          ship.bornSprite.setVisible(false);
          ship.canBeAttack = true;
          ship.sprite.schedule(function(dt) {
            me.fireMissiles(ship,dt);
          }, 1/6);
          ship.sprite.setVisible(true);
        });

        ship.sprite.runAction(cc.sequence(cc.delayTime(0.5),
                                          cc.blink(3,9),
                                          makeBeAttack));

        ship.HP = 5;
        ship._hurtColorLife = 0;
        ship.status = true;
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
        var wz= ccsx.screen(),
        pos = ship.sprite.getPosition(),
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

