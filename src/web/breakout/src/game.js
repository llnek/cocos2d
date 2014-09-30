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

(function(undef) { "use strict"; var global = this, _ = global._  ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
bko= asterix.BreakOut,
sjs= global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  getHUD: function() {
    var rc= this.ptScene.getLayers();
    return rc['HUD'];
  },

  getNode: function() { return this.atlasBatch; },

  reset: function(newFlag) {
    if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
      var img = cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
      this.atlasBatch = new cc.SpriteBatchNode(img);
      this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
    }
    this.players=[];
    this.bricks=[];
    this.actor=null;
    this.ball=null;
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },

  operational: function() {
    return this.options.running;
  },

  spawnPlayer: function() {
    var csts= sh.xcfg.csts,
    cw= ccsx.center(),
    aa = new bko.EntityPlayer(cw.x, 56, {});
    this.addItem(aa.create());
    this.players.push(aa);
    this.actor= aa;
    this.spawnBall();
  },

  spawnBall: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    aa= new bko.EntityBall(cw.x, 250, {});
    this.addItem(aa.create());
    this.ball=aa;
  },

  initBrickSize: function() {
    if (this.candySize) {} else {
      var dummy = new bko.EntityBrick(0,0, { color: 'red_candy' });
      this.candySize= dummy.create().getContentSize();
    }
  },

  initBallSize: function() {
    if (this.ballSize) {} else {
      var dummy = new bko.EntityBall(0,0, {});
      this.ballSize= dummy.create().getContentSize();
    }
  },

  initBricks: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen(),
    cw= ccsx.center(),
    candies= csts.CANDIES,
    cs= csts.LEVELS["1"],
    b, w, r, c,
    x,
    y= wz.height - csts.TOP_ROW * csts.TILE ;

    for (r=0; r < csts.ROWS; ++r) {
      x= csts.TILE + csts.LEFT_OFF + sh.hw(this.candySize);
      for (c=0; c < csts.COLS; ++c) {
        b= new bko.EntityBrick(x,y, {
          color: candies[cs[r]]
        });
        this.addItem(b.create());
        this.bricks.push(b);
        x += this.candySize.width + 1;
      }
      y -= this.candySize.height - 2;
    }
  },

  getEnclosureRect: function() {
    var csts= sh.xcfg.csts,
    wz= ccsx.screen();
    return { bottom: csts.TILE,
             top: wz.height - csts.TOP * csts.TILE,
             left: csts.TILE,
             right: wz.width - csts.TILE };
  },

  updateEntities: function(dt) {
    this.actor.update(dt);
    this.ball.update(dt);
  },

  checkEntities: function(dt) {
    var bs = this.ball.sprite,
    bp= bs.getPosition();

    // 1. check if ball is lost
    if (bp.y < ccsx.getBottom(this.actor.sprite)) {
      this.onPlayerKilled();
    }
    else if (ccsx.collide(this.ball, this.actor)) {
    // 2. check if ball is hitting paddle
      this.ball.vel.y = - this.ball.vel.y;
      if (this.ball.vel.x < 0) {
      } else {
      }
      bs.setPosition(bp.x, ccsx.getTop(this.actor.sprite) + ccsx.getHeight(bs) * 0.5);
      sh.sfxPlay('ball-paddle');
    }
    else {
    // 3. check if ball hits brick
      this.checkBallBricks();
    }
  },

  checkBallBricks: function(dt) {
    var bss = this.bricks,
    n,
    m= this.ball;

    for (n=0; n < bss.length; ++n) {
      if (bss[n].status !== true) { continue; }
      if (ccsx.collide(m, bss[n])) {
        m.check(bss[n]);
        break;
      }
    }
  },

  onPlayerKilled: function() {
    this.ball.dispose();
    this.ball=null;
    this.actor.dispose();
    this.players=[];
    this.actor=null;
    if ( this.getHUD().reduceLives(1)) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },

  onDone: function() {
    this.reset();
    this.getHUD().enableReplay();
  },

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {

    this.reset(newFlag);
    this.cleanSlate();
    this.options.world= this.getEnclosureRect();

    this.options.factory= new bko.EntityFactory(this.engine);
    this.engine.addSystem(new bko.GameSupervisor(this.options),
                          bko.Priorities.PreUpdate);
    this.engine.addSystem(new bko.MotionControl(this.options),
                          bko.Priorities.Motion);
    this.engine.addSystem(new bko.MovementPaddle(this.options),
                          bko.Priorities.Movement);
    this.engine.addSystem(new bko.MovementBall(this.options),
                          bko.Priorities.Movement);
    this.engine.addSystem(new bko.CollisionSystem(this.options),
                          bko.Priorities.Collision);

    this.options.running=true;
  },

  onBrickKilled: function(msg) {
    var obj= new bko.EntityExplode(msg.x, msg.y, msg);
    this.addItem(obj.create());
    sh.sfxPlay('ball-brick');
  },

  onEarnScore: function(msg) {
    this.getHUD().updateScore(msg.value);
  },

  onNewGame: function(mode) {
    //sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});




asterix.BreakOut.Factory = {
  create: function(options) {
    var scene = new asterix.XSceneFactory([
      bko.BackLayer, GameLayer, bko.HUDLayer
    ]).create(options);
    if (scene) {
      scene.ebus.on('/game/objects/bricks/killed', function(topic, msg) {
        sh.main.onBrickKilled(msg);
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
    }

    return scene;
  }
}





}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

