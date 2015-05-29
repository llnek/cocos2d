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
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/uiselect
 */
define("zotohlab/p/s/uiselect",

       ['zotohlab/p/gnodes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (gnodes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/uiselect */
    let exports = {},
    sjs= sh.skarojs,
    xcfg= sh.xcfg,
    csts = xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class SelectionSystem
     */
    SelectionSystem = sh.Ashley.sysDef({
      /**
       * @memberof module:zotohlab/p/s/uiselect~SelectionSystem
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.events= options.selQ;
        this.state= options;
      },
      /**
       * @memberof module:zotohlab/p/s/uiselect~SelectionSystem
       * @method removefromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.gui=null;
      },
      /**
       * @memberof module:zotohlab/p/s/uiselect~SelectionSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.gui = engine.getNodeList(gnodes.GUINode);
      },
      /**
       * @memberof module:zotohlab/p/s/uiselect~SelectionSystem
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        if (this.events.length > 0) {
          const evt = this.events.shift(),
          node= this.gui.head;
          if (this.state.running &&
              !!node) {
            this.process(node, evt);
          }
          this.events.length=0;
        }
      },
      /**
       * @method process
       * @private
       */
      process(node, evt) {
        let sel = node.selection,
        map = node.view.gridMap,
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
        for (let n=0; n < sz; ++n) {
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
     * @memberof module:zotohlab/p/s/uiselect~SelectionSystem
     * @property {Number} Priority
     */
    SelectionSystem.Priority= sh.ftypes.Move;
    exports= SelectionSystem;
    return exports;
});


//////////////////////////////////////////////////////////////////////////////
//EOF






