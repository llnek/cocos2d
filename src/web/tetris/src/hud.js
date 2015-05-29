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
 * @requires zotohlab/p/elements
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @module zotohlab/p/hud
 */
define("zotohlab/p/hud",

       ['zotohlab/asx/xscenes',
        'zotohlab/p/elements',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx'],

  function(scenes, cobjs, sh, ccsx) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XGameHUDLayer
     * @class HUDLayer
     */
    HUDLayer = scenes.XGameHUDLayer.extend({
      /**
       * @method initAtlases
       * @protected
       */
      initAtlases() {
        this.regoAtlas('game-pics');
      },
      /**
       * @method initLabels
       * @protected
       */
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
      /**
       * @method endGame
       * @private
       */
      endGame() {
        this.replayBtn.setVisible(true);
        this.status.setVisible(true);
        this.drawStatusText(sh.l10n('%gameover'));
      },
      /**
       * @method drawStatusText
       * @private
       */
      drawStatusText(msg) {
        this.status.setString( msg);
      },

      showStatus: sjs.NILFUNC,
      initIcons: sjs.NILFUNC,

      /**
       * @method resetAsNew
       */
      resetAsNew() {
        this.reset();
      },
      /**
       * @method reset
       */
      reset() {
        this.replayBtn.setVisible(false);
        this.status.setVisible(false);
        this.score=0;
      },
      /**
       * @method updateScore
       */
      updateScore(score) {
        this.score += score;
        this.scoreLabel.setString('' + this.score);
      },
      /**
       * @method ctor
       * @constructs
       */
      ctor(options) {

        this._super(options);

        this.options.i_replay= {
          nnn: '#icon_replay.png',
          color: ccsx.white,
          visible: false,
          cb() {
            sh.fire('/hud/replay'); }
        };

        this.options.i_menu= {
          nnn: '#icon_menu.png',
          color: ccsx.white,
          cb() {
            sh.fire('/hud/showmenu'); }
        };
      }

    });

    exports = /** @lends exports# */{
      /**
       * @property {HUDLayer} HUDLayer
       */
      HUDLayer: HUDLayer
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

