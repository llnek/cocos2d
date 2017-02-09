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
 * @module s/moveastros
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';


let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
R = sjs.ramda,
undef,

/**
 * @class MoveAsteroids
 */
MoveAsteroids = sh.Ashley.sysDef({

  /**
   * @memberof module:s/movestros~MoveAsteroids
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },

  /**
   * @memberof module:s/movestros~MoveAsteroids
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/movestros~MoveAsteroids
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },

  /**
   * @memberof module:s/movestros~MoveAsteroids
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const me=this;
    sh.pools.Astros3.iter((a) => {
      if (a.status) { me.process(a, dt); }
    });
    sh.pools.Astros2.iter((a) => {
      if (a.status) { me.process(a, dt); }
    });
    sh.pools.Astros1.iter((a) => {
      if (a.status) { me.process(a, dt); }
    });
  },

  /**
   * @method process
   * @private
   */
  process(astro, dt) {
    let rot= astro.rotation,
    B = this.state.world,
    velo= astro.vel,
    sp= astro.sprite,
    sz= sp.getContentSize(),
    pos= sp.getPosition(),
    r,x,y;

    x = pos.x + dt * velo.x;
    y = pos.y + dt * velo.y;

    rot += 0.1;
    if (rot > 360) { rot -= 360; }

    astro.rotation= rot;
    sp.setRotation(rot);
    sp.setPosition(x,y);

    //wrap?
    r= ccsx.bbox4(sp);

    if (r.bottom > B.top) {
      if (velo.y > 0) {
        y = B.bottom - sz.height;
      }
    }

    if (r.top < B.bottom) {
      if (velo.y < 0) {
        y = B.top + sz.height;
      }
    }

    if (r.left > B.right) {
      if (velo.x > 0) {
        x = B.left - sz.width;
      }
    }

    if (r.right < B.left) {
      if (velo.x < 0) {
        x = B.right + sz.width;
      }
    }

    sp.setPosition(x,y);
  }

});

/**
 * @memberof module:s/movestros~MoveAsteroids
 * @property {Number} Priority
 */
MoveAsteroids.Priority = xcfg.ftypes.Move;

/** @alias module:s/movestros */
const xbox = /** @lends xbox# */{

  /**
   * @property {MoveAsteroids} MoveAsteroids
   */
  MoveAsteroids : MoveAsteroids
};





sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

