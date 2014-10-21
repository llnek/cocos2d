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

define("zotohlab/p/sysobjs", ['zotohlab/p/components',
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

    return {

      Priorities: Priorities,
      Factory: EntityFactory,
      GameSupervisor: Supervisor,
      NetworkSystem: NetworkSystem,
      SelectionSystem: SelectionSystem,
      TurnBaseSystem: TurnBaseSystem,
      ResolutionSystem: ResolutionSystem,
      RenderSystem: RenderSystem,
      SystemUtils: utils

    };


});

//////////////////////////////////////////////////////////////////////////////
//EOF

