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
 * @requires zotohlab/p/s/priorities
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/gnodes
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/rendering
 */
define("zotohlab/p/s/rendering",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/rendering */
    var exports= {},
    R = sjs.ramda,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class RenderSystem
     */
    var RenderSystem = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/rendering~RenderSystem
       * @method constructor
       * @param {Object} options
       */
      constructor: function(options) {
        this.state= options;
      },

      /**
       * @memberof module:zotohlab/p/s/rendering~RenderSystem
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine: function(engine) {
        this.board={};
      },

      /**
       * @memberof module:zotohlab/p/s/rendering~RenderSystem
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine: function(engine) {
        this.board = engine.getNodeList(gnodes.BoardNode);
      },

      /**
       * @memberof module:zotohlab/p/s/rendering~RenderSystem
       * @method update
       * @param {Number} dt
       */
      update: function (dt) {
        var node = this.board.head;
        if (this.state.running &&
            !!node) {
          this.process(node);
        }
      },

      /**
       * @private
       */
      process: function(node) {
        var values= node.grid.values,
        view= node.view,
        cs= view.cells,
        z,c, offset;

        R.forEachIndexed(function(v, pos) {

          if (v !== csts.CV_Z) {
            c= this.xrefCell(pos, view.gridMap);
            if (!!c) {
              z=cs[pos];
              if (!!z) {
                sh.main.removeAtlasItem('markers', z[0]);
              }
              cs[pos] = [utils.drawSymbol(view, c[0], c[1], v),
                         c[0], c[1], v];
            }
          }

        }.bind(this), values);

      },

      /**
       * Given a cell, find the screen co-ordinates for that cell.
       * @private
       */
      xrefCell: function(pos, map) {
        var gg, x, y,
        delta=0;

        if (pos >= 0 && pos < csts.CELLS) {
          gg = map[pos];
          x = gg.left + (gg.right - gg.left  - delta) * 0.5;
          y = gg.top - (gg.top - gg.bottom - delta ) * 0.5;
          // the cell's center
          return [x, y];
        } else {
          return null;
        }
      }

    });

    /**
     * @memberof module:zotohlab/p/s/rendering~RenderSystem
     * @property {Number} Priority
     * @static
     */
    RenderSystem.Priority = pss.Render;

    exports= RenderSystem;
    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

