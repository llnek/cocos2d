// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/asx/xsplash", ['cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/ccsx',
                               'zotohlab/asx/xlayers'],
  function (sjs, sh, ccsx, layers) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    XSplashLayer = layers.XLayer.extend({

      pkInit: function() {

        var wb = ccsx.vbox(),
        cw = ccsx.center();

        this._super();

        this.addItem(ccsx.tmenu1({
          fontPath: sh.getFontPath('font.Hiruko'),
          text: sh.l10n('%play'),
          selector: function() {
            sh.fireEvent('/splash/controls/playgame');
          },
          target: this,
          scale: 1,
          pos: cc.p(cw.x, wb.top *0.25)
        }));

      },

      rtti: function() { return "SplashLayer"; }

    });


    return XSplashLayer;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

