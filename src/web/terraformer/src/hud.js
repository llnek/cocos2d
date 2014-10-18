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
    csts = xcfg.csts,
    R= sjs.ramda,
    undef,
    BackTileMap= ["lvl1_map1.png", "lvl1_map2.png", "lvl1_map3.png", "lvl1_map4.png"],
    BackTiles= BackTileMap.length,
    BackTile= sh.Ashley.compDef({
    }),
    BackLayer = layers.XLayer.extend({

      createTile: function (name) {
        var rc, tm = ccsx.createSpriteFrame(name);
        tm.setAnchorPoint(0.5,0);
        tm.setVisible(false);
        this.tilesBatch.addChild(tm, -9);
        return new BackTile(tm);
      },

      preSetTiles: function (count) {
        var tiles = BackTileMap,
        tlen= tiles.length,
        sz= count || 1,
        me=this;
        this.backTiles.preSet(function(pool) {
          for (var n=0; n < tlen; ++n) {
            pool.push(me.createTile(tiles[sjs.rand(tlen)]));
          }
        }, sz);
      },

      rtti: function() { return 'BackLayer'; },

      pkInit: function() {
        var img= cc.textureCache.addImage( sh.getAtlasPath('tr-pics'));
        this.atlasBatch = new cc.SpriteBatchNode(img);
        this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);

        img= cc.textureCache.addImage( sh.getAtlasPath('back-tiles'));
        this.tilesBatch= new cc.SpriteBatchNode(img);
        this.addChild(this.tilesBatch, this.lastZix, ++this.lastTag);

        this.backTiles= new XPool();
        this.preSetTiles(6);

        return this._super();
      }

    }),
    HUDLayer = layers.XGameHUDLayer.extend({

      initParentNode: function() {
        var img= cc.textureCache.addImage( sh.getAtlasPath('tr-pics'));
        this.atlasBatch = new cc.SpriteBatchNode(img);
        this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);
      },

      getNode: function() { return this.atlasBatch; },

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
          frames: ['ship01.png'],
          scale: 0.4,
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

      initCtrlBtns: function(s) {
        this._super(32/48);
      }

    });

    return {
      BackLayer : BackLayer,
      HUDLayer : HUDLayer
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

