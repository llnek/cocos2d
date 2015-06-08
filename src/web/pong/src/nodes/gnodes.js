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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires nodes/cobjs
 * @module nodes/gnodes
 */

import sh from 'zotohlab/asx/asterix';
import cobjs from 'nodes/cobjs';


/** @alias module:nodes/gnodes */
let xbox= {},
sjs= sh.skarojs,
undef;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BallNode
 */
BallNode = sh.Ashley.nodeDef({
  /**
   * @memberof module:nodes/gnodes~BallNode
   * @property {Velocity} velocity
   */
  velocity    : cobjs.Velocity,
  /**
   * @memberof module:nodes/gnodes~BallNode
   * @property {Ball} ball
   */
  ball        : cobjs.Ball
});
/**
 * @property {BallNode} BallNode
 */
xbox.BallNode = BallNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class FauxPaddleNode
 */
FauxPaddleNode = sh.Ashley.nodeDef({
  /**
   * @memberof module:nodes/gnodes~FauxPaddleNode
   * @property {Position} lastpos
   */
  lastpos   : cobjs.Position,
  /**
   * @memberof module:nodes/gnodes~FauxPaddleNode
   * @property {Paddle} paddle
   */
  paddle    : cobjs.Paddle,
  /**
   * @memberof module:nodes/gnodes~FauxPaddleNode
   * @property {Faux} faux
   */
  faux      : cobjs.Faux,
  /**
   * @memberof module:nodes/gnodes~FauxPaddleNode
   * @property {Player} player
   */
  player    : cobjs.Player
});
/**
 * @property {FauxPaddleNode} FauxPaddleNode
 */
xbox.FauxPaddleNode = FauxPaddleNode;

/**
 * @class PaddleNode
 */
PaddleNode = sh.Ashley.nodeDef({
  /**
   * @memberof module:nodes/gnodes~PaddleNode
   * @property {Position} lastpos
   */
  lastpos   : cobjs.Position,
  /**
   * @memberof module:nodes/gnodes~PaddleNode
   * @property {Motion} motion
   */
  motion    : cobjs.Motion,
  /**
   * @memberof module:nodes/gnodes~PaddleNode
   * @property {Paddle} paddle
   */
  paddle    : cobjs.Paddle,
  /**
   * @memberof module:nodes/gnodes~PaddleNode
   * @property {Player} player
   */
  player    : cobjs.Player
});
/**
 * @property {PaddleNode} PaddleNode
 */
xbox.PaddleNode = PaddleNode;




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

