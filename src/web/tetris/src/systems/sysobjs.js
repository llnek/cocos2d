// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/sysobjs", ['zotohlab/p/components',
                             'zotohlab/p/gnodes',
                             'zotohlab/p/s/utils',
                             'zotohlab/p/s/priorities',
                             'zotohlab/p/s/factory',
                             'zotohlab/p/s/clearance',
                             'zotohlab/p/s/generator',
                             'zotohlab/p/s/motioncontrol',
                             'zotohlab/p/s/movement',
                             'zotohlab/p/s/rendering',
                             'zotohlab/p/s/resolution',
                             'zotohlab/p/s/supervisor'],

  function (cobjs, gnodes, utils,
            Priorities,
            EntityFactory,
            RowClearance,
            Generator,
            MotionControl,
            Movements,
            Rendering,
            Resolution,
            Supervisor) { "use strict";

    return {

      Priorities      : Priorities,
      Factory   : EntityFactory,
      RowClearance    : RowClearance,
      Generator       : Generator,
      MotionControl   : MotionControl,
      Movements       : Movements,
      Rendering       : Rendering,
      Resolution      : Resolution,
      Supervisor      : Supervisor

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

