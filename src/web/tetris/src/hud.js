// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Ken Leung. All rights reserved.

define("zotohlab/p/hud",

       ['zotohlab/p/components',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes'],

  function(cobjs, sjs, sh, ccsx, layers, scenes) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////
    BackLayer = layers.XLayer.extend({

      rtti: function() { return 'BackLayer'; },

      pkInit: function() {
        this.centerImage(sh.getImagePath('game.bg'));
      }
    }),

    //////////////////////////////////////////////////////////////////////////
    HUDLayer = layers.XGameHUDLayer.extend({

      initAtlases: function() {
        this.regoAtlas('game-pics');
      },

      initLabels: function() {
        var cw= ccsx.center(),
        wz = ccsx.vrect(),
        wb = ccsx.vbox();

        this.scoreLabel = ccsx.bmfLabel({
          fontPath: sh.getFontPath('font.SmallTypeWriting'),
          text: '0',
          anchor: ccsx.AnchorTopRight,
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

      initCtrlBtns: function(scale, where) {
        var csts = xcfg.csts,
        menu;

        where = where || ccsx.AnchorBottom;
        scale = scale || 1;

        menu= ccsx.pmenu1({
          color: cc.color(255,255,255),
          imgPath: '#icon_menu.png',
          scale: scale,
          selector: function() {
            sh.fireEvent('/game/hud/controls/showmenu'); }
        });
        this.addMenuIcon(menu, where);

        menu = ccsx.pmenu1({
          imgPath: '#icon_replay.png',
          color: cc.color(255,255,255),
          scale : scale,
          visible: false,
          selector: function() {
            sh.fireEvent('/game/hud/controls/replay'); }
        });
        this.addReplayIcon(menu, where);
      }

    });

    return {
      BackLayer: BackLayer,
      HUDLayer: HUDLayer
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

