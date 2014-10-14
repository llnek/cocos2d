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

define('zotohlab/p/mmenu', ['cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/xcfg',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus'],

  function (sjs, sh, xcfg, ccsx, layers, scenes, mmenus) { "use strict";

    var csts = xcfg.csts,
    undef,
    MainMenuLayer = mmenus.XMenuLayer.extend({

      pkInit: function() {
        var sps = [null,null,null],
        ms=[null,null,null],
        logo,
        menu, sp,
        cw = ccsx.center(),
        wz = ccsx.screen();

        logo = new cc.Sprite(sh.getImagePath('logo'));
        logo.setPosition(cw.x, wz.height * 0.65);
        this.addItem(logo);

        sp = sh.getImagePath('menu-btns');
        sps[2] = new cc.Sprite(sp, cc.rect(0, 33 * 2, 126, 33));
        sps[1] = new cc.Sprite(sp, cc.rect(0, 33, 126, 33));
        sps[0] = new cc.Sprite(sp, cc.rect(0, 0, 126, 33));
        ms[0] = new cc.MenuItemSprite(sps[0], sps[1], sps[2], function () {
            this.onButtonEffect();
sh.fireEvent('/mmenu/controls/newgame', { mode: sh.P1_GAME });
            //this.onNewGame();
            //flareEffect(flare, this, this.onNewGame);
        }.bind(this));

        sps[2]= new cc.Sprite(sp, cc.rect(126, 33 * 2, 126, 33));
        sps[1]= new cc.Sprite(sp, cc.rect(126, 33, 126, 33));
        sps[0]= new cc.Sprite(sp, cc.rect(126, 0, 126, 33));
        ms[1]= new cc.MenuItemSprite(sps[0], sps[1], sps[2], this.onSettings, this);

        sps[2]= new cc.Sprite(sp, cc.rect(252, 33 * 2, 126, 33));
        sps[1]= new cc.Sprite(sp, cc.rect(252, 33, 126, 33));
        sps[0]= new cc.Sprite(sp, cc.rect(252, 0, 126, 33));
        ms[2] = new cc.MenuItemSprite(sps[0],sps[1],sps[2], this.onAbout, this);

        menu = new cc.Menu(ms[0], ms[1], ms[2]);
        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition( cw.x, wz.height * 0.35);
        this.addItem(menu);


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
          ]).create(options);
          if (!!scene) {
            scene.ebus.on('/mmenu/controls/newgame', function(topic, msg) {
              cc.director.runScene( sh.protos['GameArena'].create(msg));
            });
          }
          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

