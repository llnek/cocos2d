// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xmmenus
 * @module zotohlab/p/mmenu
 */
define('zotohlab/p/mmenu', ['cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus'],

  function (sjs, sh, ccsx, scenes, mmenus) { "use strict";

    /** @alias module:zotohlab/p/mmenu */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @extends module:zotohlab/asx/xmmenus.XMenuLayer
     * @class MainMenuLayer
     */
    MainMenuLayer = mmenus.XMenuLayer.extend({

      /**
       * @method pkInit
       * @protected
       */
      pkInit() {
        const cw = ccsx.center(),
        wz = ccsx.vrect();

        this._super();

        this.addItem( ccsx.tmenu1({
          fontPath: sh.getFontPath('font.OogieBoogie'),
          text: sh.l10n('%1player'),
          cb() {
            sh.fire('/mmenu/newgame', {
              mode: sh.gtypes.P1_GAME
            });
          },
          target: this,
          scale: 0.5,
          pos: cc.p(cw.x, wz.height * 0.20)
        }));
      }

    });

    return {

      'MainMenu' : {

        create: function(options) {
          var scene = new scenes.XSceneFactory([
            mmenus.XMenuBackLayer,
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

