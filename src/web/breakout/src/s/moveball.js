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
 * @requires n/gnodes
 * @module s/moveball
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'n/gnodes';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class MovementBall
 */
MovementBall = sh.Ashley.sysDef({
  /**
   * @memberof module:s/moveball~MovementBall
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/moveball~MovementBall
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ballMotions = undef;
  },
  /**
   * @memberof module:s/moveball~MovementBall
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ballMotions = engine.getNodeList( gnodes.BallMotionNode)
  },
  /**
   * @memberof module:s/moveball~MovementBall
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node=this.ballMotions.head;

    if (this.state.running &&
       !!node) {
      this.processBallMotions(node, dt);
    }
  },
  /**
   * @method processBallMotions
   * @private
   */
  processBallMotions(node, dt) {
    let v = node.velocity,
    b= node.ball,
    rc,
    pos= b.sprite.getPosition(),
    rect= ccsx.bbox(b.sprite);

    rect.x = pos.x;
    rect.y = pos.y;

    rc=ccsx.traceEnclosure(dt,this.state.world,
                           rect,
                           v.vel);
    if (rc.hit) {
      v.vel.x = rc.vx;
      v.vel.y = rc.vy;
    } else {
    }
    b.sprite.setPosition(rc.x,rc.y);
  }

});

/**
 * @memberof module:s/moveball~MovementBall
 * @property {Number} Priority
 */
MovementBall.Priority = xcfg.ftypes.Move;

/** @alias module:s/moveball */
const xbox = /** @lends xbox# */{
  /**
   * @property {MovementBall} MovementBall
   */
  MovementBall : MovementBall
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

