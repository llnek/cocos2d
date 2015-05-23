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
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xmmenus
 * @module zotohlab/p/mmenu
 */
define('zotohlab/p/mmenu',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus'],

  function (sjs, sh, ccsx, layers, scenes, mmenus) { "use strict";

    /** @alias module:zotohlab/p/mmenu */
    let exports= {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class BackLayer
     */
    BackLayer = mmenus.XMenuBackLayer.extend({

      setTitle() {
        const wb=ccsx.vbox(),
        cw= ccsx.center(),
        tt=ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.JellyBelly'),
          text: sh.l10n('%mmenu'),
          pos: cc.p(cw.x, wb.top * 0.9),
          scale: xcfg.game.scale
        });
        this.addItem(tt);
      }
    }),

    /**
     * @class MainMenuLayer
     */
    MainMenuLayer = mmenus.XMenuLayer.extend({

      onButtonEffect() {
        sh.sfxPlay('buttonEffect');
      },

      flareEffect(flare) {
        flare.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        flare.stopAllActions();
        flare.attr({
          x: -30,
          y: 297,
          visible: true,
          opacity: 0,
          rotation: -120,
          scale: 0.2
        });

        const opacityAnim = cc.fadeTo(0.5, 255),
        bigger = cc.scaleTo(0.5, 1),
        opacDim = cc.fadeTo(1, 0);

        const biggerEase = cc.scaleBy(0.7, 1.2, 1.2).easing(cc.easeSineOut());
        const easeMove = cc.moveBy(0.5, cc.p(328, 0)).easing(cc.easeSineOut());
        const rotateEase = cc.rotateBy(2.5, 90).easing(cc.easeExponentialOut());
        const onComplete = cc.callFunc(this.onNewGame, this);
        const killflare = cc.callFunc(() => {
          this.removeItem(flare);
        }, this);

        flare.runAction(cc.sequence(opacityAnim, biggerEase, opacDim, killflare, onComplete));
        flare.runAction(easeMove);
        flare.runAction(rotateEase);
        flare.runAction(bigger);
      },

      onNewGame() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
        sh.fire('/mmenu/newgame', { mode: sh.gtypes.P1_GAME });
      },

      onSettings() {
        this.onButtonEffect();
      },

      onAbout() {
        this.onButtonEffect();
      },

      pkInit() {
        let sps = [null,null,null],
        ms=[null,null,null],
        flare,
        logo,
        menu, sp,
        cw = ccsx.center(),
        wz = ccsx.vrect();

        flare = new cc.Sprite(sh.getImagePath('flare'));
        flare.setVisible(false);
        this.addItem(flare);

        logo = new cc.Sprite(sh.getImagePath('logo'));
        logo.setPosition(cw.x, wz.height * 0.65);
        this.addItem(logo);

        sp = sh.getImagePath('menu-btns');
        sps[2] = new cc.Sprite(sp, cc.rect(0, 33 * 2, 126, 33));
        sps[1] = new cc.Sprite(sp, cc.rect(0, 33, 126, 33));
        sps[0] = new cc.Sprite(sp, cc.rect(0, 0, 126, 33));
        ms[0] = new cc.MenuItemSprite(sps[0], sps[1], sps[2], () => {
          this.flareEffect(flare);
          this.onButtonEffect();
        });

        sps[2]= new cc.Sprite(sp, cc.rect(126, 33 * 2, 126, 33));
        sps[1]= new cc.Sprite(sp, cc.rect(126, 33, 126, 33));
        sps[0]= new cc.Sprite(sp, cc.rect(126, 0, 126, 33));
        ms[1]= new cc.MenuItemSprite(sps[0], sps[1], sps[2], this.onSettings, this);

        sps[2]= new cc.Sprite(sp, cc.rect(252, 33 * 2, 126, 33));
        sps[1]= new cc.Sprite(sp, cc.rect(252, 33, 126, 33));
        sps[0]= new cc.Sprite(sp, cc.rect(252, 0, 126, 33));
        ms[2] = new cc.MenuItemSprite(sps[0],sps[1],sps[2], this.onAbout, this);

        menu = new cc.Menu(ms[0], ms[1], ms[2]);
        menu.alignItemsVerticallyWithPadding(10);
        menu.setPosition( cw.x, wz.height * 0.35);
        this.addItem(menu);

        this._ship = new cc.Sprite("#ship01.png");
        this._ship.setPosition(sjs.rand(wz.width), 0);
        this.addItem(this._ship, -10);
        this._ship.runAction(cc.moveBy(2,
          cc.p(sjs.rand(wz.width),
               this._ship.getPosition().y + wz.height + 100)));

        //sh.sfxPlayMusic('mainMainMusic');
        this.schedule(() => { this.update(); }, 0.1);

        //this.doCtrlBtns();

        //cc.audioEngine.setMusicVolume(0.7);
        sh.sfxPlayMusic('mainMainMusic', true);

        this._super();
      },

      update() {
        let pos= this._ship.getPosition(),
        wz= ccsx.vrect();

        if (pos.y > wz.height) {
          this._ship.setPosition(sjs.rand(wz.width), 10);
          pos= this._ship.getPosition();
          this._ship.runAction(cc.moveBy(
              parseInt(sjs.rand(5), 10),
              cc.p(sjs.rand(wz.width), pos.y + wz.height)
          ));
        }
      }

    });

    exports= {

      /**
       * @property {String} rtti
       */
      rtti : sh.ptypes.mmenu,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify(options) {
        return new scenes.XSceneFactory([
          BackLayer,
          MainMenuLayer
        ]).reify(options).onmsg('/mmenu/newgame', (topic, msg) => {
            cc.director.runScene( sh.protos[sh.ptypes.game].reify(msg));
          });
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

