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

(function(undef) { "use strict"; var global = this, _ = global._  ,
asterix = global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh= asterix.Shell,
bko= asterix.BreakOut,
echt= global.ZotohLabs.echt,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// background layer
//////////////////////////////////////////////////////////////////////////////

var BackLayer = asterix.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.arena'));
    this.addItem(map);
    return this._super();
  },

  pkInput: function() {},

  rtti: function() {
    return 'BackLayer';
  }

});

//////////////////////////////////////////////////////////////////////////////
// HUD
//////////////////////////////////////////////////////////////////////////////

var HUDLayer = asterix.XGameHUDLayer.extend({

  initParentNode: function() {
    this.atlasBatch = cc.SpriteBatchNode.createWithTexture( cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics')));
    this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);
  },

  getNode: function() { return this.atlasBatch; },

  initLabels: function() {
  },

  initIcons: function() {
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

  initCtrlBtns: function(s) {
    this._super(32/48);
  },

  rtti: function() {
    return 'HUD';
  }

});

//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  getHUD: function() {
    return cc.Director.getInstance().getRunningScene().layers['HUD'];
  },

  getNode: function() { return this.atlasBatch; },

  reset: function(newFlag) {
    if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
      var img = cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics'));
      this.atlasBatch = cc.SpriteBatchNode.createWithTexture(img);
      this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
    }
    this.bricks=[];
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },

  preStart: function() {
    var csts= sh.xcfg.csts;
    var p = this.spawnEntity(bo.EntityPlayer,
      (ig.system.width - bo.EntityPlayer.prototype.size.x )/2,
      (csts.GRID_H -1) * csts.TILE -
      bo.EntityPlayer.prototype.size.y - csts.PADDLE_OFF -
      bo.EntityBall.prototype.size.y,
      {});
    this.genBricks();
    this.spawnEntity(bo.EntityBall, 100,100,{ paddle: p});
  },

  initBricks: function() {
    var csts = sh.xcfg.csts,
    b, w, r, c,
    x, y= csts.TILE + 10,
    cs= csts.LEVELS["1"];

    for (r=0; r < csts.ROWS; ++r) {
      x= csts.TILE + csts.LEFT_OFF;
      for (c=0; c < csts.COLS; ++c) {
        b= this.spawnEntity(bo.EntityBrick, x, y, { color: cs[r] });
        b.status=true;
        this.bricks.push(b);
        x += bo.EntityBrick.prototype.size.x + 1;
      }
      y += bo.EntityBrick.prototype.size.y + 2;
    }
  },

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {
    this.reset(newFlag);
    this.initBricks();
  },

  newGame: function(mode) {
    sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});




}).call(this);


