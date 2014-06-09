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
asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
SkaroJS = global.SkaroJS;

//////////////////////////////////////////////////////////////////////////////
// Main menu.
//////////////////////////////////////////////////////////////////////////////

var MainMenuLayer = asterix.XMenuLayer.extend({

  pkInit: function() {
    var dir= cc.director,
    csts = sh.xcfg.csts,
    cw = ccsx.center(),
    wz = ccsx.screen();

    this.addItem( ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%online'),
      selector: function() {
        sh.fireEvent('/mmenu/controls/newgame', { mode: 3});
      },
      target: this,
      scale: 0.5,
      pos: cc.p(114, wz.height - csts.TILE * 18 - 2)
    }));

    this.addItem(ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%2players'),
      scale: 0.5,
      selector: function() {
        sh.fireEvent('/mmenu/controls/newgame', { mode: 2});
      },
      target: this,
      pos: cc.p(cw.x + 68, wz.height - csts.TILE * 28 - 4)
    }));

    this.addItem(ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%1player'),
      scale: 0.5,
      selector: function() {
        sh.fireEvent('/mmenu/controls/newgame', { mode: 1});
      },
      target: this,
      pos: cc.p(cw.x, csts.TILE * 19)
    }));

    this.doCtrlBtns();

    return this._super();
  }

});

sh.protos['MainMenu'] = {

  create: function(options) {
    var scene = new asterix.XSceneFactory({
      layers: [
        asterix.XMenuBackLayer,
        MainMenuLayer
      ]
    }).create(options);
    if (scene) {
      scene.ebus.on('/mmenu/controls/newgame', function(topic, msg) {
        cc.director.runScene( asterix.Bricks.Factory.create(msg));
      });
    }
    return scene;
  }

};



}).call(this);


