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
 * @requires zotohlab/asterix
 * @module zotohlab/p/gnodes
 */
define("zotohlab/p/gnodes",

       ['zotohlab/p/elements',
        'zotohlab/asterix'],

  function (cobjs, sh) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    let exports= {},
    sjs= sh.skarojs,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class ArenaNode
     */
    exports.ArenaNode = sh.Ashley.nodeDef({

      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {TileGrid} collision
       */
      collision   : cobjs.TileGrid,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {GridBox} gbox
       */
      gbox        : cobjs.GridBox,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {BlockGrid} blocks
       */
      blocks      : cobjs.BlockGrid,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {Motion} motion
       */
      motion      : cobjs.Motion,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {Pauser} pauser
       */
      pauser      : cobjs.Pauser,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {Dropper} dropper
       */
      dropper     : cobjs.Dropper,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {ShapeShell} shell
       */
      shell       : cobjs.ShapeShell,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {FilledLines} flines
       */
      flines      : cobjs.FilledLines,
      /**
       * @memberof module:zotohlab/p/gnodes~ArenaNode
       * @property {CtrlPad} cpad
       */
      cpad        : cobjs.CtrlPad
    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

