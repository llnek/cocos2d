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

  function (sjs, sh, xcfg,  ccsx, Ash) { "use strict";

    var csts= xcfg.csts,
    undef,
    png= {};

    //////////////////////////////////////////////////////////////////////////////
    //
    png.Ball = Ash.Class.extend({

      constructor: function(sprite, speed) {
        this.sprite = sprite;
        this.speed= speed;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    png.Motion = Ash.Class.extend({

      constructor: function() {
        this.right = false;
        this.left= false;
      }

    });


    //////////////////////////////////////////////////////////////////////////////
    //
    png.Paddle = Ash.Class.extend({

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

        this.sprite = sprite;
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
    //
    png.Player = Ash.Class.extend({

      constructor: function(category,value,id,color,labels) {
        this.color= color;
        this.pnum=id;
        this.category= category;
        this.value= value;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    png.Faux= Ash.Class.extend({

      constructor: function() {
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    png.Position = Ash.Class.extend({

      constructor: function(lp) {
        this.lastDir= 0;
        this.lastP= lp;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    png.Velocity = Ash.Class.extend({

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
