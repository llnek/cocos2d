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

"use strict"/**
 * @requires zotohlab/asx/asterix
 * @requires nodes/cobjs
 * @module nodes/gnodes
 */

import sh from 'zotohlab/asx/asterix';
import cobjs from 'nodes/cobjs';


/** @alias module:nodes/gnodes */
let xbox = {},
sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BricksNode
 */
const BricksNode = sh.Ashley.nodeDef({
  /**
   * @memberof module:nodes/gnodes~BricksNode
   * @property {BrickFence} fence
   */
  fence   : cobjs.BrickFence
});
/**
 * @property {BricksNode} BricksNode
 */
xbox.BricksNode = BricksNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class PaddleMotionNode
 */
const PaddleMotionNode = sh.Ashley.nodeDef({
  /**
   * @memberof module:nodes/gnodes~PaddleMotionNode
   * @property {Velocity} velocity
   * @static
   */
  velocity    : cobjs.Velocity,
  /**
   * @memberof module:nodes/gnodes~PaddleMotionNode
   * @property {Motion} motion
   * @static
   */
  motion      : cobjs.Motion,
  /**
   * @memberof module:nodes/gnodes~PaddleMotionNode
   * @property {Paddle} paddle
   * @static
   */
  paddle      : cobjs.Paddle
});
/**
 * @property {PaddleMotionNode} PaddleMotionNode
 */
xbox.PaddleMotionNode = PaddleMotionNode;

//////////////////////////////////////////////////////////////////////////////
const BallMotionNode = sh.Ashley.nodeDef({
  /**
   * @memberof module:nodes/gnodes~BallMotionNode
   * @property {Velocity} velocity
   * @static
   */
  velocity    : cobjs.Velocity,
  /**
   * @memberof module:nodes/gnodes~BallMotionNode
   * @property {Ball} ball
   * @static
   */
  ball        : cobjs.Ball
});
/**
 * @property {BallMotionNode} BallMotionNode
 */
xbox.BallMotionNode = BallMotionNode;



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

