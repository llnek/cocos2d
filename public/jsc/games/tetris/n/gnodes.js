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
 * @class ArenaNode
 */
xbox.ArenaNode = _asterix2.default.Ashley.nodeDef({

  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {TileGrid} collision
   */
  collision: _cobjs2.default.TileGrid,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {GridBox} gbox
   */
  gbox: _cobjs2.default.GridBox,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {BlockGrid} blocks
   */
  blocks: _cobjs2.default.BlockGrid,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {Motion} motion
   */
  motion: _cobjs2.default.Motion,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {Pauser} pauser
   */
  pauser: _cobjs2.default.Pauser,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {Dropper} dropper
   */
  dropper: _cobjs2.default.Dropper,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {ShapeShell} shell
   */
  shell: _cobjs2.default.ShapeShell,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {FilledLines} flines
   */
  flines: _cobjs2.default.FilledLines,
  /**
   * @memberof module:n/gnodes~ArenaNode
   * @property {CtrlPad} cpad
   */
  cpad: _cobjs2.default.CtrlPad
});

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF