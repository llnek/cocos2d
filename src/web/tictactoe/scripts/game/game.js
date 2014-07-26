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

  p2Long: sh.l10n('%player2'),
  p1Long: sh.l10n('%player1'),

  p2ID: '',
  p1ID: '',

  setGameMode: function(mode) {
    this.p2ID= sh.l10n('%p2');
    this.p1ID= sh.l10n('%p1');
    if (mode === 1) {
      this.p2Long= sh.l10n('%computer');
      this.p2ID= sh.l10n('%cpu');
    }
    this.mode= mode;
    this.title.setString(this.p1ID + " / " + this.p2ID);
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
    else
    switch (winner.color) {
      case 'O': msg= sh.l10n('%whowin', { who: this.p2Long}); break;
      case 'X': msg= sh.l10n('%whowin', { who: this.p1Long}); break;
    }

    this.drawStatusText(this.result, msg);
  },

  drawStatus: function(actor) {
    var pfx;

    if (!actor) { return; }

    if (actor.isRobot()) {
      pfx = sh.l10n('%computer');
    }
    else if (actor.color === 'X') {
      pfx = sh.l10n('%player1');
    } else {
      pfx = sh.l10n('%player2');
    }

    this.drawStatusText(this.status,  sh.l10n('%whosturn', {who: pfx}));
  },

  regoPlayers: function(p1,p2) {
    this.play2= p2;
    this.play1= p1;
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

  actions: [],
  board: null,

  lastEvt: null,
  gstate: 0,

  // get an odin event
  onevent: function(topic, evt) {
    console.log( evt);
    switch (evt.type) {
      case Events.NETWORK_MSG: this.onNetworkEvent(evt); break;
      case Events.SESSION_MSG: this.onSessionEvent(evt); break;
    }
  },

  onNetworkEvent: function(evt) {
    switch (evt.code) {
      case Events.C_STOP:
        SkaroJS.loggr.info("game will stop");
        // tear down game
      break;
    }
  },

  onSessionEvent: function(evt) {
    switch (evt.code) {
      case Events.C_POKE_MOVE:
        // move state to wait move
        SkaroJS.loggr.debug("player " + evt.source.pnum + ": my turn to move");
        this.lastEvt=evt;
      break;
      case Events.C_POKE_WAIT:
        // move state to wait for other
        SkaroJS.loggr.debug("player " + evt.source.pnum + ": my turn to wait");
        this.lastEvt=null;
      break;
    }
  },

  replay: function() {
    this.play(false);
  },

  play: function(newFlag) {

    SkaroJS.loggr.debug("seed_data = " + JSON.stringify(this.options));

    this.reset(newFlag);

    var state0 = this.options.seed_data;
    var p1= null;
    var p2= null;


    switch (sh.xcfg.csts.GAME_MODE) {
    //switch (this.options.mode) {
      case 1:
        p2= new ttt.AlgoBot(sh.xcfg.csts.CV_O, 1, 'O');
        p1= new ttt.Human(sh.xcfg.csts.CV_X, 0, 'X');
      break;
      case 2:
        p1= new ttt.Human(sh.xcfg.csts.CV_X, 0, 'X');
        p2= new ttt.Human(sh.xcfg.csts.CV_O, 1, 'O');
      break;
      case 3:
        p1= new ttt.NetPlayer(sh.xcfg.csts.CV_X, 0, 'X');
        p2= new ttt.NetPlayer(sh.xcfg.csts.CV_O, 1, 'O');
      break;
    }

    this.board = new ttt.Board(sh.xcfg.csts.GRID_SIZE);
    this.board.registerPlayers(p1, p2);
    this.getHUD().regoPlayers(p1,p2);
    this.players= [null,p1,p2];
    this.actions = [];

    if (this.options.wsock) {
      SkaroJS.loggr.debug("about to reply started!");
      this.options.wsock.subscribeAll(this.onevent,this);
      this.lastEvt= null;
      this.options.wsock.send({
        type: Events.SESSION_MSG,
        code: Events.C_STARTED
      });
    } else {
      this.cells= SkaroJS.makeArray( this.board.getBoardSize() * this.board.getBoardSize(), null);
      this.actor = this.board.getCurActor();
      if (this.actor.isRobot()) {
        this.move( new Cmd(this.actor, SkaroJS.rand(sh.xcfg.csts.CELLS)));
      }
      SkaroJS.loggr.debug("game started, initor = " + this.actor.color );
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
    this.actor=null;
    this.players=[];
    _.each(this.cells, function(z) {
      if (z) { this.removeItem(z[0]); }
    },this);
    this.cells=[];
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

    if (this.options.wsock) {
      if (! this.lastEvt) {
        return;
      }
    }

    if (this.board && this.board.isActive() ) {
      var cell= this.clickToCell(mx, my);
      if (cell >= 0) {
        this.move( new Cmd(this.actor, cell));
      }
    }
  },

  checkEntities: function(dt) {
    if (this.board && this.actions.length > 0) {
      var _ref = this.actions.pop(),
      status = _ref[1],
      offset=0,
      cmd= _ref[0],
      c = this.cellToGrid(cmd.cell);
      if (c) {
        switch (cmd.actor.value) {
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
    if (this.board &&  !this.board.isActive()) {
      if (this.board.isStalemate()) {
        this.doStalemate();
      } else {
        var rc= this.board.checkWinner();
        if (rc[0]) {
          this.doWin(rc);
        }
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



