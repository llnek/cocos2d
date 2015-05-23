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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/resolution
 */
define('zotohlab/p/s/resolution',

       ['zotohlab/p/s/priorities',
        'zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, cobjs, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/resolution */
    let exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
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
        this.aliens= undef;
        this.ships= undef;
        this.engine=undef;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.aliens= engine.getNodeList(gnodes.AlienMotionNode);
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        const aliens= this.aliens.head,
        ship = this.ships.head;

        this.checkMissiles();
        this.checkBombs();
        this.checkAliens(aliens);
        this.checkShip(ship);
      },

      /**
       * @private
       */
      checkMissiles() {
        const mss = sh.pools.Missiles,
        ht = ccsx.screenHeight(),
        me=this;

        mss.iter((m) => {
          if (m.status) {
            if (m.pos().y >= ht ||
                m.HP <= 0) {
              m.deflate();
            }
          }
        });
      },

      /**
       * @private
       */
      checkBombs() {
        const bbs = sh.pools.Bombs,
        bt = 0,
        me=this;

        bbs.iter((b) => {
          if (b.status) {
            if (b.pos().y <= bt ||
                b.HP <= 0) {
              b.deflate();
            }
          }
        });
      },

      /**
       * @private
       */
      checkAliens(node) {
        const sqad= node.aliens,
        me=this;

        R.forEach((en) => {
          if (en.status) {
            if (en.HP <= 0) {
              sh.fire('/game/players/earnscore', {
                score: en.value });
              en.deflate();
            }
          }
        }, sqad.aliens.pool);
      },

      /**
       * @private
       */
      checkShip(node) {
        const ship = node.ship;

        if (ship.status &&
            ship.HP <= 0) {
          ship.deflate();
          sh.fire('/game/players/killed');
        }
      }

    });

    /**
     * @memberof module:zotohlab/p/s/resolution~Resolution
     * @property {Number} Priority
     */
    Resolution.Priority= pss.Resolve;

    exports= Resolution;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

