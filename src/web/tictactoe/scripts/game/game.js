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

(function (undef){ "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var klass = global.ZotohLabs.klass;
var loggr= global.ZotohLabs.logger;
var echt= global.ZotohLabs.echt;
var ttt= asterix.TicTacToe;
var ccsx = asterix.COCOS2DX;
var sh = asterix.Shell;
var Cmd= klass.extends({
  ctor: function(a,pos) {
    this.cell=pos;
    this.actor=a;
  }
});

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
var arenaLayer = asterix.XGameLayer.extend({

  p2Long: sh.l10n('%player2'),
  p1Long: sh.l10n('%player1'),

  p2ID: '',
  p1ID: '',

  actions: [],
  board: null,

  scores:  { 'O': 0, 'X': 0 },

  // map of the screen co-ords of each cell in the grid
  gridMap: [],

  // holds references to sprites
  cells: [],

  resetScores: function() {
    this.scores=  { 'O': 0, 'X': 0 };
  },

  play: function() {

    this.mapGridPos();
    this.maybeReset();

    var p1= new ttt.Human(sh.xcfg.csts.CV_X, 0, 'X');
    var p2= null;
    switch (sh.xcfg.csts.GAME_MODE) {
      case 1:
        p2= new ttt.AlgoBot(sh.xcfg.csts.CV_O, 1, 'O');
      break;
      case 2:
        p2= new ttt.Human(sh.xcfg.csts.CV_O, 1, 'O');
      break;
      case 3:
      break;
    }

    this.board = new ttt.Board(sh.xcfg.csts.GRID_SIZE);
    this.board.registerPlayers(p1, p2);
    this.players= [null,p1,p2];
    this.actions = [];

    this.cells= global.ZotohLabs.makeArray( this.board.getBoardSize() * this.board.getBoardSize(), null);
    this.doLayout();

    this.actor = this.board.getCurActor();
    if (this.actor.isRobot()) {
      this.move( new Cmd(this.actor, asterix.fns.rand(sh.xcfg.csts.CELLS)));
    }
    loggr.debug("game started, initor = " + this.actor.color );

    return true;
  },

  newGame: function(mode) {
    sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.resetScores();
    return this.play();
  },

  maybeReset: function() {
  // clean up
    this.actor=null;
    this.players=[];
    this.cells=[];
  },

  move: function(cmd) {
  // given a command object, make a move
  // if the move is valid, then a corresponding action is added to the
  // queue, such as drawing the icon , playing a sound...etc
    loggr.debug("actor = " + cmd.actor.color + ", pos = " + cmd.cell);
    var me= this;
    this.board.enqueue(cmd, function(cmd, status, np) {
      // crap move, is ignored for now.
      if (status !== 'bogus') {
        me.actions.push([cmd, status]);
      }
      if (status === 'next') {
        // there is a next, so move was valid and game has not ended.
        // switch the players.
        me.actor= np;
        if (np.isRobot()) {
          // fake some thinking time...
          setTimeout(function() {
            me.move( new Cmd(np, np.takeTurn()));
          }, 1000);
        }
      }
    });
  },

  onclicked: function(mx,my) {
    if (this.board && this.board.isActive() ) {
      var cell= this.clickToCell(mx, my);
      if (cell >= 0) {
        this.move( new Cmd(this.actor, cell));
      }
    }
  },

  onTouchesEnded: function (touches, event) {
    loggr.debug("touch event = " + event);
    loggr.debug("touch = " + touches);
  },

  onMouseUp: function(evt) {
    var pt= evt.getLocation();
    //loggr.debug("mouse location [" + pt.x + "," + pt.y + "]");
    this.onclicked(pt.x, pt.y);
  },

  update: function() {
  // null board => game over
    if (this.board) {
      if (this.actions.length > 0) {
      // update the board.
          var _ref = this.actions.pop();
          var status = _ref[1];
          var offset=0;
          var cmd= _ref[0];
          var c = this.cellToGrid(cmd.cell);
          if (c) {
            switch (cmd.actor.value) {
              case sh.xcfg.csts.CV_X:
                sh.xcfg.sfxPlay('x_pick');
                offset=0;
              break;
              case sh.xcfg.csts.CV_O:
                sh.xcfg.sfxPlay('o_pick');
                offset=1;
              break;
            }
            this.cells[cmd.cell] = [ this.drawSymbol(c[0],c[1], offset), c[0], c[1], offset ];
          }
      } else {
        this.checkEnding();
      }
    }
    this.drawGui();
  },

  drawSymbol: function(x,y,offset) {
    var m = sh.xcfg.assets.sprites['gamelevel1.sprites.markers'];
    var w= m[1];
    var h= m[2];
    var p= sh.sanitizeUrl(m[0]);
    var s1= cc.Sprite.create(p, cc.rect(offset * w,0,w,h));
    s1.setPosition(x,y);
    s1.setAnchorPoint(cc.p(0.5,0.5));
    this.addChild(s1, 12, ++this.lastTag);
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
    var combo= info[1];
    var p= info[0];
    var s = this.scores[p.color];
    this.scores[p.color] = s + 1;
    this.drawScores();
    this.doDone(p,info[1]);
  },

  showWinningIcons: function(combo) {
  // flip all other icons except for the winning ones.
    var c, me= this;
    _.each(this.cells, function(z,n) {
      if (! _.contains(combo,n)) { if (z) {
        me.removeChild(z[0],true);
        z[0] = me.drawSymbol(z[1],z[2],z[3]+2);
      } }
    });
  },

  doDone: function(p,combo) {
    this.replayBtn.setVisible(true);
    this.result.setVisible(true);
    this.status.setVisible(false);
    this.showWinningIcons(combo);
    sh.xcfg.sfxPlay('game_end');
    this.lastWinner = p;
    this.board.finz();
    this.board=null;
  },

  drawGui: function() {
    if (this.board) {
      if (this.board.isActive()) {
        this.drawStatus();
      }
    } else {
      this.drawResult();
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
    var csts= sh.xcfg.csts;
    var gzh = 3 * csts.HOLE + 2 * csts.R_GAP;
    var y2, y1 = csts.TILE * ((csts.GRID_H + gzh) / 2);
    var x2, x1 = csts.LEFT * csts.TILE;
    var hz = csts.TILE * csts.HOLE;
    var r,c,n, _results = [];

    for (n=0; n < csts.CELLS; ++n) {
      this.gridMap[n] = [];
    }
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
    var delta= 0;//72;//img2.height;
    var gg, x, y, csts= sh.xcfg.csts;
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

  drawStatusText: function(obj, msg) {
    var csts = sh.xcfg.csts;
    var cw=  ccsx.center();
    obj.setString( msg);
  },

  drawStatus: function() {
    var pfx;

    if (this.actor.isRobot()) {
      pfx = sh.l10n('%computer');
    }
    else if (this.actor.color === 'X') {
      pfx = sh.l10n('%player1');
    } else {
      pfx = sh.l10n('%player2');
    }

    this.drawStatusText(this.status,  sh.l10n('%whosturn', {who: pfx}));
  },

  drawResult: function() {
  // report game result please.
    var msg, p1, p2;

    //this.status.setVisible(false);

    p2= this.players[2];
    p1= this.players[1];
    switch (this.lastWinner) {
      case p2: msg= sh.l10n('%whowin', { who: this.p2Long}); break;
      case p1: msg= sh.l10n('%whowin', { who: this.p1Long}); break;
      default: msg= sh.l10n('%whodraw'); break;
    }

    this.drawStatusText(this.result, msg);
  },

  drawScores: function() {
    var s2 = this.scores[this.players[2].color];
    var s1 = this.scores[this.players[1].color];
    var csts= sh.xcfg.csts;
    var wz = ccsx.screen();
    var n2 = global.ZotohLabs.prettyNumber(s2,3);
    var n1 = global.ZotohLabs.prettyNumber(s1,3);

    this.score1.setString(n1);
    this.score2.setString(n2);

  },

  doLayout: function() {
    var map = cc.TMXTiledMap.create(sh.xcfg.getTilesPath('gamelevel1.tiles.arena'));
    var cw= ccsx.center();
    var wz= ccsx.screen();
    var csts= sh.xcfg.csts;
    var title;

    this.addChild(map, this.lastZix, ++this.lastTag);

    title= cc.LabelBMFont.create(this.p1ID + " / " + this.p2ID, sh.xcfg.getFontPath('font.TinyBoxBB'));
    title.setPosition(cw.x, wz.height - csts.TILE - csts.GAP);
    title.setScale(24/72);
    title.setOpacity(0.9*255);
    this.addChild(title, this.lastZix, ++this.lastTag);

    this.score1= cc.LabelBMFont.create('888', sh.xcfg.getFontPath('font.TinyBoxBB'));
    this.score1.setScale(20/72);
    this.score1.setOpacity(0.9*255);
    this.score1.setColor(new cc.Color3B(253,188,178)); // 0xfdbcb2;
    this.score1.setPosition(csts.TILE + csts.S_OFF + 2, wz.height - csts.TILE - csts.S_OFF);
    this.score1.setAnchorPoint(cc.p(0,1));
    this.addChild(this.score1, this.lastZix, ++this.lastTag);

    this.score2= cc.LabelBMFont.create('888', sh.xcfg.getFontPath('font.TinyBoxBB'));
    this.score2.setScale(20/72);
    this.score2.setOpacity(0.9*255);
    this.score2.setColor(new cc.Color3B(255,102,0)); // 0xff6600;
    this.score2.setPosition(wz.width - csts.TILE - csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF);
    this.score2.setAnchorPoint(cc.p(1,1));
    this.addChild(this.score2, this.lastZix, ++this.lastTag);

    this.status= cc.LabelBMFont.create('', sh.xcfg.getFontPath('font.TinyBoxBB'));
    this.status.setScale(12/72);
    this.status.setOpacity(0.9*255);
    this.status.setPosition(cw.x, csts.TILE * 10);
    this.addChild(this.status, this.lastZix, ++this.lastTag);

    this.result= cc.LabelBMFont.create('', sh.xcfg.getFontPath('font.TinyBoxBB'));
    this.result.setScale(12/72);
    this.result.setOpacity(0.9*255);
    this.result.setPosition(cw.x, csts.TILE * 10);
    this.result.setVisible(false);
    this.addChild(this.result, this.lastZix, ++this.lastTag);

    this.doCtrlBtns();

    this.drawScores();
  },

  setGameMode: function(mode) {
    this.p2ID= sh.l10n('%p2');
    this.p1ID= sh.l10n('%p1');
    if (mode === 1) {
      this.p2Long= sh.l10n('%computer');
      this.p2ID= sh.l10n('%cpu');
    }
    this._super(mode);
  }


});


asterix.TicTacToe.Factory = new asterix.XSceneFactory(arenaLayer);

}).call(this);



