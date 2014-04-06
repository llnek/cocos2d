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
    this.atlasBatch = cc.SpriteBatchNode.createWithTexture( cc.TextureCache.getInstance().addImage( sh.xcfg.getAtlasPath('game-pics')));
    this.addChild(this.atlasBatch, this.lastZix, ++this.lastTag);

    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.hudwall'));
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
      fontPath: sh.xcfg.getFontPath('font.TinyBoxBB'),
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
    this.initUfoSize();
    this.players=[];
    this.ufos=[];
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

    if (this.ufos.length === 0) {
      this.spawnUfo();
    }

    var obj= sh.pools['live-lasers'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });

    this.actor.update(dt);

    _.each(this.ufos, function(z) {
      z.update(dt);
    });

    obj = sh.pools['live-missiles'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });

    obj = sh.pools['live-lasers'];
    _.each(_.keys(obj), function(k) {
      obj[k].update(dt);
    });

  },

  checkEntities: function(dt) {

    this.checkMissilesAstros(dt);

    /*
    this.checkMissilesLasers(dt);
    this.checkMissilesUfos(dt);
    */

    for (var n=0; n< 5; ++n) {
      this.checkRocks(dt);
    }
  },

  checkShipLasers: function(dt) {
    var bss = sh.pools['live-lasers'],
    a= _.keys(bss),
    b, n, p = this.actor;
    for (n=0; n < a.length; ++n) {
      b = bss[ a[n] ];
      if (ccsx.collide(b, p)) {
        p.check(b);
        break;
      }
    }
  },

  checkShipAstros: function(dt) {
    var ass= this.rocks,
    p= this.actor,
    n;
    for (n=0; n < ass.length; ++n) {
      if (ass[n].status !== true) { continue; }
      if (ccsx.collide(p, ass[n])) {
        p.check(ass[n]);
        break;
      }
    }
  },

  checkShipUfos: function(dt) {
    var ass= this.ufos,
    p= this.actor,
    n;
    for (n=0; n < ass.length; ++n) {
      if (ass[n].status !== true) { continue; }
      if (ccsx.collide(p, ass[n])) {
        p.check(ass[n]);
        break;
      }
    }
  },

  checkMissilesAstros: function(dt) {
    var mss = sh.pools['live-missiles'],
    ass= this.rocks,
    m, n;
    _.each(_.keys(mss), function(z) {
      m = mss[z];
      for (n=0; n < ass.length; ++n) {
        if (ass[n].status !== true) { continue; }
        if (ccsx.collide(m, ass[n])) {
          m.check(ass[n]);
          break;
        }
      }
    });
  },

  checkMissilesUfos: function(dt) {
    var mss = sh.pools['live-missiles'],
    ass= this.ufos,
    m, n;
    _.each(_.keys(mss), function(z) {
      m = mss[z];
      for (n=0; n < ass.length; ++n) {
        if (ass[n].status !== true) { continue; }
        if (ccsx.collide(m, ass[n])) {
          m.check(ass[n]);
          break;
        }
      }
    });
  },

  checkMissilesLasers: function(dt) {
    var mss = sh.pools['live-missiles'],
    bbs = sh.pools['live-lasers'],
    k, a,m,b;
    _.each(_.keys(bbs), function(z) {
      a= _.keys(mss);
      b= bbs[z];
      for (k = 0; k < a.length; ++k) {
        m = mss[ a[k] ];
        if ( ccsx.collide(m, b)) {
          m.check(b);
          break;
        }
      }
    });
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
    var dummy = new ast.EntityAsteroid3(0,0,{}),
    s= dummy.create();
    this.astro3 = s.getContentSize();

    dummy = new ast.EntityAsteroid2(0,0,{});
    s= dummy.create();
    this.astro2 = s.getContentSize();

    dummy = new ast.EntityAsteroid1(0,0,{});
    s= dummy.create();
    this.astro1 = s.getContentSize();
  },

  initPlayerSize: function() {
    var dummy = new ast.EntityPlayer(0,0,{}),
    s= dummy.create();
    this.playerSize = s.getContentSize();
  },

  initUfoSize: function() {
    var dummy = new ast.EntityUfo(0,0,{}),
    s= dummy.create();
    this.ufoSize = s.getContentSize();
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

  spawnUfo: function() {
    var h = this.ufoSize.height,
    w = this.ufoSize.width,
    B= this.getEnclosureRect(),
    wz = ccsx.screen(),
    cw = ccsx.center(),
    test=true,
    aa,x,y,r;

    this.ufos=[];
    while (test) {
      r= { left: asterix.fns.randPercentage() * wz.width,
           top: asterix.fns.randPercentage() * wz.height };
      r.bottom = r.top - h;
      r.right = r.left + w;
      if (!this.maybeOverlap(r) && !asterix.fns.outOfBound(r,B)) {
        x = r.left + w/2;
        y = r.top - h/2;
        aa = new ast.EntityUfo( x, y, { player: this.actor });
        this.addItem(aa.create());
        this.ufos.push(aa);
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

  onFireLaser: function(msg) {
    var ent = sh.pools['lasers'].get();
    if (ent) {
      ent.revive(msg.x, msg.y, msg);
    } else {
      ent = new ast.EntityLaser(msg.x, msg.y, msg);
      this.addItem(ent.create());
    }
    sh.pools['live-lasers'][ent.OID] = ent;
    //sh.xcfg.sfxPlay('ship-missile');
  },

  onMissileKilled: function(msg) {
    var obj = sh.pools['live-missiles'],
    m= msg.entity,
    tag= m.sprite.getTag();
    delete obj[tag];
    sh.pools['missiles'].add(m);
  },

  onLaserKilled: function(msg) {
    var obj = sh.pools['live-lasers'],
    m= msg.entity,
    tag= m.sprite.getTag();
    delete obj[tag];
    sh.pools['lasers'].add(m);
  },

  onCreateStones: function(msg) {
    var aa= new ast.EntityAsteroid3(msg.x, msg.y, msg);
    this.addItem(aa.create());
    this.rocks.push(aa);
  },

  onCreateRocks: function(msg) {
    var aa= new ast.EntityAsteroid2(msg.x, msg.y, msg);
    this.addItem(aa.create());
    this.rocks.push(aa);
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
      scene.ebus.on('/game/objects/ufo/shoot',function(t,msg) {
        sh.main.onFireLaser(msg);
      });
      scene.ebus.on('/game/objects/stones/create',function(t,msg) {
        sh.main.onCreateStones(msg);
      });
      scene.ebus.on('/game/objects/rocks/create',function(t,msg) {
        sh.main.onCreateRocks(msg);
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


