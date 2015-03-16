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

define("zotohlab/p/components", ['cherimoia/skarojs',
                                'zotohlab/asterix',
                                'zotohlab/asx/ccsx'],

  function (sjs, sh, ccsx) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    png= {};

    //////////////////////////////////////////////////////////////////////////////
    png.Ball = sh.Ashley.compDef({

      constructor: function(sprite, speed) {
        this.ctor(sprite);
        this.speed= speed;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    png.Motion = sh.Ashley.casDef({

      constructor: function() {
        this.right = false;
        this.left= false;
      }

    });


    //////////////////////////////////////////////////////////////////////////////
    png.Paddle = sh.Ashley.compDef({

      p1Keys: function() {
        return  ccsx.isPortrait() ? [cc.KEY.left, cc.KEY.right] : [cc.KEY.down, cc.KEY.up];
      },

      p2Keys: function() {
        return ccsx.isPortrait() ? [cc.KEY.a, cc.KEY.d] : [cc.KEY.s, cc.KEY.w];
      },

      onColor: function(keycodes, snd) {
        this.kcodes = keycodes;
        this.snd= snd;
      },

      constructor: function(sprite, color, speed) {

        this.ctor(sprite);
        this.color= color;
        this.speed= speed;

        if (this.color === csts.P1_COLOR) {
          this.onColor(this.p1Keys(), 'x_hit' );
        } else {
          this.onColor(this.p2Keys(), 'o_hit');
        }
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    png.Player = sh.Ashley.casDef({

      constructor: function(category,value,id,color,labels) {
        this.color= color;
        this.pnum=id;
        this.category= category;
        this.value= value;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    png.Faux= sh.Ashley.casDef({

      constructor: function() {
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    png.Position = sh.Ashley.casDef({

      constructor: function(lp) {
        this.lastDir= 0;
        this.lastP= lp;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    png.Velocity = sh.Ashley.casDef({

      constructor: function(vx,vy) {
        this.vel = {
          x: vx,
          y: vy
        };
      }

    });

    return png;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

