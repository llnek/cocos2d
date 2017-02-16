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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires zotohlab/asx/ccsx
              * @module n/cobjs
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @alias module:n/cobjs */
var xbox = {},
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class ShapeShell
 */
xbox.ShapeShell = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~ShapeShell
   * @method constructor
   */

  constructor: function constructor() {
    this.shape = null;
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Shape
 */
xbox.Shape = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~Shape
   * @method constructor
   * @param {Number} x
   * @param {Number} y
   * @param {Object} options
   */

  constructor: function constructor(x, y, options) {
    this.model = options.model;
    this.rot = options.rot;
    this.png = options.png;
    this.x = x;
    this.y = y;
    this.bricks = [];
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class CtrlPad
 */
xbox.CtrlPad = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~CtrlPad
   * @method constructor
   */

  constructor: function constructor() {
    this.hotspots = {};
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class GridBox
 */
xbox.GridBox = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~GridBox
   * @method constructor
   */

  constructor: function constructor() {
    this.box = {};
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BlockGrid
 */
xbox.BlockGrid = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~BlockGrid
   * @method constructor
   */

  constructor: function constructor() {
    this.grid = [];
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
  layout: [[[1, 1], [1, 1]], [[1, 1], [1, 1]], [[1, 1], [1, 1]], [[1, 1], [1, 1]]],

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
var Block = cc.Sprite.extend({
  /**
   * @memberof module:n/cobjs~Block
   * @method blink
   */

  blink: function blink() {
    this.setAnchorPoint(_ccsx2.default.acs.TopLeft);
    this.setSpriteFrame(this.frame1);
  },

  /**
   * @memberof module:n/cobjs~Block
   * @method show
   */
  show: function show() {
    this.setAnchorPoint(_ccsx2.default.acs.TopLeft);
    this.setSpriteFrame(this.frame0);
  },

  /**
   * @memberof module:n/cobjs~Block
   * @method ctor
   * @param {Number} x
   * @param {Number} y
   * @param {Object} options
   */
  ctor: function ctor(x, y, options) {
    this.options = options;
    this.frame0 = _ccsx2.default.getSprite(options.frames[0]);
    this.frame1 = _ccsx2.default.getSprite(options.frames[1]);
    this._super();
    this.show();
    this.setPosition(x, y);
  }
});

/**
 * @class Brick
 */

var Brick = function (_sjs$ES6Claxx) {
  _inherits(Brick, _sjs$ES6Claxx);

  _createClass(Brick, [{
    key: 'blink',

    /**
     * @memberof module:n/cobjs~Brick
     * @method blink
     */
    value: function blink() {
      if (!!this.sprite) {
        this.sprite.blink();
      }
    }
    /**
     * @memberof module:n/cobjs~Brick
     * @method dispose
     */

  }, {
    key: 'dispose',
    value: function dispose() {
      if (!!this.sprite) {
        this.sprite.removeFromParent();
        this.sprite = null;
      }
    }
    /**
     * @memberof module:n/cobjs~Brick
     * @method create
     */

  }, {
    key: 'create',
    value: function create() {
      return this.sprite = new Block(this.startPos.x, this.startPos.y, this.options);
    }
    /**
     * @memberof module:n/cobjs~Brick
     * @method constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Object} options
     */

  }]);

  function Brick(x, y, options) {
    _classCallCheck(this, Brick);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Brick).call(this));

    _this.options = options || {};
    _this.startPos = cc.p(x, y);
    _this.options.frames = ['' + options.frame + '.png', '0.png'];
    return _this;
  }

  return Brick;
}(sjs.ES6Claxx);

xbox.Brick = Brick;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Dropper
 */
xbox.Dropper = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~Dropper
   * @method constructor
   */

  constructor: function constructor() {
    this.dropSpeed = csts.DROPSPEED;
    this.dropRate = 80 + 700 / 1;
    this.timer = null;
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
  layout: [[[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 1, 1], [1, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]], [[0, 0, 1], [1, 1, 1], [0, 0, 0]]],

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
  layout: [[[0, 1, 0], [0, 1, 0], [1, 1, 0]], [[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 0, 1]]],

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
xbox.FilledLines = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~FilledLines
   * @method constructor
   */

  constructor: function constructor() {
    this.lines = [];
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
  layout: [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]],

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
xbox.Motion = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~Motion
   * @method constructor
   */

  constructor: function constructor() {
    this.right = false;
    this.left = false;
    this.rotr = false;
    this.rotl = false;
    this.down = false;
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
  layout: [[[0, 0, 0], [0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 0], [1, 0, 0]], [[1, 1, 1], [0, 1, 0], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 0, 1]]],

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
xbox.Pauser = _asterix2.default.Ashley.casDef({

  /**
   * @memberof module:n/cobjs~Pauser
   * @method constructor
   */

  constructor: function constructor() {
    this.pauseToClear = false;
    this.timer = null;
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
  layout: [[[0, 1, 0], [0, 1, 1], [0, 0, 1]], [[0, 0, 0], [0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]], [[0, 1, 1], [1, 1, 0], [0, 0, 0]]],

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
  layout: [[[0, 1, 0], [1, 1, 0], [1, 0, 0]], [[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 0], [0, 1, 1]]],

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
xbox.TileGrid = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/cobjs~TileGrid
   * @method constructor
   */

  constructor: function constructor() {
    this.tiles = [];
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @property {Array} Shapes
 */
xbox.Shapes = [xbox.LineShape, xbox.BoxShape, xbox.StShape, xbox.ElShape, xbox.NubShape, xbox.StxShape, xbox.ElxShape];

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF