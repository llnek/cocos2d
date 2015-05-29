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
 * @requires zotohlab/asx/negamax
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/p/c/board
 *
 * @module zotohlab/p/elements
 */
define("zotohlab/p/elements",

       ['zotohlab/asx/negamax',
        'zotohlab/p/s/utils',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/p/c/board'],

  function (negax, utils, sh, ccsx, GameBoard) { "use strict";

    /** @alias module:zotohlab/p/elements */
    let exports= {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class SmartAlgo
     */
    const SmartAlgo = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~SmartAlgo
       * @method constructor
       * @param {GameBoard} board
       */
      constructor(board) {
        this.algo= new negax.NegaMax(board);
      }
    });
    /**
     * @property {Constructor} SmartAlgo
     * @static
     */
    exports.SmartAlgo = SmartAlgo;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Board
     */
    const Board = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~Board
       * @method constructor
       * @param {Number} size
       * @param {Array} goals
       */
      constructor(size, goals) {
        this.GOALSPACE= goals;
        this.size=size;
      }
    });
    /**
     * @property {Constructor} Board
     * @static
     */
    exports.Board = Board;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Grid
     */
    const Grid = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~Grid
       * @method constructor
       * @param {Number} size
       * @param {Array} seed
       */
      constructor(size,seed) {
        this.values= sjs.makeArray(size * size, csts.CV_Z);
        this.size=size;
      }
    });
    /**
     * @property {Constructor} Grid
     * @static
     */
    exports.Grid = Grid;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class GridView
     */
    const GridView = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~GridView
       * @method constructor
       * @param {Number} size
       * @param {cc.Layer} layer
       */
      constructor(size, layer) {
        const sp = ccsx.createSpriteFrame('z.png'),
        sz= sp.getContentSize();
        this.cells= sjs.makeArray(size * size, null);
        this.layer= layer;
        this.width= sz.width;
        this.height= sz.height;
        this.url= "";
        this.gridMap= utils.mapGridPos();
      }
    });
    /**
     * @property {Constructor} GridView
     * @static
     */
    exports.GridView = GridView;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class NetPlay
     */
    const NetPlay = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~NetPlay
       * @method constructor
       */
      constructor() {
        this.event= null;
      }
    });
    /**
     * @property {Constructor} NetPlay
     * @static
     */
    exports.NetPlay = NetPlay;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Player
     */
    const Player = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~Player
       * @method constructor
       * @param {Number} category
       * @param {Number} value
       * @param {Number} id
       * @param {Number} color
       */
      constructor(category,value,id,color) {
        this.color= color;
        this.pnum=id;
        this.category= category;
        this.value= value;
        this.offset = id === 1 ? 0 : 1;
      }
    });
    /**
     * @property {Constructor} Player
     * @static
     */
    exports.Player = Player;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class UISelection
     */
    const UISelection = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/elements~UISelection
       * @method constructor
       */
      constructor() {
        this.cell = -1;
        this.px = -1;
        this.py = -1;
      }
    });
    /**
     * @property {Constructor} UISelection
     * @static
     */
    exports.UISelection = UISelection;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

