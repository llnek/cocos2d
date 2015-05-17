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
 * @module zotohlab/asx/xsplash
 */
define("zotohlab/asx/xsplash",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers'],

  function (sjs, sh, ccsx, layers) { "use strict";

    /** @alias module:zotohlab/asx/xsplash */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends XLayer
     * @class XSplashLayer
     */
    XSplashLayer = layers.XLayer.extend({

      /**
       * @memberof module:zotohlab/asx/xsplash~XSplashLayer
       * @method pkInit
       * @protected
       */
      pkInit: function() {

        var wb = ccsx.vbox(),
        cw = ccsx.center();

        this._super();

        this.addItem(ccsx.tmenu1({
          fontPath: sh.getFontPath('font.Hiruko'),
          text: sh.l10n('%play'),
          selector: function() {
            sh.fire('/splash/playgame');
          },
          target: this,
          scale: 1,
          pos: cc.p(cw.x, wb.top *0.25)
        }));

      },

      /**
       * @memberof module:zotohlab/asx/xsplash~XSplashLayer
       * @method rtti
       * @return {String}
       */
      rtti: function() { return "SplashLayer"; }

    });

    exports = {
      /**
       * @property {XSplashLayer.Class} XSplashLayer
       * @static
       */
      XSplashLayer: XSplashLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

