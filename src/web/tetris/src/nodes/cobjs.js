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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/ccsx
 * @module nodes/cobjs
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';


/** @alias module:nodes/cobjs */
let xbox= {},
sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class ShapeShell
 */
xbox.ShapeShell= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~ShapeShell
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
xbox.Shape= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~Shape
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
xbox.CtrlPad = sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~CtrlPad
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
xbox.GridBox = sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~GridBox
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
xbox.BlockGrid= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~BlockGrid
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
xbox.BoxShape = {

  /**
   * @memberof module:nodes/cobjs~BoxShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~BoxShape
   * @property {Number} dim
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
   * @memberof module:nodes/cobjs~Block
   * @method blink
   */
  blink() {
    this.setAnchorPoint(ccsx.acs.TopLeft);
    this.setSpriteFrame(this.frame1);
  },
  /**
   * @memberof module:nodes/cobjs~Block
   * @method show
   */
  show() {
    this.setAnchorPoint(ccsx.acs.TopLeft);
    this.setSpriteFrame(this.frame0);
  },
  /**
   * @memberof module:nodes/cobjs~Block
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
   * @memberof module:nodes/cobjs~Brick
   * @method blink
   */
  blink() {
    if ( !!this.sprite) { this.sprite.blink(); }
  }
  /**
   * @memberof module:nodes/cobjs~Brick
   * @method dispose
   */
  dispose() {
    if (!!this.sprite) {
      this.sprite.removeFromParent();
      this.sprite=null;
    }
  }
  /**
   * @memberof module:nodes/cobjs~Brick
   * @method create
   */
  create() {
    return this.sprite = new Block(this.startPos.x, this.startPos.y, this.options);
  }
  /**
   * @memberof module:nodes/cobjs~Brick
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
xbox.Brick = Brick;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Dropper
 */
xbox.Dropper= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~Dropper
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
xbox.ElShape = {

  /**
   * @memberof module:nodes/cobjs~ElShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~ElShape
   * @property {Number} dim
   */
  dim: 3

};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class ElxShape
 */
xbox.ElxShape = {

  /**
   * @memberof module:nodes/cobjs~ElxShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~ElxShape
   * @property {Number} dim
   */
  dim: 3

};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class FilledLines
 */
xbox.FilledLines= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~FilledLines
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
xbox.LineShape = {

  /**
   * @memberof module:nodes/cobjs~LineShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~LineShape
   * @property {Number} dim
   */
  dim: 4

};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Motion
 */
xbox.Motion= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~Motion
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
xbox.NubShape = {

  /**
   * @memberof module:nodes/cobjs~NubShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~NubShape
   * @property {Number} dim
   */
  dim: 3

};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Pauser
 */
xbox.Pauser= sh.Ashley.casDef({

  /**
   * @memberof module:nodes/cobjs~Pauser
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
xbox.StShape = {

  /**
   * @memberof module:nodes/cobjs~StShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~StShape
   * @property {Number} dim
   */
  dim: 3

};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class StxShape
 */
xbox.StxShape = {

  /**
   * @memberof module:nodes/cobjs~StxShape
   * @property {Array} layout
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
   * @memberof module:nodes/cobjs~StxShape
   * @property {Number} dim
   */
  dim: 3

};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class TileGrid
 */
xbox.TileGrid= sh.Ashley.casDef({
  /**
   * @memberof module:nodes/cobjs~TileGrid
   * @method constructor
   */
  constructor() {
    this.tiles=[];
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @property {Array} Shapes
 */
xbox.Shapes = [xbox.LineShape,
               xbox.BoxShape,
               xbox.StShape,
               xbox.ElShape,
               xbox.NubShape,
               xbox.StxShape,
               xbox.ElxShape ];


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

