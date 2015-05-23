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
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/collisions
 * @requires zotohlab/p/s/missilecontrol
 * @requires zotohlab/p/s/motions
 * @requires zotohlab/p/s/moveasteroids
 * @requires zotohlab/p/s/movelasers
 * @requires zotohlab/p/s/movemissiles
 * @requires zotohlab/p/s/moveship
 * @requires zotohlab/p/s/supervisor
 * @requires zotohlab/p/s/resolution
 * @module zotohlab/p/sysobjs
 */
define('zotohlab/p/sysobjs',

       ['zotohlab/p/s/utils',
        'zotohlab/p/s/priorities',
        'zotohlab/p/s/factory',
        'zotohlab/p/s/collisions',
        'zotohlab/p/s/missilecontrol',
        'zotohlab/p/s/motions',
        'zotohlab/p/s/moveasteroids',
        'zotohlab/p/s/movelasers',
        'zotohlab/p/s/movemissiles',
        'zotohlab/p/s/moveship',
        'zotohlab/p/s/supervisor',
        'zotohlab/p/s/resolution'],

  function(SystemUtils, Priorities, EntityFactory,
           Collisions, MissileControl, Motions,
           MoveAsteroids, MoveLasers, MoveMissiles,
           MovementShip, Supervisor, Resolution) {

    /** @alias module:zotohlab/p/sysobjs */
    const exports = /** @lends exports# */{
      /**
       * @property {SystemUtils}   SystemUtils
       */
      SystemUtils     : SystemUtils,
      /**
       * @property {Priorities}      Priorities
       */
      Priorities      : Priorities,
      /**
       * @property {EntityFactory} Factory
       */
      Factory   : EntityFactory,
      /**
       * @property {Collisions} Collisions
       */
      Collisions      : Collisions,
      /**
       * @property {MissileControl}  MissileControl
       */
      MissileControl  : MissileControl,
      /**
       * @property {Motions}  Motions
       */
      Motions         : Motions,
      /**
       * @property {MoveAsteroids}  MoveAsteroids
       */
      MoveAsteroids   : MoveAsteroids,
      /**
       * @property {MoveLasers}   MoveLasers
       */
      MoveLasers      : MoveLasers,
      /**
       * @property {MoveMissiles}   MoveMissiles
       */
      MoveMissiles    : MoveMissiles,
      /**
       * @property {MovementShip}   MovementShip
       */
      MovementShip    : MovementShip,
      /**
       * @property {Supervisor}   Supervisor
       */
      Supervisor      : Supervisor,
      /**
       * @property {Resolution}   Resolution
       */
      Resolution      : Resolution
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF




