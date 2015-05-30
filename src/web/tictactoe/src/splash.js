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
 * @module zotohlab/p/splash
 */
define("zotohlab/p/splash",

       ['zotohlab/asx/xscenes',
        'zotohlab/p/s/utils',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, utils, sh, ccsx ) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports = {},
    sjs=sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    /**
     * @class SplashLayer
     */
    SplashLayer = scenes.XLayer.extend({
      /**
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('game.bg'));
        this.title();
        this.demo();
        this.btns();
      },
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
        menu= ccsx.vmenu([{
          cb() { this.onplay(); },
          target: this,
          nnn: '#play.png'
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
          onback() { dir.runScene( ss.reify()); }
        }));
      },
      /**
       * @method demo
       * @private
       */
      demo() {
        let scale= 0.75,
        pos=0,
        fm, sp, bx;

        // we scale down the icons to make it look nicer
        R.forEach((mp) => {
          // set up the grid icons
          if (pos === 1 || pos===5 || pos===6 || pos===7) { fm= '#x.png'; }
          else if (pos===0 || pos===4) { fm= '#z.png'; }
          else { fm= '#o.png'; }
          sp= new cc.Sprite(fm);
          bx=ccsx.vboxMID(mp);
          sp.attr({
            scale: scale,
            x: bx.x,
            y: bx.y
          });
          this.addItem(sp);
          ++pos;
        },
        utils.mapGridPos(3,scale));
      }

    });

    exports = /** @lends exports# */{
      /**
       * @property {String} rtti
       */
      rtti: sh.ptypes.start,
      /**
       * Create the splash screen.
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

