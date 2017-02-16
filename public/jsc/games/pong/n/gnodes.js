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
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class BallNode
 */
var BallNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~BallNode
   * @property {Velocity} velocity
   */
  velocity: _cobjs2.default.Velocity,
  /**
   * @memberof module:n/gnodes~BallNode
   * @property {Ball} ball
   */
  ball: _cobjs2.default.Ball
});
/**
 * @property {BallNode} BallNode
 */
xbox.BallNode = BallNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class FauxPaddleNode
 */
var FauxPaddleNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~FauxPaddleNode
   * @property {Position} lastpos
   */
  lastpos: _cobjs2.default.Position,
  /**
   * @memberof module:n/gnodes~FauxPaddleNode
   * @property {Paddle} paddle
   */
  paddle: _cobjs2.default.Paddle,
  /**
   * @memberof module:n/gnodes~FauxPaddleNode
   * @property {Faux} faux
   */
  faux: _cobjs2.default.Faux,
  /**
   * @memberof module:n/gnodes~FauxPaddleNode
   * @property {Player} player
   */
  player: _cobjs2.default.Player
});
/**
 * @property {FauxPaddleNode} FauxPaddleNode
 */
xbox.FauxPaddleNode = FauxPaddleNode;

/**
 * @class PaddleNode
 */
var PaddleNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~PaddleNode
   * @property {Position} lastpos
   */
  lastpos: _cobjs2.default.Position,
  /**
   * @memberof module:n/gnodes~PaddleNode
   * @property {Motion} motion
   */
  motion: _cobjs2.default.Motion,
  /**
   * @memberof module:n/gnodes~PaddleNode
   * @property {Paddle} paddle
   */
  paddle: _cobjs2.default.Paddle,
  /**
   * @memberof module:n/gnodes~PaddleNode
   * @property {Player} player
   */
  player: _cobjs2.default.Player
});
/**
 * @property {PaddleNode} PaddleNode
 */
xbox.PaddleNode = PaddleNode;

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF