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

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/factory',
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

  function (Priorities, EntityFactory, SystemUtils,
            Supervisor, Motions, MovementAliens,
            MovementBombs,
            MovementMissiles,
            MovementShip,
            CannonControl,
            CollisionSystem,
            Resolution) { "use strict";

    /** @alias module:zotohlab/p/sysobjs */
    var exports= {};

    exports= {

      /**
       * @property {Priorities} Priorities
       * @static
       */
      Priorities          : Priorities,
      /**
       * @property {EntityFactory} EntityFactory
       * @static
       */
      Factory       : EntityFactory,
      /**
       * @property {SystemUtils} SystemUtils
       * @static
       */
      SystemUtils         : SystemUtils,
      /**
       * @property {Supervisor} Supervisor
       * @static
       */
      Supervisor          : Supervisor,
      /**
       * @property {Motions} Motions
       * @static
       */
      Motions             : Motions,
      /**
       * @property {MovementAliens} MovementAliens
       * @static
       */
      MovementAliens      : MovementAliens,
      /**
       * @property {MovementBombs} MovementBombs
       * @static
       */
      MovementBombs       : MovementBombs,
      /**
       * @property {MovementMissiles} MovementMissiles
       * @static
       */
      MovementMissiles    : MovementMissiles,
      /**
       * @property {MovemenyShip} MovemenyShip
       * @static
       */
      MovementShip        : MovementShip,
      /**
       * @property {CannonControl} CannonControl
       * @static
       */
      CannonControl       : CannonControl,
      /**
       * @property {CollisionSystem} CollisionSystem
       * @static
       */
      CollisionSystem     : CollisionSystem,
      /**
       * @property {Resolution} Resolution
       * @static
       */
      Resolution          : Resolution

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

