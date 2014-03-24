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
sh.pools['missiles'] = new asterix.XEntityPool({ entityProto: ivs.EntityMissile });
sh.pools['bombs'] = new asterix.XEntityPool({ entityProto: ivs.EntityBomb });
sh.pools['live-missiles'] = {};
sh.pools['live-bombs'] = {};

var arenaLayer = asterix.XGameLayer.extend({

  maybeReset: function() {
    sh.pools['missiles'].drain();
    sh.pools['bombs'].drain();
    sh.pools['live-missiles'] = {};
    sh.pools['live-bombs'] = {};
    this.motion = null;
    this.bombs = null;
    this.score = 0;
    this.aliens = [];
  },

  initAliens: function() {
    var csts = sh.xcfg.csts;
    var cw= ccsx.center();
    var n, x,y, me = this;
    var row = 0;
    var aa, dummy = new ivs.EntityAlien(0,0, { rank: 0, tag: 1, zIndex: 0, frameID: 'green_bug_0.png' });
    dummy.create();
    this.alienSize= dummy.sprite.getContentSize();

    for (n=0; n < csts.CELLS; ++n) {
      if (n % csts.COLS === 0) {
        y = n === 0 ? (csts.GRID_H - csts.TOP) * csts.TILE : y - dummy.height - csts.OFF_Y;
        x = csts.LEFT * csts.TILE + dummy.width / 2;
        row += 1;
      }
      aa = new ivs.EntityAlien( x + dummy.width / 2, y - dummy.height / 2, {
        frameTime: 1,
        rank: row,
        status: false
      });
      this.atlasBatch.addChild(aa.create(), this.lastZix, ++this.lastTag);
      this.aliens.push(aa);
      x += dummy.width + csts.OFF_X;
    }

    dummy = new ivs.EntityPlayer(0,0, { tag: 1, zIndex: 0, frameID: 'ship_0.png' });
    dummy.create();
    this.shipSize= dummy.sprite.getContentSize();

    y =  5 * csts.TILE + dummy.height;
    x = cw.x;
    aa= new ivs.EntityPlayer(x,y, { coolDown: 0.8});
    this.atlasBatch.addChild(aa.create(), this.lastZix, ++this.lastTag);

    this.players.push( aa);
  },

  killPlayer: function() {
    this.atlasBatch.removeChild(this.players[0].sprite,true);
    this.reduceLife(1);
  },

  killMissile: function(m) {
    var obj = sh.pools['live-missiles'];
    var tag= m.sprite.getTag();
    delete obj[tag];
    sh.pools['missiles'].add(m);
  },

  killBomb: function(b) {
    var obj = sh.pools['live-bombs'];
    var tag= b.sprite.getTag();
    delete obj[tag];
    sh.pools['bombs'].add(b);
  },

  killExplosion: function(e) {
    this.atlasBatch.removeChild(e.sprite);
    e.sprite=null;
  },

  addExplosion: function(x,y, options) {
    var aa= new ivs.EntityExplode(x,y, options);
    var tag = ++this.lastTag;
    this.atlasBatch.addChild(aa.create(), this.lastZix, tag);
  },

  addMissile: function(x,y,options) {
    var aa = new ivs.EntityMissile(x,y, options);
    var tag = ++this.lastTag;
    this.atlasBatch.addChild(aa.create(), this.lastZix, tag);
    sh.pools['live-missiles'][tag] = aa;
  },

  addBomb: function(x,y,options) {
    var aa= new ivs.EntityBomb(x, y, options);
    var tag= ++this.lastTag;
    this.atlasBatch.addChild(aa.create(), this.lastZix, tag);
    sh.pools['live-bombs'][tag] = aa;
  },

  reviveMissile: function(x,y,options) {
    var tag = -1, ent = sh.pools['missiles'].get();
    if (ent) {
      ent.revive(x,y,options);
      tag= ent.sprite.getTag();
      sh.pools['live-missiles'][tag] = ent;
    }
    return tag > 0;
  },

  reviveBomb: function(x,y,options) {
    var tag = -1, ent = sh.pools['bombs'].get();
    if (ent) {
      ent.revive(x,y,options);
      tag= ent.sprite.getTag();
      sh.pools['live-bombs'][tag] = ent;
    }
    return tag > 0;
  },

  initMotionTimers: function() {
    this.stepX = this.alienSize.width / 3;
    _.each(this.aliens, function(z) {
      z.status = true;
    });
    this.motion = cc.DelayTime.create(1);
    this.bombs = cc.DelayTime.create(2);
    this.runAction(this.motion);
    this.runAction(this.bombs);
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

  updateEntities: function(dt) {
    if (echt(this.motion) && this.motion.isDone()) {
      this.checkMotion(dt);
    }
    if (echt(this.bombs) && this.bombs.isDone()) {
      this.checkBombs(dt);
    }
    var obj= sh.pools['live-bombs'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });
    this.players[0].update(dt);
    obj = sh.pools['live-missiles'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });
  },

  checkEntities: function(dt) {
    this.checkMissilesBombs(dt);
    this.checkMissilesAliens(dt);
    this.checkShipBombs(dt);
  },

  checkMissilesAliens: function(dt) {
    var mss = sh.pools['live-missiles'];
    var ass= this.aliens;
    var m, n;
    _.each(_.keys(mss), function(z) {
      m = mss[z];
      for (n=0; n < ass.length; ++n) {
        if (ass[n].status !== true) { continue; }
        if (ccsx.checkCollide(m.sprite, ass[n].sprite)) {
          m.check(ass[n]);
          break;
        }
      }
    });
  },

  checkShipBombs: function(dt) {
    var bss = sh.pools['live-bombs'];
    var a= _.keys(bss);
    var b, n, p = this.players[0];
    for (n=0; n < a.length; ++n) {
      b = bss[ a[n] ];
      if (ccsx.checkCollide(b.sprite, p.sprite)) {
        p.check(b);
        break;
      }
    }
  },

  checkMissilesBombs: function(dt) {
    var mss = sh.pools['live-missiles'];
    var bbs = sh.pools['live-bombs'];
    var k, w,a,m,b;
    _.each(_.keys(bbs), function(z) {
      b= bbs[z];
      a= _.keys(mss);
      for (k = 0; k < a.length; ++k) {
        w = a[k];
        m = mss[w];
        if ( ccsx.checkCollide(b.sprite,m.sprite)) {
          b.check(m);
          break;
        }
      }
    });
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
    var sp= b.sprite;
    if (stepx > 0) {
      return ccsx.getRight(sp) + stepx < (csts.GRID_W - 2) * csts.TILE;
    } else {
      return ccsx.getLeft(sp) + stepx > csts.LEFT * csts.TILE;
    }
  },

  findMinX: function() {
    return _.min(this.aliens, function(a) {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return Number.MAX_VALUE;
      }
    });
  },

  findMaxX: function() {
    return _.max(this.aliens, function(a) {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return 0;
      }
    });
  },

  checkMotion: function(dt) {
    this.maybeShuffle(this.stepX);
    this.motion = cc.DelayTime.create(1);
    this.runAction(this.motion);
  },

  checkBombs: function(dt) {
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
    _.each(this.aliens, function(z) {
        if (z.status) { z.update(dt); }
    });
    this.bombs = this.runAction(cc.DelayTime.create(2));
  },

  updateScore: function(n) {
    this.score += n;
    this.scoreLabel.setString(Number(this.score).toString());
  },

  onDone: function() {
    //this.stop();
  },

  killHUDItem: function(h) {
    this.atlasBatch.removeChild(h,true);
  },

  addHUDItem: function(h) {
    this.atlasBatch.addChild(h, this.lastZix, ++this.lastTag);
  },

  reduceLife: function(n) {
    this.lives.reduceLives(n);
    if (this.lives.isDead()) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },

  spawnPlayer: function() {
    var csts= sh.xcfg.csts;
    var y =  5 * csts.TILE + this.shipSize.height;
    var cw= ccsx.center();
    var x = cw.x;
    var aa= new ivs.EntityPlayer(x,y, { coolDown: 0.8});
    this.atlasBatch.addChild(aa.create(), this.lastZix, ++this.lastTag);
    this.players=[];
    this.players.push( aa);
  },

  gui: function() {
    var me=this, csts = sh.xcfg.csts;
    var wz = ccsx.screen();
    var hdr, itm;
    var mi, msg;

    var gameAtlas = cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics'));
    this.atlasBatch = cc.SpriteBatchNode.createWithTexture(gameAtlas);
    this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);

    this.scoreLabel = cc.LabelBMFont.create('0', sh.xcfg.getFontPath('font.TinyBoxBB'));
    this.scoreLabel.setAnchorPoint(1,0);
    this.scoreLabel.setScale(12/72);
    this.scoreLabel.setOpacity(0.9*255);
    this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF, 
    wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));
    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);

    this.lives = new asterix.XHUDLives(
      csts.TILE + csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF, {
      frames: ['health.png'],
      totalLives: 3
    });
    this.lives.create();
  },

  play: function() {
    this.maybeReset();
    this.doLayout();
    this.initAliens();
    this.initMotionTimers();
    return true;
  },

  doLayout: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.arena'));
    var csts= sh.xcfg.csts;
    var cw= ccsx.center();
    var wz= ccsx.screen();

    this.addChild(map, this.lastZix, ++this.lastTag);
    this.gui();
    this.doCtrlBtns(32/48);
  },

  newGame: function(mode) {
    sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    return this.play();
  }


});

asterix.Invaders.Factory = new asterix.XSceneFactory(arenaLayer);

}).call(this);


