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
 * @requires zotohlab/p/s/collisions
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/motions
 * @requires zotohlab/p/s/moveball
 * @requires zotohlab/p/s/movepaddle
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/supervisor
 * @module zotohlab/p/sysobjs
 */
define('zotohlab/p/sysobjs',

       ['zotohlab/p/s/collisions',
        'zotohlab/p/s/factory',
        'zotohlab/p/s/motions',
        'zotohlab/p/s/moveball',
        'zotohlab/p/s/movepaddle',
        'zotohlab/p/s/priorities',
        'zotohlab/p/s/supervisor'],

  function(Collisions, EntityFactory, Motions, MovementBall,
           MovementPaddle, Priorities, Supervisor) { "use strict";

    /** @alias module:zotohlab/p/sysobjs */
    const exports= {

      /**
       * @property {Collisions} Collisions
       */
      Collisions        : Collisions,
      /**
       * @property {EntityFactory} Factory
       */
      Factory     : EntityFactory,
      /**
       * @property {Motions} Motions
       */
      Motions           : Motions,
      /**
       * @property {MovementBall} MovementBall
       */
      MovementBall      : MovementBall,
      /**
       * @property {MovementPaddle} MovementPaddle
       */
      MovementPaddle    : MovementPaddle,
      /**
       * @property {Priorities} Priorities
       */
      Priorities        : Priorities,
      /**
       * @property {Supervisor} Supervisor
       */
      Supervisor        : Supervisor

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

