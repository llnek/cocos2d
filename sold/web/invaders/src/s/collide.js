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
 * @module s/collide
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'n/gnodes';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
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
    this.aliens= undef;
    this.ships= undef;
    this.engine=undef;
  },
  /**
   * @memberof module:s/collide~Collide
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.aliens= engine.getNodeList(gnodes.AlienMotionNode);
    this.ships= engine.getNodeList(gnodes.ShipMotionNode);
    this.engine=engine;
  },
  /**
   * @memberof module:s/collide~Collide
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const aliens= this.aliens.head,
    ship = this.ships.head;

    // 1. get rid of all colliding bombs & missiles.
    //this.checkMissilesBombs();
    // 2. kill aliens
    this.checkMissilesAliens(aliens);

    if (!!ship) {
      // 3. ship ok?
      this.checkShipBombs(ship);
      // 4. overruned by aliens ?
      if (!!aliens) {
        this.checkShipAliens(aliens, ship);
      }
    }
  },
  /**
   * @method collide
   * @private
   */
  collide(a, b) {
    return ccsx.collide0(a.sprite, b.sprite);
  },
  /**
   * @method checkMissilesBombs
   * @private
   */
  checkMissilesBombs() {
    const mss = sh.pools.Missiles,
    bbs = sh.pools.Bombs,
    me=this;

    mss.iter( m => {
      bbs.iter( b => {
        if (b.status &&
            m.status &&
            me.collide(m,b)) {
          b.hurt();
          m.hurt();
        }
      });
    });
  },
  /**
   * @method checkMissilesAliens
   * @private
   */
  checkMissilesAliens(node) {
    const mss = sh.pools.Missiles,
    sqad= node.aliens,
    me=this;

    R.forEach( en => {
      if (en.status) {
        mss.iter( m => {
          if (m.status &&
              me.collide(en,m)) {
            en.hurt();
            m.hurt();
          }
        });
      }
    }, sqad.aliens.pool);
  },
  /**
   * @method checkShipBombs
   * @private
   */
  checkShipBombs(node) {
    const bbs= sh.pools.Bombs,
    me= this,
    ship=node.ship;

    bbs.iter( b => {
      if (ship.status &&
          b.status &&
          me.collide(ship, b)) {
        ship.hurt();
        b.hurt();
      }
    });
  },
  /**
   * @method checkShipAliens
   * @private
   */
  checkShipAliens(anode,snode) {
    const sqad= anode.aliens,
    ship = snode.ship,
    me=this,
    sz= sqad.aliens.length;

    R.forEach( en => {
      if (ship.status &&
          en.status &&
          me.collide(ship, en)) {
        ship.hurt();
        en.hurt();
      }
    }, sqad.aliens.pool);
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

