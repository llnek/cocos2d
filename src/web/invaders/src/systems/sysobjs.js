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
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/s/supervisor
 * @requires zotohlab/p/s/motions
 * @requires zotohlab/p/s/movealiens
 * @requires zotohlab/p/s/movebombs
 * @requires zotohlab/p/s/movemissiles
 * @requires zotohlab/p/s/moveship
 * @requires zotohlab/p/s/cannon
 * @requires zotohlab/p/s/collisions
 * @requires zotohlab/p/s/resolution
 * @module zotohlab/p/sysobjs
 */
define("zotohlab/p/sysobjs",

       ['zotohlab/p/s/factory',
        'zotohlab/p/s/utils',
        'zotohlab/p/s/supervisor',
        'zotohlab/p/s/motions',
        'zotohlab/p/s/movealiens',
        'zotohlab/p/s/movebombs',
        'zotohlab/p/s/movemissiles',
        'zotohlab/p/s/moveship',
        'zotohlab/p/s/cannon',
        'zotohlab/p/s/collisions',
        'zotohlab/p/s/resolution'],

  function (EntityFactory, SystemUtils,
            Supervisor, Motions, MovementAliens,
            MovementBombs,
            MovementMissiles,
            MovementShip,
            CannonControl,
            CollisionSystem,
            Resolution) { "use strict";

    /** @alias module:zotohlab/p/sysobjs */
    let exports= {};

    exports= /** @lends exports# */{

      /**
       * @property {EntityFactory} EntityFactory
       */
      Factory       : EntityFactory,
      /**
       * @property {SystemUtils} SystemUtils
       */
      SystemUtils         : SystemUtils,
      /**
       * @property {Supervisor} Supervisor
       */
      Supervisor          : Supervisor,
      /**
       * @property {Motions} Motions
       */
      Motions             : Motions,
      /**
       * @property {MovementAliens} MovementAliens
       */
      MovementAliens      : MovementAliens,
      /**
       * @property {MovementBombs} MovementBombs
       */
      MovementBombs       : MovementBombs,
      /**
       * @property {MovementMissiles} MovementMissiles
       */
      MovementMissiles    : MovementMissiles,
      /**
       * @property {MovemenyShip} MovemenyShip
       */
      MovementShip        : MovementShip,
      /**
       * @property {CannonControl} CannonControl
       */
      CannonControl       : CannonControl,
      /**
       * @property {CollisionSystem} CollisionSystem
       */
      CollisionSystem     : CollisionSystem,
      /**
       * @property {Resolution} Resolution
       */
      Resolution          : Resolution

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

