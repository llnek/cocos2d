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

(function(undef) { "use stricts"; var global = this, _ = global._ ,
asterix= global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
sh = asterix.Shell,
loggr= global.SkaroJS.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameHUDLayer = asterix.XLayer.extend({

  pkInit: function() {
    this.initParentNode();
    this.initLabels();
    this.initIcons();
    this.initCtrlBtns();
    return this._super();
  },

  scoreLabel: null,
  lives: null,
  score: 0,
  replayBtn: null,

  getScore: function() {
    return this.score;
  },

  reset: function() {
    this.disableReplay();
    this.score= 0;
    if (this.lives) { this.lives.resurrect(); }
  },

  reduceLives: function(n) {
    this.lives.reduce(n);
    return this.lives.isDead();
  },

  updateScore: function(num) {
    this.score += num;
    this.scoreLabel.setString(Number(this.score).toString());
  },

  disableReplay: function() {
    this.replayBtn.setVisible(false);
  },

  enableReplay: function() {
    this.replayBtn.setVisible(true);
  },

  initCtrlBtns: function(scale, where) {
    var csts = sh.xcfg.csts,
    wz= ccsx.screen(),
    cw= ccsx.center(),
    y, c, menu;

    where = where || cc.ALIGN_BOTTOM;
    scale = scale || 1;

    menu= ccsx.pmenu1({
      imgPath: sh.xcfg.getImagePath('gui.mmenu.menu'),
      scale: scale,
      selector: function() {
        sh.fireEvent('/game/hud/controls/showmenu'); }
    });
    c= menu.getChildByTag(1);
    if (where === cc.ALIGN_TOP) {
      y = wz.height - csts.TILE  - ccsx.getScaledHeight(c) / 2
    } else {
      y = csts.TILE  + ccsx.getScaledHeight(c) / 2
    }
    menu.setPosition(wz.width - csts.TILE - ccsx.getScaledWidth(c)/2, y);
    this.addItem(menu);

    menu = ccsx.pmenu1({
      imgPath: sh.xcfg.getImagePath('gui.mmenu.replay'),
      scale : scale,
      visible: false,
      selector: function() {
        sh.fireEvent('/game/hud/controls/replay'); }
    });
    c= menu.getChildByTag(1);
    if (where === cc.ALIGN_TOP) {
      y = wz.height - csts.TILE  - ccsx.getScaledHeight(c) / 2
    } else {
      y = csts.TILE  + ccsx.getScaledHeight(c) / 2
    }
    menu.setPosition(csts.TILE + ccsx.getScaledWidth(c)/2, y);
    this.replayBtn=menu;
    this.addItem(menu);
  }

});



}).call(this);


