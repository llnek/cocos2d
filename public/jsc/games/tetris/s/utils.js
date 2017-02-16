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
              * @requires n/cobjs
              * @module s/utils
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** @alias module:s/utils */
xbox = /** @lends xbox# */{
  /**
   * @method reifyShape
   * @param {cc.Layer} layer
   * @param {Object} cmap
   * @param {Object} shape
   * @return {Object}
   */

  reifyShape: function reifyShape(layer, cmap, shape) {
    var bbox = this.findBBox(cmap, shape.model, shape.x, shape.y, shape.rot),
        bricks = void 0;
    if (bbox.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, shape.x, shape.y, bbox);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
    } else {
      shape = null;
    }
    return shape;
  },

  /**
   * @method topLine
   * @param {Node} node
   * @return {Number}
   */
  topLine: function topLine(node) {
    var gbox = node.gbox,
        bx = gbox.box;
    return Math.floor((bx.top - bx.bottom) / csts.TILE);
  },

  /**
   * @method previewShape
   * @param {cc.Layer} layer
   * @param {Object} shape
   * @return {Object}
   */
  previewShape: function previewShape(layer, shape) {
    var bbox = this.findBBox([], shape.model, shape.x, shape.y, shape.rot, true),
        bricks = void 0;
    if (bbox.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, shape.x, shape.y, bbox);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
    }
    return shape;
  },

  /**
   * @method disposeShape
   * @param {Object} shape
   */
  disposeShape: function disposeShape(shape) {
    if (!!shape) {
      this.clearOldBricks(shape.bricks);
      shape.bricks.length = 0;
    }
    return null;
  },

  /**
   * @method clearOldBricks
   * @param {Array} bs
   */
  clearOldBricks: function clearOldBricks(bs) {
    R.forEach(function (z) {
      z.dispose();
    }, bs);
  },

  /**
   * @method reifyBricks
   * @param {cc.Layer} layer
   * @param {String} png
   * @param {Number} x
   * @param {Number} y
   * @param {Array} bs
   * @return {Array}
   */
  reifyBricks: function reifyBricks(layer, png, x, y, bs) {
    var pt = void 0,
        obj = void 0,
        bricks = [];

    for (var i = 0; i < bs.length; ++i) {
      pt = bs[i];
      obj = new _cobjs2.default.Brick(pt.x, pt.y, { frame: png });
      layer.addAtlasItem('game-pics', obj.create());
      bricks.push(obj);
    }

    return bricks;
  },

  /**
   * @method findBBox
   * @param {Object} cmap
   * @param {Object} model
   * @param {Number} left
   * @param {Number} top
   * @param {String} rID
   * @param {Boolean} skipCollide
   * @return {Array}
   */
  findBBox: function findBBox(cmap, model, left, top, rID, skipCollide) {
    skipCollide = skipCollide || false;
    var form = model.layout[rID],
        x = void 0,
        y = void 0,
        pt = void 0,
        bs = [];

    for (var r = 0; r < model.dim; ++r) {
      y = top - csts.TILE * r;
      for (var c = 0; c < model.dim; ++c) {
        x = left + csts.TILE * c;
        if (form[r][c] === 1) {
          if (!skipCollide && this.maybeCollide(cmap, x, y, x + csts.TILE, y - csts.TILE)) {
            return [];
          }
          bs.push(cc.p(x, y));
        }
      }
    }
    return bs;
  },

  /**
   * @method maybeCollide
   * @private
   */
  maybeCollide: function maybeCollide(cmap, tl_x, tl_y, br_x, br_y) {
    var tile = this.xrefTile(tl_x, tl_y),
        r = void 0,
        c = void 0;

    sjs.loggr.debug("tile = " + tile.row + ", " + tile.col);

    if (tile.row < 0 || tile.col < 0 || cmap[tile.row][tile.col] !== 0) {
      sjs.loggr.debug("collide! tile = " + tile.row + ", " + tile.col);
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method xrefTile
   * @private
   */
  xrefTile: function xrefTile(x, y) {
    var co = csts.TILE * 0.5;

    // find center, instead of top left
    y -= co;
    x += co;

    // realign actual x,y
    x -= csts.CBOX.left - csts.FENCE;

    return { row: Math.floor(y / csts.TILE),
      col: Math.floor(x / csts.TILE) };
  },

  /**
   * @method initDropper
   * @private
   */
  initDropper: function initDropper(par, dp) {
    dp.timer = _ccsx2.default.createTimer(par, dp.dropRate / dp.dropSpeed);
  },

  /**
   * @method setDropper
   * @private
   */
  setDropper: function setDropper(par, dp, r, s) {
    dp.timer = _ccsx2.default.createTimer(par, r / s);
    dp.dropSpeed = s;
    dp.dropRate = r;
  },

  /**
   * @method lockBricks
   * @private
   */
  lockBricks: function lockBricks(cmap, emap, z) {
    var zs = z.sprite.getPosition(),
        t = this.xrefTile(zs.x, zs.y);

    cmap[t.row][t.col] = 1;
    emap[t.row][t.col] = z;
  },

  /**
   * @method lock
   * @private
   */
  lock: function lock(node, shape) {
    var _this = this;

    var cmap = node.collision.tiles,
        emap = node.blocks.grid;

    R.forEach(function (z) {
      _this.lockBricks(cmap, emap, z);
    }, shape.bricks);

    this.postLock(node, cmap, emap);
  },

  /**
   * @method postLock
   * @private
   */
  postLock: function postLock(node, cmap, emap) {

    // search bottom up until top.
    var top = cmap.length,
        rc = [];

    // 0 is the bottom wall
    for (var r = 1; r < top; ++r) {
      if (this.testFilledRow(cmap, r)) {
        rc.push(r);
      }
    }

    if (rc.length > 0) {
      this.pauseForClearance(node, true, 0.5);
      this.flashFilled(emap, node.flines, rc);
    }
  },

  /**
   * @method testFilledRow
   * @private
   */
  testFilledRow: function testFilledRow(cmap, r) {
    var row = cmap[r];

    // negative if any holes in the row
    for (var c = 0; c < row.length; ++c) {
      if (row[c] !== 1) {
        return false;
      }
    }

    // entire row must be filled.
    return true;
  },

  /**
   * @method flashFilled
   * @private
   */
  flashFilled: function flashFilled(emap, flines, lines) {
    R.forEach(function (z) {
      var row = emap[z];
      for (var c = 0; c < row.length; ++c) {
        if (row[c]) {
          row[c].blink();
        }
      }
    }, lines);

    flines.lines = lines;
  },

  /**
   * @method pauseForClearance
   * @private
   */
  pauseForClearance: function pauseForClearance(node, b, delay) {
    var pu = node.pauser;

    node.flines.lines = [];
    pu.pauseToClear = b;

    if (b) {
      pu.timer = _ccsx2.default.createTimer(_asterix2.default.main, delay);
    } else {
      pu.timer = null;
    }
  },

  /**
   * @method moveDown
   * @private
   */
  moveDown: function moveDown(layer, cmap, shape) {
    var new_y = shape.y - csts.TILE,
        x = shape.x,
        bricks = void 0,
        bs = this.findBBox(cmap, shape.model, x, new_y, shape.rot);

    if (bs.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, x, new_y, bs);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
      shape.y = new_y;
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method shiftRight
   * @private
   */
  shiftRight: function shiftRight(layer, cmap, shape) {
    var new_x = shape.x + csts.TILE,
        y = shape.y,
        bricks = void 0,
        bs = this.findBBox(cmap, shape.model, new_x, y, shape.rot);

    if (bs.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, new_x, y, bs);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
      shape.x = new_x;
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method shiftLeft
   * @private
   */
  shiftLeft: function shiftLeft(layer, cmap, shape) {
    var new_x = shape.x - csts.TILE,
        y = shape.y,
        bricks = void 0,
        bs = this.findBBox(cmap, shape.model, new_x, y, shape.rot);

    if (bs.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, new_x, y, bs);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
      shape.x = new_x;
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method rotateRight
   * @private
   */
  rotateRight: function rotateRight(layer, cmap, shape) {
    var nF = sjs.xmod(shape.rot + 1, shape.model.layout.length),
        bricks = void 0,
        bs = this.findBBox(cmap, shape.model, shape.x, shape.y, nF);

    sjs.loggr.debug("shape.rot = " + shape.rot + ", dim = " + shape.model.dim + ", rot-right , nF = " + nF);
    if (bs.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, shape.x, shape.y, bs);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
      shape.rot = nF;
      return true;
    } else {
      return false;
    }
  },

  /**
   * @method rotateLeft
   * @private
   */
  rotateLeft: function rotateLeft(layer, cmap, shape) {
    var nF = sjs.xmod(shape.rot - 1, shape.model.layout.length),
        bricks = void 0,
        bs = this.findBBox(cmap, shape.model, shape.x, shape.y, nF);

    sjs.loggr.debug("shape.rot = " + shape.rot + ", dim = " + shape.model.dim + ", rot-right , nF = " + nF);
    if (bs.length > 0) {
      bricks = this.reifyBricks(layer, shape.png, shape.x, shape.y, bs);
      this.clearOldBricks(shape.bricks);
      shape.bricks = bricks;
      shape.rot = nF;
      return true;
    } else {
      return false;
    }
  }
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF