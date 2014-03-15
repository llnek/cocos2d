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
var sh = asterix.Shell;
var loggr = global.ZotohLabs.logger;
var echt = global.ZotohLabs.echt;


//////////////////////////////////////////////////////////////////////////////
// splash screen for the game - make it look nice please.
//////////////////////////////////////////////////////////////////////////////
var SplashLayer = cc.Layer.extend({

  pkInit: function() {
    var director = cc.Director.getInstance();
    var winSize = director.getWinSize();
    var me=this, cw = cc.p(winSize.width / 2, winSize.height / 2);
    var imgUrl= sh.xcfg.getImagePath('splash.splash');
    var s= cc.Sprite.create( imgUrl);
    s.setPosition(cw);
    this.addChild(s, 10, 1);

    imgUrl= sh.xcfg.getImagePath('splash.play-btn');
    var btn = cc.Sprite.create(imgUrl);
    var mi= cc.MenuItemSprite.create(btn, null, null, this.pkPlay, this);
    var menu = cc.Menu.create(mi);
    menu.alignItemsVerticallyWithPadding(10);
    this.addChild(menu, 11, 2);
    menu.setPosition(winSize.width / 2, 80);

    return true;
  },

  pkPlay: function() {
    var dir= cc.Director.getInstance();
    var options= {
      onBack: function() {
        dir.replaceScene( asterix.StartScreenFactory.create());
      }
    };
    dir.replaceScene( asterix.MainMenuFactory.create(options));
  },

  init: function() {
    return this._super() ? this.pkInit() : false;
  }

});


asterix.StartScreenFactory = {

  create: function() {
    var scene = cc.Scene.create();
    var y= new SplashLayer();
    return y.init() ? (function() { scene.addChild(y); return scene; })() : null;
  }

};



}).call(this);


