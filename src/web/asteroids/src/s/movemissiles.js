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
 * @requires s/utils
 * @module s/movemissiles
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import utils from 's/utils';


let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
undef,
R= sjs.ramda,

/**
 * @class MoveMissiles
 */
MoveMissiles = sh.Ashley.sysDef({

  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },

  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },

  /**
   * @memberof module:s/movemissiles~MoveMissiles
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    let pos,
    x,y;

    sh.pools.Missiles.iter((m) => {
      if (m.status) {
        pos= m.pos();
        y = pos.y + dt * m.vel.y * m.speed;
        x = pos.x + dt * m.vel.x * m.speed;
        m.setPos(x, y);
      }
    });
  }

});

/**
 * @memberof module:s/movemissiles~MoveMissiles
 * @property {Number} Priority
 */
MoveMissiles.Priority = xcfg.ftypes.Move;

/** @alias module:s/movemissiles */
const xbox = /** @lends xbox# */{

  /**
   * @property {MoveMissiles} MoveMissiles
   */
  MoveMissiles : MoveMissiles
};





sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

