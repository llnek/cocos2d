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
              * @module s/factory
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var xcfg = _asterix2.default.xcfg,
    sjs = _asterix2.default.skarojs,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////////
/** * @class EntityFactory */
EntityFactory = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(engine, options) {
    this.state = options;
    this.engine = engine;
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createMissiles
   * @param {Number} count
   */
  createMissiles: function createMissiles(count) {
    _asterix2.default.pools.Missiles.preSet(function () {
      var sp = _ccsx2.default.createSprite('laserGreen.png');
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('game-pics', sp);
      return new _cobjs2.default.Missile(sp);
    }, count || 36);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createLasers
   * @param {Number} count
   */
  createLasers: function createLasers(count) {
    _asterix2.default.pools.Lasers.preSet(function () {
      var sp = _ccsx2.default.createSprite('laserRed.png');
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('game-pics', sp);
      return new _cobjs2.default.Laser(sp);
    }, count || 36);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createShip
   */
  createShip: function createShip() {
    var ent = _asterix2.default.Ashley.newEntity(),
        deg = 90,
        //sjs.randPercent() * 360;
    sp = _ccsx2.default.createSprite('rship_0.png');

    sp.setRotation(deg);
    _asterix2.default.main.addAtlasItem('game-pics', sp);

    sp = new _cobjs2.default.Ship(sp, ['rship_0.png', 'rship_1.png']);
    this.state.ship = sp;
    this.bornShip();

    ent.add(sp);

    ent.add(new _cobjs2.default.Velocity(0, 0, 150, 150));
    ent.add(new _cobjs2.default.Motion());
    ent.add(new _cobjs2.default.Looper(1));
    ent.add(new _cobjs2.default.Cannon());
    ent.add(new _cobjs2.default.Thrust(25));
    ent.add(new _cobjs2.default.Rotation(deg));
    this.engine.addEntity(ent);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method bornShip
   */
  bornShip: function bornShip() {
    var h = this.state.playerSize.height,
        w = this.state.playerSize.width,
        B = this.state.world,
        wz = _ccsx2.default.vrect(),
        cw = _ccsx2.default.center(),
        test = true,
        sp = void 0,
        aa = void 0,
        x = void 0,
        y = void 0,
        r = void 0;

    while (test) {
      r = { left: sjs.rand(wz.width),
        top: sjs.rand(wz.height) };
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) && !_asterix2.default.outOfBound(r, B)) {
        x = r.left + w * 0.5;
        y = r.top - h * 0.5;
        test = false;
      }
    }

    this.state.ship.inflate({ x: x, y: y });
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createAsteroids
   * @param {Number} rank
   */
  createAsteroids: function createAsteroids(rank) {
    var cfg = _asterix2.default.main.getLCfg(),
        B = this.state.world,
        pool = void 0,
        ht = this.state.astro1.height,
        wd = this.state.astro1.width;

    switch (rank) {
      case csts.P_AS1:
        pool = _asterix2.default.pools.Astros1;break;
      case csts.P_AS2:
        pool = _asterix2.default.pools.Astros2;break;
      case csts.P_AS3:
        pool = _asterix2.default.pools.Astros3;break;

      default:
        return;
    }

    sjs.loggr.debug('about to create more asteroids - ' + rank);

    pool.preSet(function (pl) {
      var wz = _ccsx2.default.vrect(),
          cw = _ccsx2.default.center(),
          sp = void 0,
          x = void 0,
          y = void 0,
          deg = void 0,
          r = void 0,
          n = 0;
      while (n < cfg[rank][0]) {
        r = { left: sjs.rand(wz.width),
          top: sjs.rand(wz.height) };
        r.bottom = r.top - ht;
        r.right = r.left + wd;
        if (!_asterix2.default.outOfBound(r, B)) {
          deg = sjs.rand(360);
          x = r.left + wd / 2;
          y = r.top - ht / 2;
          sp = _ccsx2.default.createSprite(cfg[rank][1]);
          sp.setRotation(deg);
          _asterix2.default.main.addAtlasItem('game-pics', sp);

          sp = new _cobjs2.default.Asteroid(sp, cfg[rank][2], rank, deg, 20 * sjs.randSign(), 20 * sjs.randSign());
          sp.inflate({ x: x, y: y });
          pl.push(sp);
          ++n;
        }
      }
    }, 1);

    sjs.loggr.debug('CREATED more asteroids - ' + rank);
  },

  /**
   * @private
   */
  maybeOverlap: function maybeOverlap(ship) {
    var rc = R.any(function (z) {
      return z.status ? _asterix2.default.isIntersect(ship, _ccsx2.default.bbox4(z.sprite)) : false;
    }, _asterix2.default.pools.Astros1.pool);
    if (rc) {
      return true;
    }

    rc = R.any(function (z) {
      return z.status ? _asterix2.default.isIntersect(ship, _ccsx2.default.bbox4(z.sprite)) : false;
    }, _asterix2.default.pools.Astros2.pool);
    if (rc) {
      return true;
    }

    rc = R.any(function (z) {
      return z.status ? _asterix2.default.isIntersect(ship, _ccsx2.default.bbox4(z.sprite)) : false;
    }, _asterix2.default.pools.Astros3.pool);
    if (rc) {
      return true;
    }

    return false;
  }
});

/** @alias module:s/factory */
var xbox = /** @lends xbox# */{

  /**
   * @property {EntityFactory} EntityFactory
   */
  EntityFactory: EntityFactory
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF