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
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @module zotohlab/p/gnodes
 */
define("zotohlab/p/gnodes",

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix'],

  function (cobjs, sjs, sh) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    var exports= {},
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ArenaNode
     */
    exports.ArenaNode = sh.Ashley.nodeDef({

      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {TileGrid} collision
       * @static
       */
      collision   : cobjs.TileGrid,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {GridBox} gbox
       * @static
       */
      gbox        : cobjs.GridBox,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {BlockGrid} blocks
       * @static
       */
      blocks      : cobjs.BlockGrid,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {Motion} motion
       * @static
       */
      motion      : cobjs.Motion,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {Pauser} pauser
       * @static
       */
      pauser      : cobjs.Pauser,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {Dropper} dropper
       * @static
       */
      dropper     : cobjs.Dropper,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {ShapeShell} shell
       * @static
       */
      shell       : cobjs.ShapeShell,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {FilledLines} flines
       * @static
       */
      flines      : cobjs.FilledLines,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {CtrlPad} cpad
       * @static
       */
      cpad        : cobjs.CtrlPad
    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

