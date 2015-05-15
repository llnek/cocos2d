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
 * @requires zotohlab/tictactoe/priorities
 * @requires zotohlab/tictactoe/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/tictactoe/uiselect
 */
define("zotohlab/p/s/uiselect",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/tictactoe/uiselect */
    var exports = {},
    xcfg= sh.xcfg,
    csts = xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class SelectionSystem
     */
    var SelectionSystem = sh.Ashley.sysDef({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/tictactoe/uiselect~SelectionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.events= options.selQ;
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/tictactoe/uiselect~SelectionSystem
       * @method removefromEngine
       * @param {Engine} engine
       */
      removeFromEngine: function(engine) {
        this.gui=null;
      },

      /**
       * @memberof module:zotohlab/tictactoe/uiselect~SelectionSystem
       * @method addToEngine
       * @param {Engine} engine
       */
      addToEngine: function(engine) {
        this.gui = engine.getNodeList(gnodes.GUINode);
      },

      /**
       * @memberof module:zotohlab/tictactoe/uiselect~SelectionSystem
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        if (this.events.length > 0) {
          var evt = this.events.shift(),
          node= this.gui.head;
          if (this.state.running &&
              !!node) {
            this.process(node, evt);
          }
          this.events.length=0;
        }
      },

      /**
       * @private
       */
      process: function(node, evt) {
        var sel = node.selection,
        map = node.view.gridMap,
        n,
        rect,
        sz= map.length;

        //set the mouse/touch position
        sel.px = evt.x;
        sel.py = evt.y;
        sel.cell= -1;

        if (this.state.actor === 0) {
          return;
        }

        //which cell did he click on?
        for (n=0; n < sz; ++n) {
          rect = map[n];
          if (sel.px >= rect.left && sel.px <= rect.right &&
              sel.py >= rect.bottom && sel.py <= rect.top) {
            sel.cell= n;
            break;
          }
        }
      }

    });

    /**
     * @memberof module:zotohlab/tictactoe/uiselect~SelectionSystem
     * @static
     * @property {Number} Priority
     * @final
     */
    SelectionSystem.Priority= pss.Movement;

    /**
     * @property {SelectionSystem.Class} SelectionSystem
     * @final
     */
    exports.SelectionSystem = SelectionSystem;
    return exports;
});


//////////////////////////////////////////////////////////////////////////////
//EOF






