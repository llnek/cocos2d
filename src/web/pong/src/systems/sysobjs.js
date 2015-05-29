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
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/collision
 * @requires zotohlab/p/s/networking
 * @requires zotohlab/p/s/rendering
 * @requires zotohlab/p/s/resolution
 * @requires zotohlab/p/s/supervisor
 * @requires zotohlab/p/s/motion
 * @requires zotohlab/p/s/movements
 * @module zotohlab/p/sysobjs
 */

define("zotohlab/p/sysobjs",

       ['zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'zotohlab/p/s/factory',
        'zotohlab/p/s/collision',
        'zotohlab/p/s/networking',
        'zotohlab/p/s/rendering',
        'zotohlab/p/s/resolution',
        'zotohlab/p/s/supervisor',
        'zotohlab/p/s/motion',
        'zotohlab/p/s/movements'],

  function (cobjs, gnodes,
            EntityFactory,
            Collisions,
            Networking,
            Rendering,
            Resolution,
            Supervisor,
            Motions,
            Movements) { "use strict";

    /** @alias module:zotohlab/p/sysobjs */
    const exports= /** @lends exports# */{

      /**
       * @property {Factory} Factory
       */
      Factory     : EntityFactory,
      /**
       * @property {Collisions} Collisions
       */
      Collisions        : Collisions,
      /**
       * @property {Networking} Networking
       */
      Networking        : Networking,
      /**
       * @property {Rendering} Rendering
       */
      Rendering         : Rendering,
      /**
       * @property {Resolution} Resolution
       */
      Resolution        : Resolution,
      /**
       * @property {Supervisor} Supervisor
       */
      Supervisor        : Supervisor,
      /**
       * @property {Motions} Motions
       */
      Motions           : Motions,
      /**
       * @property {Movements} Movements
       */
      Movements         : Movements

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

