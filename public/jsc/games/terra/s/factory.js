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
              * @module s/factory
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BackTileMap = ["lvl1_map1.png", "lvl1_map2.png", "lvl1_map3.png", "lvl1_map4.png"];

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class EntityFactory */
EntityFactory = _asterix2.default.Ashley.casDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Ash.Engine} engine
   */

  constructor: function constructor(engine) {
    this.engine = engine;
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createShip
   * @return {Object} a ship
   */
  createShip: function createShip() {
    var sp = _ccsx2.default.createSprite('ship01.png'),
        ent = _asterix2.default.Ashley.newEntity(),
        sz = sp.getContentSize(),
        bs = void 0,
        player = void 0,
        cw = _ccsx2.default.center(),
        wz = _ccsx2.default.vrect();
    sp.setPosition(cw.x, sz.height);

    // set frame
    var fr0 = _ccsx2.default.getSprite("ship01.png"),
        fr1 = _ccsx2.default.getSprite("ship02.png"),
        animFrames = [fr0, fr1],
        animation = new cc.Animation(animFrames, 0.1),
        animate = cc.animate(animation);
    sp.runAction(animate.repeatForever());

    _asterix2.default.main.addAtlasItem('game-pics', sp, csts.SHIP_ZX);

    bs = _ccsx2.default.createSprite("ship03.png");
    bs.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    bs.setPosition(sz.width * 0.5, 12);
    bs.setVisible(false);
    sp.addChild(bs, csts.SHIP_ZX, 99999);

    player = new _cobjs2.default.Ship(sp, bs);
    ent.add(player);
    ent.add(new _cobjs2.default.Motion());
    this.engine.addEntity(ent);
    return player;
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createMissiles
   * @param {Number} count
   */
  createMissiles: function createMissiles(count) {
    _asterix2.default.pools.Missiles.preSet(function () {
      var sp = _ccsx2.default.createSprite('W1.png');
      sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('op-pics', sp, csts.SHIP_ZX);
      return new _cobjs2.default.Missile(sp);
    }, count);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createBombs
   * @param {Number} count
   */
  createBombs: function createBombs(count) {
    _asterix2.default.pools.Bombs.preSet(function () {
      var sp = _ccsx2.default.createSprite('W2.png');
      sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('op-pics', sp, csts.SHIP_ZX);
      return new _cobjs2.default.Bomb(sp);
    }, count);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createExplosions
   * @param {Number} count
   */
  createExplosions: function createExplosions(count) {
    _asterix2.default.pools.Explosions.preSet(function () {
      var sp = _ccsx2.default.createSprite("explosion_01.png");
      sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('explosions', sp);
      return new _cobjs2.default.Explosion(sp);
    }, count || 6);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createHitEffects
   * @param {Number} count
   */
  createHitEffects: function createHitEffects(count) {
    _asterix2.default.pools.HitEffects.preSet(function () {
      var sp = _ccsx2.default.createSprite("hit.png");
      sp.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('op-pics', sp);
      return new _cobjs2.default.HitEffect(sp);
    }, count || 10);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createSparks
   * @param {Number} count
   */
  createSparks: function createSparks(count) {
    _asterix2.default.pools.Sparks.preSet(function () {
      var sp = [_ccsx2.default.createSprite("explode2.png"), _ccsx2.default.createSprite("explode3.png")];
      R.forEach(function (s) {
        s.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        s.setVisible(false);
        _asterix2.default.main.addAtlasItem('op-pics', s);
      }, sp);
      return new _cobjs2.default.Spark(sp[0], sp[1]);
    }, count || 6);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createEnemies
   * @param {Number} count
   */
  createEnemies: function createEnemies(count) {
    var cr = function cr(arg) {
      var sp = _ccsx2.default.createSprite(arg.textureName);
      sp.setVisible(false);
      _asterix2.default.main.addAtlasItem('game-pics', sp, csts.SHIP_ZX - 1); // why?
      return new _cobjs2.default.Enemy(sp, arg);
    },
        ts = xcfg.EnemyTypes;

    _asterix2.default.pools.Baddies.preSet(function (pool) {
      for (var j = 0; j < ts.length; ++j) {
        pool.push(cr(ts[j]));
      }
    }, count || 3);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createBackSkies
   */
  createBackSkies: function createBackSkies() {
    var layer = _asterix2.default.main.getBackgd();
    _asterix2.default.pools.BackSkies.preSet(function () {
      var bg = _ccsx2.default.createSprite('bg01.png');
      bg.setAnchorPoint(0, 0);
      bg.setVisible(false);
      layer.addAtlasItem('game-pics', bg, -10);
      return _asterix2.default.Ashley.newObject(bg);
    }, 2);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createBackTiles
   * @param {Number} count
   */
  createBackTiles: function createBackTiles(count) {
    var layer = _asterix2.default.main.getBackgd(),
        rc = void 0,
        sp = void 0,
        cr = function cr(name) {
      sp = _ccsx2.default.createSprite(name);
      sp.setAnchorPoint(0.5, 0);
      sp.setVisible(false);
      layer.addAtlasItem('back-tiles', sp, -9);
      return _asterix2.default.Ashley.newObject(sp);
    };

    var tm = BackTileMap,
        tn = tm.length,
        sz = count || 1;

    _asterix2.default.pools.BackTiles.preSet(function (pool) {
      for (var n = 0; n < tn; ++n) {
        pool.push(cr(tm[sjs.rand(tn)]));
      }
    }, sz);
  }
});

/** @alias module:s/factory */
var xbox = /** @lends xbox# */{
  /**
   * @property {EntityFactory}  EntityFactory
   */
  EntityFactory: EntityFactory
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF