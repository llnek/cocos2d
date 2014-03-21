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

(function(undef) { "use strict"; var global=this; var _ = global._;
var asterix = global.ZotohLabs.Asterix;
var ccsx= asterix.COCOS2DX;
var sh= asterix.Shell;
var png= asterix.Pong;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var arenaLayer = asterix.XGameLayer.extend({

  scores : { 'O': 0, 'X': 0 },
  MAX_SCORE: 9, //11,
  ball: null,

  play: function() {
    var p2Img= cc.Sprite.create(sh.xcfg.getImagePath('gamelevel1.images.paddle2'));
    var p1Img= cc.Sprite.create(sh.xcfg.getImagePath('gamelevel1.images.paddle1'));
    var ballImg= cc.Sprite.create(sh.xcfg.getImagePath('gamelevel1.images.ball'));
    var csts= sh.xcfg.csts;
    var cw= ccsx.center();
    var wz= ccsx.screen();
    var p1x,p2x;

    this.doLayout();

    p2x = wz.width - csts.TILE - 4 - ballImg.getContentSize().width - p2Img.getContentSize().width/2;
    p1x = csts.TILE + ballImg.getContentSize().width + 4 + p1Img.getContentSize().width/2;
    this.maybeReset();

    var p1 = new png.EntityHuman( p1x, cw.y, { color: 'X' });
    var p2= null;
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

    this.players= [ null, p1, p2];
    this.addChild(p1.create(), this.lastZix, ++this.lastTag);
    this.addChild(p2.create(), this.lastZix, ++this.lastTag);
    this.spawnBall();
    this.drawScores();

    return true;
  },

  spawnBall: function() {
    var ballImg= cc.Sprite.create(sh.xcfg.getImagePath('gamelevel1.images.ball'));
    var cw= ccsx.center();
    this.ball = new png.EntityBall( cw.x, cw.y, {});
    if (this.players[2].isRobot()) {
      this.players[2].bindBall(this.ball);
    }
    this.addChild(this.ball.create(), this.lastZix, ++this.lastTag);
  },

  doLayout: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.arena'));
    var csts= sh.xcfg.csts;
    var cw= ccsx.center();
    var wz= ccsx.screen();
    var title;

    this.addChild(map, this.lastZix, ++this.lastTag);

    title= cc.LabelBMFont.create(this.p1ID + " / " + this.p2ID, sh.xcfg.getFontPath('font.TinyBoxBB'));
    title.setPosition(cw.x, wz.height - csts.TILE * 6 /2 );
    title.setScale(12/72);
    title.setOpacity(0.9*255);
    this.addChild(title, this.lastZix, ++this.lastTag);

    this.score1= cc.LabelBMFont.create('8', sh.xcfg.getFontPath('font.OCR'));
    this.score1.setScale(36/72);
    this.score1.setOpacity(0.9*255);
    this.score1.setColor(new cc.Color3B(255,0,0)); // 0xff0000
    this.score1.setPosition( cw.x - ccsx.getScaledWidth(title)/2 - ccsx.getScaledWidth(this.score1)/2 - 10,
    wz.height - csts.TILE * 6 /2 - 2);
    this.addChild(this.score1, this.lastZix, ++this.lastTag);

    this.score2= cc.LabelBMFont.create('8', sh.xcfg.getFontPath('font.OCR'));
    this.score2.setScale(36/72);
    this.score2.setOpacity(0.9*255);
    this.score2.setColor(new cc.Color3B(106,190,97)); // 0x6ABE61
    this.score2.setPosition(
    cw.x + ccsx.getScaledWidth(title)/2 + ccsx.getScaledWidth(this.score1)/2 + 6,
    wz.height - csts.TILE * 6 /2 - 2);
    this.addChild(this.score2, this.lastZix, ++this.lastTag);

    this.resultMsg = cc.LabelBMFont.create('', sh.xcfg.getFontPath('font.TinyBoxBB'));
    this.resultMsg.setPosition(cw.x,  100);
    this.resultMsg.setScale(24/72);
    this.resultMsg.setOpacity(0.9*255);
    this.addChild(this.resultMsg, this.lastZix, ++this.lastTag);
    this.resultMsg.setVisible(false);

    this.doCtrlBtns();
  },

  doCtrlBtns: function() {
    var x, y, csts = sh.xcfg.csts;
    var wz= ccsx.screen();
    var cw= ccsx.center();
    var s1,s2,t1,t2,menu;

    s1= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.menu'));
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      this.goMenu();
    }, this);
    t1.setScale(28/48);
    menu= cc.Menu.create(t1);
    menu.setPosition(wz.width - csts.TILE - ccsx.getScaledWidth(t1)/2,
    wz.height - csts.TILE * 6 /2 );
    this.addChild(menu, this.lastZix, ++this.lastTag);

    s2= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.replay'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      this.pkReplay();
    }, this);
    t2.setScale(28/48);
    this.replayBtn= cc.Menu.create(t2);
    this.replayBtn.setPosition(csts.TILE + ccsx.getScaledWidth(t2)/2, wz.height - csts.TILE * 6 /2 );
    this.replayBtn.setVisible(false);
    this.addChild(this.replayBtn, this.lastZix, ++this.lastTag);
  },

  drawScores: function() {
    var s2 = this.scores[this.players[2].color];
    var s1 = this.scores[this.players[1].color];
    var csts= sh.xcfg.csts;
    var wz = ccsx.screen();
    var n2 = global.ZotohLabs.prettyNumber(s2,1);
    var n1 = global.ZotohLabs.prettyNumber(s1,1);

    this.score1.setString(n1);
    this.score2.setString(n2);
  },

  newGame: function(mode) {
    sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.resetScores();
    return this.play();
  },

  resetScores: function() {
    this.scores= { 'X' : 0, 'O' : 0 };
  },

  maybeReset: function() {
    this.players=[];
    this.actor=null;
  },

  updateEntities: function(dt) {
    this.players[2].update(dt);
    this.players[1].update(dt);
    this.ball.update(dt);
  },

  checkEntities: function() {
    var p2s = this.players[2].sprite;
    var p1s = this.players[1].sprite;
    var bs = this.ball.sprite;
    var bp= bs.getPosition();
    if ( bp.x < ccsx.getLeft(p1s)) {
      // p2 scores
      this.onWinner(this.players[2]);
    }
    else
    if (bp.x > ccsx.getRight(p2s)) {
      // p1 scores
      this.onWinner(this.players[1]);
    }
    else if (ccsx.checkCollide(p2s,bs)) {
      this.ball.vel.x = - this.ball.vel.x;
      if (this.ball.vel.y < 0) {
      } else {
      }
      bs.setPosition(ccsx.getLeft(p2s) - ccsx.getWidth(bs) / 2, bs.getPosition().y);
      sh.xcfg.sfxPlay('o_hit');
    }
    else
    if ( ccsx.checkCollide(p1s,bs)) {
      this.ball.vel.x = - this.ball.vel.x;
      if (this.ball.vel.y < 0) {
      } else {
      }
      bs.setPosition(ccsx.getRight(p1s) + ccsx.getWidth(bs) / 2, bs.getPosition().y);
      sh.xcfg.sfxPlay('x_hit');
    }
  },

  update: function(dt) {
    if (this.ball) {
      this.updateEntities(dt);
      this.checkEntities();
    }
    this.drawGui();
  },

  onWinner: function(p) {
    this.removeChild(this.ball.kill(), true);
    var s = this.scores[p.color];
    this.scores[p.color] = s + 1;
    this.ball=null;
    if (s+1 >= this.MAX_SCORE) {
      this.onDone(p);
    } else {
      this.spawnBall();
    }
  },

  onDone: function(p) {
    this.replayBtn.setVisible(true);
    this.lastWinner = p;
    this.drawResult();
    sh.xcfg.sfxPlay('game_end');
  },

  drawResult: function() {
  // report game result please.
    var msg, p1, p2;

    //this.status.setVisible(false);

    p2= this.players[2];
    p1= this.players[1];
    switch (this.lastWinner) {
      case p2: msg= sh.l10n('%whowin', { who: this.p2Long}); break;
      case p1: msg= sh.l10n('%whowin', { who: this.p1Long}); break;
      default: msg= sh.l10n('%whodraw'); break;
    }

    this.resultMsg.setString(msg);
    this.resultMsg.setVisible(true);
  },

  drawGui: function() {
    this.drawScores();
  },

  setGameMode: function(mode) {
    this.p2ID= sh.l10n("%p2");
    this.p1ID= sh.l10n("%p1");
    if (mode === 1) {
      this.p2Long= sh.l10n('%computer');
      this.p2ID= sh.l10n('%cpu');
    }
    this._super(mode);
  }

});

asterix.Pong.Factory = new asterix.XSceneFactory(arenaLayer);

}).call(this);





