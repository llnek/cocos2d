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
 * @requires zotohlab/asterix
 * @module zotohlab/p/gnodes
 */
define('zotohlab/p/gnodes',

       ['zotohlab/p/elements',
        'zotohlab/asterix'],

  function (cobjs, sh) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BricksNode
     */
    BricksNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~BricksNode
       * @property {BrickFence} fence
       */
      fence   : cobjs.BrickFence
    });
    /**
     * @property {BricksNode} BricksNode
     */
    exports.BricksNode = BricksNode;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class PaddleMotionNode
     */
    PaddleMotionNode = sh.Ashley.nodeDef({
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
    /**
     * @property {PaddleMotionNode} PaddleMotionNode
     */
    exports.PaddleMotionNode = PaddleMotionNode;

    //////////////////////////////////////////////////////////////////////////////
    BallMotionNode = sh.Ashley.nodeDef({
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
    /**
     * @property {BallMotionNode} BallMotionNode
     */
    exports.BallMotionNode = BallMotionNode;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

