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
 * @requires n/gnodes
 * @module s/factory
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import gnodes from 'n/gnodes';


let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////////
/** * @class EntityFactory */
EntityFactory = sh.Ashley.casDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Object} options
   */
  constructor(engine, options) {
    this.state = options;
    this.engine=engine;
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method createMissiles
   * @param {Number} count
   */
  createMissiles(count) {
    sh.pools.Missiles.preSet(() => {
      const sp = ccsx.createSprite('laserGreen.png');
      sp.setVisible(false);
      sh.main.addAtlasItem('game-pics', sp);
      return new cobjs.Missile(sp);
    }, count || 36);
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method createLasers
   * @param {Number} count
   */
  createLasers(count) {
    sh.pools.Lasers.preSet(() => {
      const sp = ccsx.createSprite('laserRed.png');
      sp.setVisible(false);
      sh.main.addAtlasItem('game-pics', sp);
      return new cobjs.Laser(sp);
    }, count || 36);
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method createShip
   */
  createShip() {
    let ent= sh.Ashley.newEntity(),
    deg = 90,//sjs.randPercent() * 360;
    sp= ccsx.createSprite('rship_0.png');

    sp.setRotation(deg);
    sh.main.addAtlasItem('game-pics', sp);

    sp= new cobjs.Ship(sp,['rship_0.png','rship_1.png']);
    this.state.ship= sp;
    this.bornShip();

    ent.add(sp);

    ent.add(new cobjs.Velocity(0,0,150,150));
    ent.add(new cobjs.Motion());
    ent.add(new cobjs.Looper(1));
    ent.add(new cobjs.Cannon());
    ent.add(new cobjs.Thrust(25));
    ent.add(new cobjs.Rotation(deg));
    this.engine.addEntity(ent);
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method bornShip
   */
  bornShip() {
    let h = this.state.playerSize.height,
    w = this.state.playerSize.width,
    B= this.state.world,
    wz = ccsx.vrect(),
    cw = ccsx.center(),
    test=true,
    sp,aa,x,y,r;

    while (test) {
      r= { left: sjs.rand(wz.width),
           top: sjs.rand(wz.height) };
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) &&
          !sh.outOfBound(r,B)) {
        x = r.left + w * 0.5;
        y = r.top - h * 0.5;
        test=false;
      }
    }

    this.state.ship.inflate({ x: x, y: y });
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method createAsteroids
   * @param {Number} rank
   */
  createAsteroids(rank) {
    let cfg = sh.main.getLCfg(),
    B= this.state.world,
    pool,
    ht = this.state.astro1.height,
    wd = this.state.astro1.width;

    switch (rank) {
      case csts.P_AS1: pool = sh.pools.Astros1; break;
      case csts.P_AS2: pool = sh.pools.Astros2; break;
      case csts.P_AS3: pool = sh.pools.Astros3; break;

      default: return;
    }

    sjs.loggr.debug('about to create more asteroids - ' + rank);

    pool.preSet( pl => {
      let wz = ccsx.vrect(),
      cw = ccsx.center(),
      sp, x, y,
      deg, r, n=0;
      while (n < cfg[rank][0]) {
        r= { left: sjs.rand(wz.width),
             top: sjs.rand(wz.height) };
        r.bottom = r.top - ht;
        r.right = r.left + wd;
        if ( !sh.outOfBound(r,B)) {
          deg = sjs.rand(360);
          x = r.left + wd/2;
          y = r.top - ht/2;
          sp= ccsx.createSprite(cfg[rank][1]);
          sp.setRotation(deg);
          sh.main.addAtlasItem('game-pics', sp);

          sp= new cobjs.Asteroid(sp, cfg[rank][2], rank,
                                 deg,
                                 20 * sjs.randSign(),
                                 20 * sjs.randSign());
          sp.inflate({x :x, y: y});
          pl.push(sp);
          ++n;
        }
      }
    },1);

    sjs.loggr.debug('CREATED more asteroids - ' + rank);
  },
  /**
   * @private
   */
  maybeOverlap(ship) {
    let rc= R.any( z => {
      return z.status ? sh.isIntersect(ship, ccsx.bbox4(z.sprite)) : false;
    }, sh.pools.Astros1.pool);
    if (rc) { return true; }

    rc= R.any( z => {
      return z.status ? sh.isIntersect(ship, ccsx.bbox4(z.sprite)) : false;
    }, sh.pools.Astros2.pool);
    if (rc) { return true; }

    rc= R.any( z => {
      return z.status ? sh.isIntersect(ship, ccsx.bbox4(z.sprite)) : false;
    }, sh.pools.Astros3.pool);
    if (rc) { return true; }

    return false;
  }

});


/** @alias module:s/factory */
const xbox = /** @lends xbox# */{

  /**
   * @property {EntityFactory} EntityFactory
   */
  EntityFactory : EntityFactory
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

