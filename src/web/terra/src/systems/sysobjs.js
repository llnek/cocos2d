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
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/supervisor
 * @requires zotohlab/p/levelmgr
 * @requires zotohlab/p/s/motions
 * @requires zotohlab/p/s/movemissiles
 * @requires zotohlab/p/s/movebombs
 * @requires zotohlab/p/s/moveship
 * @requires zotohlab/p/s/collisions
 * @requires zotohlab/p/s/resolution
 * @requires zotohlab/p/s/rendering
 * @module zotohlab/p/sysobjs
 */
define("zotohlab/p/sysobjs",

       ['zotohlab/p/s/utils',
        'zotohlab/p/s/factory',
        'zotohlab/p/s/supervisor',
        'zotohlab/p/levelmgr',
        'zotohlab/p/s/motions',
        'zotohlab/p/s/movemissiles',
        'zotohlab/p/s/movebombs',
        'zotohlab/p/s/moveship',
        'zotohlab/p/s/collisions',
        'zotohlab/p/s/resolution',
        'zotohlab/p/s/rendering'],

  function (Utils,
            EntityFactory,
            Supervisor,
            LevelManager,
            Motions,
            MoveMissiles,
            MoveBombs,
            MoveShip,
            Collisions,
            Resolution,
            Rendering) { "use strict";

    /** @alias module:zotohlab/p/sysobjs */
    const exports = /** @lends exports# */{

      /**
       * @property {EntityFactory}  EntityFactory
       */
      EntityFactory       : EntityFactory,
      /**
       * @property {Utils}    Utils
       */
      Utils               : Utils,
      /**
       * @property {Supervisor}   Supervisor
       */
      Supervisor          : Supervisor,
      /**
       * @property {LevelManager}   LevelManager
       */
      LevelManager        : LevelManager,
      /**
       * @property {Motions}      Motions
       */
      Motions             : Motions,
      /**
       * @property {MoveMissiles}     MoveMissiles
       */
      MoveMissiles        : MoveMissiles,
      /**
       * @property {MoveBombs}      MoveBombs
       */
      MoveBombs           : MoveBombs,
      /**
       * @property {MoveShip}     MoveShip
       */
      MoveShip            : MoveShip,
      /**
       * @property {Collisions}     Collisions
       */
      Collisions       : Collisions,
      /**
       * @property {Resolution}     Resolution
       */
      Resolution       : Resolution,
      /**
       * @property {Rendering}      Rendering
       */
      Rendering        : Rendering
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

