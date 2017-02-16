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
              * @module s/clear
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

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Clear
 */
Clear = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/clear~Clear
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/clear~Clear
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.arena = null;
  },

  /**
   * @memberof module:s/clear~Clear
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.arena = engine.getNodeList(_gnodes2.default.ArenaNode);
  },

  /**
   * @memberof module:s/clear~Clear
   * @method update
   * @return {Number}
   */
  update: function update(dt) {
    var node = this.arena.head,
        ps = void 0;

    if (this.state.running && !!node) {
      ps = node.pauser;
      if (ps.pauseToClear) {
        if (_ccsx2.default.timerDone(ps.timer)) {
          this.clearFilled(node);
          ps.timer = _ccsx2.default.undoTimer(ps.timer);
          ps.pauseToClear = false;
        }
        //stop downstream processing
        return false;
      }
    }
  },

  /**
   * @method clearFilled
   * @private
   */
  clearFilled: function clearFilled(node) {
    var _this = this;

    var score = node.flines.lines.length;

    R.forEach(function (z) {
      _this.clearOneRow(node, z);
      _this.resetOneRow(node, z);
    }, node.flines.lines);

    this.shiftDownLines(node);
    _asterix2.default.fire('/hud/score/update', { score: score * 50 });
  },

  /**
   * Dispose and get rid of blocks which are marked to be cleared
   * @method clearOneRow
   * @private
   */
  clearOneRow: function clearOneRow(node, r) {
    var row = node.blocks.grid[r];

    for (var c = 0; c < row.length; ++c) {
      if (!!row[c]) {
        row[c].dispose();
        row[c] = undef;
      }
    }
  },

  /**
   * Clear collision mark
   * @method resetOneRow
   * @private
   */
  resetOneRow: function resetOneRow(node, r) {
    var row = node.collision.tiles[r];

    for (var c = 0; c < row.length; ++c) {
      row[c] = r === 0 ? 1 : 0;
    }
    row[0] = 1;
    row[row.length - 1] = 1;
  },

  /**
   * @method shiftDownLines
   * @private
   */
  shiftDownLines: function shiftDownLines(node) {
    var top = _utils2.default.topLine(node),
        f0 = void 0,
        f = void 0,
        e0 = void 0,
        e = void 0,
        d = void 0,
        s = void 0,
        t = void 0,
        r = void 0;

    // top down search

    f0 = this.findFirstDirty(node);
    // no lines are touched
    if (f0 === 0) {
      return;
    }
    e0 = this.findFirstEmpty(node, f0);
    if (e0 === 0) {
      return;
    }
    e = this.findLastEmpty(node, e0);
    f = e0 + 1; // last dirty
    if (f > f0) {
      sjs.tne("error while shifting lines down");
      return;
    } // error!
    r = e0 - e + 1; // number of empty lines

    s = f; // last dirty
    t = e;
    while (s <= f0) {
      this.copyLine(node, s, t);
      ++t;
      ++s;
    }
  },

  /**
   * @method findFirstDirty
   * @private
   */
  findFirstDirty: function findFirstDirty(node) {
    var t = _utils2.default.topLine(node); // - 1,

    for (var r = t; r > 0; --r) {
      if (!this.isEmptyRow(node, r)) {
        return r;
      }
    }

    return 0;
  },

  /**
   * @method findFirstEmpty
   * @private
   */
  findFirstEmpty: function findFirstEmpty(node, t) {
    for (var r = t; r > 0; --r) {
      if (this.isEmptyRow(node, r)) {
        return r;
      }
    }
    return 0;
  },

  /**
   * @method findLastEmpty
   * @private
   */
  findLastEmpty: function findLastEmpty(node, t) {
    for (var r = t; r >= 0; --r) {
      if (!this.isEmptyRow(node, r)) {
        return r + 1;
      }
    }
    //should never get here
    sjs.tne("findLastEmpty has error.");
    return 1;
  },

  /**
   * @method isEmptyRow
   * @private
   */
  isEmptyRow: function isEmptyRow(node, r) {
    var row = node.collision.tiles[r],
        len = row.length - 1;

    if (r === 0) {
      return false;
    }

    for (var c = 1; c < len; ++c) {
      if (row[c] !== 0) {
        return false;
      }
    }
    return true;
  },

  /**
   * @method copyLine
   * @private
   */
  copyLine: function copyLine(node, from, to) {
    var line_f = node.collision.tiles[from],
        line_t = node.collision.tiles[to],
        dlen = csts.TILE * (from - to),
        c = void 0,
        pos = void 0;

    for (c = 0; c < line_f.length; ++c) {
      line_t[c] = line_f[c];
      line_f[c] = 0;
    }
    line_f[0] = 1;
    line_f[line_f.length - 1] = 1;

    // deal with actual shape
    line_f = node.blocks.grid[from];
    line_t = node.blocks.grid[to];

    for (c = 0; c < line_f.length; ++c) {
      if (line_f[c]) {
        pos = line_f[c].sprite.getPosition();
        line_f[c].sprite.setPosition(pos.x, pos.y - dlen);
      }
      line_t[c] = line_f[c];
      line_f[c] = undef;
    }
  }
}, {
  /**
   * @memberof module:s/clear~Clear
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Clear
});

/** @alias module:s/clear */
var xbox = /** @lends xbox# */{
  /**
   * @property {Clear} Clear
   */
  Clear: Clear
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF