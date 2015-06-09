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
 * @requires nodes/gnodes
 * @module s/movepaddle
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'nodes/gnodes';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MovementPaddle
 */
MovementPaddle = sh.Ashley.sysDef({
  /**
   * @memberof module:s/movepaddle~MovementPaddle
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/movepaddle~MovementPaddle
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.paddleMotions = undef;
  },
  /**
   * @memberof module:s/movepaddle~MovementPaddle
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.paddleMotions = engine.getNodeList(gnodes.PaddleMotionNode)
  },
  /**
   * @memberof module:s/movepaddle~MovementPaddle
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node=this.paddleMotions.head;

    if (this.state.running &&
       !!node) {
      this.processPaddleMotions(node,dt);
    }
  },
  /**
   * @method processPaddleMotions
   * @private
   */
  processPaddleMotions(node,dt) {
    let motion = node.motion,
    sv = node.velocity,
    pad= node.paddle,
    pos = pad.sprite.getPosition(),
    x= pos.x,
    y= pos.y;

    if (motion.right) {
      x = pos.x + dt * sv.vel.x;
    }

    if (motion.left) {
      x = pos.x - dt * sv.vel.x;
    }

    pad.sprite.setPosition(x,y);
    this.clamp(pad);

    motion.right=false;
    motion.left=false;
  },
  /**
   * @method clamp
   * @private
   */
  clamp(pad) {
    const sz= pad.sprite.getContentSize(),
    pos= pad.sprite.getPosition(),
    wz = ccsx.vrect();

    if (ccsx.getRight(pad.sprite) > wz.width - csts.TILE) {
      pad.sprite.setPosition(wz.width - csts.TILE - sh.hw(sz), pos.y);
    }
    if (ccsx.getLeft(pad.sprite) < csts.TILE) {
      pad.sprite.setPosition( csts.TILE + sh.hw(sz), pos.y);
    }
  }

});

/**
 * @memberof module:s/movepaddle~MovementPaddle
 * @property {Number} Priority
 */
MovementPaddle.Priority= xcfg.ftypes.Move;


/** @alias module:s/movepaddle */
const xbox= /** @lends xbox# */{

  /**
   * @property {MovementPaddle} MovementPaddle
   */
  MovementPaddle : MovementPaddle
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

