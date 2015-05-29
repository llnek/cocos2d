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

  function (scenes, sh, ccsx ) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports= {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R= sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
     * @class SplashLayer
     */
    SplashLayer = scenes.XLayer.extend({
      /**
       * @method setup
       * @private
       */
      setup() {
        this.centerImage(sh.getImagePath('game.bg'));
        this.btns();
      },
      /**
       * @method btns
       * @private
       */
      btns() {
        const cw = ccsx.center(),
        wb= ccsx.vbox(),
        menu= ccsx.vmenu([{
          cb() { this.onplay(); },
          target: this,
          nnn: '#play.png'}],
          { pos: cc.p(cw.x, wb.top * 0.1)});
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
              //this.removeAll();
        dir.runScene( mm.reify({
          onBack() { dir.runScene( ss.reify() ); }
        }));
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
        return new scenes.XSceneFactory([
          SplashLayer
        ]).reify(options);
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

