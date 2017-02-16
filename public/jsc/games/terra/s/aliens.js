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
              * @module s/aliens
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

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
/** * @class Aliens */
Aliens = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/aliens~Aliens
   * @method constructor
   * @param {Object} options
   */

  constructor: function constructor(options) {
    this.state = options;
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine: function removeFromEngine(engine) {
    this.ships = null;
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine: function addToEngine(engine) {
    this.ships = engine.getNodeList(_gnodes2.default.ShipMotionNode);
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    var node = this.ships.head;
    if (this.state.running && !!node) {
      this.doit(node, this.state.secCount);
    }
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method doit
   * @param {Object} node
   * @param {Number} dt
   */
  doit: function doit(node, dt) {
    var _this = this;

    var enemies = _asterix2.default.pools.Baddies,
        cfg = _asterix2.default.main.getLCfg(),
        fc = void 0;

    if (enemies.actives() < cfg.enemyMax) {
      sjs.eachObj(function (v) {
        fc = function fc() {
          for (var t = 0; t < v.types.length; ++t) {
            _this.addEnemyToGame(node, v.types[t]);
          }
        };
        if (v.style === "*" && dt % v.time === 0) {
          fc();
        }
        if (v.style === "1" && v.time >= dt) {
          v.style = "0";
          fc();
        }
      }, cfg.enemies);
    }
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method dropBombs
   * @param {Object} enemy
   */
  dropBombs: function dropBombs(enemy) {
    var bombs = _asterix2.default.pools.Bombs,
        sp = enemy.sprite,
        sz = sp.getContentSize(),
        pos = sp.getPosition(),
        b = bombs.get();

    if (!b) {
      _asterix2.default.factory.createBombs();
      b = bombs.get();
    }

    b.inflate({ x: pos.x, y: pos.y - sz.height * 0.2 });
    b.attackMode = enemy.attackMode;
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method getB
   * @param {Object} arg
   */
  getB: function getB(arg) {
    var _this2 = this;

    var enemies = _asterix2.default.pools.Baddies,
        en = void 0,
        pred = function pred(e) {
      return e.enemyType === arg.type && e.status === false;
    };

    en = enemies.select(pred);
    if (!en) {
      _asterix2.default.factory.createEnemies(1);
      en = enemies.select(pred);
    }

    if (!!en) {
      en.sprite.schedule(function () {
        _this2.dropBombs(en);
      }, en.delayTime);
      en.inflate();
    }

    return en;
  },

  /**
   * @memberof module:s/aliens~Aliens
   * @method addEnemyToGame
   * @param {Object} node
   * @param {Number} enemyType
   */
  addEnemyToGame: function addEnemyToGame(node, enemyType) {
    var arg = xcfg.EnemyTypes[enemyType],
        wz = _ccsx2.default.vrect(),
        en = this.getB(arg);

    if (!en) {
      return;
    }

    var sz = en.size(),
        epos = en.pos(),
        ship = node.ship,
        pos = ship.pos(),
        act = void 0,
        a0 = void 0,
        a1 = void 0;

    en.setPos(sjs.rand(80 + wz.width * 0.5), wz.height);
    switch (en.moveType) {

      case csts.ENEMY_MOVES.RUSH:
        act = cc.moveTo(1, cc.p(pos.x, pos.y));
        break;

      case csts.ENEMY_MOVES.VERT:
        act = cc.moveBy(4, cc.p(0, -wz.height - sz.height));
        break;

      case csts.ENEMY_MOVES.HORZ:
        a0 = cc.moveBy(0.5, cc.p(0, -100 - sjs.rand(200)));
        a1 = cc.moveBy(1, cc.p(-50 - sjs.rand(100), 0));
        var onComplete = cc.callFunc(function (p) {
          var a2 = cc.delayTime(1);
          var a3 = cc.moveBy(1, cc.p(100 + sjs.rand(100), 0));
          p.runAction(cc.sequence(a2, a3, a2.clone(), a3.reverse()).repeatForever());
        });
        act = cc.sequence(a0, a1, onComplete);
        break;

      case csts.ENEMY_MOVES.OLAP:
        var newX = pos.x <= wz.width * 0.5 ? wz.width : -wz.width;
        a0 = cc.moveBy(4, cc.p(newX, -wz.width * 0.75));
        a1 = cc.moveBy(4, cc.p(-newX, -wz.width));
        act = cc.sequence(a0, a1);
        break;
    }

    en.sprite.runAction(act);
  }
}, {

  /**
   * @memberof module:s/aliens~Aliens
   * @property {Number} Priority
   */
  Priority: xcfg.ftypes.Motion
});

/** @alias module:s/aliens */
var xbox = /** @lends xbox# */{
  /**
   * @property {Aliens} Aliens
   */
  Aliens: Aliens
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF