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
 * @requires zotohlab/p/s/utils
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xsplash
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/splash
 */
define("zotohlab/p/splash",

       ['zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xsplash',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes'],

  function (utils, sjs, sh, ccsx, splash, layers, scenes) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////
    /**
     * @class SplashLayer
     */
    SplashLayer = splash.XSplashLayer.extend({

      pkInit() {
        this._super();
        // show the demo icons
        this.showGrid();
      },

      setPlay() {
        const cw = ccsx.center(),
        wb = ccsx.vbox(),
        // show the play button at the bottom
        menu= ccsx.vmenu([
          { imgPath: '#play.png',
            cb() {
              this.removeAll();
              sh.fire('/splash/playgame');
            },
            target: this }
        ]);
        menu.setPosition(cw.x, wb.top * 0.10);
        this.addItem(menu);
      },

      showGrid() {
        let scale= 0.75, me=this,
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
          sp.setScale(scale);
          sp.setPosition(bx);
          me.addItem(sp);
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
        const ss= sh.protos[sh.ptypes.start],
        mm= sh.protos[sh.ptypes.mmenu],
        dir= cc.director;
        return new scenes.XSceneFactory([
          SplashLayer
        ]).
          reify(options).
          onmsg('/splash/playgame',
          () => {
            dir.runScene( mm.reify({
              onBack() { dir.runScene( ss.reify()); }
          }));
        });
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

