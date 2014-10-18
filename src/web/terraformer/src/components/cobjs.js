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

define("zotohlab/p/components", ['cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef,
    cobjs={};

    //////////////////////////////////////////////////////////////////////////
    cobjs.Missile = sh.Ashley.compDef({

      constructor: function (sprite, attackMode) {
        this.attackMode = attackMode || csts.ENEMY_ATTACK.NORMAL;
        this.rego('Missile');
        this.ctor(sprite);
        this.vel= {
          x: 0,
          y: csts.MISSILE_SPEED
        };
      }

    });

    //////////////////////////////////////////////////////////////////////////
    cobjs.Bomb = sh.Ashley.compDef({

      constructor: function (sprite, attackMode) {
        this.attackMode = attackMode || csts.ENEMY_ATTACK.NORMAL;
        this.rego('Bomb');
        this.ctor(sprite);
        this.vel= {
          x: 0,
          y: -csts.BOMB_SPEED
        };
      }

    });


    //////////////////////////////////////////////////////////////////////////
    cobjs.Enemy = sh.Ashley.compDef({

      constructor: function(sprite, arg) {

        this.ctor(sprite, arg.HP, arg.scoreValue);
        this.delayTime= 1 + 1.2 * Math.random();
        this.rego('Enemy');
        this.speed= arg.speed || 200;
        this.moveType = arg.moveType;
        this.attackMode = arg.attackMode;
        this.enemyType = arg.type;

      }

    });

    //////////////////////////////////////////////////////////////////////////
    //
    cobjs.Ship = sh.Ashley.compDef({

      constructor: function(sprite, spriteX) {
        this.bornSprite = spriteX;
        this.canBeAttack = false;
        this.ctor(sprite, 5);
        this.rego('Player');
      }

    });

    //////////////////////////////////////////////////////////////////////////
    //
    cobjs.Motion = sh.Ashley.casDef({

      constructor: function() {
        this.right=false;
        this.left= false;
        this.down= false;
        this.up= false;
      }

    });


    return cobjs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

