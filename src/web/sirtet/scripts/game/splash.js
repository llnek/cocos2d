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

(function (undef) { "use strict"; var global= this, _ = global._  ,
asterix = global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh = asterix.Shell,
echt = global.ZotohLabs.echt,
loggr = global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// splash screen for the game - make it look nice please.
//////////////////////////////////////////////////////////////////////////////

var UILayer = asterix.XLayer.extend({

  pkInit: function() {
    var cw = ccsx.center();

    this.addItem(ccsx.pmenu1({
      imgPath: sh.xcfg.getImagePath('splash.play-btn'),
      selector: function() {
        sh.fireEvent('/splash/controls/playgame');
      },
      target: this,
      pos: cc.p(cw.x, 56)
    }));

    return this._super();
  }

});

sh.protos['StartScreen'] = {
  create: function(options) {
    var scene = new asterix.XSceneFactory({
      layers: [
        asterix.XSplashLayer,
        UILayer
      ]
    }).create(options);
    if (scene) {
      scene.ebus.on('/splash/controls/playgame', function() {
          var dir= cc.Director.getInstance(),
          ss= sh.protos['StartScreen'],
          mm= sh.protos['MainMenu'];
          dir.replaceScene( mm.create({
            onBack: function() { dir.replaceScene( ss.create() ); }
          }));
      });
    }
    return scene;
  }
};


}).call(this);

