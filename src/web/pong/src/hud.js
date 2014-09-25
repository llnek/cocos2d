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

(function(undef) { "use strict"; var global=this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
sjs= global.SkaroJS;

var NILFUNC= function() {};



//////////////////////////////////////////////////////////////////////////////
// back layer
//////////////////////////////////////////////////////////////////////////////

png.BackLayer = asterix.XLayer.extend({

  rtti: function() { return 'BackLayer'; },

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gamelevel1.tiles.arena'));
    this.addItem(map);
    return this._super();
  },


});

//////////////////////////////////////////////////////////////////////////////
// HUD layer
//////////////////////////////////////////////////////////////////////////////

png.HUDLayer = asterix.XGameHUDLayer.extend({

  scores:  { 'O': 0, 'X': 0 },
  mode: 0,
  MAX_SCORE: 3, //11,

  p2Long: '',
  p1Long: '',
  p2ID: '',
  p1ID: '',

  setGameMode: function(mode) {
    this.mode=mode;
  },

  initParentNode: NILFUNC,

  regoPlayers: function(p1,p1ids,p2,p2ids) {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen();

    this.play2= p2;
    this.play1= p1;
    this.p2Long= p2ids[1];
    this.p1Long= p1ids[1];
    this.p2ID= p2ids[0];
    this.p1ID= p1ids[0];
    this.title.setString(this.p1ID + " / " + this.p2ID);

    this.score1.setPosition( cw.x - ccsx.getScaledWidth(this.title)/2 -
                             ccsx.getScaledWidth(this.score1)/2 - 10,
                             wz.height - csts.TILE * 6 /2 - 2);
    this.score2.setPosition( cw.x + ccsx.getScaledWidth(this.title)/2 +
                             ccsx.getScaledWidth(this.score2)/2 + 6,
                             wz.height - csts.TILE * 6 /2 - 2);
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
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      scale: 12/72,
      pos: cc.p( cw.x, wz.height - csts.TILE * 6 /2 )
    });
    this.addItem(this.title);

    this.score1= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.OCR'),
      text: '8',
      scale: 36/72,
      color: cc.color(255,0,0)
    });
    this.addItem(this.score1);

    this.score2= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.OCR'),
      text: '8',
      scale: 36/72,
      color: cc.color(106, 190, 97) //#6abe61
    });
    this.addItem(this.score2);

    this.resultMsg = ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      visible: false,
      pos: cc.p(cw.x,  100),
      scale: 24/72
    });
    this.addItem(this.resultMsg);

  },

  initCtrlBtns: function() {
    this._super(28/48, 'cc.ALIGN_TOP');
  },

  initIcons: function() {
  },

  isDone: function() {
    var s2= this.scores[this.play2],
    s1= this.scores[this.play1],
    rc= [false, null];

    if (s2 >= this.MAX_SCORE) { rc = [ true, this.play2]; }
    if (s1 >= this.MAX_SCORE) { rc = [ true, this.play1]; }
    return rc;
  },

  updateScores: function(scores) {
    this.scores[this.play2] = scores[this.play2];
    this.scores[this.play1] = scores[this.play1];
    this.drawScores();
  },

  updateScore: function(actor,value) {
    this.scores[actor.color] = this.scores[actor.color] + value;
    this.drawScores();
  },

  drawScores: function() {
    var s2 = this.play2 ? this.scores[this.play2] : 0,
    s1 = this.play1 ? this.scores[this.play1] : 0,
    n2 = sjs.prettyNumber(s2,1),
    n1 = sjs.prettyNumber(s1,1);
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


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF



