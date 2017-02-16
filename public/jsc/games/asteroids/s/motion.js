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

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class Motions */
Motions = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/motion~Motions
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.throttleWait = 80;
    this.state = options;
  },


  /**
   * @memberof module:s/motion~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.cannons = null;
    this.ships = null;
  },


  /**
   * @memberof module:s/motion~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.cannons = engine.getNodeList(_gnodes2.default.CannonCtrlNode);
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);

    this.ops = {};
    this.initKeyOps();
  },


  /**
   * @memberof module:s/motion~Motions
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var ships = this.ships.head,
        cns = this.cannons.head;

    if (this.state.running) {
      if (!!ships) {
        this.scanInput(ships, dt);
      }
      if (!!cns) {
        this.controlCannon(cns, dt);
      }
    }
  },

  /**
   * @method controlCannon
   * @private
   */
  controlCannon: function controlCannon(node, dt) {
    var gun = node.cannon,
        ship = node.ship,
        lpr = node.looper,
        t = lpr.timers[0];

    if (!gun.hasAmmo) {
      if (_ccsx2.default.timerDone(t)) {
        gun.hasAmmo = true;
        lpr.timers[0] = null;
      }
      return;
    } else if (_asterix2.default.main.keyPoll(cc.KEY.space)) {
      this.fireMissile(node, dt);
    }
  },

  /**
   * @method fireMissile
   * @private
   */
  fireMissile: function fireMissile(node, dt) {
    var p = _asterix2.default.pools.Missiles,
        lpr = node.looper,
        ship = node.ship,
        gun = node.cannon,
        sz = ship.sprite.getContentSize(),
        pos = ship.sprite.getPosition(),
        top = _ccsx2.default.getTop(ship.sprite),
        deg = ship.sprite.getRotation(),
        tag = void 0,
        ent = p.get();

    if (!ent) {
      _asterix2.default.factory.createMissiles(30);
      ent = p.get();
    }

    var rc = _asterix2.default.calcXY(deg, sz.height * 0.5);
    ent.vel.x = rc[0];
    ent.vel.y = rc[1];
    ent.inflate({ x: pos.x + rc[0], y: pos.y + rc[1] });
    ent.sprite.setRotation(deg);

    lpr.timers[0] = _ccsx2.default.createTimer(_asterix2.default.main, gun.coolDownWindow);
    gun.hasAmmo = false;
    //sh.sfxPlay('ship-missile');
  },

  /**
   * @method scanInput
   * @private
   */
  scanInput: function scanInput(node, dt) {
    if (_asterix2.default.main.keyPoll(cc.KEY.right)) {
      this.ops.rotRight(node, dt);
    }
    if (_asterix2.default.main.keyPoll(cc.KEY.left)) {
      this.ops.rotLeft(node, dt);
    }
    if (_asterix2.default.main.keyPoll(cc.KEY.down)) {
      this.ops.sftDown(node, dt);
    }
    if (_asterix2.default.main.keyPoll(cc.KEY.up)) {
      this.ops.sftUp(node, dt);
    }
  },


  /**
   * @method shiftDown
   * @private
   */
  shiftDown: function shiftDown(node, dt) {
    node.motion.down = true;
  },


  /**
   * @method shiftUp
   * @private
   */
  shiftUp: function shiftUp(node, dt) {
    node.motion.up = true;
  },


  /**
   * @method rotateRight
   * @private
   */
  rotateRight: function rotateRight(node, dt) {
    node.motion.right = true;
  },


  /**
   * @method rotateLeft
   * @private
   */
  rotateLeft: function rotateLeft(node, dt) {
    node.motion.left = true;
  },


  /**
   * @method initKeyOps
   * @private
   */
  initKeyOps: function initKeyOps() {
    this.ops.rotRight = _asterix2.default.throttle(this.rotateRight.bind(this), this.throttleWait, { trailing: false });
    this.ops.rotLeft = _asterix2.default.throttle(this.rotateLeft.bind(this), this.throttleWait, { trailing: false });
    this.ops.sftDown = _asterix2.default.throttle(this.shiftDown.bind(this), this.throttleWait, { trailing: false });
    this.ops.sftUp = _asterix2.default.throttle(this.shiftUp.bind(this), this.throttleWait, { trailing: false });
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
   * @property {Motions} Motions
   */
  Motions: Motions
};

sjs.merge(exports, xbox);

return xbox;

///////////////////////////////////////////////////////////////////////////////
//EOF