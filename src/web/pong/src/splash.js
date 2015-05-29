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
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/splash
 */
define("zotohlab/p/splash",

       ['zotohlab/asx/xscenes',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports= {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class SplashLayer
     */
    SplashLayer = scenes.XLayer.extend({
      /**
       * @method title
       * @private
       */
      title() {
        const cw = ccsx.center(),
        wb = ccsx.vbox();
        this.addFrame('#title.png',
                      cc.p(cw.x, wb.top * 0.9));
      },
      /**
       * @method btns
       * @private
       */
      btns() {
        const cw = ccsx.center(),
        wb = ccsx.vbox(),
        menu = ccsx.vmenu([{
          nnn: '#play.png',
          target: this,
          cb() {
            this.onplay();
          }
        }],
        { pos: cc.p(cw.x, wb.top * 0.1) });
        this.addItem(menu);
      },
      /**
       * @method onplay
       * @private
       */
      onplay() {
        const ss= sh.protos[sh.ptypes.start],
        mm= sh.protos[sh.ptypes.mmenu],
        dir= cc.director;
        dir.runScene( mm.reify({
          onBack() { dir.runScene( ss.reify() ); }
        }));
      },
      /**
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('game.bg'));
        this.title();
        this.btns();
      }

    });

    exports= /** @lends exports# */{
      /**
       * @property {String} rtti
       */
      rtti : sh.ptypes.start,
      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([
          SplashLayer
        ]).reify(options);
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

