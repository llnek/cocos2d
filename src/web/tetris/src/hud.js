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
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

var NILFUNC=function(){};

var EntityList = [
  bks.EntityLine,
  bks.EntityBox,
  bks.EntitySt,
  bks.EntityElx,
  bks.EntityNub,
  bks.EntityStx,
  bks.EntityElx
];

//////////////////////////////////////////////////////////////////////////////
// background layer
//////////////////////////////////////////////////////////////////////////////

bks.BackLayer = asterix.XLayer.extend({

  rtti: function() { return 'BackLayer'; },

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gamelevel1.tiles.arena'));
    this.addItem(map);
    return this._super();
  }

});

//////////////////////////////////////////////////////////////////////////////
// HUD
//////////////////////////////////////////////////////////////////////////////

bks.HUDLayer = asterix.XGameHUDLayer.extend({

  initParentNode: function() {
    var img= cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
    this.atlasBatch = new cc.SpriteBatchNode(img);
    this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);
  },

  getNode: function() { return this.atlasBatch; },

  initLabels: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
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

  showNext: function() {
    var n= sjs.rand( EntityList.length),
    proto= EntityList[n],
    csts= sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    sz = proto.prototype.matrix * csts.TILE,
    left= (csts.FIELD_W + 2) * csts.TILE,
    x= left + (wz.width - left - csts.TILE) * 0.5,
    y = cw.y;

    if (this.nextShape) { this.nextShape.dispose(); }
    x -= sz * 0.5;
    y += sz * 0.5;
    this.nextShape= new (proto)( x, y, { wantKeys: false });
    this.nextShape.createAsOutline(this);
    this.nextShapeInfo= {
      formID: this.nextShape.formID,
      png: this.nextShape.png,
      model: proto
    };
  },

  updateScore: function(score) {
    this.score += score;
    this.scoreLabel.setString('' + this.score);
  },

  getNextShapeInfo: function() {
    return this.nextShapeInfo;
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
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

