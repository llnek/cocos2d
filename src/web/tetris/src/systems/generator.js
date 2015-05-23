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
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/gnodes
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/generator
 */
define("zotohlab/p/s/generator",

       ['zotohlab/p/s/priorities',
        'zotohlab/p/elements',
        'zotohlab/p/gnodes',
        'zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (pss, cobjs, gnodes, utils, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/generator */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,

    /**
     * @class ShapeGenerator
     */
    ShapeGenerator = sh.Ashley.sysDef({

      /**
       * @memberof module:zotohlab/p/s/generator~ShapeGenerator
       * @method constructor
       * @param {Object} options
       */
      constructor(options) {
        this.state = options;
      },

      /**
       * @memberof module:zotohlab/p/s/generator~ShapeGenerator
       * @method removeFromEngine
       * @param {Ash.Engine} engine
       */
      removeFromEngine(engine) {
        this.arena=null;
      },

      /**
       * @memberof module:zotohlab/p/s/generator~ShapeGenerator
       * @method addToEngine
       * @param {Ash.Engine} engine
       */
      addToEngine(engine) {
        this.arena= engine.getNodeList(gnodes.ArenaNode);
        this.nextShapeInfo= this.randNext();
        this.nextShape=null;
      },

      /**
       * @memberof module:zotohlab/p/s/generator~ShapeGenerator
       * @method update
       * @param {Number} dt
       */
      update(dt) {
        let node = this.arena.head,
        dp, sl;

        if (this.state.running &&
           !!node) {
          dp = node.dropper;
          sl = node.shell;
          if (sl.shape) {}
          else {
            sl.shape = this.reifyNextShape(node, sh.main);
            if (!!sl.shape) {
              //show new next shape in preview window
              this.previewNextShape(node, sh.main);
              //activate drop timer
              dp.dropSpeed= csts.DROPSPEED;
              utils.initDropper(sh.main, dp);
            } else {
              return false;
            }
          }
        }
      },

      /**
       * @private
       */
      reifyNextShape(node, layer) {
        let gbox= node.gbox,
        wz= ccsx.vrect(),
        shape= new cobjs.Shape(gbox.box.left + 5 * csts.TILE,
                               gbox.box.top - csts.TILE,
                               this.nextShapeInfo);
        shape= utils.reifyShape(layer, node.collision.tiles, shape);
        if (!!shape) {} else {
          //sh.main.removeAtlasAll('game-pics');
          node.blocks.grid=[];
          /*
          R.forEach(function(g) {
            R.forEach(function(z) {
              if (!!z && !!z.sprite) {
                sh.main.removeAtlasItem('game-pics',z.sprite);
              }
            },g);
          },
          node.blocks.grid);
          */
          sjs.loggr.debug("game over.  you lose.");
          sh.fire('/hud/end');
        }

        return shape;
      },

      /**
       * @private
       */
      previewNextShape(node, layer) {
        let info = this.randNext(),
        gbox= node.gbox,
        cw = ccsx.center(),
        wb = ccsx.vbox(),
        shape,
        sz = (1 + info.model.dim) * csts.TILE,
        //left = cw.x + 2 * csts.TILE,
        //x = left + (wz.width - left - csts.TILE) * 0.5,
        x = cw.x + (wb.right - cw.x) * 0.5,
        y = wb.top * 0.7;//cw.y;

        x -= sz * 0.5;
        y += sz * 0.5;

        utils.disposeShape(this.nextShape);
        this.nextShape= null;
        shape= new cobjs.Shape(x,y, info);
        this.nextShapeInfo= info;
        this.nextShape= utils.previewShape(layer, shape);
      },

      /**
       * @private
       */
      randNext() {
        const n= sjs.rand( cobjs.Shapes.length),
        proto= cobjs.Shapes[n];

        return {
          png: sjs.rand(csts.BLOCK_COLORS) + 1,
          rot: sjs.rand(proto.layout.length),
          model: proto
        };
      }

    });

    /**
     * @memberof module:zotohlab/p/s/generator~ShapeGenerator
     * @property {Number} Priority
     */
    ShapeGenerator.Priority= pss.Generate;

    exports= ShapeGenerator;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

