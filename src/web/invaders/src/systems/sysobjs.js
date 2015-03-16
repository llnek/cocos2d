// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define("zotohlab/p/sysobjs", ['zotohlab/p/s/priorities',
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

    return {

      Priorities          : Priorities,
      Factory       : EntityFactory,
      SystemUtils         : SystemUtils,
      Supervisor          : Supervisor,
      Motions             : Motions,
      MovementAliens      : MovementAliens,
      MovementBombs       : MovementBombs,
      MovementMissiles    : MovementMissiles,
      MovementShip        : MovementShip,
      CannonControl       : CannonControl,
      CollisionSystem     : CollisionSystem,
      Resolution          : Resolution

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

