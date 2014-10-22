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
                                'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    ast= {};

    //////////////////////////////////////////////////////////////////////////////
    ast.Asteroid = sh.Ashley.compDef({

      constructor: function(sprite,value,rank, deg, vx, vy) {
        this.ctor(sprite, 1, value);
        this.rank=rank;
        this.deg= deg;
        this.vel = {
          x: vx,
          y: vy
        }
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Cannon = sh.Ashley.casDef({

      constructor: function(coolDownWindow) {
        this.coolDownWindow= coolDownWindow || 0.8;
        this.hasAmmo = true;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Looper = sh.Ashley.casDef({

      constructor: function(count) {
        this.timers=sjs.makeArray(count,null);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Missile = sh.Ashley.compDef({

      constructor: function(sprite,speed) {
        this.speed=speed || 20;
        this.ctor(sprite);
        this.vel= {
          x: 0,
          y: 0
        };
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Motion = sh.Ashley.casDef({

      constructor: function() {
        this.right = false;
        this.left = false;
        this.up=false;
        this.down=false;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Ship = sh.Ashley.compDef({

      constructor: function(sprite,frames) {
        this.ctor(sprite);
        this.frames=frames;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Velocity = sh.Ashley.casDef({

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
    ast.Rotation = sh.Ashley.casDef({

      constructor: function(deg) {
        this.angle = deg;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    ast.Thrust = sh.Ashley.casDef({

      constructor: function(t) {
        this.power = t;
      }

    });

    return ast;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

