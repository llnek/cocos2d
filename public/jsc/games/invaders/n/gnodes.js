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
 * @class AlienMotionNode
 */
var AlienMotionNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~AlienMotionNode
   * @property {AlienSquad} aliens
   */
  aliens: _cobjs2.default.AlienSquad,
  /**
   * @memberof module:n/gnodes~AlienMotionNode
   * @property {Looper} looper
   */
  looper: _cobjs2.default.Looper
});
/**
 * @property {AlienMotionNode} AlienMotionNode
 */
xbox.AlienMotionNode = AlienMotionNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class CannonCtrlNode
 */
var CannonCtrlNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~CannonCtrlNode
   * @property {Looper} looper
   */
  looper: _cobjs2.default.Looper,
  /**
   * @memberof module:n/gnodes~CannonCtrlNode
   * @property {Cannon} cannon
   */
  cannon: _cobjs2.default.Cannon,
  /**
   * @memberof module:n/gnodes~CannonCtrlNode
   * @property {Ship} ship
   */
  ship: _cobjs2.default.Ship
});
/**
 * @property {CannonCtrlNode} CannonCtrlNode
 */
xbox.CannonCtrlNode = CannonCtrlNode;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class ShipMotionNode
 */
var ShipMotionNode = _asterix2.default.Ashley.nodeDef({
  /**
   * @memberof module:n/gnodes~ShipMotionNode
   * @property {Velocity} velocity
   */
  velocity: _cobjs2.default.Velocity,
  /**
   * @memberof module:n/gnodes~ShipMotionNode
   * @property {Motion} motion
   */
  motion: _cobjs2.default.Motion,
  /**
   * @memberof module:n/gnodes~ShipMotionNode
   * @property {Ship} ship
   */
  ship: _cobjs2.default.Ship
});
/**
 * @property {ShipMotionNode} ShipMotionNode
 */
xbox.ShipMotionNode = ShipMotionNode;

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF