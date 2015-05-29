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
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/mmenu
 */
define('zotohlab/p/mmenu',

       ['zotohlab/asx/xscenes',
        'zotohlab/p/s/utils',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, utils, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/mmenu */
    let exports= {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xmmenus.XMenuBackLayer
     * @class BackLayer
     */
    BackLayer = mmenus.XMenuBackLayer.extend({

      /**
       * @method setTitle
       * @protected
       */
      setTitle() {
        const cw=ccsx.center(),
        wb=ccsx.vbox(),
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: ccsx.white,
          scale: xcfg.game.scale
        });
        this.addItem(tt);
      },

      /**
       * @method setBg
       * @protected
       */
      setBg() {
        this.centerImage(sh.getImagePath('bg'));
      }

    }),
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XMenuLayer
     * @class MainMenuLayer
     */
    MainMenuLayer = scenes.XMenuLayer.extend({
      /**
       * @method setup
       * @protected
       */
      setup() {
        //this.centerImage(sh.getImagePath('gui.mmenus.menu.bg'));
        this.centerImage(sh.getImagePath('bg'));
        const wb=ccsx.vbox(),
        cw= ccsx.center();

        // title
        const tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          color: ccsx.white,
          scale: xcfg.game.scale
        });
        this.addItem(tt);

        // buttons
        const menu= ccsx.vmenu([
          { nnn: '#player1.png',
            target: this,
            cb() {
              this.onplay({mode: sh.gtypes.P1_GAME });
            }
        }],
        {pos: cw});
        this.addItem(menu);

        this.mkBackQuit(false, [{
            nnn: '#icon_back.png',
            cb() {
              this.options.onBack();
            },
            target: this },
          { nnn: '#icon_quit.png',
            cb() { this.onQuit(); },
            target: this
          }],
          (m,z) => {
            m.setPosition(wb.left + csts.TILE + z.width * 1.1,
                          wb.bottom + csts.TILE + z.height * 0.45);
        });

        this.mkAudio({
          pos: cc.p(wb.right - csts.TILE,
                    wb.bottom + csts.TILE),
          anchor: ccsx.acs.BottomRight
        });
      },
      /**
       * @method onplay
       * @private
       */
      onplay(msg) {
        cc.director.runScene( sh.protos[sh.ptypes.game].reify(msg));
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
          MainMenuLayer
        ]).reify(options);
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

