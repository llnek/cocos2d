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
define('zotohlab/p/gnodes',

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix'],

  function (cobjs, sjs, sh) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    let exports = {   },
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BricksNode
     */
    exports.BricksNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~BricksNode
       * @property {BrickFence} fence
       */
      fence   : cobjs.BrickFence
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class PaddleMotionNode
     */
    exports.PaddleMotionNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleMotionNode
       * @property {Velocity} velocity
       * @static
       */
      velocity    : cobjs.Velocity,
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleMotionNode
       * @property {Motion} motion
       * @static
       */
      motion      : cobjs.Motion,
      /**
       * @memberof module:zotohlab/p/gnodes~PaddleMotionNode
       * @property {Paddle} paddle
       * @static
       */
      paddle      : cobjs.Paddle
    });

    //////////////////////////////////////////////////////////////////////////////
    exports.BallMotionNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~BallMotionNode
       * @property {Velocity} velocity
       * @static
       */
      velocity    : cobjs.Velocity,
      /**
       * @memberof module:zotohlab/p/gnodes~BallMotionNode
       * @property {Ball} ball
       * @static
       */
      ball        : cobjs.Ball
    });

    return exports;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

