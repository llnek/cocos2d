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
 * @requires zotohlab/asx/pool
 * @requires nodes/cobjs
 * @requires s/utils
 * @module s/supervisor
 */

import cobjs from 'nodes/cobjs';
import utils from 's/utils';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import xpool from 'zotohlab/asx/pool';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
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
   * @method initAlienSize
   */
  initAlienSize() {
    //pick purple since it is the largest
    this.state.alienSize= ccsx.createSpriteFrame('purple_bug_0.png').getContentSize();
  },
  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method initShipSize
   */
  initShipSize() {
    this.state.shipSize= ccsx.createSpriteFrame( 'ship_0.png').getContentSize();
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
    }
  },
  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {
    sh.pools.Missiles = xpool.reify();
    sh.pools.Bombs = xpool.reify();
    sh.pools.Explosions = xpool.reify();

    this.initAlienSize();
    this.initShipSize();

    sh.factory.createMissiles();
    sh.factory.createBombs();
    sh.factory.createExplosions();

    sh.factory.createAliens();
    sh.factory.createShip();
  }

});

/**
 * @memberof module:s/supervisor~GameSupervisor
 * @property {Number} Priority
 */
GameSupervisor.Priority= xcfg.ftypes.PreUpdate;

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
