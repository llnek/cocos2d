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
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xsplash
 * @module zotohlab/p/splash
 */
define('zotohlab/p/splash',

       ['zotohlab/p/s/utils',
        'zotohlab/asx/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xsplash'],

  function (utils, sh, ccsx, scenes, splash) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @extends module:zotohlab/asx/xsplash.XSplashLayer
     * @class SplashLayer
     */
    SplashLayer = splash.XSplashLayer.extend({

      /**
       * @module:zotohlab/p/splash~SplashLayer
       * @method pkInit
       * @protected
       */
      pkInit() {
        const wz = ccsx.vrect();
        this._super();

        this.flare = new cc.Sprite(sh.getImagePath('flare'));
        this.flare.visible = false;

        this.ship = new cc.Sprite("#ship03.png");
        this.ship.attr({
          x: sjs.rand(wz.width),
          y: 0
        });

        this.addItem(this.ship, 0, 4);
        this.addItem(flare, 15, 10);

        this.ship.runAction(cc.moveBy(2, cc.p(sjs.rand(wz.width),
                                              this.ship.y + wz.height + 100)));

        sh.sfxPlayMusic('mainMusic', { vol: 0.7});
        this.schedule(this.update, 0.1);
      },

      setTitle() {
      },

      setPlay() {
        const wb = ccsx.vbox(),
        cw = ccsx.center();
        mnu= ccsx.vmenu([{
          nnn: '#play.png'
          cb() {
            sh.fire('/splash/playgame');
          }
        }]);
        mnu.attr({
          y: wb.top * 0.1,
          x: cw.x
        });
        this.addItem(mnu);
      },

       /**
       * @method setBg
       * @protected
       */
      setBg() {
        this.centerImage(sh.getImagePath('bg'));
      },

      /**
       * @method onPlay
       * @private
       */
      onPlay() {
        const ss= sh.protos[sh.ptypes.start],
        mm= sh.protos[sh.ptypes.mmenu],
        dir= cc.director;
        utils.btnEffect();
        utils.flare(this.flare, () => {
          dir.runScene( mm.reify({
              onBack() { dir.runScene( ss.reify() ); }
          }));
        });
      },

      /**
       * @memberof module:zotohlab/p/splash~SplashLayer
       * @method update
       */
      update() {
        const wz = ccsx.vrect();
        if (this.ship.y > 750) {
          const pt= cc.p(sjs.rand(wz.width), this.ship.y + 750);
          this.ship.attr({
            x: sjs.rand(wz.width),
            y: 10
          });
          this.ship.runAction(cc.moveBy(sjs.rand(5), pt));
        }
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
        ]).reify(options).onmsg('/splash/playgame', () => {
          sh.main.onPlay();
        });
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

