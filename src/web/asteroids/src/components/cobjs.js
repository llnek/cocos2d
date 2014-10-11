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

define('zotohlab/p/components', ['cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/xcfg',
                                'zotohlab/asx/ccsx',
                                'ash-js'],

  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    ast= {};

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Asteroid = Ash.Class.extend({

      constructor: function(sprite,value,rank) {
        this.sprite=sprite;
        this.value=value;
        this.rank=rank;
        this.status=true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Cannon = Ash.Class.extend({

      constructor: function(coolDownWindow) {
        this.coolDownWindow= coolDownWindow || 0.8;
        this.hasAmmo = true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Looper = Ash.Class.extend({

      constructor: function(count) {
        this.timers=sjs.makeArray(count,null);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Missile = Ash.Class.extend({

      constructor: function(sprite,speed) {
        this.speed=speed || 20;
        this.sprite=sprite;
        this.vel= {
          x: 0,
          y: 0
        };
        this.status=false;
      },

      pid: function() { return this.sprite.getTag(); },
      rtti: function() { return "Missile"; },

      deflate: function() {
        this.sprite.setVisible(false);
        this.sprite.setPosition(0,0);
        this.vel.x=0;
        this.vel.y=0;
        this.status=false;
      },

      inflate: function(x,y) {
        this.sprite.setVisible(true);
        this.sprite.setPosition(x,y);
        this.status=true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Motion = Ash.Class.extend({

      constructor: function() {
        this.right = false;
        this.left = false;
        this.up=false;
        this.down=false;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Ship = Ash.Class.extend({

      constructor: function(sprite,frames) {
        this.sprite=sprite;
        this.frames=frames;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Velocity = Ash.Class.extend({

      constructor: function(vx,vy,mx,my) {
        this.vel = {
          x: vx || 0,
          y: vy || 0
        };
        this.max = {
          x: mx || 0,
          y: my || 0
        };
        this.acc = {
          x: 0,
          y: 0
        };
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Rotation = Ash.Class.extend({

      constructor: function(deg) {
        this.angle = deg;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    ast.Thrust = Ash.Class.extend({

      constructor: function(t) {
        this.power = t;
      }

    });


    return ast;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

