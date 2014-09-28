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
ccsx= asterix.COCOS2DX,
ivs= asterix.Invaders,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// object pools
//////////////////////////////////////////////////////////////////////////////

sh.pools['missiles'] = new asterix.XEntityPool({ entityProto: ivs.EntityMissile });
sh.pools['bombs'] = new asterix.XEntityPool({ entityProto: ivs.EntityBomb });
sh.pools['live-missiles'] = {};
sh.pools['live-bombs'] = {};

//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  reset: function(newFlag) {
    if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
      var img = cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
      this.atlasBatch = new cc.SpriteBatchNode(img);
      this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
    }
    sh.pools['missiles'].drain();
    sh.pools['bombs'].drain();
    sh.pools['live-missiles'] = {};
    sh.pools['live-bombs'] = {};
    this.motion = null;
    this.bombs = null;
    this.aliens = [];
    this.players=[];
    this.actor=null;
    this.getHUD().reset();
  },

  getHUD: function() {
    var rc= this.ptScene.getLayers();
    return rc['HUD'];
  },

  initAlienSize: function() {
    var dummy = new ivs.EntityAlien(0,0, { rank: 0, frameID: 'green_bug_0.png' });
    dummy.create();
    return this.alienSize= dummy.sprite.getContentSize();
  },

  initShipSize: function() {
    var dummy = new ivs.EntityPlayer(0,0, { frameID: 'ship_0.png' });
    dummy.create();
    return this.shipSize= dummy.sprite.getContentSize();
  },

  getNode: function() { return this.atlasBatch; },

  initAliens: function() {
    var alien = this.initAlienSize(),
    ship = this.initShipSize(),
    csts = sh.xcfg.csts,
    cw= ccsx.center(),
    n, x,y, me = this,
    aa, row = 0;

    for (n=0; n < csts.CELLS; ++n) {
      if (n % csts.COLS === 0) {
        y = n === 0 ? (csts.GRID_H - csts.TOP) * csts.TILE : y - alien.height - csts.OFF_Y;
        x = csts.LEFT * csts.TILE + sh.hw(alien);
        row += 1;
      }
      aa = new ivs.EntityAlien( x + sh.hw(alien), y - sh.hh(alien), {
        frameTime: 1,
        rank: row
      });
      this.addItem(aa.create());
      this.aliens.push(aa);
      x += alien.width + csts.OFF_X;
    }

    this.spawnPlayer();
  },

  initMotionTimers: function() {
    _.each(this.aliens, function(z) { z.status = true; });
    this.stepX = this.alienSize.width / 3;
    this.bombs = ccsx.createTimer(this, 2);
    this.motion = ccsx.createTimer(this, 1);
  },

  updateEntities: function(dt) {
    if (ccsx.timerDone(this.motion)) { this.checkMotion(dt); }
    if (ccsx.timerDone(this.bombs)) { this.checkBombs(dt); }

    var obj= sh.pools['live-bombs'];
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
    // 1. get rid of all colliding bombs & missiles.
    this.checkMissilesBombs(dt);
    // 2. kill aliens
    this.checkMissilesAliens(dt);
    // 3. ship ok?
    this.checkShipBombs(dt);
    // 4. overruned by aliens ?
    this.checkShipAliens(dt);
  },

  checkMissilesAliens: function(dt) {
    var mss = sh.pools['live-missiles'],
    ass= this.aliens,
    m, n;
    _.each(_.keys(mss), function(z) {
      m = mss[z];
      for (n=0; n < ass.length; ++n) {
        if (ass[n].status !== true) {
          continue;
        }
        if (ccsx.collide(m, ass[n])) {
          m.check(ass[n]);
          break;
        }
      }
    });
  },

  checkMissilesBombs: function(dt) {
    var mss = sh.pools['live-missiles'],
    bbs = sh.pools['live-bombs'],
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

  checkShipBombs: function(dt) {
    var bss = sh.pools['live-bombs'],
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

  checkShipAliens: function(dt) {
    var ass= this.aliens,
    p= this.actor,
    n;
    for (n=0; n < ass.length; ++n) {
      if (ass[n].status !== true) {
        continue;
      }
      if (ccsx.collide(p, ass[n])) {
        p.check(ass[n]);
        break;
      }
    }
  },

  maybeShuffle: function(stepx) {
    var b = stepx > 0 ? this.findMaxX() : this.findMinX(),
    ok;
    if (sjs.echt(b) && b.status) {
      ok = this.testDirX(b, stepx) ? this.doShuffle(stepx)
                                   : this.doForward(stepx);
      if (ok) {
        sh.sfxPlay('bugs-march');
      }
    }
  },

  doShuffle: function(stepx) {
    var rc = _.filter(this.aliens, function(a) {
      return a.status;
    });
    _.each(rc, function(a) {
      a.shuffle(stepx);
    });
    return rc.length > 0;
  },

  doForward: function(stepx) {
    var rc = _.filter(this.aliens, function(a) {
      return a.status;
    });
    _.each(rc, function(a) {
      a.forward();
    });
    this.stepX = -stepx;
    return rc.length > 0;
  },

  testDirX: function(b, stepx) {
    var csts = sh.xcfg.csts,
    sp= b.sprite;
    if (stepx > 0) {
      return ccsx.getRight(sp) + stepx < (csts.GRID_W - 2) * csts.TILE;
    } else {
      return ccsx.getLeft(sp) + stepx > csts.LEFT * csts.TILE;
    }
  },

  findMinX: function() {
    return _.min(this.aliens, function(a) {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return Number.MAX_VALUE;
      }
    });
  },

  findMaxX: function() {
    return _.max(this.aliens, function(a) {
      if (a.status) {
        return ccsx.getLeft(a.sprite);
      } else {
        return 0;
      }
    });
  },

  checkMotion: function(dt) {
    this.maybeShuffle(this.stepX);
    this.motion = ccsx.createTimer(this, 1);
  },

  checkBombs: function(dt) {
    var rc = [],
    n;
    for (n=0; n < this.aliens.length; ++n) {
      if (this.aliens[n].status) {
        rc.push(n);
      }
    }
    if (rc.length > 0) {
      n = rc.length === 1 ? 0 : sjs.rand( rc.length);
      this.aliens[n].loadBomb();
    }
    _.each(this.aliens, function(z) {
        if (z.status) { z.update(dt); }
    });
    this.bombs = ccsx.createTimer(this, 2);
  },

  operational: function() {
    return this.players.length > 0;
  },

  spawnPlayer: function() {
    var csts= sh.xcfg.csts,
    y =  5 * csts.TILE + this.shipSize.height,
    cw= ccsx.center(),
    aa= new ivs.EntityPlayer(cw.x, y, { coolDown: 0.8});

    this.addItem(aa.create());
    this.players=[];
    this.players.push( aa);
    this.actor=aa;
  },

  replay: function() {
    this.play();
  },

  play: function(newFlag) {
    this.reset(newFlag);
    this.initAliens();
    this.initMotionTimers();
  },

  onNewGame: function(mode) {
    //sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  dropBombs: function(msg) {
    var ent = sh.pools['bombs'].get(),
    tag;
    if (ent) {
      ent.revive(msg.x, msg.y, msg);
      tag= ent.OID;
    } else {
      ent= new ivs.EntityBomb(msg.x, msg.y, msg);
      this.addItem(ent.create());
      tag= ent.OID;
    }
    sh.pools['live-bombs'][tag] = ent;
  },

  fireMissiles: function(msg) {
    var ent = sh.pools['missiles'].get();
    if (ent) {
      ent.revive(msg.x, msg.y, msg);
    } else {
      ent = new ivs.EntityMissile(msg.x, msg.y, msg);
      this.addItem(ent.create());
    }
    sh.pools['live-missiles'][ent.OID] = ent;
    sh.sfxPlay('ship-missile');
  },

  onAlienKilled: function(msg) {
    var obj= new ivs.EntityExplode(msg.x, msg.y, msg);
    this.addItem(obj.create());
    sh.sfxPlay('xxx-explode');
  },

  onBombKilled: function(msg) {
    var obj = sh.pools['live-bombs'],
    b= msg.entity,
    tag= b.sprite.getTag();
    delete obj[tag];
    sh.pools['bombs'].add(b);
    // explosion?
    if (msg.explode === true) {
      obj= new ivs.EntityExplode(msg.x, msg.y, msg);
      this.addItem(obj.create());
      sh.sfxPlay('xxx-explode');
    }
  },

  onMissileKilled: function(msg) {
    var obj = sh.pools['live-missiles'],
    m= msg.entity,
    tag= m.sprite.getTag();
    delete obj[tag];
    sh.pools['missiles'].add(m);
  },

  onPlayerKilled: function(msg) {
    sh.sfxPlay('xxx-explode');
    if ( this.getHUD().reduceLives(1)) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },

  onEarnScore: function(msg) {
    this.getHUD().updateScore( msg.score);
  },

  onDone: function() {
    this.reset();
    this.getHUD().enableReplay();
  }


});

