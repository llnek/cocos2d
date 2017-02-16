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
              * @module s/move
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
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Move
 */
Move = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/move~Move
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/move~Move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.arena = null;
  },

  /**
   * @memberof module:s/move~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.arena = engine.getNodeList(_gnodes2.default.ArenaNode);
  },

  /**
   * @memberof module:s/move~Move
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.arena.head;
    if (this.state.running && !!node) {

      if (_ccsx2.default.timerDone(node.dropper.timer) && !!node.shell.shape) {
        node.dropper.timer = _ccsx2.default.undoTimer(node.dropper.timer);
        this.doFall(_asterix2.default.main, node);
      }
    }
  },

  /**
   * @method doFall
   * @private
   */
  doFall: function doFall(layer, node) {
    var cmap = node.collision.tiles,
        shape = node.shell.shape,
        emap = node.blocks.grid,
        pu = node.pauser,
        dp = node.dropper;

    if (!!shape) {
      if (!_utils2.default.moveDown(layer, cmap, shape)) {

        // lock shape in place
        _utils2.default.lock(node, shape);

        // what is this???
        if (!pu.timer) {
          node.shell.shape = null;
          shape.bricks = [];
        }

        node.shell.shape = null;
        shape.bricks = [];
      } else {
        _utils2.default.initDropper(layer, dp);
      }
    }
  }
}, {
  /**
   * @memberof module:s/move~Move
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Move
});

/** @alias module:s/move */
var xbox = /** @lends xbox# */{
  /**
   * @property {Move} Move
   */
  Move: Move
};
sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF