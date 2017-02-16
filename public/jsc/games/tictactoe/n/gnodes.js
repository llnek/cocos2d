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
              * @requires n/cobjs
              * @module n/gnodes
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
/** @alias module:n/gnodes */
var xbox = {},
    sjs = _asterix2.default.skarojs,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BoardNode
 */
BoardNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~BoardNode
   * @property {UISelection} selection
   */
  selection: _cobjs2.default.UISelection,
  /**
   * @memberof module:n/gnodes~BoardNode
   * @property {Board} board
   */
  board: _cobjs2.default.Board,
  /**
   * @memberof module:n/gnodes~BoardNode
   * @property {SmartAlgo} robot
   */
  robot: _cobjs2.default.SmartAlgo,
  /**
   * @memberof module:n/gnodes~BoardNode
   * @property {Grid} grid
   */
  grid: _cobjs2.default.Grid,
  /**
   * @memberof module:n/gnodes~BoardNode
   * @property {GridView} view
   */
  view: _cobjs2.default.GridView
});
/**
 * @property {BoardNode} BoardNode
 */
xbox.BoardNode = BoardNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class GUINode
 */
var GUINode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~GUINode
   * @property {UISelection} selection
   */
  selection: _cobjs2.default.UISelection,
  /**
   * @memberof module:n/gnodes~GUINode
   * @property {GridView} view
   */
  view: _cobjs2.default.GridView
});
/**
 * @property {GUINode} GUINode
 */
xbox.GUINode = GUINode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class NetPlayNode
 */
var NetPlayNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~NetPlayNode
   * @property {NetPlay} playcmd
   */
  playcmd: _cobjs2.default.NetPlay,
  /**
   * @memberof module:n/gnodes~Grid
   * @property {Grid} grid
   */
  grid: _cobjs2.default.Grid
});
/**
 * @property {NetPlayNode} NetPlayNode
 */
xbox.NetPlayNode = NetPlayNode;

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF