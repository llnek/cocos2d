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
 * @class ArenaNode
 */
xbox.ArenaNode = sh.Ashley.nodeDef({

  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {TileGrid} collision
   */
  collision   : cobjs.TileGrid,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {GridBox} gbox
   */
  gbox        : cobjs.GridBox,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {BlockGrid} blocks
   */
  blocks      : cobjs.BlockGrid,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {Motion} motion
   */
  motion      : cobjs.Motion,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {Pauser} pauser
   */
  pauser      : cobjs.Pauser,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {Dropper} dropper
   */
  dropper     : cobjs.Dropper,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {ShapeShell} shell
   */
  shell       : cobjs.ShapeShell,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {FilledLines} flines
   */
  flines      : cobjs.FilledLines,
  /**
   * @memberof module:nodes/gnodes~ArenaNode
   * @property {CtrlPad} cpad
   */
  cpad        : cobjs.CtrlPad
});


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

