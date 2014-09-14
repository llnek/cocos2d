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

(function(undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
ast= asterix.Asteroids,
sjs= global.SkaroJS;

var NILFUNC=function() {};


//////////////////////////////////////////////////////////////////////////////
// back layer
//////////////////////////////////////////////////////////////////////////////

ast.BackLayer = asterix.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gamelevel1.tiles.arena'));
    this.addItem(map);
    return this._super();
  },

  pkInput: NILFUNC,

  rtti: function() {
    return 'BackLayer';
  }

});

//////////////////////////////////////////////////////////////////////////////
// HUD layer
//////////////////////////////////////////////////////////////////////////////

ast.HUDLayer = asterix.XGameHUDLayer.extend({

  updateScore: function(n) {
    this.score += n;
    this.drawScore();
  },

  resetAsNew: function() {
    this.score = 0;
    this.reset();
  },

  reset: function() {
    this.replayBtn.setVisible(false);
    this.lives.resurrect();
  },

  initParentNode: function() {
    this.atlasBatch = cc.SpriteBatchNode.create( cc.textureCache.addImage( sh.getAtlasPath('game-pics')));
    this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);

    var map = cc.TMXTiledMap.create(sh.getTilesPath('gamelevel1.tiles.hudwall'));
    this.addChild(map,++this.lastZix, ++this.lastTag);
  },

  getNode: function() { return this.atlasBatch; },

  drawScore: function() {
    this.scoreLabel.setString(Number(this.score).toString());
  },

  initLabels: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();

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

  initCtrlBtns: function() {
    this._super(32/48);
  },

  initIcons: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();

    this.lives = new asterix.XHUDLives( this, csts.TILE + csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF, {
      frames: ['rship_1.png'],
      scale: 0.5,
      totalLives: 3
    });

    this.lives.create();
  },

  removeItem: function(n) {
    if (n instanceof cc.Sprite) { this._super(n); } else {
      this.removeChild(n);
    }
  },

  addItem: function(n) {
    if (n instanceof cc.Sprite) { this._super(n); } else {
      this.addChild(n, this.lastZix, ++this.lastTag);
    }
  },

  rtti: function() {
    return 'HUD';
  }


});



}).call(this);


