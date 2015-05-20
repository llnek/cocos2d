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
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires ash-js
 * @module zotohlab/p/s/Resolution
 */
define('zotohlab/p/s/resolution',

       ['zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'ash-js'],

  function (cobjs, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/resolution */
    var exports = {},
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
      constructor: function(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.ships= undef;
        this.engine=undef;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.ships= engine.getNodeList(gnodes.ShipMotionNode);
        this.engine=engine;
      },

      /**
       * @memberof module:zotohlab/p/s/resolution~Resolution
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var ship = this.ships.head;

        if (this.state.running) {
          this.checkMissiles();
          this.checkLasers();
          this.checkAstros();
          this.checkShip(ship);
        }
      },

      /**
       * @private
       */
      checkMissiles: function() {
        var world = this.state.world;
        sh.pools.Missiles.iter(function(m) {
          if (m.status) {
            if (m.HP <= 0 ||
                sh.outOfBound(ccsx.bbox4(m.sprite), world)) {
            m.deflate();
          }}
        });
      },

      /**
       * @private
       */
      checkLasers: function() {
        var world = this.state.world;
        sh.pools.Lasers.iter(function(b) {
          if (b.status) {
            if (b.HP <= 0 ||
                sh.outOfBound(ccsx.bbox4(b.sprite), world)) {
            b.deflate();
          }}
        });
      },

      /**
       * @private
       */
      checkAstros: function() {
        sh.pools.Astros1.iter(function(a) {
          if (a.status &&
              a.HP <= 0) {
              sh.fire('/game/players/earnscore', {score: a.value});
              sh.factory.createAsteroids(a.rank +1);
              a.deflate();
            }
        });
        sh.pools.Astros2.iter(function(a) {
          if (a.status &&
              a.HP <= 0) {
              sh.fire('/game/players/earnscore', {score: a.value});
              sh.factory.createAsteroids(a.rank +1);
              a.deflate();
            }
        });
        sh.pools.Astros3.iter(function(a) {
          if (a.status &&
              a.HP <= 0) {
              sh.fire('/game/players/earnscore', {score: a.value});
              a.deflate();
            }
        });
      },

      /**
       * @private
       */
      checkShip: function(node) {
        var ship=node.ship;

        if (ship.status && ship.HP <= 0) {
          ship.deflate();
          sh.fire('/game/players/killed');
        }
      }

    });

    exports= Resolution;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

