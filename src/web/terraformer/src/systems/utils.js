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

      fireMissiles: function(dt) {
        //this === ship sprite
        var po1= sh.pools[csts.P_MS],
        po2= sh.pools[csts.P_LMS],
        sz= this.getContentSize(),
        pos= this.getPosition(),
        m= po1.get(),
        offset=13;
        if (!m) {
          SystemUtils.createMissiles(sh.main.getNode('op-pics'),
                                     sh.main.options, 50);
          m= po1.get();
        }
        m.inflate(pos.x + offset, pos.y + 3 + sz.height * 0.3);
        po2[m.pid() ] = m;
        m= po1.get();
        m.inflate(pos.x - offset, pos.y + 3 + sz.height * 0.3);
        po2[m.pid() ] = m;
      },

      bornShip: function(ship) {
        ship.bornSprite.scale = 8;
        ship.canBeAttack = false;
        ship.bornSprite.runAction(cc.scaleTo(0.5, 1, 1));
        ship.bornSprite.setVisible(true);

        var cb= this.fireMissiles,
        makeBeAttack = cc.callFunc(function () {
          ship.bornSprite.setVisible(false);
          ship.canBeAttack = true;
          ship.sprite.schedule(cb, 1/6);
          ship.sprite.setVisible(true);
        }),
        blinks = cc.blink(3, 9);
        ship.sprite.runAction(cc.sequence(cc.delayTime(0.5), blinks, makeBeAttack));

        ship.HP = 5;
        ship._hurtColorLife = 0;
        ship.status = true;
      },

      createMissiles: function(layer, options, count) {
        for (var n=0; n < count; ++n) {
          var b= new cobjs.Missile(ccsx.createSpriteFrame('W1.png'));
          b.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          layer.addItem(b.sprite, 3000);
          sh.pools[csts.P_MS].add(b);
        }
      },

      createBombs: function(layer, options, count) {
        for (var n=0; n < count; ++n) {
          var b= new cobjs.Bomb(ccsx.createSpriteFrame('W2.png'));
          b.sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          layer.addItem(b.sprite, 3000);
          sh.pools[csts.P_BS].add(b);
        }
      },

    };

    return SystemUtils;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

