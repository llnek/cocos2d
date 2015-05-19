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
 * @requires zotohlab/asx/xplash
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/splash
 */
define("zotohlab/p/splash",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xsplash',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, splash, layers, scenes) { "use strict";

    /** @alias module:zotohlab/p/splash */
    var exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////////
    SplashLayer = splash.XSplashLayer.extend({

      setPlay: function() {
        var cw = ccsx.center(),
        wb= ccsx.vbox(),
        menu;
        menu= ccsx.vmenu([
          { imgPath: '#play.png',
            cb: function() {
              this.removeAll();
              sh.fireEvent('/splash/playgame');
            },
            target: this }
        ]);

        menu.setPosition(cw.x, wb.top * 0.10);
        this.addItem(menu);
      }

    });

    exports = {

      /**
       * @property {String} rtti
       * @static
       */
      rtti: sh.ptypes.start,

      /**
       * @method reify
       * @static
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify: function(options) {
        var scene = new scenes.XSceneFactory([
          SplashLayer
        ]).reify(options);

        scene.onmsg('/splash/playgame', function() {
          var ss= sh.protos[sh.ptypes.start],
          mm= sh.protos[sh.ptypes.mmenu],
          dir= cc.director;
          dir.runScene( mm.create({
            onBack: function() { dir.runScene( ss.reify() ); }
          }));
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

