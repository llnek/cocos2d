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
 * @requires zotohlab/p/sysobjs
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/collision
 */
define("zotohlab/p/s/collision",

       ['zotohlab/p/sysobjs',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/collision */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class CollisionSystem
     */
    CollisionSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/collision~CollisionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/collision~CollisionSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.nodeList=null;
        this.fauxs=null;
        this.balls=null;
      },

      /**
       * @memberof module:zotohlab/p/s/collision~CollisionSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.fauxs= engine.getNodeList(gnodes.FauxPaddleNode);
        this.nodeList= engine.getNodeList(gnodes.PaddleNode);
        this.balls= engine.getNodeList(gnodes.BallNode);
      },

      /**
       * @memberof module:zotohlab/p/s/collision~CollisionSystem
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var bnode = this.balls.head;

        if (this.state.running &&
           !!bnode) {
          this.checkNodes(this.nodeList, bnode);
          this.checkNodes(this.fauxs, bnode);
        }
      },

      /**
       * @private
       */
      checkNodes: function(nl, bnode) {
        for (var node=nl.head; node; node=node.next) {
          if (ccsx.collide0(node.paddle.sprite,
                            bnode.ball.sprite)) {
            this.check(node, bnode);
          }
        }
      },

      /**
       * Ball hits paddle.
       * @private
       */
      check: function(node, bnode) {
        var pos = bnode.ball.sprite.getPosition(),
        bb4 = ccsx.bbox4(node.paddle.sprite),
        velo = bnode.velocity,
        x= pos.x,
        y= pos.y,
        hw2= ccsx.halfHW(bnode.ball.sprite);

        if (ccsx.isPortrait()) {
          velo.vel.y = - velo.vel.y;
        } else {
          velo.vel.x = - velo.vel.x;
        }

        if (node.paddle.color === csts.P1_COLOR) {
          if (ccsx.isPortrait()) {
            y=bb4.top + hw2[1];
          } else {
            x=bb4.right + hw2[0];
          }
        } else {
          if (ccsx.isPortrait()) {
            y = bb4.bottom - hw2[1];
          } else {
            x = bb4.left - hw2[0];
          }
        }

        bnode.ball.sprite.setPosition(x,y);
        sh.sfxPlay(node.paddle.snd);
      }

    });

    /**
     * @memberof module:zotohlab/p/s/collision~CollisionSystem
     * @property {Number} Priority
     * @static
     */
    CollisionSystem.Priority = sobjs.Collision;

    exports= CollisionSystem;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

