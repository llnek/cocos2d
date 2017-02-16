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

var _Rx = require('Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class Motions
 */
Motions = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/motions~Motions
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/motions~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.ships = null;
    this.evQ = null;
  },

  /**
   * @memberof module:s/motions~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
    this.evQ = [];
  },

  /**
   * @memberof module:s/motions~Motions
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var evt = this.evQ.length > 0 ? this.evQ.shift() : undef,
        node = this.ships.head;

    if (this.state.running && !!node) {
      this.doit(node, evt, dt);
    }
  },

  /**
   * @method doit
   * @private
   */
  doit: function doit(node, evt, dt) {
    if (!!evt) {
      this.ongui(node, evt, dt);
    }
    if (_ccsx2.default.hasKeyPad()) {
      this.onkey(node, dt);
    }
  },

  /**
   * @method ongui
   * @private
   */
  ongui: function ongui(node, evt, dt) {
    var pos = node.ship.pos(),
        wz = _ccsx2.default.vrect(),
        cur = cc.pAdd(pos, evt.delta);
    cur = cc.pClamp(cur, cc.p(0, 0), cc.p(wz.width, wz.height));
    node.ship.setPos(cur.x, cur.y);
    cur = null;
  },

  /**
   * @method onkey
   * @private
   */
  onkey: function onkey(node, dt) {
    if (_asterix2.default.main.keyPoll(cc.KEY.right)) {
      node.motion.right = true;
    }
    if (_asterix2.default.main.keyPoll(cc.KEY.left)) {
      node.motion.left = true;
    }

    if (_asterix2.default.main.keyPoll(cc.KEY.down)) {
      node.motion.down = true;
    }
    if (_asterix2.default.main.keyPoll(cc.KEY.up)) {
      node.motion.up = true;
    }
  }
}, {
  /**
     * @memberof module:s/motions~Motions
     * @property {Number} Priority
     */
  Priority: xcfg.ftypes.Motion
});

/** @alias module:s/motions */
var xbox = /** @lends xbox# */{
  /**
   * @property {Motions} Motions
   */
  Motions: Motions
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF