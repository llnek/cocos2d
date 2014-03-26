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
asterix= global.ZotohLabs.Asterix,
ccsx= asterix.COCOS2DX,
sh = asterix.Shell,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameHUDLayer = asterix.XLayer.extend({

  pkInit: function() {
    this.initNode();
    this.initScore();
    this.initLives();
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
    this.lives.resurrect();
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

  initCtrlBtns: function(scale) {
    var csts = sh.xcfg.csts,
    wz= ccsx.screen(),
    cw= ccsx.center(),
    x,y, menu,
    s1,s2,t1,t2;

    scale = scale || 1;

    s1 = cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.menu'));
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      sh.fireEvent('/game/hud/controls/showmenu');
    }, this);
    if (scale !== 1) {
      t1.setScale(scale);
    }
    menu= cc.Menu.create(t1);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF -
      ccsx.getScaledWidth(t1) / 2,
      csts.TILE + csts.S_OFF + ccsx.getScaledHeight(t1) / 2);
    this.addChild(menu, this.lastZix, ++this.lastTag);

    s2= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.replay'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      sh.fireEvent('/game/hud/controls/replay');
    }, this);
    if (scale !== 1) {
      t2.setScale(scale);
    }
    this.replayBtn= cc.Menu.create(t2);
    this.replayBtn.setPosition(cw.x, csts.TILE + csts.S_OFF + ccsx.getScaledHeight(t2) / 2);
    this.replayBtn.setVisible(false);
    this.addChild(this.replayBtn, this.lastZix, ++this.lastTag);
  }

});



}).call(this);


