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
              * @requires zotohlab/asx/pool
              * @requires n/cobjs
              * @module s/factory
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _pool = require('zotohlab/asx/pool');

var _pool2 = _interopRequireDefault(_pool);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class EntityFactory */
EntityFactory = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Ash.Engine} engine
   * @param {Object} options
   */

  constructor: function constructor(engine, options) {
    this.engine = engine;
    this.state = options;
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createMissiles
   * @param {Number} count
   */
  createMissiles: function createMissiles(count) {
    _asterix2.default.pools.Missiles.preSet(function () {
      var sp = _ccsx2.default.createSprite('missile.png');
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('game-pics', sp);
      return new _cobjs2.default.Missile(sp);
    }, count || 36);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createExplosions
   * @param {Number} count
   */
  createExplosions: function createExplosions(count) {
    _asterix2.default.pools.Explosions.preSet(function () {
      var sp = _ccsx2.default.createSprite('boom_0.png');
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('game-pics', sp);
      return new _cobjs2.default.Explosion(sp);
    }, count || 24);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createBombs
   * @param {Number} count
   */
  createBombs: function createBombs(count) {
    _asterix2.default.pools.Bombs.preSet(function () {
      var sp = _ccsx2.default.createSprite('bomb.png');
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('game-pics', sp);
      return new _cobjs2.default.Bomb(sp);
    }, count || 24);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method calcImgSize
   * @param {String} img
   */
  calcImgSize: function calcImgSize(img) {
    return _ccsx2.default.csize(img);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method getRankInfo
   * @param {Number} rank
   */
  getRankInfo: function getRankInfo(rank) {
    if (rank < 3) {
      return [100, ['blue_bug_0.png', 'blue_bug_1.png'], this.calcImgSize('blue_bug_0.png')];
    } else if (rank < 5) {
      return [50, ['green_bug_0.png', 'green_bug_1.png'], this.calcImgSize('green_bug_0.png')];
    } else {
      return [30, ['purple_bug_0.png', 'purple_bug_1.png'], this.calcImgSize('purple_bug_0.png')];
    }
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method fillSquad
   * @param {XPool} pool
   */
  fillSquad: function fillSquad(pool) {
    var az = this.state.alienSize,
        wz = _ccsx2.default.vrect(),
        wb = _ccsx2.default.vbox(),
        row = 0,
        info = void 0,
        aa = void 0,
        x = void 0,
        y = void 0;

    info = this.getRankInfo(row);
    az = info[2];
    for (var n = 0; n < csts.CELLS; ++n) {
      if (n % csts.COLS === 0) {
        y = n === 0 ? wb.top * 0.9 : y - az.height - wz.height * 4 / 480;
        x = wb.left + 8 / 320 * wz.width + _asterix2.default.hw(az);
        row += 1;
        info = this.getRankInfo(row);
        az = info[2];
      }
      aa = _ccsx2.default.createSprite(info[1][0]);
      aa.setPosition(x + _asterix2.default.hw(az), y - _asterix2.default.hh(az));
      aa.runAction(new cc.RepeatForever(new cc.Animate(new cc.Animation([_ccsx2.default.getSprite(info[1][0]), _ccsx2.default.getSprite(info[1][1])], 1))));
      _asterix2.default.main.addAtlasItem('game-pics', aa);
      x += az.width + 8 / 320 * wz.width;
      aa = new _cobjs2.default.Alien(aa, info[0], row);
      aa.status = true;
      pool.push(aa);
    }
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createAliens
   */
  createAliens: function createAliens() {
    var stepx = this.state.alienSize.width / 3,
        ent = _asterix2.default.Ashley.newEntity(),
        aliens = _pool2.default.reify(),
        me = this;

    aliens.preSet(function (pool) {
      me.fillSquad(pool);
    }, 1);

    ent.add(new _cobjs2.default.AlienSquad(aliens, stepx));
    ent.add(new _cobjs2.default.Looper(2));

    this.engine.addEntity(ent);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method bornShip
   */
  bornShip: function bornShip() {
    if (!!this.state.ship) {
      this.state.ship.inflate();
    }
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createShip
   */
  createShip: function createShip() {
    var s = _ccsx2.default.createSprite('ship_1.png'),
        ent = new _asterix2.default.Ashley.newEntity(),
        wz = _ccsx2.default.vrect(),
        wb = _ccsx2.default.vbox(),
        y = this.state.shipSize.height + wb.bottom + 5 / 60 * wz.height,
        x = wb.left + wz.width * 0.5,
        ship = void 0;

    _asterix2.default.main.addAtlasItem('game-pics', s);

    ship = new _cobjs2.default.Ship(s, ['ship_1.png', 'ship_0.png']);
    this.state.ship = ship;
    ship.inflate({ x: x, y: y });
    ent.add(ship);

    ent.add(new _cobjs2.default.Velocity(150, 0));
    ent.add(new _cobjs2.default.Looper(1));
    ent.add(new _cobjs2.default.Cannon());
    ent.add(new _cobjs2.default.Motion());

    this.engine.addEntity(ent);
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