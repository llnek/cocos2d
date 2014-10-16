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
                                'zotohlab/asx/xcfg',
                                'zotohlab/asx/ccsx',
                                'ash-js'],

  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts= xcfg.csts,
    undef,
    cobjs={};

    cobjs.Velocity = Ash.Class.extend({
      constructor: function(vx, vy, mx, my) {
        this.vel = {
          x: vx,
          y: vy
        };
        this.max = {
          x: mx || 0,
          y: my || 0
        };
      }
    });

    cobjs.Missile = Ash.Class.extend({

      constructor: function (sprite, attackMode) {
        this.attackMode = attackMode || csts.ATTACK_MODE.NORMAL;
        this.sprite = sprite;
        this.status= false;
        this.power= 1;
        this.vel= {
          x: 0,
          y: csts.MISSILE_SPEED
        };
        this.HP = 1;
      },

      pid: function() { return this.sprite.getTag(); },
      rtti: function() { return "Missile"; },

      deflate: function() {
        this.sprite.setVisible(false);
        this.sprite.setPosition(0,0);
        this.status=false;
      },

      inflate: function(x,y) {
        this.sprite.setVisible(true);
        this.sprite.setPosition(x,y);
        this.status=true;
      }

    });

    cobjs.Bomb = Ash.Class.extend({

      constructor: function (sprite, attackMode) {
        this.attackMode = attackMode || csts.ATTACK_MODE.NORMAL;
        this.sprite = sprite;
        this.status= false;
        this.power= 1;
        this.vel= {
          x: 0,
          y: -csts.BOMB_SPEED
        };
        this.HP = 1;
      },

      pid: function() { return this.sprite.getTag(); },
      rtti: function() { return "Bomb"; },

      deflate: function() {
        this.sprite.setVisible(false);
        this.sprite.setPosition(0,0);
        this.status=false;
      },

      inflate: function(x,y) {
        this.sprite.setVisible(true);
        this.sprite.setPosition(x,y);
        this.status=true;
      }

    });

    //////////////////////////////////////////////////////////////////////////
    //
    cobjs.Ship = Ash.Class.extend({

      constructor: function(sprite, spriteX) {
        this.bornSprite = spriteX;
        this.sprite= sprite;
        this.canBeAttack = false;
        this.HP = 5;
        this._hurtColorLife = 0;
        this.status = false;
      }

    });



    return cobjs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

