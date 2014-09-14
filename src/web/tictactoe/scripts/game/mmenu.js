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

(function (undef) { "use strict"; var global= this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sjs= global.SkaroJS;

var SEED= {
  seed_data: {
    grid: [0,0,0,
           0,0,0,
           0,0,0],
    size: 3,
    players: { }
  },
  pnum: 1,
  mode: 0
};

//////////////////////////////////////////////////////////////////////////////
// Main menu.
//////////////////////////////////////////////////////////////////////////////

var MainMenuLayer = asterix.XMenuLayer.extend({

  rtti: function() { return 'MainMenuLayer'; },

  pkInit: function() {

    var csts = sh.xcfg.csts,
    pobj2, pobj1,
    cw = ccsx.center(),
    wz = ccsx.screen();

    this.addItem(ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%online'),
      selector: function() {
        sh.fireEvent('/mmenu/controls/online',
                     sjs.mergeEx(SEED,
                                 { mode: sh.ONLINE_GAME 3 }));
      },
      target: this,
      scale: 0.5,
      pos: cc.p(114, wz.height - csts.TILE * 18 - 2)
    }));

    pobj2={};
    pobj2[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
    pobj2[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
    this.addItem(ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%2players'),
      selector: function() {
        sh.fireEvent('/mmenu/controls/newgame',
                     sjs.mergeEx(SEED,
                                 { seed_data: { players: pobj2 },
                                   mode: sh.P2_GAME }));
      },
      target: this,
      scale: 0.5,
      pos: cc.p(cw.x + 68, wz.height - csts.TILE * 28 - 4)
    }));

    pobj1={};
    pobj1[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
    pobj1[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
    this.addItem(ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%1player'),
      selector: function() {
        sh.fireEvent('/mmenu/controls/newgame',
                     sjs.mergeEx(SEED,
                                 { seed_data: { players: pobj1 },
                                   mode: sh.P1_GAME }));
      },
      target: this,
      scale: 0.5,
      pos: cc.p(cw.x, csts.TILE * 19)
    }));

    this.doCtrlBtns();

    return this._super();
  }


});

//////////////////////////////////////////////////////////////////////////////
//
sh.protos['MainMenu'] = {

  create: function(options) {

    var tttf= asterix.TicTacToe.Factory,
    dir=cc.director,
    scene = new asterix.XSceneFactory([
      asterix.XMenuBackLayer,
      MainMenuLayer
    ]).create(options);

    if (scene) {
      scene.ebus.on('/mmenu/controls/newgame', function(topic, msg) {
        dir.runScene( tttf.create(msg));
      });
      scene.ebus.on('/mmenu/controls/online', function(topic, msg) {
        msg.onBack=function() {
          dir.runScene( sh.protos['MainMenu'].create());
        };
        msg.yes=function(wss,pnum,startmsg) {
          var m= sjs.mergeEx( _.omit(msg, 'yes', 'onBack'), {
            wsock: wss,
            pnum: pnum
          });
          m.seed_data.players = startmsg.players;
          dir.runScene( tttf.create(m));
        }
        dir.runScene( sh.protos['OnlinePlay'].create(msg));
      });
    }

    return scene;
  }

};




}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

