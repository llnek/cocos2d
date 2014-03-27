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

(function(undef) { "use strict"; var global=this, _ = global._ ,
asterix = global.ZotohLabs.Asterix,
ccsx= asterix.COCOS2DX,
sh= asterix.Shell,
png= asterix.Pong,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// back layer
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
// HUD layer
//////////////////////////////////////////////////////////////////////////////

var HUDLayer = asterix.XGameHUDLayer.extend({

  scores:  { 'O': 0, 'X': 0 },
  mode: 0,
  MAX_SCORE: 3, //11,

  p2Long: sh.l10n('%player2'),
  p1Long: sh.l10n('%player1'),

  p2ID: '',
  p1ID: '',

  setGameMode: function(mode) {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen();

    this.p2ID= sh.l10n('%p2');
    this.p1ID= sh.l10n('%p1');
    if (mode === 1) {
      this.p2Long= sh.l10n('%computer');
      this.p2ID= sh.l10n('%cpu');
    }
    this.mode= mode;
    this.title.setString(this.p1ID + " / " + this.p2ID);
    this.score1.setPosition( cw.x - ccsx.getScaledWidth(this.title)/2 -
                             ccsx.getScaledWidth(this.score1)/2 - 10,
                             wz.height - csts.TILE * 6 /2 - 2);
    this.score2.setPosition( cw.x + ccsx.getScaledWidth(this.title)/2 +
                             ccsx.getScaledWidth(this.score2)/2 + 6,
                             wz.height - csts.TILE * 6 /2 - 2);
  },

  initParentNode: function() {},

  regoPlayers: function(p1,p2) {
    this.play2= p2;
    this.play1= p1;
  },

  resetAsNew: function() {
    //this.scores=  { 'O': 0, 'X': 0 };
    this.reset();
  },

  reset: function() {
    this.scores=  { 'O': 0, 'X': 0 };
    this.replayBtn.setVisible(false);
    this.resultMsg.setVisible(false);
    this.drawScores();
  },

  endGame: function() {
    this.replayBtn.setVisible(true);
    this.resultMsg.setVisible(true);
  },

  initLabels: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz = ccsx.screen();

    this.title= ccsx.bmfLabel({
      fontPath: sh.xcfg.getFontPath('font.TinyBoxBB'),
      text: '',
      scale: 12/72,
      pos: cc.p( cw.x, wz.height - csts.TILE * 6 /2 )
    });
    this.addItem(this.title);

    this.score1= ccsx.bmfLabel({
      fontPath: sh.xcfg.getFontPath('font.OCR'),
      text: '8',
      scale: 36/72,
      color: cc.c3b(255,0,0)
    });
    this.addItem(this.score1);

    this.score2= ccsx.bmfLabel({
      fontPath: sh.xcfg.getFontPath('font.OCR'),
      text: '8',
      scale: 36/72,
      color: cc.c3b(106, 190, 97) //#6abe61
    });
    this.addItem(this.score2);

    this.resultMsg = ccsx.bmfLabel({
      fontPath: sh.xcfg.getFontPath('font.TinyBoxBB'),
      text: '',
      visible: false,
      pos: cc.p(cw.x,  100),
      scale: 24/72
    });
    this.addItem(this.resultMsg);

  },

  initCtrlBtns: function() {
    this._super(28/48, cc.ALIGN_TOP);
  },

  initIcons: function() {
  },

  rtti: function() {
    return 'HUD';
  },

  isDone: function() {
    var s2= this.scores[this.play2.color],
    s1= this.scores[this.play1.color],
    rc= [false, null];

    if (s2 >= this.MAX_SCORE) { rc = [ true, this.play2]; }
    if (s1 >= this.MAX_SCORE) { rc = [ true, this.play1]; }
    return rc;
  },

  updateScore: function(actor,value) {
    this.scores[actor.color] = this.scores[actor.color] + value;
    this.drawScores();
  },

  drawScores: function() {
    var s2 = this.play2 ? this.scores[this.play2.color] : 0,
    s1 = this.play1 ? this.scores[this.play1.color] : 0,
    n2 = global.ZotohLabs.prettyNumber(s2,1),
    n1 = global.ZotohLabs.prettyNumber(s1,1);
    this.score1.setString(n1);
    this.score2.setString(n2);
  },

  drawResult: function(winner) {
    var msg="";
    switch (winner.color) {
      case 'O': msg= sh.l10n('%whowin', { who: this.p2Long}); break;
      case 'X': msg= sh.l10n('%whowin', { who: this.p1Long}); break;
    }
    this.resultMsg.setString(msg);
  }


});

//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  getHUD: function() {
    return cc.Director.getInstance().getRunningScene().layers['HUD'];
  },

  players: [],
  ball: null,

  initPaddleSize: function() {
    var dummy= cc.Sprite.create(sh.xcfg.getImagePath('gamelevel1.images.paddle1'));
    return this.paddleSize = dummy.getContentSize();
  },

  initBallSize: function() {
    var dummy= cc.Sprite.create(sh.xcfg.getImagePath('gamelevel1.images.ball'));
    return this.ballSize = dummy.getContentSize();
  },

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {
    var ps = this.initPaddleSize(),
    bs = this.initBallSize(),
    csts= sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    p2,p1,
    p1x,p2x;

    p2x = wz.width - csts.TILE - 4 - bs.width - ps.width/2;
    p1x = csts.TILE + bs.width + 4 + ps.width/2;
    this.reset(newFlag);

    p1 = new png.EntityHuman( p1x, cw.y, { color: 'X' });
    p2= null;
    switch (csts.GAME_MODE) {
      case 1:
      p2 = new png.EntityRobot( p2x, cw.y, { color: 'O' });
      break;
      case 2:
      p2 = new png.EntityHuman( p2x, cw.y, { color: 'O' });
      break;
      case 3:
      break;
    };

    this.getHUD().regoPlayers(p1,p2);
    this.players= [ null, p1, p2];
    this.addItem(p1.create());
    this.addItem(p2.create());
    this.spawnBall();
  },

  spawnBall: function() {
    var cw= ccsx.center();
    this.ball = new png.EntityBall( cw.x, cw.y, {});
    if (this.players[2].isRobot()) {
      this.players[2].bindBall(this.ball);
    }
    this.addItem(this.ball.create());
  },

  newGame: function(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  reset: function(newFlag) {
    _.each(this.players,function(z) {
      if (z) { z.dispose(); }
    });
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
    this.actor=null;
    this.ball=null;
    this.players=[];
  },

  updateEntities: function(dt) {
    this.players[2].update(dt);
    this.players[1].update(dt);
    this.ball.update(dt);
  },

  checkEntities: function() {
    var p2 = this.players[2],
    p1 = this.players[1],
    bs = this.ball.sprite,
    bp= bs.getPosition();

    if ( bp.x < ccsx.getLeft(p1.sprite)) {
      // p2 scores
      this.onWinner(p2);
    }
    else
    if (bp.x > ccsx.getRight(p2.sprite)) {
      // p1 scores
      this.onWinner(p1);
    }
    else if (ccsx.collide(p2,this.ball)) {
      this.ball.vel.x = - this.ball.vel.x;
      if (this.ball.vel.y < 0) {
      } else {
      }
      bs.setPosition(ccsx.getLeft(p2.sprite) - ccsx.getWidth(bs) / 2, bp.y);
      sh.xcfg.sfxPlay('o_hit');
    }
    else
    if ( ccsx.collide(p1,this.ball)) {
      this.ball.vel.x = - this.ball.vel.x;
      if (this.ball.vel.y < 0) {
      } else {
      }
      bs.setPosition(ccsx.getRight(p1.sprite) + ccsx.getWidth(bs) / 2, bp.y);
      sh.xcfg.sfxPlay('x_hit');
    }
  },

  operational: function() {
    return echt(this.ball);
  },

  onWinner: function(p) {
    this.getHUD().updateScore(p,1);
    this.ball.dispose();
    this.ball=null;
    var rc= this.getHUD().isDone();
    if (rc[0]) {
      this.doDone( rc[1] );
    } else {
      this.spawnBall();
    }
  },

  doDone: function(p) {
    this.getHUD().drawResult(p);
    this.getHUD().endGame();
    sh.xcfg.sfxPlay('game_end');
  },

  setGameMode: function(mode) {
    this.getHUD().setGameMode(mode);
    this._super(mode);
  }

});

asterix.Pong.Factory = {

  create: function(options) {
    var fac = new asterix.XSceneFactory({ layers: [ BackLayer, GameLayer, HUDLayer ] });
    var scene= fac.create(options);
    if (!scene) { return null; }
    scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
      asterix.XMenuLayer.onShowMenu();
    });
    scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
      sh.main.replay();
    });

    return scene;
  }

};


}).call(this);





