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
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asterix
 * @module zotohlab/p/elements
 */
define("zotohlab/p/elements",

       ['zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/elements */
    let exports= {},
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
       * @constructor
       * @param {cc.Sprite} sprite
       * @param {Number} speed
       */
      constructor(sprite, speed) {
        this.ctor(sprite);
        this.speed= speed;
      }
    });
    /**
     * @property {Ball} Ball
     */
    exports.Ball = Ball;

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
        this.left= false;
      }
    });
    /**
     * @property {Motion} Motion
     */
    exports.Motion= Motion;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Paddle
     */
    Paddle = sh.Ashley.compDef({

      /**
       * @memberof module:zotohlab/p/elements~Paddle
       * @method p1Keys
       * @return {Array}
       */
      p1Keys() {
        return ccsx.isPortrait() ?
          [cc.KEY.left, cc.KEY.right] : [cc.KEY.down, cc.KEY.up];
      },

      /**
       * @memberof module:zotohlab/p/elements~Paddle
       * @method p2Keys
       * @return {Array}
       */
      p2Keys() {
        return ccsx.isPortrait() ?
          [cc.KEY.a, cc.KEY.d] : [cc.KEY.s, cc.KEY.w];
      },

      /**
       * @memberof module:zotohlab/p/elements~Paddle
       * @method onColor
       * @param {Array} keycodes
       * @param {String} snd
       */
      onColor(keycodes, snd) {
        this.kcodes = keycodes;
        this.snd= snd;
      },

      /**
       * @memberof module:zotohlab/p/elements~Paddle
       * @method constructor
       * @param {cc.Sprite} sprite
       * @param {Number} color
       * @param {Number} speed
       */
      constructor(sprite, color, speed) {

        this.ctor(sprite);
        this.color= color;
        this.speed= speed;

        if (this.color === csts.P1_COLOR) {
          this.onColor(this.p1Keys(), 'x_hit' );
        } else {
          this.onColor(this.p2Keys(), 'o_hit');
        }
      }

    });
    /**
     * @property {Paddle} Paddle
     */
    exports.Paddle= Paddle;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Player
     */
    Player = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Player
       * @method constructor
       * @param {Number} category
       * @param {Number} value
       * @param {Number} id
       * @param {Number} color
       */
      constructor(category,value,id,color) {
        this.color= color;
        this.pnum=id;
        this.category= category;
        this.value= value;
      }

    });
    /**
     * @property {Player} Player
     */
    exports.Player= Player;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Faux
     */
    Faux= sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Faux
       * @method constructor
       */
      constructor() {
      }

    });
    /**
     * @property {Faux} Faux
     */
    exports.Faux = Faux;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Position
     */
    Position = sh.Ashley.casDef({

      /**
       * @memberof module:zotohlab/p/elements~Position
       * @method constructor
       * @param {cc.Point} lp
       */
      constructor(lp) {
        this.lastDir= 0;
        this.lastP= lp;
      }

    });
    /**
     * @property {Position} Position
     */
    exports.Position= Position;

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
          x: vx,
          y: vy
        };
      }

    });
    /**
     * @property {Velocity} Velocity
     */
    exports.Velocity= Velocity;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

