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
              * @requires n/gnodes
              * @requires s/utils
              * @module s/generate
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Generate
 */
Generate = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/generate~Generate
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/generate~Generate
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.arena = null;
  },

  /**
   * @memberof module:s/generate~Generate
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.arena = engine.getNodeList(_gnodes2.default.ArenaNode);
    this.nextShapeInfo = this.randNext();
    this.nextShape = null;
  },

  /**
   * @memberof module:s/generate~Generate
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.arena.head,
        dp = void 0,
        sl = void 0;

    if (this.state.running && !!node) {
      dp = node.dropper;
      sl = node.shell;
      if (sl.shape) {} else {
        sl.shape = this.reifyNextShape(node, _asterix2.default.main);
        if (!!sl.shape) {
          //show new next shape in preview window
          this.previewNextShape(node, _asterix2.default.main);
          //activate drop timer
          dp.dropSpeed = csts.DROPSPEED;
          _utils2.default.initDropper(_asterix2.default.main, dp);
        } else {
          return false;
        }
      }
    }
  },

  /**
   * @method reifyNextShape
   * @private
   */
  reifyNextShape: function reifyNextShape(node, layer) {
    var gbox = node.gbox,
        wz = _ccsx2.default.vrect(),
        shape = new _cobjs2.default.Shape(gbox.box.left + 5 * csts.TILE, gbox.box.top - csts.TILE, this.nextShapeInfo);
    shape = _utils2.default.reifyShape(layer, node.collision.tiles, shape);
    if (!!shape) {} else {
      sjs.loggr.debug("game over.  you lose.");
      node.blocks.grid = [];
      _asterix2.default.fire('/hud/end');
    }

    return shape;
  },

  /**
   * @method previewNextShape
   * @private
   */
  previewNextShape: function previewNextShape(node, layer) {
    var info = this.randNext(),
        gbox = node.gbox,
        cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        shape = void 0,
        sz = (1 + info.model.dim) * csts.TILE,
        x = cw.x + (wb.right - cw.x) * 0.5,
        y = wb.top * 0.7;

    x -= sz * 0.5;
    y += sz * 0.5;

    _utils2.default.disposeShape(this.nextShape);
    this.nextShape = null;
    shape = new _cobjs2.default.Shape(x, y, info);
    this.nextShapeInfo = info;
    this.nextShape = _utils2.default.previewShape(layer, shape);
  },

  /**
   * @method randNext
   * @private
   */
  randNext: function randNext() {
    var n = sjs.rand(_cobjs2.default.Shapes.length),
        proto = _cobjs2.default.Shapes[n];

    return {
      png: sjs.rand(csts.BLOCK_COLORS) + 1,
      rot: sjs.rand(proto.layout.length),
      model: proto
    };
  }
}, {
  /**
   * @memberof module:s/generate~Generate
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Generate
});

/** @alias module:s/generate */
var xbox = /** @lends xbox# */{
  /**
   * @property {Generate} Generate
   */
  Generate: Generate
};
sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF