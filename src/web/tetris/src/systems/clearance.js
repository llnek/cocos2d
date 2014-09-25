
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.RowClearance = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList= engine.getNodeList(bks.ArenaNode);
  },

  update: function(dt) {
    var node = this.nodeList.head,
    ps= node.pauser;

    if (ps.pauseToClear) {
      if (ccsx.timerDone(ps.timer)) {
        //this.state.curShape=null;
        this.clearFilled(node);
        ps.timer=null;
        ps.pauseToClear=false;
      }
      //stop downstream processing
      return false;
    }
  },

  clearFilled: function(node) {
    var score= node.flines.lines.length;
    sh.fireEvent('/game/hud/score/update', { score: score * 50 });
    _.each(node.flines.lines,function(z) {
      this.clearOneRow(node,z);
      this.resetOneRow(node,z);
    }, this);
    this.shiftDownLines(node);
  },

  //get rid of blocks
  clearOneRow: function(node,r) {
    var row= node.blocks.grid[r],
    c;
    for (c=0; c < row.length; ++c) {
      if (row[c]) {
        row[c].dispose();
        row[c]=undef;
      }
    }
  },

  //clear collision mark
  resetOneRow: function(node,r) {
    var row= node.collision.tiles[r],
    c,
    csts = sh.xcfg.csts,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W;
    for (c=0; c < len; ++c) {
      row[h+c]= 0;
    }
  },

  shiftDownLines: function(node) {
    var csts= sh.xcfg.csts,
    r,
    top = csts.GRID_H - csts.FIELD_TOP,
    f, e, d;

    while (true) {
      f= this.findFirstDirty(node);
      if (f===0) { return; } // no lines are touched.
      e= this.findLastEmpty(node);
      if (e > f) { return; }
      d=e+1;
      //d= this.findLastDirty(e); // should always find something here since first-dirty was positive
      //if (d===0) { return; }
      for (r=d; r < top; ++r) {
        this.copyLine(node,r,e);
        ++e;
      }
    }
  },

  findFirstDirty: function(node) {
    var csts= sh.xcfg.csts,
    r,
    t = csts.GRID_H - csts.FIELD_TOP - 1;

    for (r = t; r > 0; --r) {
      if (!this.isEmptyRow(node,r)) { return r; }
    }

    return 0;
  },

  findLastEmpty: function(node) {
    var csts= sh.xcfg.csts,
    r,
    t = csts.GRID_H - csts.FIELD_TOP;

    for (r=1; r < t;++r) {
      if (this.isEmptyRow(node,r)) { return r; }
    }

    return 0;
  },

  isEmptyRow: function(node,r) {
    var row= node.collision.tiles[r],
    c,
    csts= sh.xcfg.csts,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    for (c=0; c < len; ++c) {
      if (row[h+c] !== 0) { return false; }
    }
    return true;
  },

  copyLine: function(node,from,to) {
    var line_f = node.collision.tiles[from],
    line_t = node.collision.tiles[to],
    pos,
    csts = sh.xcfg.csts,
    c,h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    for (c=0; c < len; ++c) {
      line_t[h+c] = line_f[h+c];
      line_f[h+c]= 0;
    }
    line_f = node.blocks.grid[from];
    line_t = node.blocks.grid[to];
    for (c=0; c < line_f.length; ++c) {
      if (line_f[c]) {
        pos = line_f[c].sprite.getPosition();
        //line_f[c].sprite.setPosition(pos.x, to * csts.TILE);
        line_f[c].sprite.setPosition(pos.x, pos.y - csts.TILE);
      }
      line_t[c] = line_f[c];
      line_f[c] = undef;
    }
  }



});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF





