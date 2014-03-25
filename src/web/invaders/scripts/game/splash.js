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

(function (undef) { "use strict"; var global= this,  _ = global._ ,
asterix = global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh = asterix.Shell,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// splash screen for the game - make it look nice please.
//////////////////////////////////////////////////////////////////////////////
var SplashLayer = asterix.XSplashLayer.extend({

  doLayout: function() {
    var imgUrl= sh.xcfg.getImagePath('splash.play-btn'),
    btn = cc.Sprite.create(imgUrl),
    cw = ccsx.center(),
    wz = ccsx.screen(),
    mi= cc.MenuItemSprite.create(btn, null, null, this.pkPlay, this),
    menu = cc.Menu.create(mi);

    menu.alignItemsVerticallyWithPadding(10);
    menu.setPosition(cw.x, 56);
    this.addChild(menu, this.lastZix, ++this.lastTag);
  }

});

var SFac = asterix.XSceneFactory.extends({

  createLayers: function(scene, options) {
    var y = new SplashLayer(options);
    if ( y.init()) {
      scene.addChild(y);
      return true;
    } else {
      return false;
    }
  }

});

sh.protos['StartScreen'] = new SFac();

}).call(this);


