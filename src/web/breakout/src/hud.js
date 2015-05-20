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
 * @module zotohlab/p/hud
 */
define('zotohlab/p/hud',

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers'],

  function(sjs, sh, ccsx, layers) { "use strict";

    /** @alias module:zotohlab/p/hud */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    /**
     * @class BackLayer
     */
    BackLayer = layers.XLayer.extend({

      rtti: function() { return 'BackLayer'; },
      pkInit: function() {
        this.addItem(new cc.TMXTiledMap(
          sh.getTilesPath('gamelevel1.tiles.arena')));
      }

    }),

    /**
     * @class HUDLayer
     */
    HUDLayer = layers.XGameHUDLayer.extend({

      /**
       * @protected
       */
      initAtlases: function() {
        this.regoAtlas('game-pics');
        //this.hudAtlas= 'game-pics';
      },

      /**
       * @private
       */
      updateScore: function(n) {
        this.score += n;
        this.drawScore();
      },

      /**
       * @private
       */
      resetAsNew: function() {
        this.reset();
      },

      /**
       * @private
       */
      reset: function() {
        this.replayBtn.setVisible(false);
        this.lives.resurrect();
        this.score=0;
      },

      /**
       * @protected
       */
      initLabels: function() {
        var wz = ccsx.screen();

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
       * @protected
       */
      initIcons: function() {
        var wz = ccsx.screen();

        this.lives = new layers.XHUDLives( this, csts.TILE + csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF, {
          frames: ['paddle.png'],
          scale: 0.5,
          totalLives: 3
        });

        this.lives.create();
      },

      /**
       * @private
       */
      drawScore: function() {
        this.scoreLabel.setString(Number(this.score).toString());
      },

      XXinitCtrlBtns: function(s) {
        //this._super(32/48);
      }

    });

    exports= {
      /**
       * @property {BackLayer} BackLayer
       * @static
       */
      BackLayer: BackLayer,

      /**
       * @property {HUDLayer} HUDLayer
       * @static
       */
      HUDLayer: HUDLayer
    };

    return exports;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

