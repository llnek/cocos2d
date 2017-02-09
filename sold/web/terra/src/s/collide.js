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
 * @module s/collide
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
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class Collide
 */
Collide = sh.Ashley.sysDef({
  /**
   * @memberof module:s/collide~Collide
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/collide~Collide
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },
  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships = engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @method collide
   * @private
   */
  collide(a, b) {
    return ccsx.collide0(a.sprite, b.sprite);
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.ships.head;

    if (this.state.running &&
        !!node) {

      this.checkMissilesAliens();
      this.checkShipAliens(node);
      this.checkShipBombs(node);
      //this.checkMissilesBombs();
    }

  },
  /**
   * @method checkMissilesBombs
   * @private
   */
  checkMissilesBombs() {
    const bombs = sh.pools.Bombs,
    mss = sh.pools.Missiles;
    bombs.iter((b) => {
      mss.iter((m) => {
        if (b.status &&
            m.status &&
            this.collide(b, m)) {
          m.hurt();
          b.hurt();
        }
      });
    });
  },
  /**
   * @method checkMissilesAliens
   * @private
   */
  checkMissilesAliens() {
    const enemies= sh.pools.Baddies,
    mss= sh.pools.Missiles;
    enemies.iter((en) => {
      mss.iter((b) => {
        if (en.status &&
            b.status &&
            this.collide(en, b)) {
          en.hurt();
          b.hurt();
        }
      });
    });
  },
  /**
   * @checkShipBombs
   * @private
   */
  checkShipBombs(node) {
    const bombs = sh.pools.Bombs,
    ship= node.ship;

    if (!ship.status) { return; }
    bombs.iter((b) => {
      if (b.status &&
          this.collide(b, ship)) {
        ship.hurt();
        b.hurt();
      }
    });
  },
  /**
   * @method checkShipAliens
   * @private
   */
  checkShipAliens(node) {
    const enemies= sh.pools.Baddies,
    ship= node.ship;

    if (! ship.status) { return; }
    enemies.iter((en) => {
      if (en.status &&
          this.collide(en, ship)) {
        ship.hurt();
        en.hurt();
      }
    });
  }

}, {

/**
 * @memberof module:s/collide~Collide
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Collide
});


/** @alias module:s/collide */
const xbox = /** @lends xbox# */{
  /**
   * @property {Collide} Collide
   */
  Collide : Collide
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

