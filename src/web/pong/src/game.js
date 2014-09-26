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

var odin= global.ZotohLab.Odin,
evts= odin.Events;



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
        sjs.tne("onStop has bad status.");
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
    if (!_.isObject(evt.source)) { return; }
    switch (evt.code) {
      case evts.C_POKE_MOVE:
        sjs.loggr.debug("activate arena, start to rumble!");
        if (this.options.pnum === evt.source.pnum) {
          this.arena.animate();
        } else {
          sjs.loggr.error("Got POKED but with wrong player number. " +
                          evt.source.pnum);
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
    var rc= this.ptScene.getLayers();
    return rc['HUD'];
  },

  players: [],
  ball: null,

  initPaddleSize: function() {
    var dummy, id;
    if (ccsx.isPortrait()) {
      id='gamelevel1.images.p.paddle1';
    } else {
      id='gamelevel1.images.l.paddle1';
    }
    dummy= new cc.Sprite(sh.getImagePath(id));
    return this.paddleSize = dummy.getContentSize();
  },

  initBallSize: function() {
    var dummy= new cc.Sprite(sh.getImagePath('gamelevel1.images.ball'));
    return this.ballSize = dummy.getContentSize();
  },

  play: function(newFlag) {
    var world= this.getEnclosureRect(),
    ps = this.initPaddleSize(),
    bs = this.initBallSize(),
    csts= sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen(),
    p2ids,p1ids,
    p1x,p2x,
    p1y,p2y;

    // sort out names of players
    _.each(this.options.ppids,function(v,k) {
      if (v[0] === 1) {
        p1ids= [k, v[1] ];
      } else {
        p2ids= [k, v[1] ];
      }
    });

    // position of paddles
    // portrait
    p1y = Math.floor(world.bottom + bs.height + sh.hh(ps));
    p2y = Math.floor(world.top - bs.height - sh.hh(ps));
    // landscape
    p2x = Math.floor(world.right - bs.width - sh.hw(ps));
    p1x = Math.floor(world.left + bs.width + sh.hw(ps));
    // game defaults for entities and timers.
    this.options.framespersec= cc.game.config[cc.game.CONFIG_KEY.frameRate];
    this.options.world= world;
    this.options.syncMillis= 3000;
    this.options.paddle= {height: Math.floor(ps.height),
             width: Math.floor(ps.width),
             speed: Math.floor(csts.PADDLE_SPEED)};
    this.options.ball= {height: Math.floor(bs.height),
           width: Math.floor(bs.width),
           x: Math.floor(cw.x),
           y: Math.floor(cw.y),
           speed: Math.floor(csts.BALL_SPEED) };
    if (ccsx.isPortrait()) {
      this.options.p1= {y: p1y, x: Math.floor(cw.x) };
      this.options.p2= {y: p2y, x: Math.floor(cw.x) };
    } else {
      this.options.p1= {x: p1x, y: Math.floor(cw.y) };
      this.options.p2= {x: p2x, y: Math.floor(cw.y) };
    }
    this.options.numpts= csts.NUM_POINTS;


    // start with a clean slate
    this.reset(newFlag);
    this.cleanSlate();

    //
    this.options.factory= new png.EntityFactory(this.engine);
    this.initPlayers();

    //
    this.engine.addSystem(new png.GameSupervisor(this.options),
                          png.Priorities.PreUpdate);
    this.engine.addSystem(new png.MotionCtrlSystem(this.options),
                          png.Priorities.Motion);
    this.engine.addSystem(new png.MovementSystem(this.options),
                          png.Priorities.Move);
    this.engine.addSystem(new png.Resolution(this.options),
                          png.Priorities.Resolve);
    this.engine.addSystem(new png.CollisionSystem(this.options),
                          png.Priorities.Collision);
    this.engine.addSystem(new png.RenderSystem(this.options),
                          png.Priorities.Render);


    if (this.options.wsock) {
      this.options.wsock.unsubscribeAll();
      this.options.wsock.subscribeAll(this.onevent,this);
    }

    this.getHUD().regoPlayers(csts.P1_COLOR,p1ids,
                              csts.P2_COLOR,p2ids);
    this.options.running=true;
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
    this.players=[];
  },

  updateEntities: function(dt) {
    this.arena.updateEntities(dt);
  },

  checkEntities: function() {
    this.arena.checkEntities();
  },

  operational: function() {
    return this.options.running;
  },

  initPlayers: function() {
    var csts= sh.xcfg.csts,
    p2cat,p1cat,
    p2,p1;

    switch (this.options.mode) {
      case sh.ONLINE_GAME:
        p2cat = csts.NETP;
        p1cat = csts.NETP;
      break;
      case sh.P1_GAME:
        p1cat= csts.HUMAN;
        p2cat= csts.BOT;
      break;
      case sh.P2_GAME:
        p2cat= csts.HUMAN;
        p1cat= csts.HUMAN;
      break;
    }
    p1= new png.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
    p2= new png.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
    this.options.players = [null,p1,p2];
    this.options.colors={};
    this.options.colors[csts.P1_COLOR] = p1;
    this.options.colors[csts.P2_COLOR] = p2;
  },

  // scores is a map {'o': 0, 'x': 0}
  updatePoints: function(scores) {
    this.getHUD().updateScores(scores);
  },

  onWinner: function(p,score) {
    this.getHUD().updateScore(p,score || 1);
    var rc= this.getHUD().isDone();
    if (rc[0]) {
      this.doDone( rc[1] );
    } else {
      //this.arena.spawnNewBall();
    }
  },

  doDone: function(p) {
    this.getHUD().drawResult(p);
    this.getHUD().endGame();

    this.removeAllItems();
    sh.sfxPlay('game_end');

    this.options.running=false;
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

      scene.ebus.on('/game/hud/score/update',function(t,msg) {
        sh.main.onWinner(msg.color, msg.score);
      });

    }
    return scene;
  }

};


}).call(this);


//////////////////////////////////////////////////////////////////////////////
//EOF


