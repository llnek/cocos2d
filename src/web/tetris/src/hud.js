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
 * @requires zotohlab/p/elements
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/hud
 */
define("zotohlab/p/hud",

       ['zotohlab/p/elements',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes'],

  function(cobjs, sjs, sh, ccsx, layers, scenes) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////
    /**
     * @class BackLayer
     */
    BackLayer = layers.XLayer.extend({

      rtti() { return 'BackLayer'; },

      pkInit() {
        this.centerImage(sh.getImagePath('game.bg'));
      }
    }),

    //////////////////////////////////////////////////////////////////////////
    /**
     * @class HUDLayer
     */
    HUDLayer = layers.XGameHUDLayer.extend({

      initAtlases() {
        this.regoAtlas('game-pics');
      },

      initLabels() {
        const cw= ccsx.center(),
        wz = ccsx.vrect(),
        wb = ccsx.vbox();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.SmallTypeWriting'),
          text: '0',
          anchor: ccsx.acs.TopRight,
          scale: xcfg.game.scale// * 2
        });
        this.scoreLabel.setPosition(wb.right - (csts.TILE * wz.width/480),
          wb.top - (wz.height/320 * csts.TILE));// - ccsx.getScaledHeight(this.scoreLabel));

        this.addItem(this.scoreLabel);

        this.status= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.CoffeeBuzzed'),
          text: '',
          scale: xcfg.game.scale * 0.5,//12/72,
          pos: cc.p(cw.x * 1.5, cw.y)//wb.top * 0.1)
          //pos: cc.p(21 * csts.TILE, wz.height - csts.TILE * 4)
        });
        this.addItem(this.status);
      },

      endGame() {
        this.replayBtn.setVisible(true);
        this.status.setVisible(true);
        this.drawStatusText(sh.l10n('%gameover'));
      },

      drawStatusText(msg) {
        this.status.setString( msg);
      },

      showStatus() {
      },

      initIcons() {
      },

      resetAsNew() {
        this.reset();
      },

      reset() {
        this.replayBtn.setVisible(false);
        this.status.setVisible(false);
        this.score=0;
      },

      updateScore(score) {
        this.score += score;
        this.scoreLabel.setString('' + this.score);
      },

      ctor(options) {
        const color= cc.color(255,255,255),
        scale=1;

        this._super(options);

        this.options.i_replay= {
          imgPath: '#icon_replay.png',
          color: color,
          scale : scale,
          visible: false,
          cb() {
            sh.fire('/hud/replay'); }
        };

        this.options.i_menu= {
          imgPath: '#icon_menu.png',
          color: color,
          scale: scale,
          cb() {
            sh.fire('/hud/showmenu'); }
        };
      }

    });

    exports = /** @lends exports# */{
      /**
       * @property {BackLayer.Class} BackLayer
       */
      BackLayer: BackLayer,

      /**
       * @property {HUDLayer.Class} HUDLayer
       */
      HUDLayer: HUDLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

