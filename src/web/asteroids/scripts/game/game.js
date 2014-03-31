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

(function(undef) { "use strict"; var global = this, _ = global._ ,
asterix = global.ZotohLabs.Asterix,
echt= global.ZotohLabs.echt,
ccsx = asterix.COCOS2DX,
sh= asterix.Shell,
ast= asterix.Asteroids,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// back layer
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
// HUD layer
//////////////////////////////////////////////////////////////////////////////

var HUDLayer = asterix.XGameHUDLayer.extend({

  resetAsNew: function() {
    this.reset();
  },

  reset: function() {
  },

  initParentNode: function() {
  },

  initLabels: function() {
  },

  initCtrlBtns: function() {
  },

  initIcons: function() {
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

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {
    this.reset(newFlag);
    this.initRocks();
    this.spawnPlayer();
  },

  reset: function(newFlag) {
    if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
      var img = cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics'));
      this.atlasBatch = cc.SpriteBatchNode.createWithTexture(img);
      this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
    }
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }

    this.initAsteroidSizes();
    this.players=[];
    this.actor=null;
  },

  initAsteroidSizes: function() {
  /*
    var dummy = new ast.EntityAsteroid3(0,0,{});
    s= dummy.create();
    this.astro3 = s.getContentSize();
    dummy = new ast.EntityAsteroid2(0,0,{});
    s= dummy.create();
    this.astro2 = s.getContentSize();
    */
    var s, dummy = new ast.EntityAsteroid1(0,0,{});
    s= dummy.create();
    this.astro1 = s.getContentSize();
  },

  initPlayerSize: function() {
    var dummy = new ast.EntityPlayer(0,0,{});
    s= dummy.create();
    this.playerSize = s.getContentSize();
  },

  initRocks: function() {
    var cfg = sh.xcfg.levels['gamelevel' + this.level]['fixtures'],
    h = this.astro1.height,
    w = this.astro1.width,
    csts= sh.xcfg.csts,
    wz = ccsx.screen(),
    cw = ccsx.center(),
    aa, n, r,
    x,y, deg,
    B= {left: csts.TILE, top: wz.height-csts.TILE,
            right: wz.width - csts.TILE, bottom: csts.TILE };
    this.rocks= [];
    while (this.rocks.length < cfg.BOULDERS) {
      r= {};
      r.left = Math.floor( Math.random() * wz.width);
      r.top = Math.floor( Math.random() * wz.height);
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) && !asterix.fns.outOfBound(r,B)) {
        deg = Math.floor(Math.random() * 360);
        x = r.left + w/2;
        y = r.top - h/2;
        aa = new ast.EntityAsteroid1( x, y, {angle: deg});
        this.addItem(aa.create());
        this.rocks.push(aa);
      }
    }
  },

  spawnPlayer: function() {
  },

  maybeOverlap: function (a) {
    return _.some(this.rocks, function(z) {
      var r={};
      r.left= Math.floor(ccsx.getLeft(z.sprite));
      r.top= Math.floor(ccsx.getTop(z.sprite));
      r.bottom = r.top - ccsx.getHeight(z.sprite);
      r.right= r.left + ccsx.getWidth(z.sprite);
      return asterix.fns.isIntersect(r,a);
    });
  },

  newGame: function(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});



asterix.Asteroids.Factory = {

  create: function(options) {
    var scene = new asterix.XSceneFactory({
      layers: [
        BackLayer,
        GameLayer,
        HUDLayer
      ]
    }).create(options);
    if (scene) {
      scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
        asterix.XMenuLayer.onShowMenu();
      });
      scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
        sh.main.replay();
      });
    }
    return scene;
  }

};


}).call(this);


