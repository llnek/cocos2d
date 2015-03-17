// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/p/mmenu",

       ['cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers',
       'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    var SEED= { ppids: { }, pnum: 1, mode: 0 },
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MainMenuLayer = layers.XLayer.extend({

      rtti: function() { return 'MainMenuLayer'; },

      pkInit: function() {
        var dir= cc.director,
        cw= ccsx.center(),
        wb= ccsx.vbox(),
        sz, tt, menu;

        // show background image
        this.centerImage(sh.getImagePath('game.bg'));

        // show the title
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: cc.color('#EDFF90'),
          scale: xcfg.game.scale
        });
        this.addItem(tt);

        menu = ccsx.vmenu([
          { imgPath: '#online.png',
            cb: function() {
              sh.fireEvent('/mmenu/controls/online',
                           sjs.mergeEx(SEED,
                                       { mode: sh.ONLINE_GAME }));
            }
          },
          { imgPath: '#player2.png',
            cb: function() {
              var pobj2={};
              pobj2[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
              pobj2[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
              sh.fireEvent('/mmenu/controls/newgame',
                           sjs.mergeEx(SEED, {
                             ppids: pobj2,
                             mode: sh.P2_GAME }));
            }
          },
          {
            imgPath: '#player1.png',
            cb: function() {
              var pobj1={};
              pobj1[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
              pobj1[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
              sh.fireEvent('/mmenu/controls/newgame',
                           sjs.mergeEx(SEED, {
                             ppids: pobj1,
                             mode: sh.P1_GAME }));
            }
          }
        ]);
        menu.setPosition(cw);
        this.addItem(menu);

        // show the control buttons
        this.addAudioIcon({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          color: cc.color('#32baf4'),
          anchor: cc.p(1,0)
        });

        // show back & quit
        menu= ccsx.hmenu([
          { color: cc.color('#32baf4'),
            imgPath: '#icon_back.png',
            cb: function() {
              if (!!this.options.onBack) {
                this.options.onBack();
              }
            },
            target: this },
          { color: cc.color('#32baf4'),
            imgPath: '#icon_quit.png',
            cb: function() { this.onQuit(); },
            target: this }
        ]);
        sz= menu.getChildren()[0].getContentSize();
        menu.setPosition(wb.left + csts.TILE + sz.width * 1.1,
                         wb.bottom + csts.TILE + sz.height * 0.45);
        this.addItem(menu);

      }

    });

    return {

      'MainMenu' : {

        create: function(options) {

          var scene = new scenes.XSceneFactory([
            MainMenuLayer
          ]).create(options),
          fac = sh.protos['GameArena'],
          dir=cc.director;

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

          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

