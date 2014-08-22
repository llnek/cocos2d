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

(function(undef) { "use strict"; var global=this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
sjs= global.SkaroJS;

var Odin= global.ZotohLab.Odin,
evts= Odin.Events;


var BALL_SPEED=150, // 25 incremental
PADDLE_SPEED=200, // 300
NUM_ROUNDS=3;


//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  // get an odin event, first level callback
  onevent: function(topic, evt) {

    sjs.loggr.debug(evt);

    switch (evt.type) {
      case evts.NETWORK_MSG:
        this.onNetworkEvent(evt);
      break;
      case evts.SESSION_MSG:
        this.onSessionEvent(evt);
      break;
    }
  },

  onStop: function(evt) {

    switch (evt.source.status) {
      case 2:
        this.actions.push([[ this.board.getPlayer2(),
                             evt.source.combo ], 'winner'] );
      break;
      case 1:
        this.actions.push([[ this.board.getPlayer1(),
                             evt.source.combo ], 'winner'] );
      break;
      case 0:
        this.actions.push([null, 'draw' ]);
      break;
      default:
        throw new Error("onStop has bad status.");
      break;
    }
  },

  onNetworkEvent: function(evt) {
    switch (evt.code) {
      case evts.C_RESTART:
        sjs.loggr.debug("restarting a new game...");
        this.play(false);
      break;
      case evts.C_STOP:
        sjs.loggr.debug("game will stop");
        this.onStop(evt);
      break;
      default:
        //TODO: fix this hack
        this.onSessionEvent(evt);
      break;
    }
  },

  onSessionEvent: function(evt) {
    if (! _.isObject(evt.source)) {
      return;
    }
    var pnum= _.isNumber(evt.source.pnum) ? evt.source.pnum : 0;
    this.actor= this.players[pnum];
    switch (evt.code) {
      case evts.C_POKE_MOVE:
        sjs.loggr.debug("activate arena, start to rumble!");
        if (this.options.pnum === pnum) {
          this.arena.animate();
        } else {
          //this.arena.onEvent(evt);
        }
      break;
      case evts.C_SYNC_ARENA:
        sjs.loggr.debug("synchronize ui as defined by server.");
        this.arena.onEvent(evt);
      break;
    }

  },

  replay: function() {
    if (_.isObject(this.options.wsock)) {

      this.options.wsock.unsubscribeAll();
      this.options.wsock.subscribeAll(this.onevent,this);

      // request server to restart a new game
      this.options.wsock.send({
        type: evts.SESSION_MSG,
        code: evts.C_REPLAY
      });
    } else {
      this.play(false);
    }
  },


  getHUD: function() {
    return cc.director.getRunningScene().layers['HUD'];
  },

  players: [],
  ball: null,

  initPaddleSize: function() {
    var dummy= cc.Sprite.create(sh.getImagePath('gamelevel1.images.paddle1'));
    return this.paddleSize = dummy.getContentSize();
  },

  initBallSize: function() {
    var dummy= cc.Sprite.create(sh.getImagePath('gamelevel1.images.ball'));
    return this.ballSize = dummy.getContentSize();
  },

  play: function(newFlag) {
    var state0= this.options.seed_data,
    ps = this.initPaddleSize(),
    bs = this.initBallSize(),
    csts= sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    p2ids,p1ids,
    p2,p1,
    p1x,p2x;

    // sort out names of players
    _.each(state0.players,function(v,k) {
      if (v[0] === 1) {
        p1ids= [k, v[1] ];
      } else {
        p2ids= [k, v[1] ];
      }
    });

    // position of paddles
    p2x = Math.floor(wz.width - csts.TILE - 4 - bs.width - ps.width/2);
    p1x = Math.floor(csts.TILE + bs.width + 4 + ps.width/2);

    // start with clean slate
    this.reset(newFlag);

    p2=null;
    p1=null;
    // based on mode, create the 2 players
    //switch (sh.xcfg.csts.GAME_MODE) {
    switch (this.options.mode) {
      case 1:
        p2 = new png.EntityRobot(p2x, cw.y, { color: 'O' });
        p1 = new png.EntityHuman(p1x, cw.y, { color: 'X' });
        this.arena = new png.NonNetArena();
      break;
      case 2:
        p2 = new png.EntityHuman(p2x, cw.y, { color: 'O' });
        p1 = new png.EntityHuman(p1x, cw.y, { color: 'X' });
        this.arena = new png.NonNetArena();
      break;
      case 3:
        p2 = new png.NetPlayer(p2x, cw.y, { color: 'O' });
        p1 = new png.NetPlayer(p1x, cw.y, { color: 'X' });
        if (this.options.pnum === 1) {
          p1.setWEBSock(this.options.wsock);
        } else {
          p2.setWEBSock(this.options.wsock);
        }
        var opts= {
          world: this.getEnclosureRect(),
          framespersec: 60,
          syncMillis: 3000,
          paddle: {height: Math.floor(ps.height),
                   width: Math.floor(ps.width),
                   speed: Math.floor(PADDLE_SPEED)},
          ball: {height: Math.floor(bs.height),
                 width: Math.floor(bs.width),
                 x: Math.floor(cw.x),
                 y: Math.floor(cw.y),
                 speed: Math.floor(BALL_SPEED) },
          p1: {x: p1x, y: Math.floor(cw.y) },
          p2: {x: p2x, y: Math.floor(cw.y) },
          numpts: NUM_ROUNDS};
        this.arena = new png.NetArena(opts);
      break;
    }

    this.getHUD().regoPlayers(p1,p1ids,p2,p2ids);
    this.players= [null, p1, p2];
    this.arena.registerPlayers(this,p1,p2);

    if (this.options.wsock) {
      // online play
      this.options.wsock.unsubscribeAll();
      this.options.wsock.subscribeAll(this.onevent,this);
    }

    this.arena.startRumble();
  },

  onNewGame: function(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  reset: function(newFlag) {
    _.each(this.players,function(z) {
      if (z) { z.dispose(); }
    });
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
    this.actor=null;
    this.ball=null;
    this.players=[];
  },

  updateEntities: function(dt) {
    this.arena.updateEntities(dt);
  },

  checkEntities: function() {
    this.arena.checkEntities();
  },

  operational: function() {
    return this.arena && this.arena.isActive();
  },

  updatePoints: function(scores) {
    this.getHUD().updateScores(scores);
  },

  onWinner: function(p) {
    this.getHUD().updateScore(p,1);
    var rc= this.getHUD().isDone();
    if (rc[0]) {
      this.doDone( rc[1] );
    } else {
      this.arena.spawnNewBall();
    }
  },

  doDone: function(p) {
    this.getHUD().drawResult(p);
    this.getHUD().endGame();
    this.arena.finz();
    sh.sfxPlay('game_end');
  },

  setGameMode: function(mode) {
    this.getHUD().setGameMode(mode);
    this._super(mode);
  },

  getEnclosureRect: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();
    return { top: Math.floor(wz.height - 6 * csts.TILE),
             left: csts.TILE,
             bottom: csts.TILE,
             right: Math.floor(wz.width - csts.TILE) };
  }

});

asterix.Pong.Factory = {

  create: function(options) {

    var scene = new asterix.XSceneFactory([
      png.BackLayer,
      GameLayer,
      png.HUDLayer
    ]).create(options);

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





