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
 * @module zotohlab/p/s/movepaddle
 */
define('zotohlab/p/s/movepaddle',

       ['zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/movepaddle */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MovementPaddle
     */
    MovementPaddle = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/movepaddle~MovementPaddle
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/movepaddle~MovementPaddle
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.paddleMotions = undef;
      },

      /**
       * @memberof module:zotohlab/p/s/movepaddle~MovementPaddle
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.paddleMotions = engine.getNodeList(gnodes.PaddleMotionNode)
      },

      /**
       * @memberof module:zotohlab/p/s/movepaddle~MovementPaddle
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var node=this.paddleMotions.head;

        if (this.state.running &&
           !!node) {
          this.processPaddleMotions(node,dt);
        }
      },

      /**
       * @private
       */
      processPaddleMotions: function(node,dt) {
        var motion = node.motion,
        sv = node.velocity,
        pad= node.paddle,
        pos = pad.sprite.getPosition(),
        x= pos.x,
        y= pos.y;

        if (motion.right) {
          x = pos.x + dt * sv.vel.x;
        }

        if (motion.left) {
          x = pos.x - dt * sv.vel.x;
        }

        pad.sprite.setPosition(x,y);
        this.clamp(pad);

        motion.right=false;
        motion.left=false;
      },

      /**
       * @private
       */
      clamp: function(pad) {
        var sz= pad.sprite.getContentSize(),
        pos= pad.sprite.getPosition(),
        wz = ccsx.vrect();

        if (ccsx.getRight(pad.sprite) > wz.width - csts.TILE) {
          pad.sprite.setPosition(wz.width - csts.TILE - sh.hw(sz), pos.y);
        }
        if (ccsx.getLeft(pad.sprite) < csts.TILE) {
          pad.sprite.setPosition( csts.TILE + sh.hw(sz), pos.y);
        }
      }

    });

    exports= MovementPaddle;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

