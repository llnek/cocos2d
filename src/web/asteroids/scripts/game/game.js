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
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.hudwall'));
    this.addChild(map,++this.lastZix, ++this.lastTag);
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
//////////////////////////////////////////////////////////////////////////////
// object pools
//////////////////////////////////////////////////////////////////////////////

sh.pools['missiles'] = new asterix.XEntityPool({ entityProto: ast.EntityMissile });
sh.pools['lasers'] = new asterix.XEntityPool({ entityProto: ast.EntityLaser });
sh.pools['live-missiles'] = {};
sh.pools['live-lasers'] = {};

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
    sh.pools['missiles'].drain();
    sh.pools['lasers'].drain();
    sh.pools['live-missiles'] = {};
    sh.pools['live-lasers'] = {};
    this.initAsteroidSizes();
    this.initPlayerSize();
    this.players=[];
    this.actor=null;
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },

  updateEntities: function(dt) {
    _.each(this.rocks,function(z) {
      if (z && z.status) {
        z.update(dt);
      }
    });

    var obj= sh.pools['live-lasers'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });

    this.actor.update(dt);

    obj = sh.pools['live-missiles'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });

  },

  checkEntities: function(dt) {
    for (var n=0; n< 5; ++n) {
      this.checkRocks(dt);
    }
  },

  checkRocks: function(dt) {
    var r1,r2, i, j;
    for (i =0; i < this.rocks.length; ++i) {
      r1= this.rocks[i];
      if (!r1.status) { continue; }
      for (j= i+1; j < this.rocks.length; ++j) {
        r2 = this.rocks[j];
        if (!r2.status) { continue; }
        if (ccsx.collide2(r1,r2)) {
          ccsx.resolveElastic(r1,r2);
        }
      }
    }
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
    var dummy = new ast.EntityPlayer(0,0,{}),
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
    B= this.getEnclosureRect();
    this.rocks= [];
    while (this.rocks.length < cfg.BOULDERS) {
      r= { left: asterix.fns.randPercentage() * wz.width,
           top: asterix.fns.randPercentage() * wz.height };
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) && !asterix.fns.outOfBound(r,B)) {
        deg = asterix.fns.randPercentage() * 360;
        x = r.left + w/2;
        y = r.top - h/2;
        aa = new ast.EntityAsteroid1( x, y, {angle: deg});
        this.addItem(aa.create());
        this.rocks.push(aa);
      }
    }
  },

  spawnPlayer: function() {
    var h = this.playerSize.height,
    w = this.playerSize.width,
    B= this.getEnclosureRect(),
    wz = ccsx.screen(),
    cw = ccsx.center(),
    test=true,
    aa,x,y,r;

    while (test) {
      r= { left: asterix.fns.randPercentage() * wz.width,
           top: asterix.fns.randPercentage() * wz.height };
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) && !asterix.fns.outOfBound(r,B)) {
        x = r.left + w/2;
        y = r.top - h/2;
        aa = new ast.EntityPlayer( x, y, {});
        this.addItem(aa.create());
        this.players=[];
        this.players.push(aa);
        this.actor=aa;
        test=false;
      }
    }
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

  onFireMissile: function(msg) {
    var ent = sh.pools['missiles'].get();
    if (ent) {
      ent.revive(msg.x, msg.y, msg);
    } else {
      ent = new ast.EntityMissile(msg.x, msg.y, msg);
      this.addItem(ent.create());
    }
    sh.pools['live-missiles'][ent.OID] = ent;
    //sh.xcfg.sfxPlay('ship-missile');
  },

  onMissileKilled: function(msg) {
    var obj = sh.pools['live-missiles'],
    m= msg.entity,
    tag= m.sprite.getTag();
    delete obj[tag];
    sh.pools['missiles'].add(m);
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
      scene.ebus.on('/game/objects/missiles/killed', function(topic, msg) {
        sh.main.onMissileKilled(msg);
      });
      scene.ebus.on('/game/objects/players/shoot',function(t,msg) {
        sh.main.onFireMissile(msg);
      });
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


