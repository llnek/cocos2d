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
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xmmenus
 * @module zotohlab/p/mmenu
 */
define('zotohlab/p/mmenu',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus'],

  function (sjs, sh, ccsx, layers, scenes, mmenus) { "use strict";

    /** @alias module:zotohlab/p/mmenu */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BackLayer
     */
    BackLayer = mmenus.XMenuBackLayer.extend({

      setTitle() {
        const wb=ccsx.vbox(),
        cw= ccsx.center(),
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: cc.color(246,177,127),
          scale: xcfg.game.scale
        });
        this.addItem(tt);
      }

    }),

    /**
     * @class MainMenuLayer
     */
    MainMenuLayer = mmenus.XMenuLayer.extend({

      pkInit() {
        const cw = ccsx.center(),
        wb = ccsx.vbox(),
        menu= ccsx.tmenu1({
          fontPath: sh.getFontPath('font.OogieBoogie'),
          text: sh.l10n('%1player'),
          scale: 0.5,
          cb() {
            sh.fire('/mmenu/newgame', { mode: sh.gtypes.P1_GAME });
          },
          target: this
        });
        menu.setPosition(cw);
        this.addItem(menu);

        this.mkBackQuit(false, [
            { imgPath: '#icon_back.png',
              cb() {
                if (!!this.options.onBack) {
                  this.options.onBack(); }
              },
              target: this },

            { imgPath: '#icon_quit.png',
              cb() { this.onQuit(); },
              target: this }
          ],
          (m,z) => {
            m.setPosition(wb.left + csts.TILE + z.width * 1.1,
                          wb.bottom + csts.TILE + z.height * 0.45);
          });

        this.mkAudio({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          anchor: ccsx.acs.BottomRight
        });

      }

    });

    exports= /** @lends exports# */{

      /**
       * @property {String} rtti
       */
      rtti : sh.ptypes.mmenu,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([
          BackLayer,
          MainMenuLayer
        ]).reify(options).onmsg('/mmenu/newgame', (topic, msg) => {
          cc.director.runScene( sh.protos[sh.ptypes.game].reify(msg));
        });
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

