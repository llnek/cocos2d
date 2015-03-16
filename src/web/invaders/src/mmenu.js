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

define('zotohlab/p/mmenu',

       ['cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers',
       'zotohlab/asx/xscenes',
       'zotohlab/asx/xmmenus'],

  function (sjs, sh, ccsx, layers, scenes, mmenus) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    MainMenuLayer = layers.XLayer.extend({

      rtti: function() { return 'MenuLayer'; },

      pkInit: function() {
        var cw = ccsx.center(),
        wb = ccsx.vbox(),
        sz, tt, menu;

        this.centerImage(sh.getImagePath('game.bg'));

        // show the title
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: cc.color(255,255,255),
          scale: xcfg.game.scale
        });
        this.addItem(tt);

        menu= ccsx.pmenu1({
          imgPath: '#play.png',
          cb: function() {
            sh.fireEvent('/mmenu/controls/newgame', { mode: sh.P1_GAME });
          }
        });
        menu.setPosition(cw);
        this.addItem(menu);

        // show the control buttons
        this.addAudioIcon({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          color: cc.color(255,255,255),
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

    return {

      'MainMenu' : {

        create: function(options) {
          var scene = new scenes.XSceneFactory([
            MainMenuLayer
          ]).create(options);

          scene.ebus.on('/mmenu/controls/newgame', function(topic, msg) {
            cc.director.runScene( sh.protos['GameArena'].create(msg));
          });

          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

