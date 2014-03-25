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
sh = asterix.Shell,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameHUDLayer = asterix.XLayer.extend({

  maybeReset: function() {
    this.disableReplay();
    this.score= 0;
    this.lives.resurrect();
  },

  lives: null,
  score: 0,

  pkInit: function() {
    this.initLayer();
    this.initScore();
    this.initLives();
    this.initCtrlBtns();
    return true;
  },

  reduceLives: function(n) {
    this.lives.reduceLives(n);
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
      this.goMenu();
    }, this);
    if (scale !== 1) {
      t1.setScale(scale);
    }
    menu= cc.Menu.create(t1);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF -
      ccsx.getScaledWidth(t1) / 2,
      csts.TILE + csts.S_OFF + ccsx.getScaledHeight(t1) / 2);
    this.addItem(menu);

    s2= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.replay'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      this.pkReplay();
    }, this);
    if (scale !== 1) {
      t2.setScale(scale);
    }
    this.replayBtn= cc.Menu.create(t2);
    this.replayBtn.setPosition(cw.x, csts.TILE + csts.S_OFF + ccsx.getScaledHeight(t2) / 2);
    this.replayBtn.setVisible(false);
    this.addItem(this.replayBtn);
  },

  goMenu: function() {
    var dir= cc.Director.getInstance();
    dir.pushScene( sh.protos['MainMenu'].create({
      onBack: function() {
        dir.popScene();
      }
    }));
  },

  pkReplay: function() {
    //this.replayBtn.setVisible(false);
    this.getLayer().removeAllChildren(true);
    this.play();
  }

});



}).call(this);


