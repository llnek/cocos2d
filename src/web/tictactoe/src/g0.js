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

  // get an odin event, first level callback
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

  maybeUpdateActions: function(evt) {
    var cmd= evt.source.cmd;
    if (_.isObject(cmd) &&
        _.isNumber(cmd.cell)) {
      sjs.loggr.debug("adding one more action from server " +
                      JSON.stringify(cmd));
      this.actions.push([cmd, 'server']);
    }
  },

  onSessionEvent: function(evt) {
    var pnum= _.isNumber(evt.source.pnum) ? evt.source.pnum : -1;
    var h= this.getHUD();
    this.maybeUpdateActions(evt);
    switch (evt.code) {
      case evts.C_POKE_MOVE:
        sjs.loggr.debug("player " + pnum + ": my turn to move");
        this.actor= this.players[pnum];
        h.showTimer();
        this.board.toggleActor(Cmd(this.actor));
      break;
      case evts.C_POKE_WAIT:
        sjs.loggr.debug("player " + pnum + ": my turn to wait");
        this.actor = this.players[pnum===1 ? 2 : 1];
        h.killTimer();
        this.board.toggleActor(Cmd(this.actor));
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


    //based on mode, create the 2 players
    //switch (sh.xcfg.csts.GAME_MODE) {
    switch (this.options.mode) {
      case 1:
        p2= new ttt.AlgoBot(csts.CV_O, 2, 'O');
        p1= new ttt.Human(csts.CV_X, 1, 'X');
      break;
      case 2:
        p1= new ttt.Human(csts.CV_X, 1, 'X');
        p2= new ttt.Human(csts.CV_O, 2, 'O');
      break;
      case 3:
        p1= new ttt.NetPlayer(csts.CV_X, 1, 'X');
        p2= new ttt.NetPlayer(csts.CV_O, 2, 'O');
        if (this.options.pnum === 1) {
          p1.setWEBSock(this.options.wsock);
        } else {
          p2.setWEBSock(this.options.wsock);
        }
      break;
    }

    this.board = ttt.NewBoard(this.options.mode,state0.size);
    this.board.initBoard(state0.grid);
    this.board.registerPlayers(p1, p2);

    h.regoPlayers(p1, p1ids, p2, p2ids);
    this.cells= sjs.makeArray(ncells, null);
    this.players= [null,p1,p2];
    this.actions = [];

    if (this.options.wsock) {
      // online play
      sjs.loggr.debug("reply to server: session started ok");
      this.options.wsock.unsubscribeAll();
      this.options.wsock.subscribeAll(this.onevent,this);
      this.options.wsock.send({
        type: evts.SESSION_MSG,
        code: evts.C_STARTED
      });
    } else {
      this.actor= this.board.curActor();
      if (this.actor.isRobot()) {
        this.move(Cmd(this.actor, sjs.rand(ncells)));
      }
    }

    // add a delay to prevent clicking too early.
    this.board.delay(1000);
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

  // not called by online play
  move: function(cmd) {
    var h= this.getHUD();
    // given a command object, make a move
    // if the move is valid, then a corresponding action is
    // added to the
    // queue, such as drawing the icon , playing a sound...etc
    this.board.enqueue(cmd, function(cmd, status, np) {

      if (status === 'bogus') {} else {
        // kill the last timer
        h.killTimer();
      }

      if (status === 'next') {
        this.actions.push([cmd, status]);
        // there is a next, so move was valid and game has not ended.
        // switch the players.
        this.actor= np;
        if (np.isRobot()) {
          this.runAction(cc.Sequence.create(cc.DelayTime.create(1),
                                            cc.CallFunc.create(function() {
                                              this.move(Cmd(np,np.takeTurn()));
                                            },this)));
        } else {
          // if hunman player, start the timer
          h.showTimer();
        }
      }
      else if (status === 'winner') {
        this.actions.push([cmd, status]);
      }
      else if (status === 'draw') {
        this.actions.push([null, status]);
      }
      else
      if (status !== 'bogus') {
        this.actions.push([cmd, status]);
      }

    }.bind(this) );
  },

  onclicked: function(mx,my) {

    if (this.board && this.board.isActive() ) {

      var player= this.board.curActor(),
      cell;

      if (this.options.mode === sh.ONLINE_GAME) {
        if (player &&
            this.options.pnum === player.number()) {
        } else {
          return;
        }
      }

      cell= this.clickToCell(mx, my);
      if (cell >= 0) {
        this.move(Cmd(player, cell));
      }

      sjs.loggr.debug("actor = " + player.color + ", pos = " + cell);
    }
  },

  syncOneAction: function(_ref) {
    var status = _ref[1],
    c=undef,
    offset=0,
    cmd= _ref[0];

    if (status === 'winner') {
      this.doWin(cmd);
    }
    else
    if (status === 'draw') {
      this.doStalemate();
    }
    else {
      c = this.cellToGrid(cmd.cell);
      if (c) {
        switch (cmd.value) {
          case sh.xcfg.csts.CV_X:
            sh.sfxPlay('x_pick');
            offset=0;
          break;
          case sh.xcfg.csts.CV_O:
            sh.sfxPlay('o_pick');
            offset=1;
          break;
        }
        this.cells[cmd.cell] = [ this.drawSymbol(c[0],c[1], offset),
                                 c[0],
                                 c[1], offset ];
      }
    }
  },

  checkEntities: function(dt) {
    if (this.actions.length > 0) {
      var n= this.actions.shift();
      if (sjs.echt(this.board)) {
        this.syncOneAction(n);
      }
    }
    this.updateHUD();
  },

  drawSymbol: function(x,y,offset) {
    var m = sh.xcfg.assets.sprites['gamelevel1.sprites.markers'],
    w= m[1],
    h= m[2],
    p= sh.sanitizeUrl(m[0]),
    s1= new cc.Sprite(p, cc.rect(offset * w,0,w,h));

    s1.setAnchorPoint(ccsx.AnchorCenter);
    s1.setPosition(x,y);

    this.addItem(s1);

    return s1;
  },

  doStalemate: function() {
    this.doDone(null, []);
  },

  doWin: function(info) {
    var combo= info[1],
    p= info[0],
    h= this.getHUD();

    h.updateScore(p,1);
    this.doDone(p, combo);
  },

  showWinningIcons: function(combo) {
  // flip all other icons except for the winning ones.
    _.each(this.cells, function(z,n) {
      if (! _.contains(combo,n)) { if (z) {
        this.removeItem(z[0]);
        z[0] = this.drawSymbol(z[1],z[2],z[3]+2);
      } }
    }, this);
  },

  doDone: function(p,combo) {
    var h= this.getHUD();

    this.showWinningIcons(combo);
    h.killTimer();
    sh.sfxPlay('game_end');
    h.endGame();

    this.lastWinner = p;
    this.board.finz();
    this.board=null;
  },

  updateHUD: function() {
    var h= this.getHUD();

    if (this.board) {
      h.drawStatus(this.actor);
    } else {
      h.drawResult(this.lastWinner);
    }
  },

  clickToCell: function(px,py) {
  // which cell did he click on?
    var gg, n;
    for (n=0; n < sh.xcfg.csts.CELLS; ++n) {
      gg = this.gridMap[n];
      if (px >= gg[0] && px <= gg[2] && py >= gg[3] && py <= gg[1]) {
        return n;
      }
    }
    return -1;
  },

  mapGridPos: function() {
  // memorize the co-ordinates of each cell on the board, so
  // we know which cell the user has clicked on.
    var csts= sh.xcfg.csts,
    gzh = 3 * csts.HOLE + 2 * csts.R_GAP,
    y2, y1 = csts.TILE * ((csts.GRID_H + gzh) / 2),
    x2, x1 = csts.LEFT * csts.TILE,
    hz = csts.TILE * csts.HOLE,
    r,c,n, _results = [];

    for (n=0; n < csts.CELLS; ++n) { this.gridMap[n] = []; }
    for (r=0; r < csts.GRID_SIZE; ++r) {
      for (c= 0; c < csts.GRID_SIZE; ++c) {
        x2 = x1 + hz;
        y2 = y1 - hz;
        this.gridMap[r * csts.GRID_SIZE + c] = [x1, y1, x2, y2];
        x1 = x2 + csts.C_GAP * csts.TILE;
      }
      y1 = y1 - (csts.HOLE + csts.R_GAP) * csts.TILE;
      x1 = csts.LEFT * csts.TILE;
      _results.push(x1);
    }
  },

  cellToGrid: function(pos) {
    // given a cell, find the screen co-ordinates for that cell.
    //var img2= sh.main.cache.getImage('gamelevel1.sprites.markers');
    //var delta= 0;//72;//img2.height;
    var csts= sh.xcfg.csts,
    gg, x, y,
    delta=0;

    if (pos >= 0 && pos < csts.CELLS) {
      gg = this.gridMap[pos];
      x = gg[0] + (gg[2] - gg[0]  - delta) / 2;
      y = gg[1] - (gg[1] - gg[3] - delta ) / 2;
      // the cell's center
      return [x, y];
    } else {
      return null;
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
    var rc= this.ptScene.getLayers(); //cc.director.getRunningScene().getLayers();
    return rc['HUD'];
  },

  rtti: function() { return 'GameLayer'; },

  setGameMode: function(mode) {
    var h= this.getHUD();
    this._super(mode);
    if (h) {
      h.setGameMode(mode);
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

