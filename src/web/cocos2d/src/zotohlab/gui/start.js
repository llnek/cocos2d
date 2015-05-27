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
 * @module zotohlab/asx/xsplash
 */
define("zotohlab/asx/xsplash",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, scenes) { "use strict";

    /** @alias module:zotohlab/asx/xsplash */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class XSplashLayer
     */
    XSplashLayer = scenes.XLayer.extend({

      /**
       * @memberof module:zotohlab/asx/xsplash~XSplashLayer
       * @method pkInit
       * @protected
       */
      pkInit() {
        //this._super();
        this.setBg();
        this.setTitle();
        this.setPlay();
      },

      /**
       * @method setPlay
       * @protected
       */
      setPlay() {
        const wb = ccsx.vbox(),
        cw = ccsx.center();

        this.addItem(ccsx.tmenu1({
          fontPath: sh.getFontPath('font.Hiruko'),
          text: sh.l10n('%play'),
          cb() {
            sh.fire('/splash/playgame');
          },
          target: this,
          scale: 1,
          pos: cc.p(cw.x, wb.top *0.25)
        }));
      },

      /**
       * @method setBg
       * @protected
       */
      setBg() {
        this.centerImage(sh.getImagePath('game.bg'));
      },

      /**
       * @method setTitle
       * @protected
       */
      setTitle() {
        const wb = ccsx.vbox(),
        cw = ccsx.center();
        this.addFrame('#title.png',
                      cc.p(cw.x, wb.top * 0.9));
      },

      /**
       * @memberof module:zotohlab/asx/xsplash~XSplashLayer
       * @method rtti
       * @return {String}
       */
      rtti() { return "SplashLayer"; }

    });

    exports = /** @lends exports# */{
      /**
       * @property {XSplashLayer} XSplashLayer
       */
      XSplashLayer: XSplashLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

