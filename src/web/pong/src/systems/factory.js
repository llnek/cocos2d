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

/**
 * @requires zotohlab/p/elements
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/factory
 */
define("zotohlab/p/s/factory",

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/factory */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class EntityFactory
     */
    EntityFactory = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method constructor
       * @param {Ash.Engine} engine
       */
      constructor(engine) {
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createPaddles
       * @param {cc.Layer} layer
       * @param {Object} options
       */
      createPaddles(layer, options) {

        this.createOnePaddle(layer, options.players[1],
                             options.p1,
                             options.paddle.speed,
                             options);

        this.createOnePaddle(layer, options.players[2],
                             options.p2,
                             options.paddle.speed,
                             options);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBall
       * @param {cc.Layer} layer
       * @param {Object} options
       */
      createBall(layer, options) {
        let ent = sh.Ashley.newEntity(),
        info = options.ball,
        vy = info.speed * sjs.randSign(),
        vx = info.speed * sjs.randSign(),
        sp;

        if (options.mode === sh.gtypes.ONLINE_GAME) {
          vx = vy = 0;
        }

        sp= new cc.Sprite('#pongball.png');
        sp.setPosition(info.x, info.y);
        layer.addAtlasItem('game-pics', sp);

        ent.add(new cobjs.Ball(sp, info.speed));
        ent.add(new cobjs.Velocity(vx, vy));
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
      createOnePaddle(layer, p, info, speed, options) {
        let res1 = '#red_paddle.png',
        res2= '#green_paddle.png',
        ent = sh.Ashley.newEntity(),
        res,
        sp, lp;

        if (p.color === csts.P1_COLOR) {
          res= res1;
        } else {
          res= res2;
        }

        sp = new cc.Sprite(res);
        sp.setPosition(info.x, info.y);
        layer.addAtlasItem('game-pics', sp);

        ent.add(new cobjs.Paddle(sp, p.color, speed));
        ent.add(p);

        if (ccsx.isPortrait()) { lp = info.x; } else { lp= info.y; }
        ent.add(new cobjs.Position(lp));

        if (options.wsock && options.pnum !== p.pnum) {
          ent.add(new cobjs.Faux());
          //only simulate move
        }
        else
        if (p.category === csts.BOT) {
          ent.add(new cobjs.Faux());
        } else {
          ent.add(new cobjs.Motion());
        }

        this.engine.addEntity(ent);
      }

    });

    exports= EntityFactory;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

