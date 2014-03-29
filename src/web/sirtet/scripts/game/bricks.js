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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var sh= asterix.Shell;
var br= asterix.Bricks;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;
var EntityList = [ br.EntityLine, br.EntityBox, br.EntitySt,
                   br.EntityElx, br.EntityNub, br.EntityStx, br.EntityElx ];

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
sh.xcfg.game.proto = asterix.XGame.extend({

  name: 'bricks',
  score: 0,

  pauseForClearance: function(b) {
    this.pauseToClear=b;
    this.pauseTimer=new ig.Timer();
    this.flines=[];
  },

  clearFilled: function() {
    var me=this;
    _.each(this.flines,function(z) {
      me.clearOneRow(z);
      me.resetOneRow(z);
    });
    this.shiftDownLines();
  },

  flashFilled: function(lines) {
    var c,row,me=this;
    _.each(lines,function(z) {
      row= me.entityGrid[z];
      for (c=0; c < row.length; ++c) {
        if (row[c]) {
          row[c].blink();
        }
      }
    });
    this.flines=lines;
    this.pauseTimer.set(0.5);
  },

  clearOneRow: function(r) {
    var c, row= this.entityGrid[r];
    for (c=0; c < row.length; ++c) {
      if (row[c]) {
        row[c].kill();
        row[c]=undef;
      }
    }
  },

  resetOneRow: function(r) {
    var c,row= this.collisionMap.data[r];
    var csts = sh.xcfg.csts;
    var h= csts.FIELD_SIDE;
    var len= csts.FIELD_W;
    for (c=0; c < len; ++c) {
      row[h+c]= 0;
    }
  },

  postLockCheckLine: function() {
    // search bottom up until top.
    var r, rows= this.collisionMap.data.length;
    var csts = sh.xcfg.csts;
    var b= rows - csts.FIELD_BOTTOM  - 1;
    var t= csts.FIELD_TOP ;
    var rc=[];
    for (r = b; r >= t; --r) {
      if (this.testRow(r)) { rc.push(r); }
    }
    if (rc.length > 0) {
      this.pauseForClearance(true);
      this.flashFilled(rc);
    }
  },

  testRow: function(r) {
    var c,row= this.collisionMap.data[r];
    var csts = sh.xcfg.csts;
    var h= csts.FIELD_SIDE;
    var len= csts.FIELD_W;
    for (c=0; c < len; ++c) {
      if (row[h+c] !== 1) { return false; }
    }
    return true;
  },

  isEmptyRow: function(r) {
    var c, row= this.collisionMap.data[r];
    var csts= sh.xcfg.csts;
    var h= csts.FIELD_SIDE;
    var len= csts.FIELD_W;
    for (c=0; c < len; ++c) {
      if (row[h+c] !== 0) { return false; }
    }
    return true;
  },

  copyLine: function(from,to) {
    var line_f = this.collisionMap.data[from];
    var line_t = this.collisionMap.data[to];
    var csts = sh.xcfg.csts;
    var c,h= csts.FIELD_SIDE;
    var len= csts.FIELD_W;
    for (c=0; c < len; ++c) {
      line_t[h+c] = line_f[h+c];
      line_f[h+c]= 0;
    }
    line_f = this.entityGrid[from];
    line_t = this.entityGrid[to];
    for (c=0; c < line_f.length; ++c) {
      if (line_f[c]) { line_f[c].pos.y = to * csts.TILE; }
      line_t[c] = line_f[c];
      line_f[c] = undef;
    }
  },

  findFirstDirty: function() {
    var r, csts= sh.xcfg.csts;
    var last= this.collisionMap.data.length - csts.FIELD_BOTTOM;
    for (r= csts.FIELD_TOP; r < last; ++r) {
      if (!this.isEmptyRow(r)) { return r; }
    }
    return 0;
  },

  findLastDirty: function(empty) {
    var r, csts= sh.xcfg.csts;
    var last= this.collisionMap.data.length - csts.FIELD_BOTTOM - 1;
    for (r= empty-1; r >= csts.FIELD_TOP; --r) {
      if (!this.isEmptyRow(r)) { return r; }
    }
    return 0;
  },

  findLastEmpty: function() {
    var r, csts= sh.xcfg.csts;
    var last= this.collisionMap.data.length - csts.FIELD_BOTTOM - 1;
    for (r= last; r >= csts.FIELD_TOP; --r) {
      if (this.isEmptyRow(r)) { return r; }
    }
    return 0;
  },

  shiftDownLines: function() {
    var r, csts= sh.xcfg.csts;
    var f, e, d;
    while (true) {
      f= this.findFirstDirty();
      if (f==0) { return; } // no lines are touched.
      e= this.findLastEmpty();
      if (e < f) { return; }
      d= this.findLastDirty(e);
      if (d===0) { return; }
      for (r=d; r >= csts.FIELD_TOP; --r) {
        this.copyLine(r,e);
        --e;
      }
    }
  },

  undoCMapRow: function(r) {
    var row= this.collisionMap.data[r];
    var csts= sh.xcfg.csts;
    var c, h=  csts.FIELD_SIDE;
    var len= csts.FIELD_W ;
    for (c=0; c < len; ++c) {
      row[h+c] = 0;
    }
  },

  undoCMapCell: function(r,c) {
    this.collisionMap.data[r][c] = 0;
  },

  newEntityMap: function() {
    var r,c,data= this.collisionMap.data;
    var rc,row;
    this.entityGrid=[];
    for (r= 0; r < data.length; ++r) {
      row= data[r];
      rc=[];
      for (c= 0; c < row.length; ++c) {
        rc.push(undef);
      }
      this.entityGrid.push(rc);
    }
  },

  spawnNext: function() {
    var me=this, n= asterix.fns.rand( EntityList.length);
    var csts= sh.xcfg.csts;
    var c= 5;
    this.curShape= new (EntityList[n])(  c * csts.TILE, csts.FIELD_TOP * csts.TILE, {});
    this.curShape.update();
    this.curShape.draw();
    this.dropper= new ig.Timer();
    this.dropRate= 80 + 700/1;
    this.dropper.set(this.dropRate / 1000);
  },

  preStart: function() {
    this.pauseToClear=false;
    this.newEntityMap();
    this.spawnNext();
  },

  onStart: function() {
  },

  maybeReset: function() {
  },

  update: function() {
    this.parent();
    if (this.pauseToClear) {
      if (this.pauseTimer && this.pauseTimer.delta() >= 0) {
        this.pauseTimer.pause();
        this.pauseTimer=null;
        this.clearFilled();
        this.spawnNext();
        this.pauseToClear=false;
      }
      return;
    }

    if (this.dropper && this.dropper.delta() >= 0) {
      this.doFall();
      if (this.dropper) { this.dropper.reset(); }
    }
    if (ig.input.pressed('right')) {
      this.onRight();
    }
    if (ig.input.pressed('left')) {
      this.onLeft();
    }
    if (ig.input.pressed('down')) {
      this.onDown();
    }
    if (ig.input.pressed('up')) {
      this.onUp();
    }
    if (ig.input.pressed('space')) {
      this.onSpace();
    }
  },

  updateScore: function(n) {
    this.score += n;
  },

  onRight: function() {
    if(this.curShape) { this.curShape.shiftRight(); }
  },

  onLeft: function() {
    if (this.curShape) { this.curShape.shiftLeft(); }
  },

  onDown: function() {
    if (this.curShape) { this.curShape.rotateRight(); }
  },

  onUp: function() {
    if (this.curShape) { this.curShape.rotateLeft();}
  },

  onSpace: function() {
    if (this.curShape && this.dropper) {
      this.doFall();
      if (this.dropper) { this.dropper.set( this.dropRate / 5 / 1000); }
    }
  },

  doFall: function() {
    var ok;
    if (this.curShape) {
      ok = this.curShape.moveDown();
    } else {
      return;
    }
    if (!ok) {
      if (this.dropper) { this.dropper.pause(); }
      this.dropper= null;
      // lock shape in place
      this.curShape.lock();
      this.postLockCheckLine();
      //
      if (! this.pauseTimer) {
        this.spawnNext();
      } else {
        this.curShape=null;
      }
    }
  },

  init: function() {
    this.parent();
    this.start();
  }

});



}).call(this);


