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

function moduleFactory(sjs, asterix, xcfg, ccsx,
                       layers, scenes,
                       mmenus, undef) { "use strict";
var sh = asterix,
SEED= {
  grid: [0,0,0, 0,0,0, 0,0,0],
  size: 3,
  ppids: { },
  pnum: 1,
  mode: 0
};

//////////////////////////////////////////////////////////////////////////////
//
var MainMenuLayer = mmenus.XMenuLayer.extend({

  rtti: function() { return 'MainMenuLayer'; },

  pkInit: function() {

    var csts = xcfg.csts,
    pobj2,
    pobj1,
    cw = ccsx.center(),
    wz = ccsx.screen();

    this.addItem(ccsx.tmenu1({
      fontPath: sh.getFontPath('font.OogieBoogie'),
      text: sh.l10n('%online'),
      selector: function() {
        sh.fireEvent('/mmenu/controls/online',
                     sjs.mergeEx(SEED,
                                 { mode: sh.ONLINE_GAME }));
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
                                 {ppids: pobj2,
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
                                 {ppids: pobj1,
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
return {

  'MainMenu' : {
      create = function (options) {
        var gl = sh.protos['GameArena'],
        mm= sh.protos['MainMenu'],
        ol= sh.protos['OnlinePlay'],
        dir= cc.director,
        scene = new scenes.XSceneFactory([
          mmenus.XMenuBackLayer,
          MainMenuLayer
        ]).create(options);
        if (scene) {
          scene.ebus.on('/mmenu/controls/newgame', function(topic, msg) {
            dir.runScene( gl.create(msg));
          });
          scene.ebus.on('/mmenu/controls/online', function(topic, msg) {
            msg.onBack=function() {
              dir.runScene( mm.create());
            };
            msg.yes=function(wss,pnum,startmsg) {
              var m= sjs.mergeEx( R.omit(['yes', 'onBack'], msg), {
                wsock: wss,
                pnum: pnum
              });
              sjs.merge(m, startmsg);
              dir.runScene( gl.create(m));
            }
            dir.runScene( ol.create(msg));
          });
        }
        return scene;
    }
  }

};


}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("cherimoia/games/mmenu",
            ['cherimoia/skarojs',
             'cherimoia/zlab/asterix',
             'cherimoia/zlab/asterix/xcfg',
             'cherimoia/zlab/asterix/ccsx',
             'cherimoia/zlab/asterix/xlayers',
             'cherimoia/zlab/asterix/xscenes',
             'cherimoia/zlab/asterix/xmmenus'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

