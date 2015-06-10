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
 * @requires s/utils
 * @requires n/gnodes
 * @module s/movebombs
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import utils from 's/utils';
import gnodes from 'n/gnodes';


let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R= sjs.ramda,
//////////////////////////////////////////////////////////////////////////
undef,
/**
 * @class MoveBombs
 */
MoveBombs = sh.Ashley.sysDef({
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },
  /**
   * @memberof module:s/movebombs~MoveBombs
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    if (this.state.running) {
      this.processMovement(dt);
    }
  },
  /**
   * @method moveBomb
   * @private
   */
  moveBomb(m, dt) {
    const pos = m.sprite.getPosition();
    m.sprite.setPosition(pos.x + m.vel.x * dt,
                         pos.y + m.vel.y * dt);
  },
  /**
   * @method processMovement
   * @private
   */
  processMovement(dt) {
    sh.pools.Bombs.iter((b) => {
      if (b.status) {
        this.moveBomb(b,dt);
      }
    });
  }

});

/**
 * @memberof module:s/movebombs~MoveBombs
 * @property {Number} Priority
 */
MoveBombs.Priority = xcfg.ftypes.Move;


/** @alias module:s/movebombs */
const xbox = /** @lends xbox# */{
  /**
   * @property {MoveBombs} MoveBombs
   */
  MoveBombs : MoveBombs
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

