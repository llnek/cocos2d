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

(function (undef) { "use strict"; var global= this; var _ = global._;
var asterix= global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var br= asterix.Bricks;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

asterix.Bricks.EntityShape= asterix.XEntity.extend({

  //rotations: [0,1,2,3],
  manifest: [],
  blocks: [],
  matrix: 3,
  formID: 0,
  png: 1,
  paint: false,

  clear: function() {
    _.each(this.blocks, function(z) {
      z.kill();
    });
    this.blocks=[];
  },

  randPng: function() {
    return asterix.fns.rand( sh.xcfg.csts.BLOCK_COLORS) + 1;
  },

  shiftRight: function() {
    var new_x= this.pos.x + sh.xcfg.csts.TILE;
    var y= this.pos.y;
    var bs= this.findBBox(new_x, y, this.formID);
    if (bs.length > 0) {
      this.reifyBlocks(new_x, y, this.formID, bs);
      this.update();
      this.draw();
    }
    return bs.length > 0;
  },

  shiftLeft: function() {
    var new_x= this.pos.x - sh.xcfg.csts.TILE;
    var y= this.pos.y;
    var bs= this.findBBox(new_x, y, this.formID);
    if (bs.length > 0) {
      this.reifyBlocks(new_x, y, this.formID, bs);
      this.update();
      this.draw();
    }
    return bs.length > 0;
  },

  rotateRight: function() {
    var nF = global.ZotohLabs.xmod(this.formID+1, this.numRotates());
    var bs= this.findBBox(this.pos.x, this.pos.y, nF);
    if (bs.length > 0) {
      this.reifyBlocks(this.pos.x, this.pos.y, nF, bs);
      this.update();
      this.draw();
    }
    return bs.length > 0;
  },

  rotateLeft: function() {
    var nF = global.ZotohLabs.xmod(this.formID-1, this.numRotates());
    var bs= this.findBBox(this.pos.x, this.pos.y, nF);
    if (bs.length > 0) {
      this.reifyBlocks(this.pos.x, this.pos.y, nF, bs);
      this.update();
      this.draw();
    }
    return bs.length > 0;
  },

  moveDown: function() {
    var new_y= this.pos.y + sh.xcfg.csts.TILE;
    var x= this.pos.x;
    var bs= this.findBBox(x, new_y, this.formID);
    if (bs.length > 0) {
      this.reifyBlocks(x, new_y, this.formID, bs);
      this.update();
      this.draw();
    }
    return bs.length > 0;
  },

  update: function() {
  },

  draw: function() {
  },

  numRotates: function() {
    return this.manifest.length;
  },

  checkRotation: function(rID) {
  },

  xrefTile: function (x,y) {
    var csts= sh.xcfg.csts;
    return [ Math.floor(x / csts.TILE), Math.floor( y / csts.TILE) ];
  },

  maybeCollide: function(p1) {
    var r,c, cm= ig.game.collisionMap.data;
    var csts= sh.xcfg.csts;
    var tile;
    for (r= 0; r < csts.TILE; ++r) {
      for (c= 0; c < csts.TILE; ++c) {
        tile= this.xrefTile( p1.x + c, p1.y + r);
        if ( cm[tile[1]][tile[0]] !== 0) {
          loggr.debug("collide! tile = " + tile[0] + ", " + tile[1]);
          return true; 
        }
      }
    }
    return false;
  },

  findBBox: function(left,top,rID) {
    var x, y, form= this.manifest[rID];
    var ui= global.ZotohLabs.UI;
    var csts= sh.xcfg.csts;
    var r,c, pt,bs=[];
    for (r=0; r < this.matrix; ++r) {
      y = top + csts.TILE * r;
      for (c=0; c < this.matrix; ++c) {
        x = left + csts.TILE * c;
        if (form[r][c] === 1) {
          pt= new ui.Point(x,y);
          if ( this.maybeCollide(pt, new ui.Point(x + csts.TILE, y + csts.TILE))) {
            return [];
          }
          bs.push(pt);
        }
      }
    }
    return bs;
  },

  reifyBlocks: function(x,y,fid,bs) {
    var pt, i, obj, png= this.png;
    if (bs.length > 0) {
      this.formID= fid;
      this.pos.x= x;
      this.pos.y=y;
      this.clear();
      for (i=0; i < bs.length; ++i) {
        pt= bs[i];
        obj= ig.game.spawnEntity(br.EntityBlock, pt.x, pt.y, { animID: png } );
        this.blocks.push(obj);
      }
    }
  },

  reify: function() {
    this.reifyBlocks( this.pos.x, this.pos.y, this.formID, this.findBBox(this.pos.x, this.pos.y, this.formID));
  },

  regoBlockInMap: function(z) {
    var csts= sh.xcfg.csts;
    var t, r,c;
    for (r = 0; r < csts.TILE; ++r) {
      for (c=0; c < csts.TILE; ++c) {
        t= this.xrefTile(z.pos.x + c, z.pos.y + r );
        ig.game.collisionMap.data[ t[1]][ t[0]] = 1;
        ig.game.entityGrid[t[1]][ t[0]] = z;
      }
    }
  },

  lock: function() {
    var me=this;
    _.map(this.blocks,function(z) { me.regoBlockInMap(z); });
  },

  init: function(x,y,settings) {
    this.parent(x,y,settings);
    // start with random rotation.
    this.formID= asterix.fns.rand(this.numRotates());
    this.png = '' + this.randPng();
    this.reify();
  }



});


}).call(this);

