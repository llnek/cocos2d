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
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/resolution
 */
define('zotohlab/p/s/resolution',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/elements',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, cobjs, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/resolution */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    /**
     * @class Resolution
     */
    Resolution = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.ships=null;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.ships = engine.getNodeList(gnodes.ShipMotionNode);
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
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
       * @private
       */
      checkMissiles() {
        let box= sh.main.getEnclosureBox(),
        me=this,
        pos;

        sh.pools.Missiles.iter((m) => {
          if (m.status) {
            pos= m.sprite.getPosition();
            if (m.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              me.onBulletDeath(m);
              m.deflate();
            }
          }
        });
      },

      /**
       * @private
       */
      checkBombs() {
        let box= sh.main.getEnclosureBox(),
        me=this,
        pos;

        sh.pools.Bombs.iter((b) => {
          if (b.status) {
            pos= b.sprite.getPosition();
            if (b.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              me.onBulletDeath(b);
              b.deflate();
            }
          }
        });
      },

      /**
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
       * @private
       */
      checkAliens() {
        let box= sh.main.getEnclosureBox(),
        me=this,
        pos;

        sh.pools.Baddies.iter((a) => {
          if (a.status) {
            pos= a.sprite.getPosition();
            if (a.HP <= 0 ||
                !ccsx.pointInBox(box, pos)) {
              me.onEnemyDeath(a);
              a.deflate();
              sh.fire('/game/players/earnscore', { score: a.value });
            }
          }
        });
      },

      /**
       * @private
       */
      checkShip(node) {
        const ship = node.ship,
        me=this;

        if (ship.status) {
          if (ship.HP <= 0) {
            me.onShipDeath(ship);
            ship.deflate();
            sh.fire('/game/players/killed');
          }
        }
      }

    });

    /**
     * @memberof module:zotohlab/p/s/resolution~Resolution
     * @property {Number} Priority
     */
    Resolution.Priority = pss.Resolve;

    exports=Resolution;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

