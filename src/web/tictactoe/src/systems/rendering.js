// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/s/rendering",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/s/utils',
        'zotohlab/p/gnodes',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, utils, gnodes, sjs, sh, ccsx) { "use strict";

    var R = sjs.ramda,
    xcfg= sh.xcfg,
    csts= xcfg.csts,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    var RenderSystem = sh.Ashley.sysDef({

      constructor: function(options) {
        this.state= options;
      },

      removeFromEngine: function(engine) {
        this.board=null;
      },

      addToEngine: function(engine) {
        this.board = engine.getNodeList(gnodes.BoardNode);
      },

      update: function (dt) {
        var node = this.board.head;
        if (this.state.running &&
            !!node) {
          this.process(node);
        }
      },

      process: function(node) {
        var values= node.grid.values,
        view= node.view,
        cs= view.cells,
        z,c, offset;

        R.forEach.idx(function(v, pos) {

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

      xrefCell: function(pos, map) {
        // given a cell, find the screen co-ordinates for that cell.
        //var img2= sh.main.cache.getImage('gamelevel1.sprites.markers');
        //var delta= 0;//72;//img2.height;
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

    RenderSystem.Priority = pss.Render;
    return RenderSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

