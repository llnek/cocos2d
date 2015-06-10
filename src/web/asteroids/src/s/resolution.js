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
 * @requires ash-js
 * @module s/Resolution
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

/**
 * @class Resolution
 */
Resolution = sh.Ashley.sysDef({

  /**
   * @memberof module:s/resolution~Resolution
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },

  /**
   * @memberof module:s/resolution~Resolution
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
    this.ships= undef;
    this.engine=undef;
  },

  /**
   * @memberof module:s/resolution~Resolution
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.ships= engine.getNodeList(gnodes.ShipMotionNode);
    this.engine=engine;
  },

  /**
   * @memberof module:s/resolution~Resolution
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const ship = this.ships.head;

    if (this.state.running) {
      this.checkMissiles();
      this.checkLasers();
      this.checkAstros();
      this.checkShip(ship);
    }
  },

  /**
   * @method checkMissiles
   * @private
   */
  checkMissiles() {
    const world = this.state.world;
    sh.pools.Missiles.iter((m) => {
      if (m.status) {
        if (m.HP <= 0 ||
            sh.outOfBound(ccsx.bbox4(m.sprite), world)) {
        m.deflate();
      }}
    });
  },

  /**
   * @method checkLasers
   * @private
   */
  checkLasers() {
    const world = this.state.world;
    sh.pools.Lasers.iter((b) => {
      if (b.status) {
        if (b.HP <= 0 ||
            sh.outOfBound(ccsx.bbox4(b.sprite), world)) {
        b.deflate();
      }}
    });
  },

  /**
   * @method checkAstros
   * @private
   */
  checkAstros() {
    sh.pools.Astros1.iter((a) => {
      if (a.status &&
          a.HP <= 0) {
          sh.fire('/game/players/earnscore', {score: a.value});
          sh.factory.createAsteroids(a.rank +1);
          a.deflate();
        }
    });
    sh.pools.Astros2.iter((a) => {
      if (a.status &&
          a.HP <= 0) {
          sh.fire('/game/players/earnscore', {score: a.value});
          sh.factory.createAsteroids(a.rank +1);
          a.deflate();
        }
    });
    sh.pools.Astros3.iter((a) => {
      if (a.status &&
          a.HP <= 0) {
          sh.fire('/game/players/earnscore', {score: a.value});
          a.deflate();
        }
    });
  },

  /**
   * @method checkShip
   * @private
   */
  checkShip(node) {
    const ship=node.ship;

    if (ship.status && ship.HP <= 0) {
      ship.deflate();
      sh.fire('/game/players/killed');
    }
  }

});

/**
 * @memberof module:s/resolution~Resolution
 * @property {Number} Priority
 */
Resolution.Priority = xcfg.ftypes.Resolve;

/** @alias module:s/resolution */
const xbox = /** @lends xbox# */{

  /**
   * @property {Resolution} Resolution
   */
  Resolution : Resolution
};




sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

