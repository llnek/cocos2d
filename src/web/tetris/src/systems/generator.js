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

define("zotohlab/p/s/generator", ["zotohlab/p/s/utils",
                                 'zotohlab/p/cobjs',
                                 'cherimoia/skarojs',
                                 'zotohlab/asterix',
                                 'zotohlab/asx/xcfg',
                                 'zotohlab/asx/ccsx',
                                 'ash-js'],

  function (utils, gnodes, sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var csts = xcfg.csts,
    undef,
    ShapeGenerator = Ash.System.extend({

      constructor: function(options) {
        this.state = options;
      },

      removeFromEngine: function(engine) {
        this.nodeList=null;
      },

      addToEngine: function(engine) {
        this.nodeList= engine.getNodeList(gnodes.ArenaNode);
        this.nextShapeInfo= this.randNext();
        this.nextShape=null;
      },

      update: function (dt) {
        var node = this.nodeList.head,
        dp,
        sl;
        if (this.state.running &&
           !!node) {
          dp = node.dropper;
          sl = node.shell;
          if (sl.shape) {}
          else {
            sl.shape = this.reifyNextShape(node);
            if (!!sl.shape) {
              //show new next shape in preview window
              this.previewNextShape();
              //activate drop timer
              dp.dropSpeed= csts.DROPSPEED;
              utils.initDropper(sh.main, dp);
            } else {
              return false;
            }
          }
        }
      },

      reifyNextShape: function(node) {
        var shape= new cobjs.Shape(5 * csts.TILE,
                                   ccsx.screen().height - csts.FIELD_TOP * csts.TILE,
                                   this.nextShapeInfo);
        shape= utils.reifyShape(sh.main, node.collision.tiles, shape);
        if (!!shape) {} else {
          sjs.loggr.debug("game over.  you lose.");
          sh.fireEvent('/game/hud/end');
        }

        return shape;
      },

      previewNextShape: function() {
        var info = this.randNext(),
        wz = ccsx.screen(),
        cw = ccsx.center(),
        shape,
        sz = info.model.dim * csts.TILE,

        left = (csts.FIELD_W + 2) * csts.TILE,
        x = left + (wz.width - left - csts.TILE) * 0.5,
        y = cw.y;

        x -= sz * 0.5;
        y += sz * 0.5;

        utils.disposeShape(this.nextShape);
        this.nextShape= null;
        shape= new cobjs.Shape(x,y, info);
        this.nextShapeInfo= info;
        this.nextShape= utils.previewShape(sh.main, shape);
      },

      randNext: function() {
        var n= sjs.rand( cobjs.Shapes.length),
        proto= cobjs.Shapes[n];

        return {
          png: sjs.rand(csts.BLOCK_COLORS) + 1,
          rot: sjs.rand(proto.layout.length),
          model: proto
        };
      }

    });

    return ShapeGenerator;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

