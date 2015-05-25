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
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/collisions
 */
define('zotohlab/p/s/collisions',

       ['zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/collisions */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class CollisionSystem
     */
    CollisionSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.ships= undef;
        this.engine=undef;
      },

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/collisions~CollisionSystem
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const ship = this.ships.head;

        if (this.state.running) {

          this.checkMissilesRocks();

          if (!!ship) {
            this.checkShipBombs(ship);
            this.checkShipRocks(ship);
          }
        }

      },

      /**
       * @method collide
       * @private
       */
      collide(a,b) {
        return ccsx.collide0(a.sprite, b.sprite);
      },

      /**
       * @method checkMissilesRocks
       * @private
       */
      checkMissilesRocks() {
        const me=this;
        sh.pools.Missiles.iter((m) => {
          if (m.status && m.HP > 0) {
            sh.pools.Astros3.iter((a) => {
              if (a.status && me.collide(m,a)) {
                m.hurt();
                a.hurt();
              }
            });
          }
          if (m.status && m.HP > 0) {
            sh.pools.Astros2.iter((a) => {
              if (a.status && me.collide(m,a)) {
                m.hurt();
                a.hurt();
              }
            });
          }
          if (m.status && m.HP > 0) {
            sh.pools.Astros1.iter((a) => {
              if (a.status && me.collide(m,a)) {
                m.hurt();
                a.hurt();
              }
            });
          }
        });
      },

      /**
       * @method checkShipBombs
       * @private
       */
      checkShipBombs(node) {
        const ship = node.ship,
        me=this;
        sh.pools.Lasers.iter((b) => {
          if (b.status &&
              ship.status &&
              me.collide(b,ship)) {
            ship.hurt();
            b.hurt();
          }
        });
      },

      /**
       * @method checkShipRocks
       * @private
       */
      checkShipRocks(node) {
        const ship = node.ship,
        me=this;

        if (ship.status && ship.HP > 0) {
          sh.pools.Astros3.iter((a) => {
            if (a.status && me.collide(ship,a)) {
              ship.hurt();
              a.hurt();
            }
          });
        }
        if (ship.status && ship.HP > 0) {
          sh.pools.Astros2.iter((a) => {
            if (a.status && me.collide(ship,a)) {
              ship.hurt();
              a.hurt();
            }
          });
        }
        if (ship.status && ship.HP > 0) {
          sh.pools.Astros1.iter((a) => {
            if (a.status && me.collide(ship,a)) {
              ship.hurt();
              a.hurt();
            }
          });
        }
      }

    });

    /**
     * @memberof module:zotohlab/p/s/collisions~CollisionSystem
     * @property {Number} Priority
     */
    CollisionSystem.Priority = sh.ftypes.Collision;

    exports= CollisionSystem;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

