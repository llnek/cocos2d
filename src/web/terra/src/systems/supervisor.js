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

/**
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xpool
 * @module zotohlab/p/s/supervisor
 */
define("zotohlab/p/s/supervisor",

       ['zotohlab/p/elements',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xpool'],

  function (cobjs, utils, gnodes, sh, ccsx, XPool) { "use strict";

    /** @alias module:zotohlab/p/s/supervisor */
    let exports = {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    /**
     * class GameSupervisor
     */
    GameSupervisor = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
        this.inited=false;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.ships=null;
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      /**
       * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
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
          frame = cc.spriteFrameCache.getSpriteFrame(str);
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

        sh.pools.BackTiles= new XPool();
        sh.pools.BackSkies= new XPool();

        sh.pools.Missiles = new XPool();
        sh.pools.Baddies = new XPool();
        sh.pools.Bombs= new XPool();

        sh.pools.Explosions= new XPool();
        sh.pools.Sparks= new XPool();
        sh.pools.HitEffects= new XPool();

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
      }

    });

    /**
     * @memberof module:zotohlab/p/s/supervisor~GameSupervisor
     * @property {Number} Priority
     */
    GameSupervisor.Priority = sh.ftypes.PreUpdate;

    exports = GameSupervisor;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

