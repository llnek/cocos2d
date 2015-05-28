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
 * @requires zotohlab/asx/xsplash
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/splash
 */
define('zotohlab/p/splash',

       ['zotohlab/asx/xscenes',
        'zotohlab/asx/xsplash',
        'zotohlab/p/s/utils',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, splash, utils, sh, ccsx) { "use strict";

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
        this.addItem(this.flare, 15, 10);

        this.update();
        //sh.sfxPlayMusic('mainMusic', { repeat: true, vol: 0.7});
        //this.schedule(this.update, 0.1);
      },

      /**
       * @method setTitle
       * @protected
       */
      setTitle() {
      },

      /**
       * @method setPlay
       * @protected
       */
      setPlay() {
        const wb = ccsx.vbox(),
        cw = ccsx.center(),
        mnu= ccsx.vmenu([{
          nnn: '#play.png',
          target: this,
          cb() { this.onPlay(); }
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
        utils.flareEffect(this.flare, () => {
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
        const wz = ccsx.vrect(),
        g= cc.callFunc(() => {
          this.ship.attr({
            x: sjs.rand(wz.width),
            y: 10
          });
          this.update();
        });
        this.ship.runAction(cc.sequence(cc.moveBy(2, cc.p(sjs.rand(wz.width),
                                                   wz.height + 100)),g));
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

