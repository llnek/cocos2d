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
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/factory
 * @requires zotohlab/p/s/clearance
 * @requires zotohlab/p/s/generator
 * @requires zotohlab/p/s/motioncontrol
 * @requires zotohlab/p/s/movement
 * @requires zotohlab/p/s/rendering
 * @requires zotohlab/p/s/resolution
 * @requires zotohlab/p/s/supervisor
 * @module zotohlab/p/sysobjs
 */
define("zotohlab/p/sysobjs",

       ['zotohlab/p/elements',
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

    /** @alias module:zotohlab/p/sysobjs */
    var exports= {};

    exports= {

      /**
       * @property {Priorities} Priorities
       * @static
       */
      Priorities      : Priorities,
      /**
       * @property {Factory} EntityFactory
       * @static
       */
      Factory   : EntityFactory,
      /**
       * @property {RowClearance} RowClearance
       * @static
       */
      RowClearance    : RowClearance,
      /**
       * @property {Generator} Generator
       * @static
       */
      Generator       : Generator,
      /**
       * @property {MotionControl} MotionControl
       * @static
       */
      MotionControl   : MotionControl,
      /**
       * @property {Movements} Movements
       * @static
       */
      Movements       : Movements,
      /**
       * @property {Rendering} Rendering
       * @static
       */
      Rendering       : Rendering,
      /**
       * @property {Resolution} Resolution
       * @static
       */
      Resolution      : Resolution,
      /**
       * @property {Supervisor} Supervisor
       * @static
       */
      Supervisor      : Supervisor

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

