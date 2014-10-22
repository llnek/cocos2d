// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

define('zotohlab/p/hud', ['cherimoia/skarojs',
                         'zotohlab/asterix',
                         'zotohlab/asx/ccsx',
                         'zotohlab/asx/xlayers'],

  function(sjs, sh, ccsx, layers) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    undef,

    BackLayer = layers.XLayer.extend({

      rtti: function() { return 'BackLayer'; },
      pkInit: function() {
        this._super();
        this.addItem(new cc.TMXTiledMap(
          sh.getTilesPath('gamelevel1.tiles.arena')));
      }

    }),

    HUDLayer = layers.XGameHUDLayer.extend({

      initAtlases: function() {
        this.regoAtlas('game-pics');
        this.hudAtlas= 'game-pics';
      },

      updateScore: function(n) {
        this.score += n;
        this.drawScore();
      },

      resetAsNew: function() {
        this.reset();
      },

      reset: function() {
        this.replayBtn.setVisible(false);
        this.lives.resurrect();
        this.score=0;
      },

      initLabels: function() {
        var wz = ccsx.screen();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '0',
          anchor: ccsx.AnchorBottomRight,
          scale: 12/72
        });
        this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

        this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
      },

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

      drawScore: function() {
        this.scoreLabel.setString(Number(this.score).toString());
      },

      initCtrlBtns: function(s) {
        this._super(32/48);
      }

    });

    return {
      BackLayer: BackLayer,
      HUDLayer: HUDLayer
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

