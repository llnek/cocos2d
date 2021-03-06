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
              * @requires n/gnodes
              * @module s/motion
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class Motions */
Motions = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/motion~Motions
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.nodeList = null;
    this.evQ = null;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.nodeList = engine.getNodeList(_gnodes2.default.PaddleNode);
    this.evQ = [];
  },

  /**
   * @memberof module:s/motions~Motions
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var evt = this.evQ.length > 0 ? this.evQ.shift() : undef;
    if (this.state.running) {
      for (var node = this.nodeList.head; node; node = node.next) {
        this.doit(node, evt, dt);
      }
    }
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(node, evt, dt) {
    if (!!node) {
      if (!!evt) {
        this.ongui(node, evt, dt);
      }
      if (_ccsx2.default.hasKeyPad()) {
        this.onkey(node, dt);
      }
    }
  },

  /**
   * @method ongui
   * @private
   */
  ongui: function ongui(node, evt, dt) {},

  /**
   * @method onkey
   * @private
   */
  onkey: function onkey(node, dt) {
    var p = node.paddle,
        m = node.motion,
        cs = p.kcodes;

    if (_asterix2.default.main.keyPoll(cs[0])) {
      m.left = true;
    }

    if (_asterix2.default.main.keyPoll(cs[1])) {
      m.right = true;
    }
  }
}, {

  /**
   * @memberof module:s/motion~Motions
   * @property {Number} Priority
   * @static
   */
  Priority: xcfg.ftypes.Motion
});

/** @alias module:s/motion */
var xbox = /** @lends xbox# */{

  /**
   * @property {Motions} Motions
   */
  Motions: Motions
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF