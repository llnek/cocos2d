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
 * @requires nodes/cobjs
 * @requires nodes/gnodes
 * @requires s/utils
 * @module s/movement
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'nodes/cobjs';
import gnodes from 'nodes/gnodes';
import utils from 's/utils';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MovementSystem
 */
MovementSystem = sh.Ashley.sysDef({
  /**
   * @memberof module:s/movement~MovementSystem
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state = options;
  },
  /**
   * @memberof module:s/movement~MovementSystem
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.arena=null;
  },
  /**
   * @memberof module:s/movement~MovementSystem
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.arena = engine.getNodeList(gnodes.ArenaNode);
  },
  /**
   * @memberof module:s/movement~MovementSystem
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node= this.arena.head;
    if (this.state.running &&
       !!node) {

      if (ccsx.timerDone(node.dropper.timer) &&
          !!node.shell.shape) {
        node.dropper.timer= ccsx.releaseTimer(node.dropper.timer);
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

});

/**
 * @memberof module:s/movement~MovementSystem
 * @property {Number} Priority
 */
MovementSystem.Priority= xcfg.ftypes.Move;

/** @alias module:s/movement */
const xbox = /** @lends xbox# */{
  /**
   * @property {MovementSystem} MovementSystem
   */
  MovementSystem : MovementSystem
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF
