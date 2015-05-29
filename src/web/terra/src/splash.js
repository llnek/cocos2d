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
define('zotohlab/p/splash',

       ['zotohlab/asx/xscenes',
        'zotohlab/p/s/utils',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function (scenes, utils, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports = {},
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
       * @module:zotohlab/p/splash~SplashLayer
       * @method setup
       * @protected
       */
      setup() {
        this.centerImage(sh.getImagePath('bg'));
        this.btns();
        this.misc();
      },
      misc() {
        const wz = ccsx.vrect();
        this.flare = new cc.Sprite(sh.getImagePath('flare'));
        this.flare.visible = false;
        this.ship = new cc.Sprite("#ship03.png");
        this.ship.attr({
          x: sjs.rand(wz.width),
          y: 0
        });
        this.addItem(this.flare, 15, 10);
        this.addItem(this.ship, 0, 4);
        this.update();
        sh.sfxPlayMusic('mainMusic', { repeat: true, vol: 0.7});
        //this.schedule(this.update, 0.1);
      },
      /**
       * @method btns
       * @private
       */
      btns() {
        const wb = ccsx.vbox(),
        cw = ccsx.center(),
        menu= ccsx.vmenu([{
          nnn: '#play.png',
          target: this,
          cb() { this.onplay(); }
        }],
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

