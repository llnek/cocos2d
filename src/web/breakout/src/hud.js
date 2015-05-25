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
 * @requires zotohlab/asx/xscenes
 * @module zotohlab/p/hud
 */
define('zotohlab/p/hud',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes'],

  function(sjs, sh, ccsx, scenes) { "use strict";

    /** @alias module:zotohlab/p/hud */
    let exports = {     },
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class BackLayer
     */
    BackLayer = scenes.XLayer.extend({

      /**
       * @method rtti
       */
      rtti() { return 'BackLayer'; },

      /**
       * @method pkInit
       * @protected
       */
      pkInit() {
        this.addItem(new cc.TMXTiledMap(
          sh.getTilesPath('gamelevel1.tiles.arena')));
      }

    }),

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
        //this.hudAtlas= 'game-pics';
      },

      /**
       * @method updateScore
       */
      updateScore(n) {
        this.score += n;
        this.drawScore();
      },

      /**
       * @method resetAsNew
       * @private
       */
      resetAsNew() {
        this.reset();
      },

      /**
       * @method reset
       * @private
       */
      reset() {
        this.replayBtn.setVisible(false);
        this.lives.resurrect();
        this.score=0;
      },

      /**
       * @method initLabels
       * @protected
       */
      initLabels() {
        const wz = ccsx.vrect();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '0',
          anchor: ccsx.acs.BottomRight,
          scale: 12/72
        });
        this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

        this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
      },

      /**
       * @method initIcons
       * @protected
       */
      initIcons() {
        const wz = ccsx.vrect();

        this.lives = new scenes.XHUDLives( this, csts.TILE + csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF, {
          frames: ['paddle.png'],
          scale: 0.5,
          totalLives: 3
        });

        this.lives.create();
      },

      /**
       * @method drawScore
       * @private
       */
      drawScore() {
        this.scoreLabel.setString(Number(this.score).toString());
      },

      XXinitCtrlBtns(s) {
        //this._super(32/48);
      }

    });

    exports= /** @lends exports# */{
      /**
       * @property {BackLayer} BackLayer
       */
      BackLayer: BackLayer,

      /**
       * @property {HUDLayer} HUDLayer
       */
      HUDLayer: HUDLayer
    };

    return exports;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

