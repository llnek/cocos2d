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

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class EntityFactory
 */
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
   * @method createPaddles
   * @param {cc.Layer} layer
   * @param {Object} options
   */
  createPaddles: function createPaddles(layer, options) {

    this.createOnePaddle(layer, options.players[1], options.p1, options.paddle.speed, options);

    this.createOnePaddle(layer, options.players[2], options.p2, options.paddle.speed, options);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createBall
   * @param {cc.Layer} layer
   * @param {Object} options
   */
  createBall: function createBall(layer, options) {
    var ent = _asterix2.default.Ashley.newEntity(),
        info = options.ball,
        vy = info.speed * sjs.randSign(),
        vx = info.speed * sjs.randSign(),
        sp = void 0;

    if (options.mode === _asterix2.default.gtypes.ONLINE_GAME) {
      vx = vy = 0;
    }

    sp = new cc.Sprite('#pongball.png');
    sp.setPosition(info.x, info.y);
    layer.addAtlasItem('game-pics', sp);

    ent.add(new _cobjs2.default.Ball(sp, info.speed));
    ent.add(new _cobjs2.default.Velocity(vx, vy));
    this.engine.addEntity(ent);
  },

  /**
   * @method createOnePaddle
   * @param {cc.Layer} layer
   * @param {Object} p
   * @param {Object} info
   * @param {Number} speed
   * @param {Object} options
   */
  createOnePaddle: function createOnePaddle(layer, p, info, speed, options) {
    var res1 = '#red_paddle.png',
        res2 = '#green_paddle.png',
        ent = _asterix2.default.Ashley.newEntity(),
        res = void 0,
        sp = void 0,
        lp = void 0;

    if (p.color === csts.P1_COLOR) {
      res = res1;
    } else {
      res = res2;
    }

    sp = new cc.Sprite(res);
    sp.setPosition(info.x, info.y);
    layer.addAtlasItem('game-pics', sp);

    ent.add(new _cobjs2.default.Paddle(sp, p.color, speed));
    ent.add(p);

    if (_ccsx2.default.isPortrait()) {
      lp = info.x;
    } else {
      lp = info.y;
    }
    ent.add(new _cobjs2.default.Position(lp));

    if (options.wsock && options.pnum !== p.pnum) {
      ent.add(new _cobjs2.default.Faux());
      //only simulate move
    } else if (p.category === csts.BOT) {
        ent.add(new _cobjs2.default.Faux());
      } else {
        ent.add(new _cobjs2.default.Motion());
      }

    this.engine.addEntity(ent);
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