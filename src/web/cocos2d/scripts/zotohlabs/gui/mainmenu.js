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

(function (undef) { "use strict"; var global= this, _ = global._ ,
asterix = global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh = asterix.Shell,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// Main menu.
//////////////////////////////////////////////////////////////////////////////

asterix.XMenuBackLayer = asterix.XLayer.extend({
  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gui.mmenu')),
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    title = cc.LabelBMFont.create( sh.l10n('%mmenu'), sh.xcfg.getFontPath('font.JellyBelly'));

    title.setOpacity(0.9*255);
    title.setScale(0.6);
    title.setPosition(cw.x, wz.height - csts.TILE * 8 / 2);

    this.addItem(map);
    this.addItem(title);

    return this._super();
  },

  pkInput: function() {}

});

asterix.XMenuLayer= asterix.XLayer.extend({

  doCtrlBtns: function() {
    var audio = sh.xcfg.assets.sprites['gui.audio'],
    csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw = ccsx.center(),
    menu, t2,t1,
    w= audio[1],
    h= audio[2],
    p= sh.sanitizeUrl(audio[0]),
    s1= cc.Sprite.create(p, cc.rect(w,0,w,h)),
    s2= cc.Sprite.create(p, cc.rect(0,0,w,h));

    audio= cc.MenuItemToggle.create( cc.MenuItemSprite.create(s1),
                                     cc.MenuItemSprite.create(s2),
           function(sender) {
            if (sender.getSelectedIndex() === 0) {
              sh.xcfg.toggleSfx(true);
            } else {
              sh.xcfg.toggleSfx(false);
            }
           });
    audio.setAnchorPoint(cc.p(0,0));
    if (sh.xcfg.sound.open) {
      audio.setSelectedIndex(0);
    } else {
      audio.setSelectedIndex(1);
    }

    menu= cc.Menu.create(audio);
    menu.setPosition(csts.TILE + csts.S_OFF, csts.TILE + csts.S_OFF);
    this.addItem(menu);

    s2= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.back'));
    s1= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.quit'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      this.options.onBack();
    }, this);
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      this.pkQuit();
    }, this);

    menu= cc.Menu.create(t1,t2);
    menu.alignItemsHorizontally(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) / 2,
      csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addItem(menu);
  },

  pkQuit: function() {
    var dir= cc.Director.getInstance(),
    ss= sh.protos['StartScreen'],
    yn= sh.protos['YesNo'];

    dir.pushScene( yn.create({
      onBack: function() { dir.popScene(); },
      yes: function() {
        sh.xcfg.sfxPlay('game_quit');
        dir.replaceRootScene( ss.create() );
      }
    }));
  }

});

asterix.XMenuLayer.onShowMenu = function() {
  var dir= cc.Director.getInstance();
  dir.pushScene( sh.protos['MainMenu'].create({
    onBack: function() {
      dir.popScene();
    }
  }));
};

}).call(this);


