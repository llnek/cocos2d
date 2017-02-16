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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires n/cobjs
              * @module n/gnodes
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @alias module:n/gnodes */
var xbox = {},
    sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BricksNode
 */
var BricksNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~BricksNode
   * @property {BrickFence} fence
   */
  fence: _cobjs2.default.BrickFence
});
/**
 * @property {BricksNode} BricksNode
 */
xbox.BricksNode = BricksNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class PaddleMotionNode
 */
var PaddleMotionNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~PaddleMotionNode
   * @property {Velocity} velocity
   * @static
   */
  velocity: _cobjs2.default.Velocity,
  /**
   * @memberof module:n/gnodes~PaddleMotionNode
   * @property {Motion} motion
   * @static
   */
  motion: _cobjs2.default.Motion,
  /**
   * @memberof module:n/gnodes~PaddleMotionNode
   * @property {Paddle} paddle
   * @static
   */
  paddle: _cobjs2.default.Paddle
});
/**
 * @property {PaddleMotionNode} PaddleMotionNode
 */
xbox.PaddleMotionNode = PaddleMotionNode;

//////////////////////////////////////////////////////////////////////////////
var BallMotionNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~BallMotionNode
   * @property {Velocity} velocity
   * @static
   */
  velocity: _cobjs2.default.Velocity,
  /**
   * @memberof module:n/gnodes~BallMotionNode
   * @property {Ball} ball
   * @static
   */
  ball: _cobjs2.default.Ball
});
/**
 * @property {BallMotionNode} BallMotionNode
 */
xbox.BallMotionNode = BallMotionNode;

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF