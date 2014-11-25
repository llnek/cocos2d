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
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus'],

  function (sjs, sh, ccsx, layers, scenes, mmenus) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R=sjs.ramda,
    undef,
    SEED= {
      grid: [0,0,0,
        0,0,0,
        0,0,0],
      size: 3,
      ppids: {},
      pnum: 1,
      mode: 0
    },

    //////////////////////////////////////////////////////////////////////////////
    BGLayer = layers.XLayer.extend({

      rtti: function() { return "BGLayer"; },

      ctor: function() {
        var bg= new cc.Sprite(sh.getImagePath('game.bg')),
        cw= ccsx.center();
        this._super();
        bg.setPosition(cw.x, cw.y);
        this.addItem(bg);
      }


    }),

    //////////////////////////////////////////////////////////////////////////////
    MainMenuLayer = layers.XLayer.extend({

      rtti: function() { return 'MainMenuLayer'; },

      pkInit: function() {

        var cw = ccsx.center(),
        wz = ccsx.vrect(),
        wb= ccsx.vbox(),
        me=this,
        tt, menu;

        this._super();

        tt = new cc.LabelBMFont(sh.l10n('%mmenu'),
                                sh.getFontPath('font.JellyBelly')),
        tt.setPosition(cw.x, wb.top * 0.9);
        tt.setOpacity(0.9*255);
        tt.setScale(0.2);
        tt.setColor(cc.color(229,181,79));

        this.addItem(tt);

        menu= ccsx.pmenu([
          { imgPath: '#online.png',
            cb: function() {
              sh.fireEvent('/mmenu/controls/online',
                           sjs.mergeEx(SEED,
                                       { mode: sh.ONLINE_GAME }));
            },
            target: me },

          { imgPath: '#player2.png',
            cb: function() {
              var p={};
              p[ sh.l10n('%p1') ] = [ 1, sh.l10n('%player1') ];
              p[ sh.l10n('%p2') ] = [ 2, sh.l10n('%player2') ];
              sh.fireEvent('/mmenu/controls/newgame',
                           sjs.mergeEx(SEED,
                                       {ppids: p,
                                        mode: sh.P2_GAME }));
            },
            target: me },

          { imgPath: '#player1.png',
            cb: function() {
              var p={};
              p[ sh.l10n('%cpu') ] = [ 2, sh.l10n('%computer') ];
              p[ sh.l10n('%p1') ] = [ 1,  sh.l10n('%player1') ];
              sh.fireEvent('/mmenu/controls/newgame',
                           sjs.mergeEx(SEED,
                                       {ppids: p,
                                        mode: sh.P1_GAME }));
            },
            target: me },
        ]);
        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition(cw.x, cw.y);
        this.addItem(menu);

        this.doAudioToggle();
      },

      doAudioToggle: function() {
        var off= new cc.MenuItemSprite(ccsx.createSpriteFrame('sound_off.png'),
                                       ccsx.createSpriteFrame('sound_off.png'),
                                       ccsx.createSpriteFrame('sound_off.png'),
                                       sjs.NILFUNC, this),
        on= new cc.MenuItemSprite(ccsx.createSpriteFrame('sound_on.png'),
                                  ccsx.createSpriteFrame('sound_on.png'),
                                  ccsx.createSpriteFrame('sound_on.png'),
                                  sjs.NILFUNC, this),
        audio, menu, wb = ccsx.vbox();
        //off.setColor(cc.color(157,125,176));
        //on.setColor(cc.color(157,125,176));
        off.setColor(cc.color(94,49,120));
        on.setColor(cc.color(94,49,120));
        audio= new cc.MenuItemToggle(off, on, function(sender) {
          if (sender.getSelectedIndex() === 0) {
            sh.toggleSfx(true);
          } else {
            sh.toggleSfx(false);
          }
        });
        audio.setAnchorPoint(cc.p(0,0));
        if (xcfg.sound.open) {
          audio.setSelectedIndex(0);
        } else {
          audio.setSelectedIndex(1);
        }
        audio.setScale(32/off.getContentSize().width);
        menu= new cc.Menu(audio);
        menu.setPosition(wb.left + csts.TILE + csts.S_OFF,
                         wb.bottom + csts.TILE + csts.S_OFF);
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
            BGLayer,
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

