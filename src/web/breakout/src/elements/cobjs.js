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
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/elements
 */
define('zotohlab/p/elements',

       ['zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/elements */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Ball
     */
    Ball = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Ball
       * @method constructor
       * @param {cc.Sprite}
       */
      constructor(sprite) {
        this.ctor(sprite);
      }
    });
    /**
     * @property {Ball} Ball
     */
    exports.Ball= Ball;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BrickFence
     */
    BrickFence = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~BrickFence
       * @method constructor
       * @param {Array} bricks
       */
      constructor(bricks) {
        this.bricks=bricks;
      }
    });
    /**
     * @property {BrickFence} BrickFence
     */
    exports.BrickFence = BrickFence;

    /**
     * @class Brick
     */
    Brick = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Brick
       * @method constructor
       * @param {cc.Sprite} sprite
       * @param {Number} value
       * @param {Number} color
       */
      constructor(sprite,value,color) {
        this.ctor(sprite, 1, value);
        this.color=color;
      }

    });
    /**
     * @property {Brick} Brick
     */
    exports.Brick = Brick;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Motion
     */
    Motion = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Motion
       * @method constructor
       */
      constructor() {
        this.right = false;
        this.left = false;
      }
    });
    /**
     * @property {Motion} Motion
     */
    exports.Motion = Motion;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Paddle
     */
    Paddle = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Paddle
       * @method constructor
       * @param {cc.Sprite}
       */
      constructor(sprite) {
        this.ctor(sprite);
      }
    });
    /**
     * @property {Paddle} Paddle
     */
    exports.Paddle = Paddle;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Velocity
     */
    Velocity = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Velocity
       * @method constructor
       * @param {Number} vx
       * @param {Number} vy
       */
      constructor(vx,vy) {
        this.vel = {
          x: vx || 0,
          y: vy || 0
        };
      }

    });
    /**
     * @property {Velocity} Velocity
     */
    exports.Velocity = Velocity;


    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

