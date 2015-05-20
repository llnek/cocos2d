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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/collisions
 */
define('zotohlab/p/s/collisions',

       ['zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/collisions */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.xcsts,
    undef,

    /**
     * @class CollisionSystem
     */
    CollisionSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.paddles=null;
        this.balls=null;
        this.fences= undef;
      },

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.paddles= engine.getNodeList(gnodes.PaddleMotionNode);
        this.balls= engine.getNodeList(gnodes.BallMotionNode);
        this.fences= engine.getNodeList(gnodes.BricksNode);
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var bnode = this.balls.head,
        pnode= this.paddles.head,
        fnode= this.fences.head;

        if (this.state.running &&
            !!bnode &&
            !!pnode &&
            !!fnode) {

          if (! this.onPlayerKilled(pnode, bnode)) {
            this.checkNodes(pnode, bnode);
            this.checkBricks(fnode, bnode,dt);
          }
        }
      },

      /**
       * @private
       */
      onPlayerKilled: function(pnode, bnode) {
        var pos= bnode.ball.sprite.getPosition();

        if (pos.y < ccsx.getBottom(pnode.paddle.sprite)) {
          sh.fire('/game/players/killed');
          return true;
        } else {
          return false;
        }
      },

      /**
       * @private
       */
      checkNodes: function(pnode,bnode) {
        if (ccsx.collide0(pnode.paddle.sprite,
                          bnode.ball.sprite)) {
          this.check(pnode,bnode);
        }
      },

      //ball hits paddle
      /**
       * @private
       */
      check: function(pnode,bnode) {
        var ball= bnode.ball,
        pad= pnode.paddle,
        hh= ball.sprite.getContentSize().height * 0.5,
        pos= ball.sprite.getPosition(),
        bv= bnode.velocity,
        top= ccsx.getTop(pad.sprite);

        ball.sprite.setPosition(pos.x, top+hh);
        bv.vel.y = - bv.vel.y;
      },

      /**
       * @private
       */
      checkBricks: function(fence,bnode,dt) {
        var bss = fence.fence.bricks,
        n,
        m= bnode.ball;

        for (n=0; n < bss.length; ++n) {
          if (bss[n].status !== true) { continue; }
          if (ccsx.collide0(m.sprite, bss[n].sprite)) {
            this.onBrick(bnode, bss[n]);
            break;
          }
        }
      },

      /**
       * @private
       */
      onBrick: function(bnode, brick) {
        var bz = bnode.ball.sprite.getContentSize(),
        kz= brick.sprite.getContentSize(),
        velo= bnode.velocity,
        ks= brick.sprite,
        bs= bnode.ball.sprite,
        ka = { L: ccsx.getLeft(ks), T: ccsx.getTop(ks),
               R: ccsx.getRight(ks), B: ccsx.getBottom(ks) },
        ba = { L : ccsx.getLeft(bs), T: ccsx.getTop(bs),
               R: ccsx.getRight(bs), B: ccsx.getBottom(bs) };

        // ball coming down from top?
        if (ba.T > ka.T &&  ka.T > ba.B) {
          velo.vel.y = - velo.vel.y;
        }
        else
        // ball coming from bottom?
        if (ba.T > ka.B &&  ka.B > ba.B) {
          velo.vel.y = - velo.vel.y;
        }
        else
        // ball coming from left?
        if (ka.L > ba.L && ba.R > ka.L) {
          velo.vel.x = - velo.vel.x;
        }
        else
        // ball coming from right?
        if (ka.R > ba.L && ba.R > ka.R) {
          velo.vel.x = - velo.vel.x;
        }
        else {
          sjs.loggr.error("Failed to determine the collision of ball and brick.");
          return;
        }
        sh.fire('/game/players/earnscore', {
          value: brick.value
        });
        brick.sprite.setVisible(false);
        brick.status=false;
      }

    });

    exports= CollisionSystem;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

