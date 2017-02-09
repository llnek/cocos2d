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
 * @requires zotohlab/asx/pool
 * @module s/stager
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import xpool from 'zotohlab/asx/pool';
import cobjs from 'n/cobjs';
import utils from 's/utils';
import gnodes from 'n/gnodes';

let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/** * class Stager */
Stager = sh.Ashley.sysDef({
  /**
   * @memberof module:s/stager~Stager
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },
  /**
   * @memberof module:s/stager~Stager
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships=null;
  },
  /**
   * @memberof module:s/stager~Stager
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships = engine.getNodeList(gnodes.ShipMotionNode);
  },
  /**
   * @memberof module:s/stager~Stager
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    if (ccsx.isTransitioning()) { return false; }
    if (this.state.running &&
        !this.inited) {
      this.onceOnly();
      this.inited=true;
    }
  },
  /**
   * @method initBackSkies
   * @private
   */
  initBackSkies() {
    const bs = sh.pools.BackSkies.get();
    bs.inflate({x: 0, y: 0});
    this.state.backSkyRe = null;
    this.state.backSky = bs;
    this.state.backSkyDim = cc.size(bs.size());
  },
  /**
   * @method sharedExplosion
   * @private
   */
  sharedExplosion() {
    let animFrames = [],
    animation,
    frame;

    for (let n = 1; n < 35; ++n) {
      let str = "explosion_" + (n < 10 ? ("0" + n) : n) + ".png";
      frame = ccsx.getSprite(str);
      animFrames.push(frame);
    }
    animation = new cc.Animation(animFrames, 0.04);
    cc.animationCache.addAnimation(animation, "Explosion");
  },
  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {
    this.state.player= sh.factory.createShip();

    sh.pools.BackTiles= xpool.reify();
    sh.pools.BackSkies= xpool.reify();

    sh.pools.Missiles = xpool.reify();
    sh.pools.Baddies = xpool.reify();
    sh.pools.Bombs= xpool.reify();

    sh.pools.Explosions= xpool.reify();
    sh.pools.Sparks= xpool.reify();
    sh.pools.HitEffects= xpool.reify();

    sh.factory.createBackSkies();

    this.sharedExplosion();
    this.initBackSkies();

    sh.factory.createBackTiles();
    sh.fire('/game/backtiles');

    sh.factory.createMissiles();
    sh.factory.createBombs();
    sh.factory.createEnemies();

    sh.factory.createExplosions();
    sh.factory.createSparks();
    sh.factory.createHitEffects();

    const node = this.ships.head;
    if (!!node) {
      utils.bornShip(node.ship);
    }

    ccsx.onTouchOne(this);
    ccsx.onMouse(this);
    sh.main.pkInput();
  },
  /**
   * @method fire
   * @private
   */
  fire(t, evt) {
    if ('/touch/one/move' === t ||
        '/mouse/move' === t) {} else {
      return;
    }
    if (this.state.running &&
        !!this.ships.head) {
      let ship = this.ships.head.ship,
      pos = ship.pos(),
      wz= ccsx.vrect(),
      cur= cc.pAdd(pos, evt.delta);
      cur= cc.pClamp(cur, cc.p(0, 0),
                     cc.p(wz.width, wz.height));
      ship.setPos(cur.x, cur.y);
    }
  }

}, {

/**
 * @memberof module:s/stager~Stager
 * @property {Number} Priority
 */
Priority : xcfg.ftypes.PreUpdate
});


/** @alias module:s/stager */
const xbox = /** @lends xbox# */{
  /**
   * @property {Stager}  Stager
   */
  Stager : Stager
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

