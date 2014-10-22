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
    bko= {};

    //////////////////////////////////////////////////////////////////////////////
    bko.Ball = sh.Ashley.compDef({

      constructor: function(sprite) {
        this.ctor(sprite);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bko.BrickFence = sh.Ashley.casDef({

      constructor: function(bricks) {
        this.bricks=bricks;
      }

    });

    //
    bko.Brick = sh.Ashley.compDef({

      constructor: function(sprite,value,color) {
        this.ctor(sprite, 1, value);
        this.color=color;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bko.Motion = sh.Ashley.casDef({

      constructor: function() {
        this.right = false;
        this.left = false;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bko.Paddle = sh.Ashley.compDef({

      constructor: function(sprite) {
        this.ctor(sprite);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bko.Velocity = sh.Ashley.casDef({

      constructor: function(vx,vy) {
        this.vel = {
          x: vx || 0,
          y: vy || 0
        };
      }

    });

    return bko;

});

//////////////////////////////////////////////////////////////////////////////
//EOF
