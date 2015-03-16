// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Ken Leung. All rights reserved.

define("zotohlab/p/mmenu", ['cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, layers, scenes) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R=sjs.ramda,
    undef,
    SEED= {
      ppids: {},
      grid: [
        0,0,0,
        0,0,0,
        0,0,0
      ],
      size: 3,
      pnum: 1,
      mode: 0
    },

    //////////////////////////////////////////////////////////////////////////////
    MainMenuLayer = layers.XLayer.extend({

      rtti: function() { return 'MainMenuLayer'; },

      pkInit: function() {

        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        sz, tt, menu;

        // show background image
        this.centerImage(sh.getImagePath('game.bg'));

        // show the title
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: cc.color(246,177,127),
          scale: xcfg.game.scale
        });
        this.addItem(tt);

        // show the menu
        menu= ccsx.vmenu([
          { imgPath: '#online.png',
            cb: function() {
              sh.fireEvent('/mmenu/controls/online',
                           sjs.mergeEx(SEED,
                                       { mode: sh.ONLINE_GAME }));
            }},
          { imgPath: '#player2.png',
            cb: function() {
              var p={};
              p[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
              p[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
              sh.fireEvent('/mmenu/controls/newgame',
                           sjs.mergeEx(SEED,
                                       {ppids: p,
                                        mode: sh.P2_GAME }));
            }},
          { imgPath: '#player1.png',
            cb: function() {
              var p={};
              p[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
              p[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
              sh.fireEvent('/mmenu/controls/newgame',
                           sjs.mergeEx(SEED,
                                       {ppids: p,
                                        mode: sh.P1_GAME }));
            }}
        ]);
        menu.setPosition(cw);
        this.addItem(menu);

        // show the control buttons
        this.addAudioIcon({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          color: cc.color(94,49,120),
          anchor: cc.p(1,0)
        });

        // show back & quit
        menu= ccsx.hmenu([
          { color: cc.color(94,49,120),
            imgPath: '#icon_back.png',
            cb: function() {
              if (!!this.options.onBack) {
                this.options.onBack();
              }
            },
            target: this },
          { color: cc.color(94,49,120),
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

    //////////////////////////////////////////////////////////////////////////////
    //
    return {
      'MainMenu' : {
        create: function (options) {
          var gl = sh.protos['GameArena'],
          mm= sh.protos['MainMenu'],
          ol= sh.protos['OnlinePlay'],
          dir= cc.director,
          scene = new scenes.XSceneFactory([
            MainMenuLayer
          ]).create(options);

          scene.ebus.on('/mmenu/controls/newgame',
                        function(topic, msg) {
            dir.runScene( gl.create(msg));
          });
          scene.ebus.on('/mmenu/controls/online',
                        function(topic, msg) {

            msg.yes=function(wss,pnum,startmsg) {
              var m= sjs.mergeEx( R.omit(['yes', 'onBack'], msg), {
                wsock: wss,
                pnum: pnum
              });
              sjs.merge(m, startmsg);
              dir.runScene( gl.create(m));
            }

            msg.onBack=function() {
              dir.runScene( mm.create());
            };

            dir.runScene( ol.create(msg));
          });

          return scene;
        }
      }
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

