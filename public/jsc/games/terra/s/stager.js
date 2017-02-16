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
              * @requires s/utils
              * @requires n/gnodes
              * @requires zotohlab/asx/pool
              * @module s/stager
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _pool = require('zotohlab/asx/pool');

var _pool2 = _interopRequireDefault(_pool);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

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
/** * class Stager */
Stager = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/stager~Stager
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.ships = null;
  },

  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @memberof module:s/stager~Stager
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (_ccsx2.default.isTransitioning()) {
      return false;
    }
    if (this.state.running && !this.inited) {
      this.onceOnly();
      this.inited = true;
    }
  },

  /**
   * @method initBackSkies
   * @private
   */
  initBackSkies: function initBackSkies() {
    var bs = _asterix2.default.pools.BackSkies.get();
    bs.inflate({ x: 0, y: 0 });
    this.state.backSkyRe = null;
    this.state.backSky = bs;
    this.state.backSkyDim = cc.size(bs.size());
  },

  /**
   * @method sharedExplosion
   * @private
   */
  sharedExplosion: function sharedExplosion() {
    var animFrames = [],
        animation = void 0,
        frame = void 0;

    for (var n = 1; n < 35; ++n) {
      var str = "explosion_" + (n < 10 ? "0" + n : n) + ".png";
      frame = _ccsx2.default.getSprite(str);
      animFrames.push(frame);
    }
    animation = new cc.Animation(animFrames, 0.04);
    cc.animationCache.addAnimation(animation, "Explosion");
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly: function onceOnly() {
    this.state.player = _asterix2.default.factory.createShip();

    _asterix2.default.pools.BackTiles = _pool2.default.reify();
    _asterix2.default.pools.BackSkies = _pool2.default.reify();

    _asterix2.default.pools.Missiles = _pool2.default.reify();
    _asterix2.default.pools.Baddies = _pool2.default.reify();
    _asterix2.default.pools.Bombs = _pool2.default.reify();

    _asterix2.default.pools.Explosions = _pool2.default.reify();
    _asterix2.default.pools.Sparks = _pool2.default.reify();
    _asterix2.default.pools.HitEffects = _pool2.default.reify();

    _asterix2.default.factory.createBackSkies();

    this.sharedExplosion();
    this.initBackSkies();

    _asterix2.default.factory.createBackTiles();
    _asterix2.default.fire('/game/backtiles');

    _asterix2.default.factory.createMissiles();
    _asterix2.default.factory.createBombs();
    _asterix2.default.factory.createEnemies();

    _asterix2.default.factory.createExplosions();
    _asterix2.default.factory.createSparks();
    _asterix2.default.factory.createHitEffects();

    var node = this.ships.head;
    if (!!node) {
      _utils2.default.bornShip(node.ship);
    }

    _ccsx2.default.onTouchOne(this);
    _ccsx2.default.onMouse(this);
    _asterix2.default.main.pkInput();
  },

  /**
   * @method fire
   * @private
   */
  fire: function fire(t, evt) {
    if ('/touch/one/move' === t || '/mouse/move' === t) {} else {
      return;
    }
    if (this.state.running && !!this.ships.head) {
      var ship = this.ships.head.ship,
          pos = ship.pos(),
          wz = _ccsx2.default.vrect(),
          cur = cc.pAdd(pos, evt.delta);
      cur = cc.pClamp(cur, cc.p(0, 0), cc.p(wz.width, wz.height));
      ship.setPos(cur.x, cur.y);
    }
  }
}, {

  /**
   * @memberof module:s/stager~Stager
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.PreUpdate
});

/** @alias module:s/stager */
var xbox = /** @lends xbox# */{
  /**
   * @property {Stager}  Stager
   */
  Stager: Stager
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF