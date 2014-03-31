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
// background layer
//////////////////////////////////////////////////////////////////////////////

var BackLayer = asterix.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.arena'));
    this.addItem(map);
    return this._super();
  },

  pkInput: function() {},

  rtti: function() {
    return 'BackLayer';
  }

});

//////////////////////////////////////////////////////////////////////////////
// HUD
//////////////////////////////////////////////////////////////////////////////

var HUDLayer = asterix.XGameHUDLayer.extend({

  initParentNode: function() {
    this.atlasBatch = cc.SpriteBatchNode.createWithTexture( cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics')));
    this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);
  },

  getNode: function() { return this.atlasBatch; },

  initLabels: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();

    this.scoreLabel = ccsx.bmfLabel({
      fontPath: sh.xcfg.getFontPath('font.TinyBoxBB'),
      text: '0',
      anchor: ccsx.AnchorBottomRight,
      scale: 12/72
    });
    this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },

  initIcons: function() {
  },

  resetAsNew: function() {
  },

  reset: function() {
  },

  showNext: function() {
    var n= asterix.fns.rand( EntityList.length),
    proto= EntityList[n],
    csts= sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    sz = proto.prototype.matrix * csts.TILE,
    left= (csts.FIELD_W + 2) * csts.TILE,
    x= left + (wz.width - left - csts.TILE) / 2,
    y = cw.y;

    if (this.nextShape) { this.nextShape.dispose(); }
    x -= sz/2;
    y += sz/2;
    this.nextShape= new (proto)( x, y, { wantKeys: false });
    this.nextShape.createAsOutline(this);
    this.nextShapeInfo= {
      formID: this.nextShape.formID,
      png: this.nextShape.png,
      model: proto
    };
  },

  getNextShapeInfo: function() {
    return this.nextShapeInfo;
  },

  removeItem: function(n) {
    if (n instanceof cc.Sprite) { this._super(n); } else {
      this.removeChild(n);
    }
  },

  addItem: function(n) {
    if (n instanceof cc.Sprite) { this._super(n); } else {
      this.addChild(n, this.lastZix, ++this.lastTag);
    }
  },

  initCtrlBtns: function(s) {
    this._super(32/48);
  },

  rtti: function() {
    return 'HUD';
  }

});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  reset: function(newFlag) {
    if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
      var img = cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics'));
      this.atlasBatch = cc.SpriteBatchNode.createWithTexture(img);
      this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
    }
    if (newFlag) {
      this.getHUD().resetAsNew();
      this.initCMap();
    } else {
      this.getHUD().reset();
    }
    this.ops.onspace = _.throttle(this.onSpace.bind(this), 100);
    this.pauseToClear=false;
  },

  getHUD: function() {
    return cc.Director.getInstance().getRunningScene().layers['HUD'];
  },

  getNode: function() { return this.atlasBatch; },

  ops: {},

  initCMap: function() {
    var r, rc, csts= sh.xcfg.csts,
    hlen = csts.GRID_H,
    wlen = csts.GRID_W;
    this.collisionMap=[];
    for (r = 0; r < hlen; ++r) {
      if (r === 0 || r === hlen-1) {
        rc = global.ZotohLabs.makeArray(wlen, 1);
      } else {
        rc = global.ZotohLabs.makeArray(wlen, 0);
        rc[0] = 1;
        rc[csts.FIELD_W + 1] = 1;
      }
      this.collisionMap[r] = rc;
    }
  },

  collisionMap: [],

  pauseForClearance: function(b, delay) {
    this.pauseToClear=b;
    this.flines=[];
    if (b) {
      this.pauseTimer= ccsx.createTimer(this, delay);
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
    len= csts.FIELD_W;
    for (c=0; c < len; ++c) {
      row[h+c]= 0;
    }
  },

  postLockCheckLine: function() {
    // search bottom up until top.
    var rows= this.collisionMap.length,
    csts = sh.xcfg.csts,
    top= rows - csts.FIELD_TOP,
    r, rc=[];

    for (r = csts.FIELD_BOTTOM; r < top; ++r) {
      if (this.testFilledRow(r)) { rc.push(r); }
    }
    if (rc.length > 0) {
      this.pauseForClearance(true, 0.5);
      this.flashFilled(rc);
    }
  },

  testFilledRow: function(r) {
    var c, row= this.collisionMap[r],
    csts = sh.xcfg.csts,
    h= csts.FIELD_SIDE,
    len= csts.FIELD_W;

    // negative if any holes in the row
    for (c=0; c < len; ++c) {
      if (row[h+c] !== 1) { return false; }
    }

    // entire row msut be filled.
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
        //line_f[c].sprite.setPosition(pos.x, to * csts.TILE);
        line_f[c].sprite.setPosition(pos.x, pos.y - csts.TILE);
      }
      line_t[c] = line_f[c];
      line_f[c] = undef;
    }
  },

  findFirstDirty: function() {
    var r, csts= sh.xcfg.csts,
    t = csts.GRID_H - csts.FIELD_TOP - 1;

    for (r = t; r > 0; --r) {
      if (!this.isEmptyRow(r)) { return r; }
    }

    return 0;
  },

  findLastDirty: function(empty) {
    var r, csts= sh.xcfg.csts,
    t = csts.GRID_H - csts.FIELD_TOP;

    for (r = empty+1; r < t; ++r) {
      if (!this.isEmptyRow(r)) { return r; }
    }

    return 0;
  },

  findLastEmpty: function() {
    var r, csts= sh.xcfg.csts,
    t = csts.GRID_H - csts.FIELD_TOP;

    for (r=1; r < t;++r) {
      if (this.isEmptyRow(r)) { return r; }
    }

    return 0;
  },

  shiftDownLines: function() {
    var r, csts= sh.xcfg.csts,
    top = csts.GRID_H - csts.FIELD_TOP,
    f, e, d;

    while (true) {
      f= this.findFirstDirty();
      if (f===0) { return; } // no lines are touched.
      e= this.findLastEmpty();
      if (e > f) { return; }
      d=e+1;
      //d= this.findLastDirty(e); // should always find something here since first-dirty was positive
      //if (d===0) { return; }
      for (r=d; r < top; ++r) {
        this.copyLine(r,e);
        ++e;
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
    info = this.getHUD().getNextShapeInfo(),
    proto, png, formID,
    wz = ccsx.screen(),
    csts= sh.xcfg.csts,
    c= 5;
    if (info) {
      formID = info.formID;
      png = info.png;
      proto= info.model;
    } else {
      proto = EntityList[n];
    }
    this.curShape= new (proto)(  c * csts.TILE, wz.height - csts.FIELD_TOP * csts.TILE, {
      formID: formID,
      png: png
    });
    this.curShape.create(this);
    this.dropSpeed=1000;
    this.initDropper();
    this.getHUD().showNext();
  },

  initDropper: function() {
    this.dropper= ccsx.createTimer(this, this.dropRate / this.dropSpeed);
  },

  dropRate: 80 + 700/1,
  dropSpeed: 1000,

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

    if (this.curShape) {
      this.curShape.update(dt);
    }

    if (sh.main.keyboard[cc.KEY.space]) {
      this.ops.onspace();
    }

  },

  onSpace: function() {
    if (this.curShape && this.dropper) {
      this.doFall();
      if (this.dropper) {
        this.dropSpeed=8000;
        this.initDropper();
      }
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

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {
    this.reset(newFlag);
    this.newEntityMap();
    this.spawnNext();
  },

  newGame: function(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});


asterix.Bricks.Factory = {
  create: function(options) {
    var fac = new asterix.XSceneFactory({ layers: [ BackLayer, GameLayer, HUDLayer ] });
    var scene= fac.create(options);
    if (!scene) { return null; }
    scene.ebus.on('/game/objects/aliens/dropbombs', function(topic, msg) {
      sh.main.dropBombs(msg);
    });
    scene.ebus.on('/game/objects/players/shoot', function(topic, msg) {
      sh.main.fireMissiles(msg);
    });
    scene.ebus.on('/game/objects/aliens/killed', function(topic, msg) {
      sh.main.onAlienKilled(msg);
    });
    scene.ebus.on('/game/objects/bombs/killed', function(topic, msg) {
      sh.main.onBombKilled(msg);
    });
    scene.ebus.on('/game/objects/missiles/killed', function(topic, msg) {
      sh.main.onMissileKilled(msg);
    });
    scene.ebus.on('/game/objects/players/killed', function(topic, msg) {
      sh.main.onPlayerKilled(msg);
    });
    scene.ebus.on('/game/objects/players/earnscore', function(topic, msg) {
      sh.main.onEarnScore(msg);
    });
    scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
      asterix.XMenuLayer.onShowMenu();
    });
    scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
      sh.main.replay();
    });

    return scene;
  }
}

}).call(this);


