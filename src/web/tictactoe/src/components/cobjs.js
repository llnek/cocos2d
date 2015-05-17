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
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/negamax
 * @requires zotohlab/p/c/board
 *
 * @module zotohlab/p/components
 */
define("zotohlab/p/components",

       ['zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/negamax',
        'zotohlab/p/c/board'],

  function (utils, sjs, sh, ccsx, negax, GameBoard) { "use strict";

    /** @alias module:zotohlab/p/components */
    var exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class SmartAlgo
     */
    var SmartAlgo = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~SmartAlgo
       * @method constructor
       * @param {GameBoard} board
       */
      constructor: function(board) {
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
    var Board = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~Board
       * @method constructor
       * @param {Number} size
       * @param {Array} goals
       */
      constructor: function(size, goals) {
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
    var Grid = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~Grid
       * @method constructor
       * @param {Number} size
       * @param {Array} seed
       */
      constructor: function(size,seed) {
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
    var GridView = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~GridView
       * @method constructor
       * @param {Number} size
       * @param {cc.Layer} layer
       */
      constructor: function(size, layer) {
        var sp = ccsx.createSpriteFrame('z.png'),
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
    var NetPlay = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~NetPlay
       * @method constructor
       */
      constructor: function() {
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
    var Player = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~Player
       * @method constructor
       * @param {Number} category
       * @param {Number} value
       * @param {Number} id
       * @param {Number} color
       */
      constructor: function(category,value,id,color) {
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
    var UISelection = sh.Ashley.casDef({
      /**
       * @memberof module:zotohlab/p/components~UISelection
       * @method constructor
       */
      constructor: function() {
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

