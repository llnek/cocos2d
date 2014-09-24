
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
      bricks= this.reifyBricks(layer, cmap, shape.model, shape.x, shape.y,bbox);
      this.clearOldBricks(shape.bricks);
      shape.bricks=bricks;
    }
  },

  clearOldBricks: function(bs) {
    _.each(bs, function(z) { z.dispose(); });
  },

  reifyBricks: function(layer, cmap, model, x,y, bs) {
    var pt, i,
    obj,
    bricks=[];

    for (i=0; i < bs.length; ++i) {
      pt= bs[i];
      obj= new bks.Brick( pt.x, pt.y, { frame: model.png } );
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

  initDropper: function(options) {
    options.dropSpeed=1000;
    options.dropper = ccsx.createTimer(sh.main,
                                       options.dropRate / options.dropSpeed);
  }


};



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF


