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
 * @module zotohlab/p/gnodes
 */
define("zotohlab/p/gnodes",

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix'],

  function (cobjs, sjs, sh) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    let exports= {    },
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BallNode
     */
    exports.BallNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~BallNode
       * @property {Velocity} velocity
       */
      velocity    : cobjs.Velocity,
      /**
       * @memberof module:zotohlab/p/gnodes~BallNode
       * @property {Ball} ball
       */
      ball        : cobjs.Ball
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class FauxPaddleNode
     */
    exports.FauxPaddleNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~FauxPaddleNode
       * @property {Position} lastpos
       */
      lastpos   : cobjs.Position,
      /**
       * @memberof module:zotohlab/p/gnodes~FauxPaddleNode
       * @property {Paddle} paddle
       */
      paddle    : cobjs.Paddle,
      /**
       * @memberof module:zotohlab/p/gnodes~FauxPaddleNode
       * @property {Faux} faux
       */
      faux      : cobjs.Faux,
      /**
       * @memberof module:zotohlab/p/gnodes~FauxPaddleNode
       * @property {Player} player
       */
      player    : cobjs.Player
    });

    /**
     * @class PaddleNode
     */
    exports.PaddleNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleNode
       * @property {Position} lastpos
       */
      lastpos   : cobjs.Position,
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleNode
       * @property {Motion} motion
       */
      motion    : cobjs.Motion,
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleNode
       * @property {Paddle} paddle
       */
      paddle    : cobjs.Paddle,
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleNode
       * @property {Player} player
       */
      player    : cobjs.Player
    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

