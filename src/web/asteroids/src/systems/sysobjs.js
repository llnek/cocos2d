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
    var exports = {
      /**
       * @property {SystemUtils}   SystemUtils
       * @static
       */
      SystemUtils     : SystemUtils,
      /**
       * @property {Priorities}      Priorities
       * @static
       */
      Priorities      : Priorities,
      /**
       * @property {EntityFactory} Factory
       * @static
       */
      Factory   : EntityFactory,
      /**
       * @property {Collisions} Collisions
       * @static
       */
      Collisions      : Collisions,
      /**
       * @property {MissileControl}  MissileControl
       * @static
       */
      MissileControl  : MissileControl,
      /**
       * @property {Motions}  Motions
       * @static
       */
      Motions         : Motions,
      /**
       * @property {MoveAsteroids}  MoveAsteroids
       * @static
       */
      MoveAsteroids   : MoveAsteroids,
      /**
       * @property {MoveLasers}   MoveLasers
       * @static
       */
      MoveLasers      : MoveLasers,
      /**
       * @property {MoveMissiles}   MoveMissiles
       * @static
       */
      MoveMissiles    : MoveMissiles,
      /**
       * @property {MovementShip}   MovementShip
       * @static
       */
      MovementShip    : MovementShip,
      /**
       * @property {Supervisor}   Supervisor
       * @static
       */
      Supervisor      : Supervisor,
      /**
       * @property {Resolution}   Resolution
       * @static
       */
      Resolution      : Resolution
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF




