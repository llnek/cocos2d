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
 * @requires zotohlab/asx/ccsx
 * @requires n/cobjs
 * @requires n/gnodes
 * @requires s/utils
 * @module s/move
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import gnodes from 'n/gnodes';
import utils from 's/utils';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class Move
 */
Move = sh.Ashley.sysDef({
  /**
   * @memberof module:s/move~Move
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state = options;
  },
  /**
   * @memberof module:s/move~Move
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.arena=null;
  },
  /**
   * @memberof module:s/move~Move
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.arena = engine.getNodeList(gnodes.ArenaNode);
  },
  /**
   * @memberof module:s/move~Move
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node= this.arena.head;
    if (this.state.running &&
       !!node) {

      if (ccsx.timerDone(node.dropper.timer) &&
          !!node.shell.shape) {
        node.dropper.timer= ccsx.undoTimer(node.dropper.timer);
        this.doFall(sh.main, node);
      }

    }
  },
  /**
   * @method doFall
   * @private
   */
  doFall(layer, node) {
    const cmap= node.collision.tiles,
    shape= node.shell.shape,
    emap= node.blocks.grid,
    pu= node.pauser,
    dp= node.dropper;

    if (!!shape) {
      if (! utils.moveDown(layer, cmap, shape)) {

        // lock shape in place
        utils.lock(node, shape);

        // what is this???
        if (! pu.timer) {
          node.shell.shape= null;
          shape.bricks=[];
        }

        node.shell.shape= null;
        shape.bricks=[];

      } else {
        utils.initDropper(layer, dp);
      }
    }
  }

}, {
/**
 * @memberof module:s/move~Move
 * @property {Number} Priority
 */
Priority: xcfg.ftypes.Move
});


/** @alias module:s/move */
const xbox = /** @lends xbox# */{
  /**
   * @property {Move} Move
   */
  Move : Move
};
sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

