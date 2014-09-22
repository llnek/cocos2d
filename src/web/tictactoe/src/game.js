// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
Odin= global.ZotohLab.Odin,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ttt= sh.TicTacToe,
evts= Odin.Events;


//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  onStop: function(evt) {

    this.maybeUpdateActions(evt);

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


  maybeUpdateActions: function(evt) {
    var cmd= evt.source.cmd;
    if (_.isObject(cmd) &&
        _.isNumber(cmd.cell)) {
      sjs.loggr.debug("adding one more action from server " +
                      JSON.stringify(cmd));
      this.actions.push([cmd, 'server']);
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

  play: function(newFlag) {

    var csts= sh.xcfg.csts,
    h= this.getHUD(),
    p1ids, p2ids;

    sh.xcfg.csts.CELLS = this.options.size*this.options.size;
    sh.xcfg.csts.GRID_SIZE= this.options.size;

    // sort out names of players
    _.each(this.options.players,function(v,k) {
      if (v[0] === 1) {
        p1ids= [k, v[1] ];
      } else {
        p2ids= [k, v[1] ];
      }
    });

    // clean slate
    this.reset(newFlag);
    this.cleanSlate();

    this.options.factory= new ttt.EntityFactory(this.engine);
    this.initPlayers();
    this.options.selQ = [];
    this.options.netQ = [];

    this.engine.addSystem(new ttt.GameSupervisor(this.options),
                          ttt.Priorities.PreUpdate);

    this.engine.addSystem(new ttt.SelectionSystem(this.options),
                          ttt.Priorities.Movement);

    this.engine.addSystem(new ttt.NetworkSystem(this.options),
                          ttt.Priorities.Movement);

    this.engine.addSystem(new ttt.TurnBaseSystem(this.options),
                          ttt.Priorities.TurnBase);

    this.engine.addSystem(new ttt.ResolutionSystem(this.options),
                          ttt.Priorities.Resolve);

    this.engine.addSystem(new ttt.RenderSystem(this.options),
                          ttt.Priorities.Render);

    if (this.options.wsock) {
      this.options.wsock.unsubscribeAll();
      this.options.wsock.subscribeAll(this.onevent,this);
    }

    this.getHUD().regoPlayers(csts.P1_COLOR,p1ids,
                              csts.P2_COLOR,p2ids);
  },

  onNewGame: function(mode) {
    //sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  reset: function(newFlag) {
    var h= this.getHUD();
    if (newFlag) {
      h.resetAsNew();
    } else {
      h.reset();
    }
/*
    _.each(this.cells, function(z) {
      if (z) {
        this.removeItem(z[0]);
      }
    },this);
*/
  },

  onclicked: function(mx,my) {

    if (this.options.running &&
        this.options.selQ.length === 0) {
      sjs.loggr.debug("selection made at pos = " + mx + "," + my);
      this.options.selQ.push({ x: mx, y: my, cell: -1 });
    }
  },

  updateHUD: function() {
    var h= this.getHUD();

    if (this.options.running) {
      h.drawStatus(this.actor);
    } else {
      h.drawResult(this.lastWinner);
    }
  },

  playBoardReady: function() {
    if (sjs.echt(this.options.wsock)) {} else {
      var cur = this.board.curActor(),
      h= this.getHUD();
      if (!cur.isRobot()) {
        h.showTimer();
      }
    }
  },

  playTimeExpired: function(msg) {
    var winner=this.board.getOtherPlayer(this.board.curActor()),
    cmd= [winner,[]];

    this.board.forfeit();
    this.actions.push([cmd, "winner"]);
  },

  getHUD: function() {
    var rc= this.ptScene.getLayers();
    return rc['HUD'];
  },

  rtti: function() { return 'GameLayer'; },

  setGameMode: function(mode) {
    var h= this.getHUD();
    this._super(mode);
    if (h) {
      h.setGameMode(mode);
    }
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
    p1= new ttt.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
    p2= new ttt.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
    this.options.players = [null,p1,p2];
    this.options.colors={};
    this.options.colors[csts.P1_COLOR] = p1;
    this.options.colors[csts.P2_COLOR] = p2;
  },

  onevent: function(topic, evt) {
    //sjs.loggr.debug(evt);
    switch (evt.type) {
      case evts.NETWORK_MSG:
        this.onNetworkEvent(evt);
      break;
      case evts.SESSION_MSG:
        this.onSessionEvent(evt);
      break;
    }
  },

  onNetworkEvent: function(evt) {
    var h= this.getHUD();
    switch (evt.code) {
      case evts.C_RESTART:
        sjs.loggr.debug("restarting a new game...");
        h.killTimer();
        this.play(false);
      break;
      case evts.C_STOP:
        sjs.loggr.debug("game will stop");
        h.killTimer();
        this.onStop(evt);
      break;
      default:
        //TODO: fix this hack
        this.onSessionEvent(evt);
      break;
    }
  },

  onSessionEvent: function(evt) {

    switch (evt.code) {
      case evts.C_POKE_MOVE:
      case evts.C_POKE_WAIT:
        this.options.netQ.push(evt);
      break;
    }

  }


});


asterix.TicTacToe.Factory = {

  create: function(options) {
    var scene = new asterix.XSceneFactory([
      ttt.BackLayer,
      GameLayer,
      ttt.HUDLayer
    ]).create(options);

    if (scene) {
      scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
        asterix.XMenuLayer.onShowMenu();
      });
      scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
        sh.main.replay();
      });
      scene.ebus.on('/game/hud/timer/show',function(t,msg) {
        sh.main.getHUD().showTimer();
      });
      scene.ebus.on('/game/hud/timer/hide',function(t,msg) {
        sh.main.getHUD().killTimer();
      });
      scene.ebus.on('/game/hud/score/update',function(t,msg) {
        sh.main.getHUD().updateScore(msg.color, msg.score);
      });
      scene.ebus.on('/game/hud/end',function(t,msg) {
        sh.main.getHUD().endGame();
      });
      scene.ebus.on('/game/hud/update',function(t,msg) {
        sh.main.getHUD().update(msg.running, msg.pnum);
      });
      scene.ebus.on('/game/player/timer/expired',function(t,msg) {
        sh.main.playTimeExpired(msg);
      });
      scene.ebus.on('/game/board/activated',function(t,msg) {
        sh.main.playBoardReady();
      });
    }
    return scene;
  }

};

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

