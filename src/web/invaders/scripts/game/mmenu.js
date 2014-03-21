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
var MainMenu = asterix.XMenuLayer.extend({

  doLayout: function() {
    var dir= cc.Director.getInstance();
    var me=this, cw = ccsx.center();
    var csts = sh.xcfg.csts;
    var wz = ccsx.screen();
    var w,h, p,s1,s2,s3;
    var menu;
    var t1,t2;

    s1= cc.LabelBMFont.create(sh.l10n('%online'), sh.xcfg.getFontPath('font.OogieBoogie'));
    t1=cc.MenuItemLabel.create(s1,function() {
      console.log('dude!!!!!!!!!!');
    }, this);
    t1.setOpacity(255 * 0.9);
    t1.setScale(0.5);
    menu= cc.Menu.create(t1);
    menu.alignItemsVertically();
    menu.setPosition(114, wz.height - csts.TILE * 18 - 2);
    this.addChild(menu, this.lastZix, ++this.lastTag);

    s1= cc.LabelBMFont.create(sh.l10n('%2players'), sh.xcfg.getFontPath('font.OogieBoogie'));
    t1=cc.MenuItemLabel.create(s1,function() {
      dir.replaceScene( asterix.Invaders.Factory.create({
        mode: 2
      }) );
    }, this);
    t1.setOpacity(255 * 0.9);
    t1.setScale(0.5);
    menu= cc.Menu.create(t1);
    menu.alignItemsVertically();
    menu.setPosition(cw.x + 68, wz.height - csts.TILE * 28 - 4);
    this.addChild(menu, this.lastZix, ++this.lastTag);

    s1= cc.LabelBMFont.create(sh.l10n('%1player'), sh.xcfg.getFontPath('font.OogieBoogie'));
    t1=cc.MenuItemLabel.create(s1,function() {
      dir.replaceScene( asterix.Invaders.Factory.create({
        mode: 1
      }) );
    }, this);
    t1.setOpacity(255 * 0.9);
    t1.setScale(0.5);
    menu= cc.Menu.create(t1);
    menu.alignItemsVertically();
    menu.setPosition(cw.x + 0, csts.TILE * 19);
    this.addChild(menu, this.lastZix, ++this.lastTag);

    return this.doCtrlBtns();
  }

});

sh.protos['MainMenu'] = new asterix.XSceneFactory(MainMenu);


}).call(this);


