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
 * @requires zotohlab/p/components
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/network
 * @requires zotohlab/p/s/rendering
 * @requires zotohlab/p/s/resolution
 * @requires zotohlab/p/s/supervisor
 * @requires zotohlab/p/s/turnbase
 * @requires zotohlab/p/s/uiselect
 * @module zotohlab/p/sysobjs
 */
define("zotohlab/p/sysobjs",

       ['zotohlab/p/components',
        'zotohlab/p/gnodes',
        'zotohlab/p/s/utils',
        'zotohlab/p/s/priorities',
        'zotohlab/p/s/factory',
        'zotohlab/p/s/network',
        'zotohlab/p/s/rendering',
        'zotohlab/p/s/resolution',
        'zotohlab/p/s/supervisor',
        'zotohlab/p/s/turnbase',
        'zotohlab/p/s/uiselect'],

  function (cobjs, gnodes, utils,
            Priorities,
            EntityFactory,
            NetworkSystem,
            RenderSystem,
            ResolutionSystem,
            Supervisor,
            TurnBaseSystem,
            SelectionSystem) { "use strict";

    /** @alias module:zotohlab/p/sysobjs */
    var exports= {

      /**
       * @property {Priorities} Priorities
       * @static
       */
      Priorities: Priorities,
      /**
       * @property {Factory} Factory
       * @static
       */
      Factory: EntityFactory,
      /**
       * @property {GameSupervisor} GameSupervisor
       * @static
       */
      GameSupervisor: Supervisor,
      /**
       * @property {NetworkSystem} NetworkSystem
       * @static
       */
      NetworkSystem: NetworkSystem,
      /**
       * @property {SelectionSystem} SelectionSystem
       * @static
       */
      SelectionSystem: SelectionSystem,
      /**
       * @property {TurnBaseSystem} TurnBaseSystem
       * @static
       */
      TurnBaseSystem: TurnBaseSystem,
      /**
       * @property {ResolutionSystem} ResolutionSystem
       * @static
       */
      ResolutionSystem: ResolutionSystem,
      /**
       * @property {RenderSystem} RenderSystem
       * @static
       */
      RenderSystem: RenderSystem,
      /**
       * @property {SystemUtils} SystemUtils
       * @static
       */
      SystemUtils: utils

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