asterix.Invaders.Factory = {
  create: function(options) {
    var fac = new asterix.XSceneFactory([ ivs.BackLayer, GameLayer, ivs.HUDLayer ]),
    scene= fac.create(options);
    if (!scene) { return null; }
    scene.ebus.on('/game/objects/aliens/dropbombs', function(topic, msg) {
      sh.main.dropBombs(msg);
    });
    scene.ebus.on('/game/objects/players/shoot', function(topic, msg) {
      sh.main.fireMissiles(msg);
    });
    scene.ebus.on('/game/objects/aliens/killed', function(topic, msg) {
      sh.main.onAlienKilled(msg);
    });
    scene.ebus.on('/game/objects/bombs/killed', function(topic, msg) {
      sh.main.onBombKilled(msg);
    });
    scene.ebus.on('/game/objects/missiles/killed', function(topic, msg) {
      sh.main.onMissileKilled(msg);
    });
    scene.ebus.on('/game/objects/players/killed', function(topic, msg) {
      sh.main.onPlayerKilled(msg);
    });
    scene.ebus.on('/game/objects/players/earnscore', function(topic, msg) {
      sh.main.onEarnScore(msg);
    });
    scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
      asterix.XMenuLayer.onShowMenu();
    });
    scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
      sh.main.replay();
    });

    return scene;
  }
}

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF
