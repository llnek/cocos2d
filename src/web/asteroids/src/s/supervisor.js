// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/pool
 * @requires n/cobjs
 * @module s/supervisor
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import xpool from 'zotohlab/asx/pool';

let xcfg = sh.xcfg,
sjs=sh.skarojs,
csts= xcfg.csts,
undef,

/**
 * @class GameSupervisor
 */
GameSupervisor = sh.Ashley.sysDef({

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
    this.inited=false;
  },

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    } else {
    }
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {

    sh.pools.Missiles = xpool.reify();
    sh.pools.Lasers = xpool.reify();

    sh.pools.Astros3 = xpool.reify();
    sh.pools.Astros2 = xpool.reify();
    sh.pools.Astros1 = xpool.reify();

    this.initAsteroidSizes();
    this.initPlayerSize();
    this.initUfoSize();

    sh.factory.createAsteroids(csts.P_AS1);
    sh.factory.createShip();


    //ccsx.onTouchOne(this.ebus);
    //ccsx.onMouse(this.ebus);
    sh.main.pkInput();
  },

  /**
   * @method initAsteroidSizes
   * @private
   */
  initAsteroidSizes() {
    this.state.astro3 = ccsx.createSprite('rock_small.png').getContentSize();
    this.state.astro2 = ccsx.createSprite('rock_med.png').getContentSize();
    this.state.astro1 = ccsx.createSprite('rock_large.png').getContentSize();
  },

  /**
   * @method initPlayerSize
   * @private
   */
  initPlayerSize() {
    this.state.playerSize = ccsx.createSprite('rship_0.png').getContentSize();
  },

  /**
   * @method initUfoSize
   * @private
   */
  initUfoSize() {
    this.state.ufoSize = ccsx.createSprite('ufo.png').getContentSize();
  }

});

/**
 * @memberof module:s/supervisor~GameSupervisor
 * @property {Number} Priority
 */
GameSupervisor.Priority = xcfg.ftypes.PreUpdate;

/** @alias module:s/supervisor */
const xbox = /** @lends xbox# */{

  /**
   * @property {GameSupervisor} GameSupervisor
   */
  GameSupervisor : GameSupervisor
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

