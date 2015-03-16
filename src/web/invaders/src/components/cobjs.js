// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define("zotohlab/p/components",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    ivs={};

    //////////////////////////////////////////////////////////////////////////////
    ivs.AlienSquad = sh.Ashley.casDef({

      constructor: function(aliens,step) {
        this.aliens=aliens;
        this.stepx=step;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Alien = sh.Ashley.compDef({

      constructor: function(sprite,value,rank) {
        this.ctor(sprite, 1, value);
        this.rank=rank;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Bomb = sh.Ashley.compDef({

      constructor: function(sprite) {
        var wz= ccsx.vrect();
        this.ctor(sprite);
        this.vel={
          x: 0,
          y: -50 * wz.height / 480
        };
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Cannon = sh.Ashley.casDef({

      constructor: function(coolDownWindow) {
        this.coolDownWindow= coolDownWindow || 0.8;
        this.hasAmmo = true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Explosion = sh.Ashley.compDef({

      constructor: function(sprite) {
        this.ctor(sprite);
        this.frameTime= 0.1;
      },

      inflate: function(options) {
        var frames = [ccsx.getSpriteFrame('boom_0.png'),
                      ccsx.getSpriteFrame('boom_1.png'),
                      ccsx.getSpriteFrame('boom_2.png'),
                      ccsx.getSpriteFrame('boom_3.png') ],
        anim= new cc.Animation(frames, this.frameTime);
        this.sprite.setPosition(options.x, options.y);
        this.status=true;
        this.sprite.runAction(new cc.Sequence(new cc.Animate(anim),
          new cc.CallFunc(function() {
            sjs.loggr.debug('explosion done.!');
            this.deflate();
          }, this)
        ));
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Looper = sh.Ashley.casDef({

      constructor: function(count) {
        this.timers=sjs.makeArray(count,null);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Missile = sh.Ashley.compDef({

      constructor: function(sprite) {
        var wz= ccsx.vrect();
        this.ctor(sprite);
        this.vel= {
          x: 0,
          y: 150 * wz.height / 480
        };
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Motion = sh.Ashley.casDef({

      constructor: function() {
        this.right = false;
        this.left = false;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Ship = sh.Ashley.compDef({

      constructor: function(sprite,frames) {
        this.ctor(sprite);
        this.frames=frames;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ivs.Velocity = sh.Ashley.casDef({

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

