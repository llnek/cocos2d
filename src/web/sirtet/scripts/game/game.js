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

(function(undef) { "use strict"; var global = this, _ = global._ ,
asterix = global.ZotohLabs.Asterix,
echt= global.ZotohLabs.echt,
ccsx= asterix.COCOS2DX,
sh= asterix.Shell,
bks= asterix.Bricks,
loggr= global.ZotohLabs.logger;

var EntityList = [ bks.EntityLine, bks.EntityBox, bks.EntitySt,
                   bks.EntityElx, bks.EntityNub, bks.EntityStx, bks.EntityElx ];

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  initCMapRow: function() {
    var r, hlen = csts.GRID_H,
    wlen = csts.GRID_W;
    for (r = 0; r < hlen; ++r) {
      this.collisionMap[r] = global.ZotohLabs.makeArray(wlen, 0);
    }
  },

  collisionMap: [],

  pauseForClearance: function(b, delay) {
    this.pauseToClear=b;
    this.flines=[];
    if (b) {
      this.pauseTimer= ccsx.createTimer(delay);
    } else {
      this.pauseTimer= null;
    }
  },

  clearFilled: function() {
    _.each(this.flines,function(z) {
      this.clearOneRow(z);
      this.resetOneRow(z);
    }, this);
    this.shiftDownLines();
  },

  flashFilled: function(lines) {
    var c,row;
    _.each(lines, function(z) {
      row= this.entityGrid[z];
      for (c=0; c < row.length; ++c) {
        if (row[c]) {
          row[c].blink();
        }
      }
    }, this);
    this.flines=lines;
    //this.pauseTimer = ccsx.createTimer(0.5);
  },

  clearOneRow: function(r) {
    var row= this.entityGrid[r],
    c;
    for (c=0; c < row.length; ++c) {
      if (row[c]) {
        row[c].dispose();
        row[c]=undef;
      }
    }
  },

  resetOneRow: function(r) {
    var c,row= this.collisionMap[r],
    csts = sh.xcfg.csts,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W,
    for (c=0; c < len; ++c) {
      row[h+c]= 0;
    }
  },

  postLockCheckLine: function() {
    // search bottom up until top.
    var rows= this.collisionMap.length,
    csts = sh.xcfg.csts,
    b= rows - csts.FIELD_BOTTOM  - 1,
    t= csts.FIELD_TOP,
    r, rc=[];

    for (r = b; r >= t; --r) {
      if (this.testRow(r)) { rc.push(r); }
    }
    if (rc.length > 0) {
      this.pauseForClearance(true, 0.5);
      this.flashFilled(rc);
    }
  },

  testRow: function(r) {
    var c, row= this.collisionMap[r],
    csts = sh.xcfg.csts,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    for (c=0; c < len; ++c) {
      if (row[h+c] !== 1) { return false; }
    }
    return true;
  },

  isEmptyRow: function(r) {
    var c, row= this.collisionMap[r],
    csts= sh.xcfg.csts,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    for (c=0; c < len; ++c) {
      if (row[h+c] !== 0) { return false; }
    }
    return true;
  },

  copyLine: function(from,to) {
    var line_f = this.collisionMap[from],
    line_t = this.collisionMap[to],
    pos,
    csts = sh.xcfg.csts,
    c,h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    for (c=0; c < len; ++c) {
      line_t[h+c] = line_f[h+c];
      line_f[h+c]= 0;
    }
    line_f = this.entityGrid[from];
    line_t = this.entityGrid[to];
    for (c=0; c < line_f.length; ++c) {
      if (line_f[c]) {
        pos = line_f[c].sprite.getPosition();
        line_f[c].sprite.setPosition(pos.x, to * csts.TILE);
      }
      line_t[c] = line_f[c];
      line_f[c] = undef;
    }
  },

  findFirstDirty: function() {
    var r, csts= sh.xcfg.csts,
    last= this.collisionMap.length - csts.FIELD_BOTTOM;

    for (r= csts.FIELD_TOP; r < last; ++r) {
      if (!this.isEmptyRow(r)) { return r; }
    }

    return 0;
  },

  findLastDirty: function(empty) {
    var r, csts= sh.xcfg.csts,
    last= this.collisionMap.length - csts.FIELD_BOTTOM - 1;

    for (r= empty-1; r >= csts.FIELD_TOP; --r) {
      if (!this.isEmptyRow(r)) { return r; }
    }
    return 0;
  },

  findLastEmpty: function() {
    var r, csts= sh.xcfg.csts,
    last= this.collisionMap.length - csts.FIELD_BOTTOM - 1;

    for (r= last; r >= csts.FIELD_TOP; --r) {
      if (this.isEmptyRow(r)) { return r; }
    }

    return 0;
  },

  shiftDownLines: function() {
    var r, csts= sh.xcfg.csts,
    f, e, d;

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
    var row= this.collisionMap[r],
    csts= sh.xcfg.csts,
    c, h=  csts.FIELD_SIDE,
    len= csts.FIELD_W ;

    for (c=0; c < len; ++c) {
      row[h+c] = 0;
    }
  },

  undoCMapCell: function(r,c) {
    this.collisionMap[r][c] = 0;
  },

  newEntityMap: function() {
    var data= this.collisionMap,
    rc,r;
    this.entityGrid=[];
    for (r= 0; r < this.collisionMap.length; ++r) {
      rc= global.ZotohLabs.makeArray(this.collisionMap[r].length, undef);
      this.entityGrid.push(rc);
    }
  },

  spawnNext: function() {
    var n= asterix.fns.rand( EntityList.length),
    csts= sh.xcfg.csts,
    c= 5;
    this.curShape= new (EntityList[n])(  c * csts.TILE, csts.FIELD_TOP * csts.TILE, {});
    this.addItem(this.curShape.create());
    this.initDropper();
  },

  initDropper: function(scale) {
    this.dropRate= 80 + 700/1;
    scale= scale || 1000;
    this.dropper= ccsx.createTimer(this.dropRate / scale);
  },

  preStart: function() {
    this.pauseToClear=false;
    this.newEntityMap();
    this.spawnNext();
  },

  updateEntities: function(dt) {
    if (this.pauseToClear) {
      if (ccsx.timerDone(this.pauseTimer)) {
        this.pauseTimer=null;
        this.clearFilled();
        this.spawnNext();
        this.pauseToClear=false;
      }
      return;
    }

    if (ccsx.timerDone(this.dropper)) {
      this.doFall();
      if (this.dropper) { this.initDropper(); }
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
      if (this.dropper) { this.initDropper(5000); }
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
      //if (this.dropper) { this.dropper.pause(); }
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
  }

});



}).call(this);


