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
 * @module s/resolve
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
 * @class Resolve
 */
Resolve = sh.Ashley.sysDef({
  /**
   * @memberof module:s/resolve~Resolve
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/resolve~Resolve
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },
  /**
   * @memberof module:s/resolve~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships = engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @memberof module:s/resolve~Resolve
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.ships.head;

    if (this.state.running &&
       !!node) {

      this.checkMissiles();
      this.checkBombs();
      this.checkAliens();
      this.checkShip(node);
    }
  },
  /**
   * @method onBulletDeath
   * @private
   */
  onBulletDeath(b) {
    let pe= sh.pools.HitEffects,
    pos= b.pos(),
    e= pe.get();

    if (!e) {
      sh.factory.createHitEffects();
      e= pe.get();
    }
    e.inflate({x : pos.x, y: pos.y});
  },
  /**
   * @method checkMissiles
   * @private
   */
  checkMissiles() {
    let box= sh.main.getEnclosureBox(),
    pos;

    sh.pools.Missiles.iter((m) => {
      if (m.status) {
        pos= m.sprite.getPosition();
        if (m.HP <= 0 ||
            !ccsx.pointInBox(box, pos)) {
          this.onBulletDeath(m);
          m.deflate();
        }
      }
    });
  },
  /**
   * @method checkBombs
   * @private
   */
  checkBombs() {
    let box= sh.main.getEnclosureBox(),
    pos;

    sh.pools.Bombs.iter((b) => {
      if (b.status) {
        pos= b.sprite.getPosition();
        if (b.HP <= 0 ||
            !ccsx.pointInBox(box, pos)) {
          this.onBulletDeath(b);
          b.deflate();
        }
      }
    });
  },
  /**
   * @method onEnemyDeath
   * @private
   */
  onEnemyDeath(alien) {
    let pe= sh.pools.Explosions,
    ps= sh.pools.Sparks,
    pos= alien.pos(),
    e= pe.get(),
    s= ps.get();
    if (!e) {
      sh.factory.createExplosions();
      e= pe.get();
    }
    e.inflate({x : pos.x, y: pos.y});
    if (!s) {
      sh.factory.createSparks();
      s=ps.get();
    }
    s.inflate({x : pos.x, y: pos.y});
    sh.sfxPlay('explodeEffect');
  },
  /**
   * @method onShipDeath
   * @private
   */
  onShipDeath(ship) {
    let pe= sh.pools.Explosions,
    pos= ship.pos(),
    e= pe.get();

    if (!e) {
      sh.factory.createExplosions();
      e= pe.get();
    }
    e.inflate({x : pos.x, y: pos.y});
    sh.sfxPlay('shipDestroyEffect');
  },
  /**
   * @method checkAliens
   * @private
   */
  checkAliens() {
    let box= sh.main.getEnclosureBox(),
    pos;

    sh.pools.Baddies.iter((a) => {
      if (a.status) {
        pos= a.sprite.getPosition();
        if (a.HP <= 0 ||
            !ccsx.pointInBox(box, pos)) {
          this.onEnemyDeath(a);
          a.deflate();
          sh.fire('/game/players/earnscore', { score: a.value });
        }
      }
    });
  },
  /**
   * @method checkShip
   * @private
   */
  checkShip(node) {
    const ship = node.ship;
    if (ship.status) {
      if (ship.HP <= 0) {
        this.onShipDeath(ship);
        ship.deflate();
        sh.fire('/game/players/killed');
      }
    }
  }

}, {

/**
 * @memberof module:s/resolve~Resolve
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.Resolve
});


/** @alias module:s/resolve */
const xbox = /** @lends xbox# */{
  /**
   * @property {Resolve} Resolve
   */
  Resolve : Resolve
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

