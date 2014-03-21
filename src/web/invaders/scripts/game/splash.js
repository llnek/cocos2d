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
// splash screen for the game - make it look nice please.
//////////////////////////////////////////////////////////////////////////////
var SplashLayer = asterix.XSplashLayer.extend({

  doLayout: function() {
    var imgUrl= sh.xcfg.getImagePath('splash.play-btn');
    var me=this, cw = ccsx.center();
    var winSize = ccsx.screen();
    var btn = cc.Sprite.create(imgUrl);
    var mi= cc.MenuItemSprite.create(btn, null, null, this.pkPlay, this);
    var menu = cc.Menu.create(mi);
    menu.alignItemsVerticallyWithPadding(10);
    this.addChild(menu, this.lastZix, ++this.lastTag);
    menu.setPosition(cw.x, 56);

    return true;
  }

});

sh.protos['StartScreen'] = new asterix.XSceneFactory(SplashLayer);

}).call(this);


