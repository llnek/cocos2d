// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

define("zotohlab/p/sysobjs", ['zotohlab/p/s/priorities',
                             'zotohlab/p/s/factory',
                             'zotohlab/p/s/supervisor',
                             'zotohlab/p/levelmgr',
                             'zotohlab/p/s/motions',
                             'zotohlab/p/s/movemissiles',
                             'zotohlab/p/s/movebombs',
                             'zotohlab/p/s/moveship',
                             'zotohlab/p/s/movesky'],

  function (Priorities,
            EntityFactory,
            Supervisor,
            LevelManager,
            Motions,
            MoveMissiles,
            MoveBombs,
            MoveShip,
            MovementSky) { "use strict";

    return {

      EntityFactory       : EntityFactory,
      Priorities          : Priorities,
      Supervisor          : Supervisor,
      LevelManager        : LevelManager,
      Motions             : Motions,
      MoveMissiles        : MoveMissiles,
      MoveBombs           : MoveBombs,
      MoveShip            : MoveShip,
      MovementSky      : MovementSky

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

