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
              * @requires s/utils
              * @requires n/gnodes
              * @module s/resolve
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class Resolve */
Resolve = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/resolve~Resolve
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.board = null;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.board = engine.getNodeList(_gnodes2.default.BoardNode);
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.board.head;
    if (this.state.running && !!node) {
      this.syncup(node, dt);
      this.doit(node, dt);
    }
  },

  /**
   * @method syncup
   * @private
   */
  syncup: function syncup(node) {
    var _this = this;

    var values = node.grid.values,
        view = node.view,
        cs = view.cells,
        z = void 0,
        c = void 0,
        offset = void 0;

    R.forEachIndexed(function (v, pos) {

      if (v !== csts.CV_Z) {
        c = _this.xrefCell(pos, view.gridMap);
        if (!!c) {
          z = cs[pos];
          if (!!z) {
            z[0].removeFromParent();
          }
          cs[pos] = [_utils2.default.drawSymbol(view, c[0], c[1], v), c[0], c[1], v];
        }
      }
    }, values);
  },

  /**
   * Given a cell, find the screen co-ordinates for that cell.
   * @method xrefCell
   * @private
   */
  xrefCell: function xrefCell(pos, map) {
    var gg = void 0,
        x = void 0,
        y = void 0,
        delta = 0;

    if (pos >= 0 && pos < csts.CELLS) {
      gg = map[pos];
      x = gg.left + (gg.right - gg.left - delta) * 0.5;
      y = gg.top - (gg.top - gg.bottom - delta) * 0.5;
      // the cell's center
      return [x, y];
    } else {
      return null;
    }
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(node, dt) {
    var _this2 = this;

    var values = node.grid.values,
        msg = void 0,
        rc = void 0,
        res = void 0;

    if (R.find(function (p) {
      if (!!p) {
        rc = _this2.checkWin(p, values);
        if (rc) {
          return res = [p, rc];
        }
      }
    }, this.state.players)) {
      this.doWin(node, res[0], res[1]);
    } else if (this.checkDraw(values)) {
      this.doDraw(node);
    } else if (this.state.msgQ.length > 0) {
      msg = this.state.msgQ.shift();
      if ("forfeit" === msg) {
        this.doForfeit(node);
      }
    }
  },

  /**
   * @method doWin
   * @private
   */
  doWin: function doWin(node, winner, combo) {
    _asterix2.default.fire('/hud/score/update', { color: winner.color,
      score: 1 });
    this.doDone(node, winner, combo);
  },

  /**
   * @method doDraw
   * @private
   */
  doDraw: function doDraw(node) {
    this.doDone(node, null, []);
  },

  /**
   * @method doForfeit
   * @private
   */
  doForfeit: function doForfeit(node) {
    var other = this.state.actor === 1 ? 2 : this.state.actor === 2 ? 1 : 0,
        tv = this.state.players[this.state.actor],
        win = this.state.players[other],
        cs = node.view.cells,
        v2 = -1,
        layer = node.view.layer;

    if (!!tv) {
      v2 = tv.value;
    }

    _asterix2.default.fire('/hud/score/update', { color: win.color,
      score: 1 });

    //gray out the losing icons
    R.forEachIndexed(function (z, n) {
      if (!!z && z[4] === v2) {
        z[0].removeFromParent();
        z[0] = _utils2.default.drawSymbol(node.view, z[1], z[2], z[3] + 2);
      }
    }, cs);

    this.doDone(node, win, null);
  },

  /**
   * Flip all other icons except for the winning ones.
   * @method showWinningIcons
   * @private
   */
  showWinningIcons: function showWinningIcons(view, combo) {
    var layer = view.layer,
        cs = view.cells;

    if (combo === null) {
      return;
    }

    R.forEachIndexed(function (z, n) {
      if (!R.contains(n, combo)) {
        if (!!z && z[3] !== csts.CV_Z) {
          z[0].removeFromParent();
          z[0] = _utils2.default.drawSymbol(view, z[1], z[2], z[3], true);
        }
      }
    }, cs);
  },

  /**
   * @method doDone
   * @private
   */
  doDone: function doDone(node, pobj, combo) {

    var pnum = !!pobj ? pobj.pnum : 0;

    this.showWinningIcons(node.view, combo);
    _asterix2.default.fire('/hud/timer/hide');
    _asterix2.default.sfxPlay('game_end');
    _asterix2.default.fire('/hud/end', { winner: pnum });

    this.state.lastWinner = pnum;
    this.state.running = false;
  },

  /**
   * @method checkDraw
   * @private
   */
  checkDraw: function checkDraw(values) {
    return !(csts.CV_Z === R.find(function (v) {
      return v === csts.CV_Z;
    }, values));
  },

  /**
   * @method checkWin
   * @private
   */
  checkWin: function checkWin(actor, game) {
    //sjs.loggr.debug('checking win for ' + actor.color);
    var combo = void 0,
        rc = R.any(function (r) {
      combo = r;
      return R.all(function (n) {
        return actor.value === n;
      }, R.map(function (i) {
        return game[i];
      }, r));
    }, this.state.GOALSPACE);

    return rc ? combo : null;
  }
}, {
  /**
   * @memberof module:s/resolve~Resolve
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Resolve
});

/** @alias module:s/resolve */
var xbox = {
  /**
   * @property {Resolve} Resolve
   */
  Resolve: Resolve
};
sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF