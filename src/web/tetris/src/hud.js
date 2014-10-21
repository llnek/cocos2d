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

define("zotohlab/p/hud", ['zotohlab/p/components',
                          'cherimoia/skarojs',
                          'zotohlab/asterix',
                          'zotohlab/asx/ccsx',
                          'zotohlab/asx/xlayers'],

  function(cobjs, sjs, sh, ccsx, layers) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    BackLayer = layers.XLayer.extend({
      rtti: function() { return 'BackLayer'; },
      pkInit: function() {
        this._super();
        this.addItem(cc.TMXTiledMap.create(
          sh.getTilesPath('gamelevel1.tiles.arena')));
      }
    }),

    HUDLayer = layers.XGameHUDLayer.extend({

      initAtlases: function() {
        this.regoAtlas('game-pics');
      },

      initLabels: function() {
        var cw= ccsx.center(),
        wz = ccsx.screen();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          anchor: ccsx.AnchorBottomRight,
          text: '0',
          scale: 12/72
        });

        this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
          wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

        this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);

        this.status= ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.TinyBoxBB'),
          text: '',
          scale: 12/72,
          pos: cc.p(cw.x,cw.y)
          //pos: cc.p(21 * csts.TILE, wz.height - csts.TILE * 4)
        });
        this.addItem(this.status);
      },

      endGame: function() {
        this.replayBtn.setVisible(true);
        this.status.setVisible(true);
        this.drawStatusText(sh.l10n('%gameover'));
      },

      drawStatusText: function(msg) {
        this.status.setString( msg);
      },

      showStatus: function() {
      },

      initIcons: function() {
      },

      resetAsNew: function() {
        this.reset();
      },

      reset: function() {
        this.replayBtn.setVisible(false);
        this.status.setVisible(false);
        this.score=0;
      },

      updateScore: function(score) {
        this.score += score;
        this.scoreLabel.setString('' + this.score);
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

