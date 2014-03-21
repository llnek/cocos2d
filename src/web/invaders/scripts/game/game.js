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
var ccsx= asterix.COCOS2DX;
var ivs= asterix.Invaders;
var sh = asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
var arenaLayer = asterix.XGameLayer.extend({

  maybeReset: function() {
    this.motion = null;
    this.bombs = null;
    this.player = null;
    this.score = 0;
    this.aliens = [];
  },

  initAliens: function() {
    var gameAtlas = cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics'));
    var csts = sh.xcfg.csts;
    var n, x,y, me = this;
    var row = 0;

    this.aliens=[]
    this.atlasBatch = cc.SpriteBatchNode.createWithTexture(gameAtlas);
    this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);

    var aa, dummy = new ivs.EntityAlien(0,0, { rank: 0, tag: 1, zIndex: 0, frameID: 'green_bug_0.png' });
    dummy.create();
    for (n=0; n < csts.CELLS; ++n) {
      if (n % csts.COLS === 0) {
        y = n === 0 ? (csts.GRID_H - csts.TOP) * csts.TILE : y - dummy.height - csts.OFF_Y;
        x = csts.LEFT * csts.TILE + dummy.width / 2;
        row += 1;
      }
      aa = new ivs.EntityAlien( x + dummy.width / 2, y - dummy.height / 2, {
        zIndex: this.lastZix,
        tag: ++this.lastTag,
        frameTime: 1,
        rank: row,
        status: false
      });
      this.atlasBatch.addChild(aa.create(), aa.options.zIndex, aa.options.tag);
      this.aliens.push(aa);
      x += dummy.width + csts.OFF_X;
    }
    /*
    x = (ig.system.width - iv.EntityPlayer.prototype.size.x ) / 2;
    y = (csts.GRID_H - 2) * csts.TILE - iv.EntityPlayer.prototype.size.y;
    this.spawnPlayer();
    this.lives.reset();
    this.score=0;
    this.scoreLabel.setText(Number(this.score).toString());
    */
  },

  spawnPlayer: function() {
  },

  onStart: function() {
    var n;
    this.stepX = iv.EntityAlien.prototype.size.x / 3;
    for (n=0; n < sh.xcfg.csts.CELLS; ++n) {
      this.aliens[n].status = true;
    }
    this.motion = new ig.Timer(1);
    this.bombs = new ig.Timer(2);
  },

  onPlayerKilled: function() {
    this.reduceLife(1);
    //this.boomSnd.play();
  },

  onPlayerFire: function() {
    //this.fireSnd.play();
  },

  onAlienKilled: function() {},

  onAlienHit: function(a) {
    this.updateScore(a.score);
    //this.boomSnd.play();
  },

  onAlienMarch: function() {
    //this.marchSnd.play();
  },

  update: function() {
    if (echt(this.motion) && this.motion.isDone()) {
      this.checkMotion();
    }
  /*
    if (echt(this.bombs) && this.bombs.delta() > 0) {
      this.checkBombs();
    }
    */
  },

  maybeShuffle: function(stepx) {
    var b = stepx > 0 ? this.findMaxX() : this.findMinX();
    if (echt(b) && b.status) {
      var ok = this.testDirX(b, stepx) ? this.doShuffle(stepx) : this.doForward(stepx);
      if (ok) {
        this.onAlienMarch();
      }
    }
  },

  doShuffle: function(stepx) {
    var rc = _.filter(this.aliens, function(a) {
      return a.status;
    });
    _.each(rc, function(a) {
      a.shuffle(stepx);
    });
    return rc.length > 0;
  },

  doForward: function(stepx) {
    var rc = _.filter(this.aliens, function(a) {
      return a.status;
    });
    _.each(rc, function(a) {
      a.forward();
    });
    this.stepX = -stepx;
    return rc.length > 0;
  },

  testDirX: function(b, stepx) {
    var csts = sh.xcfg.csts;
    if (stepx > 0) {
      return b.pos.x + b.size.x + stepx < (csts.GRID_W - 2) * csts.TILE;
    } else {
      return (b.pos.x - 0) + stepx > csts.LEFT * csts.TILE;
    }
  },

  findMinX: function() {
    return _.min(this.aliens, function(a) {
      if (a.status) {
        return a.pos.x;
      } else {
        return Number.MAX_VALUE;
      }
    });
  },

  findMaxX: function() {
    return _.max(this.aliens, function(a) {
      if (a.status) {
        return a.pos.x;
      } else {
        return 0;
      }
    });
  },

  checkMotion: function() {
    this.maybeShuffle(this.stepX);
    this.motion.reset();
  },

  checkBombs: function() {
    var rc = [];
    var n;
    for (n=0; n < this.aliens.length; ++n) {
      if (this.aliens[n].status) {
        rc.push(n);
      }
    }
    if (rc.length > 0) {
      n = rc.length === 1 ? 0 : asterix.fns.rand( rc.length);
      this.aliens[n].loadBomb();
    }
    this.bombs.reset();
  },

  updateScore: function(n) {
    this.score += n;
    this.scoreLabel.setText(Number(this.score).toString());
  },

  onDone: function() {
    this.stop();
  },

  reduceLife: function(n) {
    this.lives.reduceLives(n);
    if (this.lives.isDead()) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },

  guiBtns: function() {
    var me=this, gid= 'gui-btns';
    var csts= sh.xcfg.csts;
    var x, y, itm;

    this.createLayerEx(gid);

    itm= asterix.XButtonFactory.define({
      animSheet: new ig.AnimationSheet(sh.imgFile('impact','btns','settings-x32.png'), 32, 32),
      size: { x: 32, y: 32 },
      _layer: gid,
      clicker: function() { sh.xcfg.smac.settings(); }
    });
    x= (ig.system.width - csts.BTN_SIZE ) / 2;
    y= csts.TILE + csts.S_OFF;
    this.spawnEntity(itm, x , y, {});
  },

  gui: function() {
    var me=this, csts = sh.xcfg.csts;
    var hdr, itm, gid='gui';
    var mi, msg;
    this.createLayer(gid);

    // the score
    msg= '0';
    this.scoreLabel = new ig.XLabel(gid, this.fontScore, msg);
      //hdr.getPos()[1] + hdr.getSize()[1] + 10
    this.scoreLabel.update=function() {
      this.x = ig.system.width - csts.TILE - this.getSize()[0] - 10;
      this.y = csts.TILE + 10;
    };
    this.addItem(this.scoreLabel);

    // hud lives
    this.lives = asterix.XHUDLivesFactory.create({
      icon: new ig.Image('media/invaders/gui/health.png'),
      _layer: gid,
      x: csts.TILE + 10,
      y: csts.TILE + 10,
      totalLives: 3
    });
    this.addItem( this.lives);

    this.guiBtns();
  },

  play: function() {
    this.maybeReset();
    this.doLayout();
    this.initAliens();
    return true;
  },

  resetScore: function() {
    this.score=0;
  },

  doLayout: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.arena'));
    var csts= sh.xcfg.csts;
    var cw= ccsx.center();
    var wz= ccsx.screen();

    this.addChild(map, this.lastZix, ++this.lastTag);
  },

  newGame: function(mode) {
    sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.resetScore();
    return this.play();
  }


});

asterix.Invaders.Factory = new asterix.XSceneFactory(arenaLayer);

}).call(this);


