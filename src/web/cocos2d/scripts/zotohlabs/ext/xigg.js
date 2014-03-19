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

(function(undef) { "use stricts"; var global = this ; var _ = global._ ;
var asterix= global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var sh = asterix.Shell;
var loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameLayer = asterix.XLayer.extend({

  players: [],
  actor: null,

  setGameMode: function(mode) {
    sh.xcfg.csts.GAME_MODE=mode;
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
    menu= cc.Menu.create(t1);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF -
      s1.getContentSize().width / 2,
      csts.TILE + csts.S_OFF + s1.getContentSize().height / 2);
    this.addChild(menu, this.lastZix, ++this.lastTag);

    s2= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.replay'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      this.pkReplay();
    }, this);
    this.replayBtn= cc.Menu.create(t2);
    this.replayBtn.setPosition(cw.x, csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.replayBtn.setVisible(false);
    this.addChild(this.replayBtn, this.lastZix, ++this.lastTag);
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
    this.replayBtn.setVisible(false);
    this.removeAllChildren(true);
    this.play();
  },

  pkInit: function() {

    var rc= this._super();

    if (rc) {
      switch (this.options.mode) {

        case 2:
          rc= this.newGame(2);
        break;

        case 1:
          rc= this.newGame(1);
        break;

        default:
          rc= false;
        break;
      }

      if (rc) {
        this.scheduleUpdate();
      }
    }

    return rc;
  }


});


}).call(this);


