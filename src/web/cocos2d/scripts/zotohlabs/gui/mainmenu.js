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

(function (undef) { "use strict"; var global= this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var ccsx = asterix.COCOS2DX;
var sh = asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;

//////////////////////////////////////////////////////////////////////////////
// Main menu.
//////////////////////////////////////////////////////////////////////////////
var MenuLayer= cc.Layer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gui.mmenu'));
    var dir= cc.Director.getInstance();
    var me=this, cw = ccsx.center();
    var csts = sh.xcfg.csts;
    var wz = ccsx.screen();
    var menu, title, audio;
    var onep, twop, netp;
    var w,h, p,s1,s2,s3;
    var t1,t2,tag=0;
    var ssheet;

    this.addChild(map,10, ++tag);
    title= cc.LabelBMFont.create( sh.l10n('%mmenu'), sh.xcfg.getFontPath('font.TinyBoxBB'));
    title.setPosition(cw.x, wz.height - csts.TILE * 8 / 2);
    title.setScale(0.3333); // font size = 72, want 24
    title.setOpacity(0.9*255);
    this.addChild(title,11, ++tag);

    ssheet = sh.xcfg.assets.sprites['gui.mmenu.modes'];
    w= ssheet[1];
    h= ssheet[2];
    p= sh.sanitizeUrl(ssheet[0]);
    s1= cc.Sprite.create(p, cc.rect(0,0,w,h));
    s2= cc.Sprite.create(p, cc.rect(0,h,w,h));
    s3= cc.Sprite.create(p, cc.rect(0,2*h,w,h));

    onep = cc.MenuItemSprite.create(s1, null, null, function() {
      dir.replaceScene( asterix.TicTacToe.Factory.create({
        mode: 1
      }) );
    }, this);
    twop = cc.MenuItemSprite.create(s2, null, null, function() {
      dir.replaceScene( asterix.TicTacToe.Factory.create({
        mode: 2
      }) );
    }, this);
    //netp = cc.MenuItemSprite.create(s3, null, null, function() {}, this);

    onep.setScale(0.8);
    twop.setScale(0.8);
    menu= cc.Menu.create(onep, twop); //, netp);
    menu.alignItemsVerticallyWithPadding(20);
    menu.setPosition(cw.x, wz.height - csts.TILE * 20);
    this.addChild(menu, 11, ++tag);

    audio = sh.xcfg.assets.sprites['gui.audio'];
    w= audio[1];
    h= audio[2];
    p= sh.sanitizeUrl(audio[0]);
    s1= cc.Sprite.create(p, cc.rect(w,0,w,h));
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
    //menu.setAnchorPoint(cc.p(0,0));
    menu.setPosition(csts.TILE + csts.S_OFF, csts.TILE + csts.S_OFF);
    this.addChild(menu, 11, ++tag);

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
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF -
      (s2.getContentSize().width + s1.getContentSize().width + 10) / 2,
    csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addChild(menu, 11, ++tag);

    return true;
  },

  pkQuit: function() {
    var dir= cc.Director.getInstance();
    var options = {
      yes: function() {
        sh.xcfg.sfxPlay('game_quit');
        dir.replaceRootScene( asterix.StartScreenFactory.create() );
      },
      onBack: function() {
        dir.popScene();
      }
    }
    dir.pushScene( asterix.YesNoFactory.create(options));
  },

  init: function() {
    return this._super() ? this.pkInit() : false;
  },

  ctor: function(options) {
    this.options = options || {};
  }

});

asterix.MainMenuFactory = {
  create: function(options) {
    var scene = cc.Scene.create();
    var y= new MenuLayer(options);
    return y.init() ? (function() { scene.addChild(y); return scene; })() : null;
  }
};



}).call(this);


