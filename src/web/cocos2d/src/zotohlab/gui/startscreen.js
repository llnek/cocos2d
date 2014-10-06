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

function moduleFactory(sjs, sh, ccsx, layers) { "use strict";
var undef;

//////////////////////////////////////////////////////////////////////////////
// splash screen for the game - make it look nice please.
//////////////////////////////////////////////////////////////////////////////
var XSplashLayer = layers.XLayer.extend({

  pkInit: function() {
    var imgUrl= sh.getImagePath('splash.splash'),
    wz = ccsx.screen(),
    cw = ccsx.center();

    if (imgUrl) {
      var s= new cc.Sprite(imgUrl);
      s.setPosition(cw);
      this.addItem(s);
    }

    return this._super();
  },

  rtti: function() { return "SplashLayer"; }

});


return XSplashLayer;
}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/asx/xsplash",
            ['cherimoia/skarojs',
             'zotohlab/asterix',
             'zotohlab/asx/ccsx',
             'zotohlab/asx/xlayers'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

