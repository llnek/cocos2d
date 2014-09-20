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
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ttt= sh.TicTacToe;

var Odin= global.ZotohLab.Odin,
evts= Odin.Events;


function Cmd(a,pos) {
  return {
    cell: pos,
    actor: a,
    value: a.value
  };
}


//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var GameLayer = asterix.XGameLayer.extend({

  // map of the screen co-ords of each cell in the grid
  gridMap: [],

  // holds references to sprites
  cells: [],

  // queue for UI updates
  actions: [],

  // polymorphic board (net/non-net)
  board: null,

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

    var state0= this.options.seed_data,
    ncells= state0.size*state0.size,
    csts= sh.xcfg.csts,
    h= this.getHUD(),
    delay,
    p1ids, p2ids,
    p1= null,
    p2= null;

    sh.xcfg.csts.GRID_SIZE= state0.size;
    sh.xcfg.csts.CELLS = ncells;

    // sort out names of players
    _.each(state0.players,function(v,k) {
      if (v[0] === 1) {
        p1ids= [k, v[1] ];
      } else {
        p2ids= [k, v[1] ];
      }
    });

    // clean slate
    this.reset(newFlag);
    this.cleanSlate();
    this.selQ = [];
    this.netQ = [];

    var state = sjs.merge({p2ids: p2ids,
                           p1ids: p1ids }, this.options),
        fac= new ttt.EntityFactory(this.engine);

    this.engine.addSystem(new ttt.GameSupervisor(state, fac),
                          ttt.Priorities.PreUpdate);

    this.engine.addSystem(new ttt.SelectionSystem(state, this.selQ),
                          ttt.Priorities.Movement);

    this.engine.addSystem(new ttt.NetworkSystem(state, this.netQ),
                          ttt.Priorities.Movement);

    this.engine.addSystem(new ttt.TurnBaseSystem(state),
                          ttt.Priorities.Resolve);

    this.engine.addSystem(new ttt.RenderSystem(state),
                          ttt.Priorities.Render);

    state.wsock.unsubscribeAll();
    state.wsock.subscribeAll(this.onevent,this);

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
      this.mapGridPos();
    } else {
      h.reset();
    }

    _.each(this.cells, function(z) {
      if (z) {
        this.removeItem(z[0]);
      }
    },this);

    this.players=[];
    this.cells=[];
    this.actor=null;
  },

  onclicked: function(mx,my) {

    if (this.state.running &&
        this.selQ.length === 0) {
      sjs.loggr.debug("selection made at pos = " + mx + "," + my);
      this.selQ.push({ x: mx, y: my, cell: -1 });
    }
  },

  updateHUD: function() {
    var h= this.getHUD();

    if (this.state.running) {
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
        this.netQ.length = 0;
        this.netQ.push(evt);
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

