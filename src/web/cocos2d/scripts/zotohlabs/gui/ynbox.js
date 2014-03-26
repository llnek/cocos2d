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
// module def
//////////////////////////////////////////////////////////////////////////////

var BGLayer = asterix.XLayer.extend({
  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gui.ynbox'));
    this.addItem(map);
    return this._super();
  },

  pkInput: function() {}
});

var UILayer =  asterix.XLayer.extend({

  pkInit: function() {
    var qn= cc.LabelBMFont.create( sh.l10n('%quit?'), sh.xcfg.getFontPath('font.TinyBoxBB')),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    s1, s2, t1, t2, menu;

    qn.setPosition(cw.x, wz.height * 0.75);
    qn.setScale(18/72);
    qn.setOpacity(0.9*255);
    this.addItem(qn);

    s2= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.back'));
    s1= cc.Sprite.create( sh.xcfg.getImagePath('gui.mmenu.ok'));
    t2 = cc.MenuItemSprite.create(s2, null, null, function() {
      this.options.onBack();
    }, this);
    t1 = cc.MenuItemSprite.create(s1, null, null, function() {
      this.options.yes();
    }, this);

    menu= cc.Menu.create(t1,t2);
    menu.alignItemsHorizontally(10);
    menu.setPosition(wz.width - csts.TILE - csts.S_OFF - (s2.getContentSize().width + s1.getContentSize().width + 10) / 2,
      csts.TILE + csts.S_OFF + s2.getContentSize().height / 2);
    this.addItem(menu);

    return this._super();
  }

});

sh.protos['YesNo'] = {

  create: function(options) {
    var fac = new asterix.XSceneFactory({
      layers: [ BGLayer, UILayer ]
    });
    return fac.create(options);
  }

};


}).call(this);

