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

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

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
    this.alienMotions = null;
    this.shipMotions = null;
    this.cannons = null;
  },

  /**
   * @memberof module:s/motion~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.alienMotions = engine.getNodeList(_gnodes2.default.AlienMotionNode);
    this.shipMotions = engine.getNodeList(_gnodes2.default.ShipMotionNode);
    this.cannons = engine.getNodeList(_gnodes2.default.CannonCtrlNode);
  },

  /**
   * @memberof module:s/motion~Motions
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var aliens = this.alienMotions.head,
        ships = this.shipMotions.head,
        cns = this.cannons.head;
    if (this.state.running) {
      if (!!aliens) {
        this.processAlienMotions(aliens, dt);
      }
      if (!!cns) {
        this.controlCannon(cns, dt);
      }
      if (!!ships) {
        this.scanInput(ships, dt);
      }
    }
  },

  /**
   * @method controlCannon
   * @private
   */
  controlCannon: function controlCannon(node, dt) {
    var gun = node.cannon,
        lpr = node.looper,
        ship = node.ship,
        t = lpr.timers[0];

    if (!gun.hasAmmo) {
      if (_ccsx2.default.timerDone(t)) {
        ship.sprite.setSpriteFrame(ship.frames[0]);
        gun.hasAmmo = true;
        lpr.timers[0] = _ccsx2.default.undoTimer(t);
      }
    } else {
      if (_asterix2.default.main.keyPoll(cc.KEY.space)) {
        this.fireMissile(node, dt);
      }
    }
  },

  /**
   * @method fireMissile
   * @private
   */
  fireMissile: function fireMissile(node, dt) {
    var top = _ccsx2.default.getTop(node.ship.sprite),
        p = _asterix2.default.pools.Missiles,
        ship = node.ship,
        pos = ship.pos(),
        lpr = node.looper,
        gun = node.cannon,
        ent = p.get();

    if (!ent) {
      _asterix2.default.factory.createMissiles(36);
      ent = p.get();
    }

    ent.inflate({ x: pos.x, y: top + 4 });

    lpr.timers[0] = _ccsx2.default.createTimer(_asterix2.default.main, gun.coolDownWindow);
    gun.hasAmmo = false;
    ship.sprite.setSpriteFrame(ship.frames[1]);
    _asterix2.default.sfxPlay('ship-missile');
  },

  /**
   * @method scanInput
   * @private
   */
  scanInput: function scanInput(node, dt) {
    var s = node.ship,
        m = node.motion;

    if (_asterix2.default.main.keyPoll(cc.KEY.right)) {
      m.right = true;
    }
    if (_asterix2.default.main.keyPoll(cc.KEY.left)) {
      m.left = true;
    }
  },

  /**
   * @method processAlienMotions
   * @private
   */
  processAlienMotions: function processAlienMotions(node, dt) {
    var lpr = node.looper,
        sqad = node.aliens;

    if (!sjs.echt(lpr.timers[0])) {
      lpr.timers[0] = _ccsx2.default.createTimer(_asterix2.default.main, 1);
    }

    if (!sjs.echt(lpr.timers[1])) {
      lpr.timers[1] = _ccsx2.default.createTimer(_asterix2.default.main, 2);
    }
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

//////////////////////////////////////////////////////////////////////////////
//EOF