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
              * @requires zotohlab/asx/negamax
              * @requires zotohlab/asx/ccsx
              * @requires s/utils
              * @module n/cobjs
              */

var _negamax = require('zotohlab/asx/negamax');

var _negamax2 = _interopRequireDefault(_negamax);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
/** @alias module:n/cobjs */
var xbox = {},
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class SmartAlgo
 */
var SmartAlgo = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~SmartAlgo
   * @method constructor
   * @param {GameBoard} board
   */

  constructor: function constructor(board) {
    this.algo = new _negamax2.default.NegaMax(board);
  }
});
/**
 * @property {SmartAlgo} SmartAlgo
 */
xbox.SmartAlgo = SmartAlgo;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Board
 */
var Board = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~Board
   * @method constructor
   * @param {Number} size
   * @param {Array} goals
   */

  constructor: function constructor(size, goals) {
    this.GOALSPACE = goals;
    this.size = size;
  }
});
/**
 * @property {GameBoard} Board
 */
xbox.Board = Board;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Grid
 */
var Grid = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~Grid
   * @method constructor
   * @param {Number} size
   * @param {Array} seed
   */

  constructor: function constructor(size, seed) {
    this.values = sjs.makeArray(size * size, csts.CV_Z);
    this.size = size;
  }
});
/**
 * @property {Grid} Grid
 */
xbox.Grid = Grid;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class GridView
 */
var GridView = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~GridView
   * @method constructor
   * @param {Number} size
   * @param {cc.Layer} layer
   */

  constructor: function constructor(size, layer) {
    var sp = _ccsx2.default.createSprite('z.png'),
        sz = sp.getContentSize();
    this.cells = sjs.makeArray(size * size, null);
    this.layer = layer;
    this.width = sz.width;
    this.height = sz.height;
    this.url = "";
    this.gridMap = _utils2.default.mapGridPos();
  }
});
/**
 * @property {GridView} GridView
 */
xbox.GridView = GridView;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class NetPlay
 */
var NetPlay = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~NetPlay
   * @method constructor
   */

  constructor: function constructor() {
    this.event = null;
  }
});
/**
 * @property {NetPlay} NetPlay
 */
xbox.NetPlay = NetPlay;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Player
 */
var Player = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~Player
   * @method constructor
   * @param {Number} category
   * @param {Number} value
   * @param {Number} id
   * @param {Number} color
   */

  constructor: function constructor(category, value, id, color) {
    this.color = color;
    this.pnum = id;
    this.category = category;
    this.value = value;
    this.offset = id === 1 ? 0 : 1;
  }
});
/**
 * @property {Player} Player
 */
xbox.Player = Player;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class UISelection
 */
var UISelection = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:n/ccobjs~UISelection
   * @method constructor
   */

  constructor: function constructor() {
    this.cell = -1;
    this.px = -1;
    this.py = -1;
  }
});
/**
 * @property {UISelection} UISelection
 */
xbox.UISelection = UISelection;

sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF