// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

define("zotohlab/p/s/rendering", ['zotohlab/p/s/utils',
                                 'zotohlab/p/gnodes',
                                 'cherimoia/skarojs',
                                 'zotohlab/asterix',
                                 'zotohlab/asx/ccsx'],

  function (utils, gnodes, sjs, sh, ccsx) { "use strict";

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
        c, offset;

        R.forEach.idx(function(v, pos) {

          if (!sjs.echt(cs[pos]) &&
              v !== csts.CV_Z) {
            c= this.xrefCell(pos, view.gridMap);
            offset= v === csts.CV_X ? 0 : 1;
            if (!!c) {
              cs[pos] = [utils.drawSymbol(view, c[0], c[1], offset),
                         c[0], c[1], offset, v];
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
          x = gg[0] + (gg[2] - gg[0]  - delta) / 2;
          y = gg[1] - (gg[1] - gg[3] - delta ) / 2;
          // the cell's center
          return [x, y];
        } else {
          return null;
        }
      }


    });


    return RenderSystem;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

