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

(function (undef){ "use strict"; var global = this,
                                     _ = global._ ,
                                     $ = global.jQuery,
asterix = global.ZotohLab.Asterix,
Odin=global.ZotohLab.Odin,
Events=Odin.Events,
sh = global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
ttt= asterix.TicTacToe,
SkaroJS = global.SkaroJS,
Cmd= SkaroJS.Class.xtends({
  ctor: function(a,pos) {
    this.cell=pos;
    this.actor=a;
  }
});

//////////////////////////////////////////////////////////////////////////////
// back layer
//////////////////////////////////////////////////////////////////////////////

var BackLayer = asterix.XLayer.extend({

  pkInit: function() {
    var map = cc.TMXTiledMap.create(sh.getTilesPath('gamelevel1.tiles.arena'));
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

  scores:  { 'O': 0, 'X': 0 },
  mode: 0,

  p2Long: '',
  p1Long: '',

  p2ID: '',
  p1ID: '',

  setGameMode: function(mode) {
    this.mode= mode;
  },

  initParentNode: function() {},

  initLabels: function() {
    var csts = sh.xcfg.csts,
    cw= ccsx.center(),
    wz= ccsx.screen();

    this.title = ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      anchor: ccsx.AnchorTop,
      scale: 12/72,
      pos: cc.p(cw.x, wz.height - csts.TILE - csts.GAP)
    });
    this.addItem(this.title);

    this.score1= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '888',
      scale: 20/72,
      color: cc.color(253,188,178), // 0xfdbcb2;
      pos: cc.p(csts.TILE + csts.S_OFF + 2,
                wz.height - csts.TILE - csts.S_OFF),
      anchor: ccsx.AnchorTopLeft
    });
    this.addItem(this.score1);

    this.score2= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '888',
      scale: 20/72,
      color: cc.color(255,102,0), // 0xff6600;
      pos: cc.p(wz.width - csts.TILE - csts.S_OFF,
                wz.height - csts.TILE - csts.S_OFF),
      anchor: ccsx.AnchorTopRight
    });
    this.addItem(this.score2);

    this.status= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      scale: 12/72,
      pos: cc.p(cw.x, csts.TILE * 10)
    });
    this.addItem(this.status);

    this.result= ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '',
      scale: 12/72,
      pos: cc.p(cw.x, csts.TILE * 10),
      visible: false
    });
    this.addItem(this.result);
  },

  // kenl
  updateScore: function(p, value) {
    this.scores[p.color] = this.scores[p.color] + value;
    this.drawScores();
  },

  endGame: function() {
    this.replayBtn.setVisible(true);
    this.result.setVisible(true);
    this.status.setVisible(false);
  },

  drawStatusText: function(obj, msg) {
    obj.setString( msg);
  },

  // kenl
  drawScores: function() {
    var s2 = this.scores[this.play2.color],
    s1 = this.scores[this.play1.color],
    csts= sh.xcfg.csts,
    wz = ccsx.screen(),
    n2 = SkaroJS.prettyNumber(s2,3),
    n1 = SkaroJS.prettyNumber(s1,3);

    this.score1.setString(n1);
    this.score2.setString(n2);
  },

  drawResult: function(winner) {
    var msg='';

    if (!winner) {
      msg= sh.l10n('%whodraw');
    }
    else {
      switch (winner.number() ) {
        case 2: msg= sh.l10n('%whowin', { who: this.p2Long}); break;
        case 1: msg= sh.l10n('%whowin', { who: this.p1Long}); break;
      }
      /*
      switch (winner.color) {
        case 'O': msg= sh.l10n('%whowin', { who: this.p2Long}); break;
        case 'X': msg= sh.l10n('%whowin', { who: this.p1Long}); break;
      }
      */
    }

    this.drawStatusText(this.result, msg);
  },

  drawStatus: function(actor) {
    if (actor) {
      var pfx = actor.number() === 1 ? this.p1Long : this.p2Long;
      this.drawStatusText(this.status, sh.l10n('%whosturn', { who: pfx }));
    }
  },

  regoPlayers: function(p1,p1ids,p2,p2ids) {
    this.play2= p2;
    this.play1= p1;
    this.p2Long= p2ids[1];
    this.p1Long= p1ids[1];
    this.p2ID= p2ids[0];
    this.p1ID= p1ids[0];
    this.title.setString(this.p1ID + " / " + this.p2ID);
  },

  initIcons: function() {
  },

  resetAsNew: function() {
    this.scores=  { 'O': 0, 'X': 0 };
    this.reset();
  },

  reset: function() {
    this.replayBtn.setVisible(false);
    this.result.setVisible(false);
    this.status.setVisible(true);
  },

  rtti: function() {
    return 'HUD';
  }

});


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

  // previous event from server - online only
  lastEvt: null,
  board: null,

  // get an odin event
  onevent: function(topic, evt) {
    SkaroJS.loggr.debug(evt);
    switch (evt.type) {
      case Events.NETWORK_MSG: this.onNetworkEvent(evt); break;
      case Events.SESSION_MSG: this.onSessionEvent(evt); break;
    }
  },

  onStop: function(evt) {
    if (this.maybeUpdateActions(evt)) {
      this.syncOneAction();
    }
    switch (evt.source.status) {
      case 0:
        this.doStalemate();
      break;
      case 1:
        this.doWin([this.board.getPlayer1(), [] ]);
      break;
      case 2:
        this.doWin([this.board.getPlayer2(), [] ]);
      break;
    }
  },

  onNetworkEvent: function(evt) {
    switch (evt.code) {
      case Events.C_STOP:
        SkaroJS.loggr.debug("game will stop");
        this.onStop(evt);
      break;
      default:
        this.onSessionEvent(evt);
      break;
    }
  },

  maybeUpdateActions: function(evt) {
    var cmd = evt.source.cmd,
    rc=null;
    if (cmd && _.isNumber(cmd.cell)) {
      SkaroJS.loggr.debug("adding one more action from server" +
                          JSON.stringify(cmd));
      rc= [cmd, 'server'];
      this.actions.push(rc);
    }
    return rc;
  },

  onSessionEvent: function(evt) {
    var pnum= evt.source.pnum,
    player;

    this.maybeUpdateActions(evt);
    switch (evt.code) {
      case Events.C_POKE_MOVE:
        SkaroJS.loggr.debug("player " + pnum + ": my turn to move");
        player = this.players[evt.source.pnum];
        this.board.toggleActor(new Cmd(player));
      break;
      case Events.C_POKE_WAIT:
        // move state to wait for other
        SkaroJS.loggr.debug("player " + pnum + ": my turn to wait");
        player = this.players[pnum===1 ? 2 : 1];
        this.board.toggleActor(new Cmd(player));
      break;
    }
  },

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {

    SkaroJS.loggr.debug("this.options = " + JSON.stringify(this.options));

    this.reset(newFlag);

    var state0 = this.options.seed_data,
    ncells= state0.size * state0.size,
    csts = sh.xcfg.csts,
    p1ids, p2ids,
    p1= null,
    p2= null;

    _.each(state0.players,function(v,k) {
      if (v[0] === 1) {
        p1ids= [k, v[1] ];
      } else {
        p2ids= [k, v[1] ];
      }
    });

    switch (sh.xcfg.csts.GAME_MODE) {
    //switch (this.options.mode) {
      case 1:
        p2= new ttt.AlgoBot(csts.CV_O, 2, 'O');
        p1= new ttt.Human(csts.CV_X, 1, 'X');
      break;
      case 2:
        p1= new ttt.Human(csts.CV_X, 1, 'X');
        p2= new ttt.Human(csts.CV_O, 2, 'O');
      break;
      case 3:
        _.each(state0.players, function(v,k) {
          var ws= this.options.pnum === v[0] ? this.options.wsock : null;
          if (v[0] === 1) {
            p1= new ttt.NetPlayer(csts.CV_X, 1, 'X', ws);
          } else {
            p2= new ttt.NetPlayer(csts.CV_O, 2, 'O', ws);
          }
        }, this);
      break;
    }

    this.board = ttt.CreateBoard(this.options.mode, state0.size);
    this.board.initBoard(state0.grid);
    this.board.registerPlayers(p1, p2);

    this.getHUD().regoPlayers(p1, p1ids, p2, p2ids);
    this.cells= SkaroJS.makeArray(ncells, null);
    this.players= [null,p1,p2];
    this.actions = [];

    if (this.options.wsock) {
      this.options.wsock.subscribeAll(this.onevent,this);
      this.lastEvt= null;
      SkaroJS.loggr.debug("about to reply started!");
      this.options.wsock.send({
        type: Events.SESSION_MSG,
        code: Events.C_STARTED
      });
    } else {
      this.actor = this.board.getCurActor();
      if (this.actor.isRobot()) {
        this.move( new Cmd(this.actor, SkaroJS.rand(ncells)));
      }
      //SkaroJS.loggr.debug("game started, initor = " + this.actor.color );
    }
  },

  onNewGame: function(mode) {
    //sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  reset: function(newFlag) {
    if (newFlag) {
      this.getHUD().resetAsNew();
      this.mapGridPos();
    } else {
      this.getHUD().reset();
    }
    _.each(this.cells, function(z) {
      if (z) { this.removeItem(z[0]); }
    },this);

    this.players=[];
    this.cells=[];
    this.actor=null;
  },

  move: function(cmd) {
  // given a command object, make a move
  // if the move is valid, then a corresponding action is added to the
  // queue, such as drawing the icon , playing a sound...etc
    SkaroJS.loggr.debug("actor = " + cmd.actor.color + ", pos = " + cmd.cell);
    this.board.enqueue(cmd, function(cmd, status, np) {
      // crap move, is ignored for now.
      if (status !== 'bogus') {
        this.actions.push([cmd, status]);
      }
      if (status === 'next') {
        // there is a next, so move was valid and game has not ended.
        // switch the players.
        this.actor= np;
        if (np.isRobot()) {
          this.runAction(cc.Sequence.create(cc.DelayTime.create(1),
                                            cc.CallFunc.create(function() {
                                              this.move(new Cmd(np,np.takeTurn()));
                                            },this)));
        }
      }
    }.bind(this) );
  },

  onclicked: function(mx,my) {

    if (this.board && this.board.isActive() ) {

      var player= this.board.getCurActor(),
      cell;

      if (this.options.mode === 3 &&
          player &&
          this.options.pnum === player.number()) {
      } else {
        return;
      }

      cell= this.clickToCell(mx, my);
      if (cell >= 0) {
        this.move( new Cmd(player, cell));
      }
    }
  },

  syncOneAction: function() {
    var _ref= this.actions.pop();
    if (! _ref) {return;}
    var status = _ref[1],
    offset=0,
    cmd= _ref[0],
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
      this.cells[cmd.cell] = [ this.drawSymbol(c[0],c[1], offset), c[0], c[1], offset ];
    }
  },

  checkEntities: function(dt) {
    if (this.board && this.actions.length > 0) {
      this.syncOneAction();
    }
    else if (this.board) {
      this.checkEnding();
    }
    this.updateHUD();
  },

  drawSymbol: function(x,y,offset) {
    var m = sh.xcfg.assets.sprites['gamelevel1.sprites.markers'],
    w= m[1],
    h= m[2],
    p= sh.sanitizeUrl(m[0]),
    s1= cc.Sprite.create(p, cc.rect(offset * w,0,w,h));

    s1.setAnchorPoint(ccsx.AnchorCenter);
    s1.setPosition(x,y);

    this.addItem(s1);

    return s1;
  },

  checkEnding: function() {
    if (this.board &&
        !this.board.isOnline() &&
        !this.board.isActive()) {
      var rc= this.board.checkWinner();
      if (rc[0]) {
        this.doWin(rc);
      }
      else
      if (this.board.isStalemate()) {
        this.doStalemate();
      }
    }
  },

  doStalemate: function() {
    this.doDone(null, []);
  },

  doWin: function(info) {
    var combo= info[1],
    p= info[0];
    this.getHUD().updateScore(p,1);
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
    this.showWinningIcons(combo);
    sh.sfxPlay('game_end');
    this.getHUD().endGame();
    this.lastWinner = p;
    this.board.finz();
    this.board=null;
  },

  updateHUD: function() {
    if (this.board && this.board.isActive()) {
      this.getHUD().drawStatus(this.actor);
    }
    else
    if (! this.board) {
      if (this.lastWinner !== undefined) {
        this.getHUD().drawResult(this.lastWinner);
      }
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

  getHUD: function() {
    return cc.director.getRunningScene().layers['HUD'];
  },

  setGameMode: function(mode) {
    this._super(mode);
    this.getHUD().setGameMode(mode);
  }


});


asterix.TicTacToe.Factory = {

  create: function(options) {
    var scene = new asterix.XSceneFactory([
      BackLayer,
      GameLayer,
      HUDLayer
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



