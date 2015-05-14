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
 * @requires zotohlab/tictactoe/components
 * @requires zotohlab/asterix
 * @module zotohlab/tictactoe/gnodes
 */
define("zotohlab/p/gnodes",

       ['zotohlab/p/components',
        'zotohlab/asterix'],

  function (cobjs, sh) { "use strict";

    /** @alias module:zotohlab/tictactoe/gnodes */
    var exports= {},
    undef;

    //////////////////////////////////////////////////////////////////////////////
    exports.BoardNode = sh.Ashley.nodeDef({
      selection: cobjs.UISelection,
      board: cobjs.Board,
      robot: cobjs.SmartAlgo,
      grid: cobjs.Grid,
      view: cobjs.GridView
    });

    //////////////////////////////////////////////////////////////////////////////
    exports.GUINode = sh.Ashley.nodeDef({
      selection: cobjs.UISelection,
      view: cobjs.GridView
    });

    //////////////////////////////////////////////////////////////////////////////
    exports.NetPlayNode = sh.Ashley.nodeDef({
      playcmd: cobjs.NetPlay,
      grid: cobjs.Grid
    });

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

