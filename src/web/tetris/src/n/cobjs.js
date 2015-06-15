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
 * @module n/cobjs
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';


/** @alias module:n/cobjs */
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
   * @memberof module:n/cobjs~ShapeShell
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
   * @memberof module:n/cobjs~Shape
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
   * @memberof module:n/cobjs~CtrlPad
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
   * @memberof module:n/cobjs~GridBox
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
   * @memberof module:n/cobjs~BlockGrid
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
   * @memberof module:n/cobjs~BoxShape
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
   * @memberof module:n/cobjs~BoxShape
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
   * @memberof module:n/cobjs~Block
   * @method blink
   */
  blink() {
    this.setAnchorPoint(ccsx.acs.TopLeft);
    this.setSpriteFrame(this.frame1);
  },
  /**
   * @memberof module:n/cobjs~Block
   * @method show
   */
  show() {
    this.setAnchorPoint(ccsx.acs.TopLeft);
    this.setSpriteFrame(this.frame0);
  },
  /**
   * @memberof module:n/cobjs~Block
   * @method ctor
   * @param {Number} x
   * @param {Number} y
   * @param {Object} options
   */
  ctor(x, y, options) {
    this.options = options;
    this.frame0 = ccsx.getSprite(options.frames[0]);
    this.frame1 = ccsx.getSprite(options.frames[1]);
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
   * @memberof module:n/cobjs~Brick
   * @method blink
   */
  blink() {
    if ( !!this.sprite) { this.sprite.blink(); }
  }
  /**
   * @memberof module:n/cobjs~Brick
   * @method dispose
   */
  dispose() {
    if (!!this.sprite) {
      this.sprite.removeFromParent();
      this.sprite=null;
    }
  }
  /**
   * @memberof module:n/cobjs~Brick
   * @method create
   */
  create() {
    return this.sprite = new Block(this.startPos.x, this.startPos.y, this.options);
  }
  /**
   * @memberof module:n/cobjs~Brick
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
   * @memberof module:n/cobjs~Dropper
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
   * @memberof module:n/cobjs~ElShape
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
   * @memberof module:n/cobjs~ElShape
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
   * @memberof module:n/cobjs~ElxShape
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
   * @memberof module:n/cobjs~ElxShape
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
   * @memberof module:n/cobjs~FilledLines
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
   * @memberof module:n/cobjs~LineShape
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
   * @memberof module:n/cobjs~LineShape
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
   * @memberof module:n/cobjs~Motion
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
   * @memberof module:n/cobjs~NubShape
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
   * @memberof module:n/cobjs~NubShape
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
   * @memberof module:n/cobjs~Pauser
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
   * @memberof module:n/cobjs~StShape
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
   * @memberof module:n/cobjs~StShape
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
   * @memberof module:n/cobjs~StxShape
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
   * @memberof module:n/cobjs~StxShape
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
   * @memberof module:n/cobjs~TileGrid
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

