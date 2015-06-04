// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/elements
 */
define("zotohlab/p/elements",

       ['zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/elements */
    let exports= {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ShapeShell
     */
    exports.ShapeShell= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~ShapeShell
       * @method constructor
       */
      constructor() {
        this.shape=null;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Shape
     */
    exports.Shape= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~Shape
       * @method constructor
       * @param {Number} x
       * @param {Number} y
       * @param {Object} options
       */
      constructor(x,y,options) {
        this.model= options.model;
        this.rot= options.rot;
        this.png = options.png;
        this.x = x;
        this.y = y;
        this.bricks=[];
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class CtrlPad
     */
    exports.CtrlPad = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~CtrlPad
       * @method constructor
       */
      constructor() {
        this.hotspots= {};
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class GridBox
     */
    exports.GridBox = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~GridBox
       * @method constructor
       */
      constructor() {
        this.box= {};
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BlockGrid
     */
    exports.BlockGrid= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~BlockGrid
       * @method constructor
       */
      constructor() {
        this.grid=[];
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BoxShape
     */
    exports.BoxShape = {

      /**
       * @memberof module:zotohlab/p/elements~BoxShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~BoxShape
       * @property {Number} dim
       * @static
       */
      dim: 2

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends cc.Sprite
     * @class Block
     */
    const Block = cc.Sprite.extend({
      /**
       * @memberof module:zotohlab/p/elements~Block
       * @method blink
       */
      blink() {
        this.setAnchorPoint(ccsx.acs.TopLeft);
        this.setSpriteFrame(this.frame1);
      },
      /**
       * @memberof module:zotohlab/p/elements~Block
       * @method show
       */
      show() {
        this.setAnchorPoint(ccsx.acs.TopLeft);
        this.setSpriteFrame(this.frame0);
      },
      /**
       * @memberof module:zotohlab/p/elements~Block
       * @method ctor
       * @param {Number} x
       * @param {Number} y
       * @param {Object} options
       */
      ctor(x, y, options) {
        this.options = options;
        this.frame0 = ccsx.getSpriteFrame(options.frames[0]);
        this.frame1 = ccsx.getSpriteFrame(options.frames[1]);
        this._super();
        this.show();
        this.setPosition(x,y);
      }
    });

    /**
     * @class Brick
     */
    class Brick extends sjs.ES6Claxx {
      /**
       * @memberof module:zotohlab/p/elements~Brick
       * @method blink
       */
      blink() {
        if ( !!this.sprite) { this.sprite.blink(); }
      }
      /**
       * @memberof module:zotohlab/p/elements~Brick
       * @method dispose
       */
      dispose() {
        if (!!this.sprite) {
          this.sprite.removeFromParent();
          this.sprite=null;
        }
      }
      /**
       * @memberof module:zotohlab/p/elements~Brick
       * @method create
       */
      create() {
        return this.sprite = new Block(this.startPos.x, this.startPos.y, this.options);
      }
      /**
       * @memberof module:zotohlab/p/elements~Brick
       * @method constructor
       * @param {Number} x
       * @param {Number} y
       * @param {Object} options
       */
      constructor(x, y, options) {
        super();
        this.options = options || {};
        this.startPos = cc.p(x,y);
        this.options.frames= [ '' + options.frame + '.png', '0.png'];
      }
    }
    exports.Brick = Brick;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Dropper
     */
    exports.Dropper= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~Dropper
       * @method constructor
       */
      constructor() {
        this.dropSpeed = csts.DROPSPEED;
        this.dropRate= 80 + 700/1 ;
        this.timer=null;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ElShape
     */
    exports.ElShape = {

      /**
       * @memberof module:zotohlab/p/elements~ElShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~ElShape
       * @property {Number} dim
       * @static
       */
      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ElxShape
     */
    exports.ElxShape = {

      /**
       * @memberof module:zotohlab/p/elements~ElxShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~ElxShape
       * @property {Number} dim
       * @static
       */
      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class FilledLines
     */
    exports.FilledLines= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~FilledLines
       * @method constructor
       */
      constructor() {
        this.lines=[];
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class LineShape
     */
    exports.LineShape = {

      /**
       * @memberof module:zotohlab/p/elements~LineShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~LineShape
       * @property {Number} dim
       * @static
       */
      dim: 4

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Motion
     */
    exports.Motion= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~Motion
       * @method constructor
       */
      constructor() {
        this.right=false;
        this.left=false;
        this.rotr= false;
        this.rotl= false;
        this.down=false;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class NubShape
     */
    exports.NubShape = {

      /**
       * @memberof module:zotohlab/p/elements~NubShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~NubShape
       * @property {Number} dim
       * @static
       */
      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Pauser
     */
    exports.Pauser= sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Pauser
       * @method constructor
       */
      constructor() {
        this.pauseToClear=false;
        this.timer=null;
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class StShape
     */
    exports.StShape = {

      /**
       * @memberof module:zotohlab/p/elements~StShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~StShape
       * @property {Number} dim
       * @static
       */
      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class StxShape
     */
    exports.StxShape = {

      /**
       * @memberof module:zotohlab/p/elements~StxShape
       * @property {Array} layout
       * @static
       */
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

      /**
       * @memberof module:zotohlab/p/elements~StxShape
       * @property {Number} dim
       * @static
       */
      dim: 3

    };

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class TileGrid
     */
    exports.TileGrid= sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~TileGrid
       * @method constructor
       */
      constructor() {
        this.tiles=[];
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @property {Array} Shapes
     * @static
     */
    exports.Shapes = [exports.LineShape,
                      exports.BoxShape,
                      exports.StShape,
                      exports.ElShape,
                      exports.NubShape,
                      exports.StxShape,
                      exports.ElxShape ];

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

