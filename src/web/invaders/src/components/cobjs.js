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
    ivs={};

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.AlienSqad = Ash.Class.extend({

      constructor: function(aliens,step) {
        this.aliens=aliens;
        this.stepx=step;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Alien = Ash.Class.extend({

      constructor: function(sprite,value,rank) {
        this.sprite=sprite;
        this.value=value;
        this.rank=rank;
        this.status=true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Bomb = Ash.Class.extend({

      constructor: function(sprite,value) {
        this.sprite=sprite;
        this.value=value;
        this.vel={
          x: 0,
          y: -50
        };
        this.status=false;
      },

      pid: function() { return this.sprite.getTag(); },
      rtti: function() { return "Bomb"; },

      hibernate: function() {
        this.sprite.setVisible(false);
        this.sprite.setPosition(0,0);
        this.status=false;
      },

      revive: function(x,y) {
        this.sprite.setVisible(true);
        this.sprite.setPosition(x,y);
        this.status=true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Cannon = Ash.Class.extend({

      constructor: function(coolDownWindow) {
        this.coolDownWindow= coolDownWindow || 0.8;
        this.hasAmmo = true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Explosion = Ash.Class.extend({

      constructor: function(sprite) {
        this.sprite = sprite;
        this.frameTime= 0.1;
        this.status=false;
      },

      revive: function(x,y) {
        var frames = [ccsx.getSpriteFrame('boom_0.png'),
                      ccsx.getSpriteFrame('boom_1.png'),
                      ccsx.getSpriteFrame('boom_2.png'),
                      ccsx.getSpriteFrame('boom_3.png') ],
        anim= new cc.Animation(frames, this.frameTime);
        this.sprite.runAction(new cc.Sequence(new cc.Animate(anim),
          new cc.CallFunc(function() {
            sjs.loggr.debug('explosion done.!');
            sh.pools[ csts.P_ES].add(this);
          }, this)
        ));
      },

      hibernate: function() {
        this.sprite.setPosition(0,0);
        this.sprite.setVisible(false);
        this.status=false;
      },

      pid: function() { return this.sprite.getTag(); },
      rtti: function() { return "Explosion"; }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Looper = Ash.Class.extend({

      constructor: function(count) {
        this.timers=sjs.makeArray(count,null);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Missile = Ash.Class.extend({

      constructor: function(sprite,value) {
        this.value=value || 0;
        this.sprite=sprite;
        this.vel= {
          x: 0,
          y: 150
        };
        this.status=false;
      },

      pid: function() { return this.sprite.getTag(); },
      rtti: function() { return "Missile"; },

      hibernate: function() {
        this.sprite.setVisible(false);
        this.sprite.setPosition(0,0);
        this.status=false;
      },

      revive: function(x,y) {
        this.sprite.setVisible(true);
        this.sprite.setPosition(x,y);
        this.status=true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Motion = Ash.Class.extend({

      constructor: function() {
        this.right = false;
        this.left = false;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Ship = Ash.Class.extend({

      constructor: function(sprite,frames) {
        this.sprite=sprite;
        this.frames=frames;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ivs.Velocity = Ash.Class.extend({

      constructor: function(vx,vy) {
        this.vel = {
          x: vx || 0,
          y: vy || 0
        };
      }

    });

    return ivs;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

