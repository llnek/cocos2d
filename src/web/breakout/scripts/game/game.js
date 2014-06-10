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

(function(undef) { "use strict"; var global = this, _ = global._  ,
asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
bko= asterix.BreakOut,
SkaroJS= global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// background layer
//////////////////////////////////////////////////////////////////////////////

var BackLayer = asterix.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gamelevel1.tiles.arena'));
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
    this.atlasBatch = cc.SpriteBatchNode.create( cc.textureCache.addImage( sh.getAtlasPath('game-pics')));
    this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);
  },

  getNode: function() { return this.atlasBatch; },

  updateScore: function(n) {
    this.score += n;
    this.drawScore();
  },

  resetAsNew: function() {
    this.score = 0;
    this.reset();
  },

  reset: function() {
    this.replayBtn.setVisible(false);
    this.lives.resurrect();
  },

  initLabels: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();

    this.scoreLabel = ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '0',
      anchor: ccsx.AnchorBottomRight,
      scale: 12/72
    });
    this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },

  initIcons: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();

    this.lives = new asterix.XHUDLives( this, csts.TILE + csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF, {
      frames: ['paddle.png'],
      scale: 0.5,
      totalLives: 3
    });

    this.lives.create();
  },

  drawScore: function() {
    this.scoreLabel.setString(Number(this.score).toString());
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
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  getHUD: function() {
    return cc.director.getRunningScene().layers['HUD'];
  },

  getNode: function() { return this.atlasBatch; },

  reset: function(newFlag) {
    if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
      var img = cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
      this.atlasBatch = cc.SpriteBatchNode.create(img);
      this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
    }
    this.players=[];
    this.bricks=[];
    this.actor=null;
    this.ball=null;
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },

  operational: function() {
    return this.players.length > 0;
  },

  spawnPlayer: function() {
    var csts= sh.xcfg.csts,
    cw= ccsx.center(),
    aa = new bko.EntityPlayer(cw.x, 56, {});
    this.addItem(aa.create());
    this.players.push(aa);
    this.actor= aa;
    this.spawnBall();
  },

  spawnBall: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    aa= new bko.EntityBall(cw.x, 250, {});
    this.addItem(aa.create());
    this.ball=aa;
  },

  initBrickSize: function() {
    if (this.candySize) {} else {
      var dummy = new bko.EntityBrick(0,0, { color: 'red_candy' });
      this.candySize= dummy.create().getContentSize();
    }
  },

  initBallSize: function() {
    if (this.ballSize) {} else {
      var dummy = new bko.EntityBall(0,0, {});
      this.ballSize= dummy.create().getContentSize();
    }
  },

  initBricks: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    candies= csts.CANDIES,
    cs= csts.LEVELS["1"],
    b, w, r, c,
    x,
    y= wz.height - csts.TOP_ROW * csts.TILE ;

    for (r=0; r < csts.ROWS; ++r) {
      x= csts.TILE + csts.LEFT_OFF + this.candySize.width/2;
      for (c=0; c < csts.COLS; ++c) {
        b= new bko.EntityBrick(x,y, {
          color: candies[cs[r]]
        });
        this.addItem(b.create());
        this.bricks.push(b);
        x += this.candySize.width + 1;
      }
      y -= this.candySize.height - 2;
    }
  },

  getEnclosureRect: function() {
    var csts= sh.xcfg.csts,
    wz= ccsx.screen();
    return { bottom: csts.TILE,
             top: wz.height - csts.TOP * csts.TILE,
             left: csts.TILE,
             right: wz.width - csts.TILE };
  },

  updateEntities: function(dt) {
    this.actor.update(dt);
    this.ball.update(dt);
  },

  checkEntities: function(dt) {
    var bs = this.ball.sprite,
    bp= bs.getPosition();

    // 1. check if ball is lost
    if (bp.y < ccsx.getBottom(this.actor.sprite)) {
      this.onPlayerKilled();
    }
    else if (ccsx.collide(this.ball, this.actor)) {
    // 2. check if ball is hitting paddle
      this.ball.vel.y = - this.ball.vel.y;
      if (this.ball.vel.x < 0) {
      } else {
      }
      bs.setPosition(bp.x, ccsx.getTop(this.actor.sprite) + ccsx.getHeight(bs) / 2);
      sh.sfxPlay('ball-paddle');
    }
    else {
    // 3. check if ball hits brick
      this.checkBallBricks();
    }
  },

  checkBallBricks: function(dt) {
    var bss = this.bricks,
    n,
    m= this.ball;

    for (n=0; n < bss.length; ++n) {
      if (bss[n].status !== true) { continue; }
      if (ccsx.collide(m, bss[n])) {
        m.check(bss[n]);
        break;
      }
    }
  },

  onPlayerKilled: function() {
    this.ball.dispose();
    this.ball=null;
    this.actor.dispose();
    this.players=[];
    this.actor=null;
    if ( this.getHUD().reduceLives(1)) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },

  onDone: function() {
    this.reset();
    this.getHUD().enableReplay();
  },

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {
    this.reset(newFlag);
    //this.initPlayerSize();
    this.initBrickSize();
    this.initBricks();
    this.spawnPlayer();
  },

  onBrickKilled: function(msg) {
    var obj= new bko.EntityExplode(msg.x, msg.y, msg);
    this.addItem(obj.create());
    sh.sfxPlay('ball-brick');
  },

  onEarnScore: function(msg) {
    this.getHUD().updateScore(msg.value);
  },

  newGame: function(mode) {
    sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});




asterix.BreakOut.Factory = {
  create: function(options) {
    var scene = new asterix.XSceneFactory({
      layers: [
        BackLayer, GameLayer, HUDLayer
      ]
    }).create(options);
    if (scene) {
      scene.ebus.on('/game/objects/bricks/killed', function(topic, msg) {
        sh.main.onBrickKilled(msg);
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
    }

    return scene;
  }
}





}).call(this);


