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
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xsplash
 * @module zotohlab/p/splash
 */
define('zotohlab/p/splash',

       ['zotohlab/p/s/utils',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xsplash'],

  function (utils, sjs, sh, ccsx, scenes, splash) { "use strict";

    /** @alias module:zotohlab/p/splash */
    let exports = {},
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
        const r = cc.rect(0,0, csts.menuWidth,csts.menuHeight),
        img= sh.getImagePath('menu.png'),
        cw=ccsx.center(),
        wb=ccsx.vbox(),
        wz= ccsx.vrect(),
        itm = new cc.MenuItemSprite(new cc.Sprite(img, r),
                                    new cc.Sprite(img, r),
                                    new cc.Sprite(img, r),
                                    () => { this.onPlay(); }),
        menu = new cc.Menu(itm);
        menu.attr({
          y: wz.height * 0.25,
          x: cw.x});
        this.addItem(menu);

        this.addItem(flare, 15, 10);

        this.flare = new cc.Sprite(sh.getImagePath('flare'));
        this.flare.visible = false;
        this.schedule(this.update, 0.1);

        this.ship = new cc.Sprite("#ship03.png");
        this.ship.attr({
          x: sjs.rand(wz.width),
          y: 0
        });
        this.addItem(this.ship, 0, 4);
        this.ship.runAction(cc.moveBy(2, cc.p(sjs.rand(wz.width),
                                              this.ship.y + wz.height + 100)));

        sh.sfxPlayMusic('mainMusic', { vol: 0.7});
      },

      /**
       * @method onPlay
       * @private
       */
      onPlay() {
        utils.btnEffect();
        utils.flare(this.flare, () => {
          sh.fire('/splash/playgame');
        }, this);
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

