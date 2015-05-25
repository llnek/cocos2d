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
 * @module zotohlab/p/s/moveball
 */
define('zotohlab/p/s/moveball',

       ['zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/moveball */
    let exports = {     },
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class MovementBall
     */
    MovementBall = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/moveball~MovementBall
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/moveball~MovementBall
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.ballMotions = undef;
      },

      /**
       * @memberof module:zotohlab/p/s/moveball~MovementBall
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.ballMotions = engine.getNodeList( gnodes.BallMotionNode)
      },

      /**
       * @memberof module:zotohlab/p/s/moveball~MovementBall
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const node=this.ballMotions.head;

        if (this.state.running &&
           !!node) {
          this.processBallMotions(node, dt);
        }
      },

      /**
       * @method processBallMotions
       * @private
       */
      processBallMotions(node, dt) {
        let v = node.velocity,
        b= node.ball,
        rc,
        pos= b.sprite.getPosition(),
        rect= ccsx.bbox(b.sprite);

        rect.x = pos.x;
        rect.y = pos.y;

        rc=ccsx.traceEnclosure(dt,this.state.world,
                               rect,
                               v.vel);
        if (rc.hit) {
          v.vel.x = rc.vx;
          v.vel.y = rc.vy;
        } else {
        }
        b.sprite.setPosition(rc.x,rc.y);
      }

    });

    /**
     * @memberof module:zotohlab/p/s/moveball~MovementBall
     * @property {Number} Priority
     */
    MovementBall.Priority = sh.ftypes.Move;

    exports= MovementBall;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

