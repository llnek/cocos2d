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

      bornShip: function(ship) {
        ship.bornSprite.scale = 8;
        ship.canBeAttack = false;
        ship.bornSprite.runAction(cc.scaleTo(0.5, 1, 1));
        ship.bornSprite.setVisible(true);

        var makeBeAttack = cc.callFunc(function () {
          ship.bornSprite.setVisible(false);
          ship.canBeAttack = true;
          ship.sprite.setVisible(true);
        }),
        blinks = cc.blink(3, 9);
        ship.sprite.runAction(cc.sequence(cc.delayTime(0.5), blinks, makeBeAttack));

        ship.HP = 5;
        ship._hurtColorLife = 0;
        ship.active = true;
      }

    };

    return SystemUtils;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

