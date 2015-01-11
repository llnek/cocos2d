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

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    bks= {};

    //////////////////////////////////////////////////////////////////////////////
    bks.ShapeShell= sh.Ashley.casDef({

      constructor: function() {
        this.shape=null;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bks.Shape= sh.Ashley.casDef({

      constructor: function(x,y,options) {
        this.model= options.model;
        this.rot= options.rot;
        this.png = options.png;
        this.x = x;
        this.y = y;
        this.bricks=[];
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bks.CtrlPad = sh.Ashley.casDef({

      constructor: function() {
        this.hotspots= {};
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bks.GridBox = sh.Ashley.casDef({

      constructor: function() {
        this.box= {};
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bks.BlockGrid= sh.Ashley.casDef({

      constructor: function() {
        this.grid=[];
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.BoxShape = {

      layout: [
        [ [1,1],
          [1,1] ],
        [ [1,1],
          [1,1] ],
        [ [1,1],
          [1,1] ],
        [ [1,1],
          [1,1] ]
      ],

      dim: 2

    };

    //////////////////////////////////////////////////////////////////////////////
    //
    var Block = cc.Sprite.extend({
      blink: function() {
        this.setAnchorPoint(ccsx.AnchorTopLeft);
        this.setSpriteFrame(this.frame1);
      },
      show: function() {
        this.setAnchorPoint(ccsx.AnchorTopLeft);
        this.setSpriteFrame(this.frame0);
      },
      ctor: function(x, y, options) {
        this.options = options;
        this.frame0 = ccsx.getSpriteFrame(options.frames[0]);
        this.frame1 = ccsx.getSpriteFrame(options.frames[1]);
        this._super();
        this.show();
        this.setPosition(x,y);
      }
    });

    bks.Brick= sjs.Class.xtends({

      blink: function() {
        if ( !!this.sprite) { this.sprite.blink(); }
      },

      dispose: function() {
        if (!!this.sprite) {
          this.sprite.getParent().removeChild(this.sprite, true);
          this.sprite=null;
        }
      },

      create: function() {
        return this.sprite = new Block(this.startPos.x, this.startPos.y, this.options);
      },

      ctor: function(x, y, options) {
        this.options = options || {};
        this.startPos = cc.p(x,y);
        this.options.frames= [ '' + options.frame + '.png', '0.png'];
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bks.Dropper= sh.Ashley.casDef({

      constructor: function() {
        this.dropSpeed = csts.DROPSPEED;
        this.dropRate= 80 + 700/1 ;
        this.timer=null;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.ElShape = {

      layout: [
        [ [0,1,0],
          [0,1,0],
          [0,1,1] ],
        [ [0,0,0],
          [1,1,1],
          [1,0,0] ],
        [ [1,1,0],
          [0,1,0],
          [0,1,0] ],
        [ [0,0,1],
          [1,1,1],
          [0,0,0] ]
      ],

      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.ElxShape = {

      layout: [
        [ [0,1,0],
          [0,1,0],
          [1,1,0] ],
        [ [1,0,0],
          [1,1,1],
          [0,0,0] ],
        [ [0,1,1],
          [0,1,0],
          [0,1,0] ],
        [ [0,0,0],
          [1,1,1],
          [0,0,1] ]
      ],

      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.FilledLines= sh.Ashley.casDef({

      constructor: function() {
        this.lines=[];
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.LineShape = {

      layout: [
        [ [0,0,0,0],
          [1,1,1,1],
          [0,0,0,0],
          [0,0,0,0] ],
        [ [0,0,1,0],
          [0,0,1,0],
          [0,0,1,0],
          [0,0,1,0] ],
        [ [0,0,0,0],
          [0,0,0,0],
          [1,1,1,1],
          [0,0,0,0] ],
        [ [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0] ]
      ],

      dim: 4

    };

    //////////////////////////////////////////////////////////////////////////////
    bks.Motion= sh.Ashley.casDef({

      constructor: function() {
        this.right=false;
        this.left=false;
        this.rotr= false;
        this.rotl= false;
        this.down=false;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.NubShape = {

      layout: [
        [ [0,0,0],
          [0,1,0],
          [1,1,1] ],
        [ [1,0,0],
          [1,1,0],
          [1,0,0] ],
        [ [1,1,1],
          [0,1,0],
          [0,0,0] ],
        [ [0,0,1],
          [0,1,1],
          [0,0,1] ]
      ],

      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    bks.Pauser= sh.Ashley.casDef({

      constructor: function() {
        this.pauseToClear=false;
        this.timer=null;
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.StShape = {

      layout: [
        [ [0,1,0],
          [0,1,1],
          [0,0,1] ],
        [ [0,0,0],
          [0,1,1],
          [1,1,0] ],
        [ [1,0,0],
          [1,1,0],
          [0,1,0] ],
        [ [0,1,1],
          [1,1,0],
          [0,0,0] ]
      ],

      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    //
    bks.StxShape = {

      layout: [
        [ [0,1,0],
          [1,1,0],
          [1,0,0] ],
        [ [1,1,0],
          [0,1,1],
          [0,0,0] ],
        [ [0,0,1],
          [0,1,1],
          [0,1,0] ],
        [ [0,0,0],
          [1,1,0],
          [0,1,1] ]
      ],

      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    bks.TileGrid= sh.Ashley.casDef({

      constructor: function() {
        this.tiles=[];
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    bks.Shapes = [bks.LineShape,
                     bks.BoxShape,
                     bks.StShape,
                     bks.ElShape,
                     bks.NubShape,
                     bks.StxShape,
                     bks.ElxShape ];


    return bks;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

