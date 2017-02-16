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

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Resolve
 */
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
    this.arena = null;
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.arena = engine.getNodeList(_gnodes2.default.ArenaNode);
  },

  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.arena.head;
    if (this.state.running && !!node) {

      var cmap = node.collision.tiles,
          motion = node.motion,
          layer = _asterix2.default.main,
          shape = node.shell.shape;

      if (!!shape) {
        if (motion.right) {
          _utils2.default.shiftRight(layer, cmap, shape);
        }
        if (motion.left) {
          _utils2.default.shiftLeft(layer, cmap, shape);
        }
        if (motion.rotr) {
          _utils2.default.rotateRight(layer, cmap, shape);
        }
        if (motion.rotl) {
          _utils2.default.rotateLeft(layer, cmap, shape);
        }
        if (motion.down) {
          this.fastDrop(layer, node);
        }
      }
      motion.right = false;
      motion.left = false;
      motion.rotr = false;
      motion.rotl = false;
      motion.down = false;
    }
  },

  /**
   * @method fastDrop
   * @private
   */
  fastDrop: function fastDrop(layer, node) {
    var dp = node.dropper;
    dp.timer = null;
    _utils2.default.setDropper(layer, dp, dp.dropRate, 9000);
  }
}, {
  /**
   * @memberof module:s/resolve~Resolve
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Resolve
});

/** @alias module:s/resolve */
var xbox = /** @lends xbox# */{
  /**
   * @property {Resolve} Resolve
   */
  Resolve: Resolve
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF