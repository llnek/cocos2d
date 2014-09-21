// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sh= asterix,
sjs = global.SkaroJS,
ttt= asterix.TicTacToe;

var NILFUNC=function() {};
var PLAYER_THINK_TIME= 7;

//////////////////////////////////////////////////////////////////////////////
// back layer
//////////////////////////////////////////////////////////////////////////////

ttt.BackLayer = asterix.XLayer.extend({

  rtti: function() { return 'tttBackLayer'; },

  pkInit: function() {
    var map = new cc.TMXTiledMap(sh.getTilesPath('gamelevel1.tiles.arena'));
    this.addItem(map);
    return this._super();
  }

});

//////////////////////////////////////////////////////////////////////////////
// HUD layer
//////////////////////////////////////////////////////////////////////////////

ttt.HUDLayer = asterix.XGameHUDLayer.extend({

  scores : {
    sh.xcfg.csts.P2_COLOR: 0,
    sh.xcfg.csts.P1_COLOR: 0
  },

  mode: 0,

  // these will be set by the game
  p2Long: '',
  p1Long: '',
  p2ID: '',
  p1ID: '',

  setGameMode: function(mode) {
    this.mode= mode;
  },

  initParentNode: NILFUNC,

  initLabels: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen();

    this.title = ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      anchor: ccsx.AnchorTop,
      scale: 12/72,
      pos: cc.p(cw.x, wz.height - csts.TILE - csts.GAP)
    });
    this.addItem(this.title);

    this.score1= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '888',
      scale: 20/72,
      color: cc.color(253,188,178), // 0xfdbcb2;
      pos: cc.p(csts.TILE + csts.S_OFF + 2,
                wz.height - csts.TILE - csts.S_OFF),
      anchor: ccsx.AnchorTopLeft
    });
    this.addItem(this.score1);

    this.score2= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '888',
      scale: 20/72,
      color: cc.color(255,102,0), // 0xff6600;
      pos: cc.p(wz.width - csts.TILE - csts.S_OFF,
                wz.height - csts.TILE - csts.S_OFF),
      anchor: ccsx.AnchorTopRight
    });
    this.addItem(this.score2);

    this.status= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      scale: 12/72,
      pos: cc.p(cw.x, csts.TILE * 10)
    });
    this.addItem(this.status);

    this.result= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      scale: 12/72,
      pos: cc.p(cw.x, csts.TILE * 10),
      visible: false
    });
    this.addItem(this.result);

  },

  showTimer: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen();

    if (this.countDownState) {
      // timer is already showing, go away
      return;
    }

    if (! this.countDown) {
      this.countDown= ccsx.bmfLabel({
        fontPath: sh.getFontPath('font.TinyBoxBB'),
        text: '',
        scale: 20/72,
        color: cc.color(255,255,255), // 0xff6600;
        pos: cc.p(wz.width/2,
                  wz.height - csts.TILE - csts.S_OFF - 40),
        anchor: ccsx.AnchorCenter
      });
      this.addItem(this.countDown);
    }

    this.countDownValue= PLAYER_THINK_TIME;
    this.countDown.setString('' + this.countDownValue);

    this.schedule(this.updateTimer,1.0);
    this.countDownState= true;
  },

  updateTimer: function(dt) {

    if (!this.countDownState) {
      return;
    }

    this.countDownValue -= 1;
    if (this.countDownValue < 0) {
      this.killTimer();
      sh.fireEvent('/game/player/timer/expired', {});
    }
    else if (this.countDown) {
      this.countDown.setString('' + this.countDownValue);
    }
  },

  killTimer: function() {
    if (this.countDownState) {
      this.unschedule(this.updateTimer);
      this.countDown.setString('');
      //this.removeItem(this.countDown);
    }
    this.countDownState=false;
    this.countDownValue=0;
    //this.countDown=null;
  },

  updateScore: function(p, value) {
    this.scores[p.color] += value;
    this.drawScores();
  },

  endGame: function() {
    this.replayBtn.setVisible(true);
    this.result.setVisible(true);
    this.status.setVisible(false);
  },

  drawStatusText: function(obj, msg) {
    obj.setString( msg);
  },

  drawScores: function() {
    var s2 = this.scores[this.play2],
    s1 = this.scores[this.play1],
    csts= sh.xcfg.csts,
    wz = ccsx.screen(),
    n2 = sjs.prettyNumber(s2,3),
    n1 = sjs.prettyNumber(s1,3);

    this.score1.setString(n1);
    this.score2.setString(n2);
  },

  drawResult: function(winner) {
    var msg='';

    if (_.isObject(winner)) {
      switch (winner.number() ) {
        case 2: msg= sh.l10n('%whowin', { who: this.p2Long}); break;
        case 1: msg= sh.l10n('%whowin', { who: this.p1Long}); break;
      }
    } else {
      msg= sh.l10n('%whodraw');
    }

    this.drawStatusText(this.result, msg);
  },

  drawStatus: function(actor) {
    if (_.isObject(actor)) {
      var pfx = actor.number() === 1 ? this.p1Long : this.p2Long;
      this.drawStatusText(this.status, sh.l10n('%whosturn', { who: pfx }));
    }
  },

  regoPlayers: function(color1,p1ids,color2,p2ids) {
    this.play2= color2;
    this.play1= color1;
    this.p2Long= p2ids[1];
    this.p1Long= p1ids[1];
    this.p2ID= p2ids[0];
    this.p1ID= p1ids[0];
    this.title.setString(this.p1ID + " / " + this.p2ID);
  },

  initIcons: NILFUNC,

  resetAsNew: function() {
    this.scores= { 'O': 0, 'X': 0 };
    this.reset();
  },

  reset: function() {
    this.replayBtn.setVisible(false);
    this.result.setVisible(false);
    this.status.setVisible(true);
  }


});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

