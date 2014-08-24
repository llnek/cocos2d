// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function (undef) { "use strict"; var global= this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.Bricks.EntityShape= asterix.XEntity.xtends({

  throttleWait: 100,
  manifest: [],
  blocks: [],
  matrix: 3,
  formID: 0,
  png: 1,

  initKeyOps: function() {
    this.ops.sftRight = _.throttle(this.shiftRight.bind(this), this.throttleWait,{ trailing:false});
    this.ops.sftLeft= _.throttle(this.shiftLeft.bind(this), this.throttleWait, {trailing:false});
    this.ops.rotRight = _.throttle(this.rotateRight.bind(this), this.throttleWait, {trailing:false});
    this.ops.rotLeft = _.throttle(this.rotateLeft.bind(this), this.throttleWait, {trailing:false});
  },

  keypressed: function(dt) {
    if (sh.main.keyboard[cc.KEY.right]) {
      this.ops.sftRight();
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      this.ops.sftLeft();
    }
    if (sh.main.keyboard[cc.KEY.down]) {
      this.ops.rotRight();
    }
    if (sh.main.keyboard[cc.KEY.up]) {
      this.ops.rotLeft();
    }
  },

  dispose: function() {
    this.clear();
  },

  clear: function() {
    _.each(this.blocks, function(z) { z.dispose(); });
    this.blocks=[];
  },

  randPng: function() {
    return sjs.rand( sh.xcfg.csts.BLOCK_COLORS) + 1;
  },

  shiftRight: function() {
    var new_x= this.startPos.x + sh.xcfg.csts.TILE,
    y= this.startPos.y,
    bs= this.findBBox(new_x, y, this.formID);
    if (bs.length > 0) {
      this.reifyBlocks(new_x, y, this.formID, bs);
    }
    return bs.length > 0;
  },

  shiftLeft: function() {
    var new_x= this.startPos.x - sh.xcfg.csts.TILE,
    y= this.startPos.y,
    bs= this.findBBox(new_x, y, this.formID);
    if (bs.length > 0) {
      this.reifyBlocks(new_x, y, this.formID, bs);
    }
    return bs.length > 0;
  },

  rotateRight: function() {
    var nF = sjs.xmod(this.formID+1, this.numRotates()),
    bs= this.findBBox(this.startPos.x, this.startPos.y, nF);
    if (bs.length > 0) {
      this.reifyBlocks(this.startPos.x, this.startPos.y, nF, bs);
    }
    return bs.length > 0;
  },

  rotateLeft: function() {
    var nF = sjs.xmod(this.formID-1, this.numRotates()),
    bs= this.findBBox(this.startPos.x, this.startPos.y, nF);
    if (bs.length > 0) {
      this.reifyBlocks(this.startPos.x, this.startPos.y, nF, bs);
    }
    return bs.length > 0;
  },

  moveDown: function() {
    var new_y= this.startPos.y - sh.xcfg.csts.TILE,
    x= this.startPos.x,
    bs= this.findBBox(x, new_y, this.formID);
    if (bs.length > 0) {
      this.reifyBlocks(x, new_y, this.formID, bs);
    }
    return bs.length > 0;
  },

  numRotates: function() {
    return this.manifest.length;
  },

  checkRotation: function(rID) {
  },

  xrefTile: function (x,y) {
    var csts= sh.xcfg.csts,
    co = csts.TILE /2;
    // find center, instead of top left
    y -= co;
    x += co;
    return { row: Math.floor(y / csts.TILE),
             col: Math.floor(x / csts.TILE) };
  },

  maybeCollide: function(tl,br) {
    var tile= this.xrefTile( tl.x , tl.y),
    r,c, cm= this.layer.collisionMap,
    csts= sh.xcfg.csts;

    sjs.loggr.debug("tile = " + tile.row + ", " + tile.col);

    if ( cm[tile.row][tile.col] !== 0)  {
      sjs.loggr.debug("collide! tile = " + tile.row + ", " + tile.col);
      return true;
    } else {
      return false;
    }
  },

  findBBox: function(left,top,rID, skipCollide) {
    var x, y, form= this.manifest[rID],
    ui= global.ZotohLab.UI,
    csts= sh.xcfg.csts,
    r,c, pt,bs=[];
    skipCollide = skipCollide || false;
    for (r=0; r < this.matrix; ++r) {
      y = top - csts.TILE * r;
      for (c=0; c < this.matrix; ++c) {
        x = left + csts.TILE * c;
        if (form[r][c] === 1) {
          pt= new ui.Point(x,y);
          if ( !skipCollide && this.maybeCollide(pt, new ui.Point(x + csts.TILE, y - csts.TILE))) {
            return [];
          }
          bs.push(pt);
        }
      }
    }
    return bs;
  },

  reifyBlocks: function(x,y,fid,bs) {
    var pt, i, obj;
    if (bs.length > 0) {
      this.startPos= cc.p(x,y);
      this.formID= fid;
      this.clear();
      for (i=0; i < bs.length; ++i) {
        pt= bs[i];
        obj= new bks.EntityBlock( pt.x, pt.y, { frame: this.png } );
        this.layer.addItem(obj.create());
        this.blocks.push(obj);
      }
    }
  },

  createAsOutline: function(layer) {
    this.layer= layer;
    this.reifyBlocks( this.startPos.x, this.startPos.y, this.formID,
                      this.findBBox(this.startPos.x, this.startPos.y, this.formID, true));
  },

  create: function(layer) {
    this.layer= layer;
    this.reifyBlocks( this.startPos.x, this.startPos.y, this.formID,
                      this.findBBox(this.startPos.x, this.startPos.y, this.formID));
  },

  regoBlockInMap: function(z) {
    var zs = z.sprite.getPosition(),
    tile = this.xrefTile(zs.x , zs.y);
    this.layer.collisionMap[tile.row][tile.col] = 1;
    this.layer.entityGrid[tile.row][tile.col] = z;
  },

  lock: function() {
    _.map(this.blocks, function(z) { this.regoBlockInMap(z); }, this);
  },

  ctor: function(x,y,options) {
    // start with random rotation.
    if (options.formID) {
      this.formID = options.formID;
    } else {
      this.formID= sjs.rand(this.numRotates());
    }
    if (options.png) {
      this.png = options.png;
    } else {
      // pick a random color png.
      this.png = '' + this.randPng() + '.png';
    }
    this.ops= {};
    if (options.wantKeys !== false) {
      this.initKeyOps();
    }
    this._super(x,y,options);
  }



});


}).call(this);

