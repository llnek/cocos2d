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
 * @requires zotohlab/asterix
 * @module zotohlab/p/gnodes
 */
define("zotohlab/p/gnodes",

       ['zotohlab/p/components',
        'zotohlab/asterix'],

  function (cobjs, sh) { "use strict";

    /** @alias module:zotohlab/p/gnodes */
    var exports= {},
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BoardNode
     */
    var BoardNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~BoardNode
       * @property {UISelection} selection
       * @static
       */
      selection: cobjs.UISelection,
      /**
       * @memberof module:zotohlab/p/gnodes~BoardNode
       * @property {Board} board
       * @static
       */
      board: cobjs.Board,
      /**
       * @memberof module:zotohlab/p/gnodes~BoardNode
       * @property {SmartAlgo} robot
       * @static
       */
      robot: cobjs.SmartAlgo,
      /**
       * @memberof module:zotohlab/p/gnodes~BoardNode
       * @property {Grid} grid
       * @static
       */
      grid: cobjs.Grid,
      /**
       * @memberof module:zotohlab/p/gnodes~BoardNode
       * @property {GridView} view
       * @static
       */
      view: cobjs.GridView
    });
    /**
     * @property {BoardNode} BoardNode
     * @static
     */
    exports.BoardNode = BoardNode;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class GUINode
     */
    var GUINode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~GUINode
       * @property {UISelection} selection
       * @static
       */
      selection: cobjs.UISelection,
      /**
       * @memberof module:zotohlab/p/gnodes~GUINode
       * @property {GridView} view
       * @static
       */
      view: cobjs.GridView
    });
    /**
     * @property {GUINode} GUINode
     * @static
     */
    exports.GUINode = GUINode;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class NetPlayNode
     */
    var NetPlayNode = sh.Ashley.nodeDef({
      /**
       * @memberof module:zotohlab/p/gnodes~NetPlayNode
       * @property {NetPlay} playcmd
       * @static
       */
      playcmd: cobjs.NetPlay,
      /**
       * @memberof module:zotohlab/p/gnodes~Grid
       * @property {Grid} grid
       * @static
       */
      grid: cobjs.Grid
    });
    /**
     * @property {NetPlayNode} NetPlayNode
     * @static
     */
    exports.NetPlayNode = NetPlayNode;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

