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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/factory
 */
define('zotohlab/p/s/factory',

       ['zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/factory */
    let exports = {   },
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
       * @param {Object} options
       */
      constructor(engine, options) {
        this.engine=engine;
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBricks
       */
      createBricks() {
        let wz = ccsx.vrect(),
        cw= ccsx.center(),
        candies= csts.CANDIES,
        bks=[],
        cs= csts.LEVELS["1"],
        ent, sp, b, w,
        x,
        y= wz.height - csts.TOP_ROW * csts.TILE ;

        for (let r=0; r < csts.ROWS; ++r) {
          x= csts.TILE + csts.LEFT_OFF + sh.hw(this.state.candySize);
          for (let c=0; c < csts.COLS; ++c) {
            sp= ccsx.createSpriteFrame( candies[cs[r]] + ".png");
            sh.main.addAtlasItem('game-pics', sp);
            sp = new cobjs.Brick(sp,10);
            bks.push(sp);
            sp.inflate({ x: x, y: y});
            x += this.state.candySize.width + 1;
          }
          y -= this.state.candySize.height - 2;
        }

        ent= sh.Ashley.newEntity();
        ent.add(new cobjs.BrickFence(bks));
        this.engine.addEntity(ent);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method bornPaddle
       */
      bornPaddle() {
        const p= this.engine.getNodeList(gnodes.PaddleMotionNode).head,
        cw= ccsx.center(),
        b= this.engine.getNodeList(gnodes.BallMotionNode).head;

        p.paddle.inflate();

        b.ball.inflate({ x: cw.x, y: 250});
        b.velocity.vel.vy = 200 * sjs.randSign();
        b.velocity.vel.vx = 200 * sjs.randSign();
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createPaddle
       */
      createPaddle() {
        let cw= ccsx.center(),
        ent,
        sp;

        sp = ccsx.createSpriteFrame('paddle.png');
        sh.main.addAtlasItem('game-pics',sp);
        sp= new cobjs.Paddle(sp);
        sp.inflate({ x: cw.x, y: 56});
        ent= sh.Ashley.newEntity();
        ent.add(sp);
        ent.add(new cobjs.Motion());
        ent.add(new cobjs.Velocity(150,0));
        this.engine.addEntity(ent);
      },

      /**
       * @memberof module:zotohlab/p/s/factory~EntityFactory
       * @method createBall
       */
      createBall() {
        let vy = 200 * sjs.randSign(),
        vx = 200 * sjs.randSign(),
        cw= ccsx.center(),
        ent,
        sp;

        sp = ccsx.createSpriteFrame('ball.png');
        sh.main.addAtlasItem('game-pics', sp);
        sp= new cobjs.Ball(sp,200);
        sp.inflate({ x: cw.x, y: 250});

        ent= sh.Ashley.newEntity();
        ent.add(sp);

        ent.add(new cobjs.Velocity(vx,vy));
        this.engine.addEntity(ent);
      }

    });

    exports= EntityFactory;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

