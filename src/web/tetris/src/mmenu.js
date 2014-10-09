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

    var csts= xcfg.csts,
    undef,
    MainMenuLayer = mmenus.XMenuLayer.extend({

      pkInit: function() {
        var dir= cc.director,
        cw = ccsx.center(),
        wz = ccsx.screen();

        this.addItem(ccsx.tmenu1({
          fontPath: sh.getFontPath('font.OogieBoogie'),
          text: sh.l10n('%1player'),
          scale: 0.5,
          selector: function() {
            sh.fireEvent('/mmenu/controls/newgame', { mode: sh.P1_GAME});
          },
          target: this,
          pos: cc.p(cw.x, wz.height * 0.5)
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

