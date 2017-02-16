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
   * @method createBricks
   */
  createBricks: function createBricks() {
    var wz = _ccsx2.default.vrect(),
        cw = _ccsx2.default.center(),
        candies = csts.CANDIES,
        bks = [],
        cs = _asterix2.default.main.getLCfg(),
        ent = void 0,
        sp = void 0,
        b = void 0,
        w = void 0,
        x = void 0,
        y = wz.height - csts.TOP_ROW * csts.TILE;

    for (var r = 0; r < csts.ROWS; ++r) {
      x = csts.TILE + csts.LEFT_OFF + _asterix2.default.hw(this.state.candySize);
      for (var c = 0; c < csts.COLS; ++c) {
        sp = _ccsx2.default.createSprite(candies[cs[r]] + ".png");
        _asterix2.default.main.addAtlasItem('game-pics', sp);
        sp = new _cobjs2.default.Brick(sp, 10);
        bks.push(sp);
        sp.inflate({ x: x, y: y });
        x += this.state.candySize.width + 1;
      }
      y -= this.state.candySize.height - 2;
    }

    ent = _asterix2.default.Ashley.newEntity();
    ent.add(new _cobjs2.default.BrickFence(bks));
    this.engine.addEntity(ent);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method bornPaddle
   */
  bornPaddle: function bornPaddle() {
    var p = this.engine.getNodeList(_gnodes2.default.PaddleMotionNode).head,
        cw = _ccsx2.default.center(),
        b = this.engine.getNodeList(_gnodes2.default.BallMotionNode).head;

    p.paddle.inflate();

    b.ball.inflate({ x: cw.x, y: 250 });
    b.velocity.vel.vy = 200 * sjs.randSign();
    b.velocity.vel.vx = 200 * sjs.randSign();
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createPaddle
   */
  createPaddle: function createPaddle() {
    var cw = _ccsx2.default.center(),
        ent = void 0,
        sp = void 0;

    sp = _ccsx2.default.createSprite('paddle.png');
    _asterix2.default.main.addAtlasItem('game-pics', sp);
    sp = new _cobjs2.default.Paddle(sp);
    sp.inflate({ x: cw.x, y: 56 });
    ent = _asterix2.default.Ashley.newEntity();
    ent.add(sp);
    ent.add(new _cobjs2.default.Motion());
    ent.add(new _cobjs2.default.Velocity(150, 0));
    this.engine.addEntity(ent);
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createBall
   */
  createBall: function createBall() {
    var vy = 200 * sjs.randSign(),
        vx = 200 * sjs.randSign(),
        cw = _ccsx2.default.center(),
        ent = void 0,
        sp = void 0;

    sp = _ccsx2.default.createSprite('ball.png');
    _asterix2.default.main.addAtlasItem('game-pics', sp);
    sp = new _cobjs2.default.Ball(sp, 200);
    sp.inflate({ x: cw.x, y: 250 });

    ent = _asterix2.default.Ashley.newEntity();
    ent.add(sp);

    ent.add(new _cobjs2.default.Velocity(vx, vy));
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