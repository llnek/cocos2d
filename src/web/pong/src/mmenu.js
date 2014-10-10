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

define("zotohlab/p/mmenu", ['cherimoia/skarojs',
                             'zotohlab/asterix',
                             'zotohlab/asx/xcfg',
                             'zotohlab/asx/ccsx',
                             'zotohlab/asx/xlayers',
                             'zotohlab/asx/xscenes',
                             'zotohlab/asx/xmmenus'],

  function (sjs, sh, xcfg, ccsx,
            layers, scenes, mmenus) { "use strict";

    var SEED= { ppids: { }, pnum: 1, mode: 0 },
    csts = xcfg.csts,
    undef,
    MainMenuLayer = mmenus.XMenuLayer.extend({

      pkInit: function() {
        var dir= cc.director,
        pobj1, pobj2,
        cw = ccsx.center(),
        wz = ccsx.screen();

        this.addItem( ccsx.tmenu1({
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
          scale: 0.5,
          selector: function() {
            sh.fireEvent('/mmenu/controls/newgame',
                         sjs.mergeEx(SEED, {
                           ppids: pobj2,
                           mode: sh.P2_GAME }));
          },
          target: this,
          pos: cc.p(cw.x + 68, wz.height - csts.TILE * 28 - 4)
        }));

        pobj1={};
        pobj1[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
        pobj1[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];

        this.addItem(ccsx.tmenu1({
          fontPath: sh.getFontPath('font.OogieBoogie'),
          text: sh.l10n('%1player'),
          scale: 0.5,
          selector: function() {
            sh.fireEvent('/mmenu/controls/newgame',
                         sjs.mergeEx(SEED, {
                           ppids: pobj1,
                           mode: sh.P1_GAME }));
          },
          target: this,
          pos: cc.p(cw.x, csts.TILE * 19)
        }));

        this.doCtrlBtns();

        return this._super();
      }

    });

    return {

      'MainMenu' : {

        create: function(options) {

          var scene = new scenes.XSceneFactory([
            mmenus.XMenuBackLayer,
            MainMenuLayer
          ]).create(options),
          fac = sh.protos['GameArena'],
          dir=cc.director;

          if (!!scene) {

            scene.ebus.on('/mmenu/controls/newgame', function(topic, msg) {
              dir.runScene( fac.create(msg));
            });

            scene.ebus.on('/mmenu/controls/online', function(topic, msg) {
              msg.onBack=function() {
                dir.runScene( sh.protos['MainMenu'].create());
              };
              msg.yes=function(wss,pnum,startmsg) {
                var m= sjs.mergeEx( R.omit(['yes', 'onBack'], msg), {
                  wsock: wss,
                  pnum: pnum
                });
                m.ppids = startmsg.ppids;
                dir.runScene( fac.create(m));
              }
              dir.runScene( sh.protos['OnlinePlay'].create(msg));
            });

          }

          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

