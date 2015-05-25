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
 * @requires zotohlab/asx/xsplash
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/splash
 */
define('zotohlab/p/splash',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xsplash',
        'zotohlab/asx/xscenes'],

  function (sjs, sh, ccsx, splash, scenes) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports= {    },
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @extends module:zotohlab/asx/xsplash.XSplashLayer
     * @class SplashLayer
     */
    SplashLayer = splash.XSplashLayer.extend({

      /**
       * @method setTitle
       * @protected
       */
      setTitle() {
        const cw= ccsx.center(),
        wb= ccsx.vbox();
        this.addFrame('#title.png',
                      cc.p(cw.x, wb.top * 0.9));
      },

      /**
       * @method setPlay
       * @protected
       */
      setPlay() {
        const cw= ccsx.center(),
        wb= ccsx.vbox(),
        menu= ccsx.pmenu1({
          imgPath: '#play.png',
          cb() {
            sh.fire('/splash/playgame');
          }
        });
        menu.setPosition(cw.x, wb.top * 0.1);
        this.addItem(menu);
      }

    });

    exports = /** @lends exports# */{

      /**
       * @property {String} rtti
       */
      rtti: sh.ptypes.start,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        const ss= sh.protos[sh.ptypes.start],
        mm= sh.protos[sh.ptypes.mmenu],
        dir= cc.director;
        return new scenes.XSceneFactory([
          SplashLayer
        ]).reify(options).onmsg('/splash/playgame', () => {
          dir.runScene( mm.reify({
            onBack() { dir.runScene( ss.reify() ); }
          }));
        });
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

