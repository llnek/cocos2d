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

define("zotohlab/p/sysobjs", ['zotohlab/p/components',
                             'zotohlab/p/gnodes',
                             'zotohlab/p/s/priorities',
                             'zotohlab/p/s/factory',
                             'zotohlab/p/s/collision',
                             'zotohlab/p/s/networking',
                             'zotohlab/p/s/rendering',
                             'zotohlab/p/s/resolution',
                             'zotohlab/p/s/supervisor',
                             'zotohlab/p/s/motion',
                             'zotohlab/p/s/movements'],

  function (cobjs, gnodes,
            Priorities,
            EntityFactory,
            Collisions,
            Networking,
            Rendering,
            Resolution,
            Supervisor,
            Motions,
            Movements) { "use strict";

    return {

      Priorities        : Priorities,
      Factory     : EntityFactory,
      Collisions        : Collisions,
      Networking        : Networking,
      Rendering         : Rendering,
      Resolution        : Resolution,
      Supervisor        : Supervisor,
      Motions           : Motions,
      Movements         : Movements

    };


});

//////////////////////////////////////////////////////////////////////////////
//EOF

