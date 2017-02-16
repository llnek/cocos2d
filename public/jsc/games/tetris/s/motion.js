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
              * @module s/motion
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
   * @memberof module:s/motion
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.throttleWait = csts.THROTTLEWAIT;
    this.state = options;
  },

  /**
   * @memberof module:s/motion
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.stream = null;
    this.arena = null;
    this.evQ = null;
  },

  /**
   * @memberof module:s/motion
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.arena = engine.getNodeList(_gnodes2.default.ArenaNode);
    this.ops = {};
    this.evQ = [];
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly() {
    var _this = this;

    this.stream = _Rx2.default.Observable.merge(_Rx2.default.Observable.create(function (obj) {
      _asterix2.default.main.signal('/touch/one/end', function (msg) {
        obj.onNext(msg);
      });
    }), _Rx2.default.Observable.create(function (obj) {
      _asterix2.default.main.signal('/mouse/up', function (msg) {
        obj.onNext(msg);
      });
    }));
    this.stream.subscribe(function (msg) {
      if (!!_this.evQ) {
        _this.evQ.push(msg);
      }
    });
    if (_ccsx2.default.hasKeyPad()) {
      this.initKeyOps();
    }
  },

  /**
   * @memberof module:s/motion
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var evt = this.evQ.length > 0 ? this.evQ.shift() : undef,
        node = this.arena.head;
    if (this.state.running && !!node) {

      if (!this.inited) {
        this.onceOnly();
        this.inited = true;
      } else {
        this.doit(node, evt, dt);
      }
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
    this.onkey(node, dt);
  },

  /**
   * @method obgui
   * @private
   */
  ongui: function ongui(node, evt, dt) {
    var hsps = node.cpad.hotspots,
        px = evt.loc.x,
        py = evt.loc.y;

    if (_ccsx2.default.pointInBox(hsps.rr, px, py)) {
      this.ops.rotRight(node, dt);
    }

    if (_ccsx2.default.pointInBox(hsps.rl, px, py)) {
      this.ops.rotLeft(node, dt);
    }

    if (_ccsx2.default.pointInBox(hsps.sr, px, py)) {
      this.ops.sftRight(node, dt);
    }

    if (_ccsx2.default.pointInBox(hsps.sl, px, py)) {
      this.ops.sftLeft(node, dt);
    }

    if (_ccsx2.default.pointInBox(hsps.cd, px, py)) {
      this.ops.sftDown(node, dt);
    }
  },

  /**
   * @onkey
   * @private
   */
  onkey: function onkey(node, dt) {

    if (this.keyPoll(cc.KEY.right)) {
      this.ops.sftRight(node, dt);
    }
    if (this.keyPoll(cc.KEY.left)) {
      this.ops.sftLeft(node, dt);
    }
    if (this.keyPoll(cc.KEY.down)) {
      this.ops.rotRight(node, dt);
    }
    if (this.keyPoll(cc.KEY.up)) {
      this.ops.rotLeft(node, dt);
    }
    if (this.keyPoll(cc.KEY.space)) {
      this.ops.sftDown(node, dt);
    }
  },

  /**
   * @method keyPoll
   * @private
   */
  keyPoll: function keyPoll(kp) {
    return _asterix2.default.main.keyPoll(kp);
  },

  /**
   * @method shiftRight
   * @private
   */
  shiftRight: function shiftRight(node, dt) {
    node.motion.right = true;
  },

  /**
   * @method shiftLeft
   * @private
   */
  shiftLeft: function shiftLeft(node, dt) {
    node.motion.left = true;
  },

  /**
   * @method shiftDown
   * @private
   */
  shiftDown: function shiftDown(node, dt) {
    node.motion.down = true;
  },

  /**
   * @method rotateRight
   * @private
   */
  rotateRight: function rotateRight(node, dt) {
    node.motion.rotr = true;
  },

  /**
   * @method rotateLeft
   * @private
   */
  rotateLeft: function rotateLeft(node, dt) {
    node.motion.rotl = true;
  },

  /**
   * @method bindKey
   * @private
   */
  bindKey: function bindKey(func, fid) {
    this.ops[fid] = _asterix2.default.throttle(func, this.throttleWait, { trailing: false });
  },

  /**
   * @method initKeyOps
   * @private
   */
  initKeyOps: function initKeyOps() {
    var _this2 = this;

    sjs.eachObj(function (v, k) {
      _this2.bindKey(v, k);
    }, { 'sftRight': this.shiftRight.bind(this),
      'sftLeft': this.shiftLeft.bind(this),
      'rotRight': this.rotateRight.bind(this),
      'rotLeft': this.rotateLeft.bind(this),
      'sftDown': this.shiftDown.bind(this) });
  }
}, {
  /**
   * @memberof module:s/motion~Motions
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Motion
});

/** @alias module:s/motion */
var xbox = /** @lends xbox# */{
  /**
   * @property {Motions}  Motions
   */
  Motions: Motions
};
sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF