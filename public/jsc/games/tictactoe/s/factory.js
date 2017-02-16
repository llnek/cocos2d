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
              * @requires n/board
              * @requires n/gnodes
              * @module s/factory
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _board = require('n/board');

var _board2 = _interopRequireDefault(_board);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,


//////////////////////////////////////////////////////////////////////////////
// returns array of winning combinations.
mapGoalSpace = function mapGoalSpace(size) {
  var rows = [],
      cols = [],
      dx = [],
      dy = [];
  var h = void 0,
      v = void 0;

  for (var r = 0; r < size; ++r) {
    h = [];
    v = [];
    for (var c = 0; c < size; ++c) {
      h.push(r * size + c);
      v.push(c * size + r);
    }
    rows.push(h);
    cols.push(v);
    dx.push(r * size + r);
    dy.push((size - r - 1) * size + r);
  }
  return [dx, dy].concat(rows, cols);
},

//////////////////////////////////////////////////////////////////////////////
/** * @class EntityFactory */
EntityFactory = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Ash.Engine} engine
   */

  constructor: function constructor(engine) {
    this.engine = engine;
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method reifyBoard
   * @param {cc.Layer} layer
   * @param {Object} options
   * @return {Ash.Entity}
   */
  reifyBoard: function reifyBoard(layer, options) {
    var goals = mapGoalSpace(options.size),
        bd = new _board2.default.GameBoard(options.size, csts.CV_Z, csts.CV_X, csts.CV_O, goals),
        ent = _asterix2.default.Ashley.newEntity();

    ent.add(new _cobjs2.default.Grid(options.size, options.seed));
    ent.add(new _cobjs2.default.Board(options.size, goals));
    ent.add(new _cobjs2.default.UISelection());
    ent.add(new _cobjs2.default.SmartAlgo(bd));
    ent.add(new _cobjs2.default.NetPlay());
    ent.add(new _cobjs2.default.GridView(options.size, layer));

    options.GOALSPACE = goals;
    return ent;
  }
});

/** @alias module:s/factory */
var xbox = /** @lends xbox# */{
  EntityFactory: EntityFactory
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF