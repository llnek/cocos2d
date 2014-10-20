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
    csts= xcfg.csts,
    undef,
    SystemUtils = {

      fireMissiles: function(ship, dt) {
        var po1= sh.pools.Missiles,
        pos = ship.pos(),
        sz = ship.size(),
        offy= 3 + sz.height * 0.3,
        offx=13,
        m2= po1.getAndSet(),
        m1= po1.getAndSet();

        if (!m1 || !m2) { sh.factory.createMissiles(); }

        if (!m1) { m1= po1.getAndSet(); }
        if (!m2) { m2= po1.getAndSet(); }

        m2.inflate({ x: pos.x - offx, y: pos.y + offy });
        m1.inflate({ x: pos.x + offx, y: pos.y + offy });
      },

      bornShip: function(ship) {
        var bsp= ship.bornSprite,
        ssp=ship.sprite,
        me=this,
        makeBeAttack = cc.callFunc(function () {
          ship.canBeAttack = true;
          bsp.setVisible(false);
          ssp.schedule(function(dt) {
            me.fireMissiles(ship, dt);
          }, 1/6);
          ship.inflate();
        });

        ship.canBeAttack = false;
        bsp.scale = 8;

        bsp.setVisible(true);
        bsp.runAction(cc.scaleTo(0.5, 1, 1));

        ssp.runAction(cc.sequence(cc.delayTime(0.5),
                                  cc.blink(3,9), makeBeAttack));
      },

      processTouch: function(ship, delta) {
        var pos = ship.pos(),
        wz= ccsx.screen(),
        cur= cc.pAdd(pos, delta);
        cur= cc.pClamp(cur, cc.p(0, 0),
                       cc.p(wz.width, wz.height));
        ship.setPos(cur.x, cur.y);
        cur=null;
      }

    };

    return SystemUtils;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

