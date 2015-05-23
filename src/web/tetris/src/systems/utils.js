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
 * @requires zotohlab/p/elements
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/s/utils
 */
define("zotohlab/p/s/utils",

       ["zotohlab/p/elements",
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (cobjs, sjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/s/utils */
    let exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class SystemUtils
     */
    SystemUtils = {

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method reifyShape
       * @param {cc.Layer} layer
       * @param {Object} cmap
       * @param {Object} shape
       * @return {Object}
       */
      reifyShape(layer, cmap, shape) {
        let bbox= this.findBBox(cmap, shape.model,
                                shape.x, shape.y, shape.rot),
        bricks;
        if (bbox.length > 0) {
          bricks= this.reifyBricks(layer, shape.png,
                                   shape.x, shape.y,bbox);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
        } else {
          shape=null;
        }
        return shape;
      },

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method topLine
       * @param {Node} node
       * @return {Number}
       */
      topLine(node) {
        const gbox= node.gbox,
        bx= gbox.box;
        return Math.floor((bx.top - bx.bottom) / csts.TILE);
      },

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method previewShape
       * @param {cc.Layer} layer
       * @param {Object} shape
       * @return {Object}
       */
      previewShape(layer, shape) {
        let bbox= this.findBBox([],shape.model,
                                shape.x,shape.y,shape.rot,true),
        bricks;
        if (bbox.length > 0) {
          bricks= this.reifyBricks(layer,shape.png,
                                   shape.x,shape.y,bbox);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
        }
        return shape;
      },

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method disposeShape
       * @param {Object} shape
       */
      disposeShape(shape) {
        if (!!shape) {
          this.clearOldBricks(shape.bricks);
          shape.bricks.length=0;
        }
        return null;
      },

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method clearOldBricks
       * @param {Array} bs
       */
      clearOldBricks(bs) {
        R.forEach((z) => { z.dispose(); }, bs);
      },

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method reifyBricks
       * @param {cc.Layer} layer
       * @param {String} png
       * @param {Number} x
       * @param {Number} y
       * @param {Array} bs
       * @return {Array}
       */
      reifyBricks(layer, png, x,y, bs) {
        let pt, obj,
        bricks=[];

        for (let i=0; i < bs.length; ++i) {
          pt= bs[i];
          obj= new cobjs.Brick( pt.x, pt.y, { frame: png } );
          layer.addAtlasItem('game-pics',obj.create());
          bricks.push(obj);
        }

        return bricks;
      },

      /**
       * @memberof module:zotohlab/p/s/utils~SystemUtils
       * @method findBBox
       * @param {Object} cmap
       * @param {Object} model
       * @param {Number} left
       * @param {Number} top
       * @param {String} rID
       * @param {Boolean} skipCollide
       * @return {Array}
       */
      findBBox(cmap, model, left, top, rID, skipCollide) {
        skipCollide = skipCollide || false;
        let form= model.layout[rID],
        x,y,
        pt,
        bs=[];

        for (let r=0; r < model.dim; ++r) {
          y = top - csts.TILE * r;
          for (let c=0; c < model.dim; ++c) {
            x = left + csts.TILE * c;
            if (form[r][c] === 1) {
              if (!skipCollide &&
                  this.maybeCollide(cmap, x, y,
                                    x + csts.TILE,
                                    y - csts.TILE)) {
                return [];
              }
              bs.push(cc.p(x,y));
            }
          }
        }
        return bs;
      },

      /**
       * @private
       */
      maybeCollide(cmap, tl_x, tl_y, br_x, br_y) {
        let tile= this.xrefTile(tl_x , tl_y),
        r,
        c;

        sjs.loggr.debug("tile = " + tile.row + ", " + tile.col);

        if (tile.row < 0 || tile.col < 0 ||
            cmap[tile.row][tile.col] !== 0)  {
          sjs.loggr.debug("collide! tile = " + tile.row + ", " + tile.col);
          return true;
        } else {
          return false;
        }
      },

      /**
       * @private
       */
      xrefTile(x,y) {
        const co = csts.TILE * 0.5;

        // find center, instead of top left
        y -= co;
        x += co;

        // realign actual x,y
        x -= csts.CBOX.left - csts.FENCE;

        return { row: Math.floor(y / csts.TILE),
                 col: Math.floor(x / csts.TILE) };
      },

      /**
       * @private
       */
      initDropper(par, dp) {
        dp.timer = ccsx.createTimer(par, dp.dropRate / dp.dropSpeed);
      },

      /**
       * @private
       */
      setDropper(par, dp, r, s) {
        dp.timer = ccsx.createTimer(par, r/s);
        dp.dropSpeed=s;
        dp.dropRate=r;
      },

      /**
       * @private
       */
      lockBricks(cmap, emap, z) {
        const zs = z.sprite.getPosition(),
        t= this.xrefTile(zs.x, zs.y);

        cmap[t.row][t.col] = 1;
        emap[t.row][t.col] = z;
      },

      /**
       * @private
       */
      lock(node, shape) {
        const cmap= node.collision.tiles,
        emap= node.blocks.grid;

        R.forEach((z) => {
          this.lockBricks(cmap, emap, z);
        }, shape.bricks);

        this.postLock(node, cmap, emap);
      },

      /**
       * @private
       */
      postLock(node, cmap, emap) {

        // search bottom up until top.
        let rows= cmap.length,
        top= rows - 0,//csts.FIELD_TOP,
        rc=[];

        //for (r = csts.FIELD_BOTTOM; r < top; ++r) {
        for (let r = 0; r < top; ++r) {
          if (this.testFilledRow(cmap, r)) {
            rc.push(r);
          }
        }

        if (rc.length > 0) {
          this.pauseForClearance(node, true, 0.5);
          this.flashFilled(emap, node.flines, rc);
        }
      },

      /**
       * @private
       */
      testFilledRow(cmap, r) {
        const row= cmap[r];

        // negative if any holes in the row
        for (let c=0; c < row.length; ++c) {
          if (row[c] !== 1) { return false; }
        }

        // entire row must be filled.
        return true;
      },

      /**
       * @private
       */
      flashFilled(emap, flines, lines) {
        R.forEach((z) => {
          let row= emap[z];
          for (let c=0; c < row.length; ++c) {
            if (row[c]) {
              row[c].blink();
            }
          }
        }, lines);

        flines.lines=lines;
      },

      /**
       * @private
       */
      pauseForClearance(node, b, delay) {
        const pu= node.pauser;

        node.flines.lines=[];
        pu.pauseToClear=b;

        if (b) {
          pu.timer= ccsx.createTimer(sh.main, delay);
        } else {
          pu.timer=null;
        }
      },

      /**
       * @private
       */
      moveDown(layer, cmap, shape) {
        let new_y = shape.y - csts.TILE,
        x = shape.x,
        bricks,
        bs = this.findBBox(cmap, shape.model,
                           x, new_y, shape.rot);

        if (bs.length > 0) {
          bricks=this.reifyBricks(layer,shape.png, x, new_y, bs);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
          shape.y= new_y;
          return true;
        } else {
          return false;
        }
      },

      /**
       * @private
       */
      shiftRight(layer, cmap, shape) {
        let new_x= shape.x + csts.TILE,
        y= shape.y,
        bricks,
        bs= this.findBBox(cmap, shape.model,
                          new_x, y, shape.rot);

        if (bs.length > 0) {
          bricks=this.reifyBricks(layer,shape.png, new_x, y, bs);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
          shape.x= new_x;
          return true;
        } else {
          return false;
        }
      },

      /**
       * @private
       */
      shiftLeft(layer, cmap, shape) {
        let new_x= shape.x - csts.TILE,
        y= shape.y,
        bricks,
        bs= this.findBBox(cmap, shape.model,
                          new_x, y, shape.rot);

        if (bs.length > 0) {
          bricks=this.reifyBricks(layer,shape.png, new_x, y, bs);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
          shape.x= new_x;
          return true;
        } else {
          return false;
        }
      },

      /**
       * @private
       */
      rotateRight(layer,cmap,shape) {
        let nF = sjs.xmod(shape.rot+1, shape.model.layout.length),
        bricks,
        bs= this.findBBox(cmap, shape.model,
                          shape.x, shape.y, nF);

        sjs.loggr.debug("shape.rot = " + shape.rot +
                        ", dim = " +
                        shape.model.dim +
                        ", rot-right , nF = " + nF);
        if (bs.length > 0) {
          bricks=this.reifyBricks(layer,shape.png, shape.x, shape.y, bs);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
          shape.rot= nF;
          return true;
        } else {
          return false;
        }
      },

      /**
       * @private
       */
      rotateLeft(layer,cmap,shape) {
        let nF = sjs.xmod(shape.rot-1, shape.model.layout.length),
        bricks,
        bs= this.findBBox(cmap, shape.model,
                          shape.x, shape.y, nF);

        sjs.loggr.debug("shape.rot = " + shape.rot +
                        ", dim = " +
                        shape.model.dim +
                        ", rot-right , nF = " + nF);
        if (bs.length > 0) {
          bricks=this.reifyBricks(layer,shape.png, shape.x, shape.y, bs);
          this.clearOldBricks(shape.bricks);
          shape.bricks=bricks;
          shape.rot= nF;
          return true;
        } else {
          return false;
        }
      }

    };

    exports= SystemUtils;
    return exports;
});

///////////////////////////////////////////////////////////////////////////////
//EOF

