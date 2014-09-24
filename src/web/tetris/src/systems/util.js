
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.SystemUtils = {

  reifyShape: function(layer,cmap,shape) {
    var bbox= this.findBBox(cmap, shape.model, shape.x, shape.y, shape.rot),
    bricks;
    if (bbox.length > 0) {
      bricks= this.reifyBricks(layer, shape.png, shape.x, shape.y,bbox);
      this.clearOldBricks(shape.bricks);
      shape.bricks=bricks;
    }
    return shape;
  },

  previewShape: function(layer, shape) {
    var bbox= this.findBBox([],shape.model,shape.x,shape.y,shape.rot,true),
    bricks;
    if (bbox.length > 0) {
      bricks= this.reifyBricks(layer,shape.png,shape.x,shape.y,bbox);
      this.clearOldBricks(shape.bricks);
      shape.bricks=bricks;
    }
    return shape;
  },

  disposeShape: function(shape) {
    if (shape) {
      this.clearOldBricks(shape.bricks);
      shape.bricks.length=0;
    }
    return null;
  },

  clearOldBricks: function(bs) {
    _.each(bs, function(z) { z.dispose(); });
  },

  reifyBricks: function(layer, png, x,y, bs) {
    var pt, i,
    obj,
    bricks=[];

    for (i=0; i < bs.length; ++i) {
      pt= bs[i];
      obj= new bks.Brick( pt.x, pt.y, { frame: png } );
      layer.addItem(obj.create());
      bricks.push(obj);
    }

    return bricks;
  },

  findBBox: function(cmap, model, left,top,rID, skipCollide) {
    var skipCollide = skipCollide || false,
    form= model.layout[rID],
    csts= sh.xcfg.csts,
    x,y,
    r,c,
    pt,
    bs=[];

    for (r=0; r < model.dim; ++r) {
      y = top - csts.TILE * r;
      for (c=0; c < model.dim; ++c) {
        x = left + csts.TILE * c;
        if (form[r][c] === 1) {
          if (!skipCollide && this.maybeCollide(cmap, x,y, x + csts.TILE, y - csts.TILE)) {
            return [];
          }
          bs.push(cc.p(x,y));
        }
      }
    }
    return bs;
  },

  maybeCollide: function(cmap, tl_x, tl_y, br_x, br_y) {
    var tile= this.xrefTile(tl_x , tl_y),
    r,c,
    csts= sh.xcfg.csts;

    sjs.loggr.debug("tile = " + tile.row + ", " + tile.col);

    if (cmap[tile.row][tile.col] !== 0)  {
      sjs.loggr.debug("collide! tile = " + tile.row + ", " + tile.col);
      return true;
    } else {
      return false;
    }
  },

  xrefTile: function (x,y) {
    var csts= sh.xcfg.csts,
    co = csts.TILE * 0.5;
    // find center, instead of top left
    y -= co;
    x += co;
    return { row: Math.floor(y / csts.TILE),
             col: Math.floor(x / csts.TILE) };
  },

  initDropper: function(par,dp) {
    dp.timer = ccsx.createTimer(par, dp.dropRate / dp.dropSpeed);
  },

  setDropper: function(par,dp,r,s) {
    dp.dropSpeed=s;
    dp.dropRate=r;
    dp.timer = ccsx.createTimer(par, r/s);
  },

  lockBricks: function(cmap, emap, z) {
    var zs = z.sprite.getPosition(),
    tile = this.xrefTile(zs.x , zs.y);

    cmap[tile.row][tile.col] = 1;
    emap[tile.row][tile.col] = z;
  },

  lock: function(node,shape) {
    var cmap= node.collision.tiles,
    emap= node.blocks.grid;

    _.map(shape.bricks, function(z) {
      this.lockBricks(cmap,emap,z);
    }, this);

    this.postLock(node,cmap,emap);
  },

  postLock: function(node,cmap,emap) {

    // search bottom up until top.
    var rows= cmap.length,
    csts= sh.xcfg.csts,
    top= rows - csts.FIELD_TOP,
    r,
    rc=[];

    for (r = csts.FIELD_BOTTOM; r < top; ++r) {
      if (this.testFilledRow(cmap, r)) {
        rc.push(r);
      }
    }

    if (rc.length > 0) {
      this.pauseForClearance(node, true, 0.5);
      this.flashFilled(emap, node.flines, rc);
    }
  },

  testFilledRow: function(cmap, r) {
    var csts = sh.xcfg.csts,
    row= cmap[r],
    c,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    // negative if any holes in the row
    for (c=0; c < len; ++c) {
      if (row[h+c] !== 1) { return false; }
    }

    // entire row msut be filled.
    return true;
  },

  flashFilled: function(emap,flines,lines) {
    var c,row;

    _.each(lines, function(z) {
      row= emap[z];
      for (c=0; c < row.length; ++c) {
        if (row[c]) {
          row[c].blink();
        }
      }
    }, this);
    flines.lines=lines;
  },

  pauseForClearance: function(node, b, delay) {
    var pu= node.pauser;

    node.flines.lines=[];
    pu.pauseToClear=b;

    if (b) {
      pu.timer= ccsx.createTimer(sh.main, delay);
    } else {
      pu.timer=null;
    }
  },

  moveDown: function(layer,cmap,shape) {
    var new_y = shape.y - sh.xcfg.csts.TILE,
    x = shape.x,
    bricks,
    bs = this.findBBox(cmap, shape.model, x, new_y, shape.rot);

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

  shiftRight: function(layer,cmap,shape) {
    var new_x= shape.x + sh.xcfg.csts.TILE,
    y= shape.y,
    bricks,
    bs= this.findBBox(cmap, shape.model, new_x, y, shape.rot);

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

  shiftLeft: function(layer,cmap,shape) {
    var new_x= shape.x - sh.xcfg.csts.TILE,
    y= shape.y,
    bricks,
    bs= this.findBBox(cmap, shape.model, new_x, y, shape.rot);

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

  rotateRight: function(layer,cmap,shape) {
    var nF = sjs.xmod(shape.rot+1, shape.model.dim),
    bricks,
    bs= this.findBBox(cmap, shape.model, shape.x, shape.y, nF);

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

  rotateLeft: function(layer,cmap,shape) {
    var nF = sjs.xmod(shape.rot-1, shape.model.dim),
    bricks,
    bs= this.findBBox(cmap, shape.model, shape.x, shape.y, nF);

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



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF


