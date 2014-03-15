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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var asterix = global.ZotohLabs.Asterix;
var loggr = global.ZotohLabs.logger;
var klass= global.ZotohLabs.klass;
var echt = global.ZotohLabs.echt;
var negax= global.ZotohLabs.NegaMax;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
asterix.TicTacToe.Board= klass.extends({

  gameInProgress: false,
  actors: null,

  GOALSPACE : null,
  DAGSPACE : null,
  ROWSPACE : null,
  COLSPACE : null,

  grid : null,
  CV_Z : 0,

  isActive: function() { return this.gameInProgress; },
  getCurActor: function() { return this.actors[0]; },

  registerPlayers: function(p1,p2) {
    this.actors= [ asterix.fns.randomSign() > 0 ? p1 : p2, p1, p2 ];
    p2.bindBoard(this);
    p1.bindBoard(this);
    this.gameInProgress = true;
  },

  getPlayer2: function() { return this.actors[2]; },
  getPlayer1: function() { return this.actors[1]; },

  enqueue: function(cmd, cb) {
    if ( (cmd.cell >= 0 && cmd.cell < this.grid.length) &&
         this.actors[0] === cmd.actor &&
         this.CV_Z === this.grid[cmd.cell]) {
      this.grid[cmd.cell] = cmd.actor.value;
      this.checkWin(cmd,cb);
    }
  },

  checkWin: function(cmd, cb) {
    loggr.debug("checking for win " + cmd.actor.color + ", pos = " + cmd.cell);
    if (this.isStalemate()) {
      this.drawGame(cmd, cb);
    }
    else
    if (this.isWinner(cmd.actor)[0] ) {
      this.endGame(cmd,cb);
    }
    else {
      this.toggleActor(cmd,cb);
    }
  },

  drawGame: function(cmd, cb) {
    this.onStopReset();
    cb(cmd, 'draw');
  },

  endGame: function(cmd, cb) {
    this.onStopReset();
    cb(cmd, 'win');
  },

  toggleActor: function(cmd, cb) {
    this.actors[0] = this.getOtherPlayer(this.actors[0]);
    cb(cmd, 'next', this.actors[0]);
  },

  onStopReset: function() {
    this.gameInProgress = false;
    this.actors[0]=null;
  },

  isNil: function(cellv) { return cellv === this.CV_Z; },
  getNilValue: function() { return this.CV_Z; },

  getGoalSpace: function() { return this.GOALSPACE; },
  getBoardSize: function() { return this.size; },
  getState: function() { return this.grid; },

  getDiagX: function() { return this.DAGSPACE[0]; },
  getDiagY: function() { return this.DAGSPACE[1]; },

  finz: function() {
    this.onStopReset();
    this.actors=[];
    this.grid=[];
  },

  initBoard: function() {
    this.grid= global.ZotohLabs.makeArray( this.size * this.size, this.CV_Z);
  },

  isStalemate: function(game) {
    game = game || this.grid;
    var me = this; return ! _.some(game, function(n) {
      return n === me.CV_Z;
    });
  },

  checkWinner: function() {
    var w, me=this, rc = undef;
    _.find(this.actors, function(actor,n) {
      switch (n) {
        case 0: return false;
        default:
          w= me.isWinner(actor);
          if (w[0]) {
            rc=actor; return true;
          } else {
            return false;
          }
      }
    });
    return echt(rc) ? [rc, w[1]] : [undef, null] ;
  },

  isWinner: function(actor, game) {
    var rc, combo, me=this;
    game= game || this.grid;
    rc= _.some(this.GOALSPACE, function(r) {
      combo=r;
      return _.every(_.map(r, function(i) {
        return game[i];
      }), function(n) {
        return actor.isValue(n);
      });
    });
    return rc ? [rc, combo] : [rc, null];
  },

  nextFreeCell: function(actor) {
    var me=this, fr= _.reduce(this.grid, function(memo, z, n) {
      if (z === me.CV_Z) { memo.push(n); }
      return memo;
    }, []);
    if (fr.length === 0) {
      return -1;
    } else {
      return fr[ asterix.fns.rand( fr.length) ];
    }
  },

  poiseToWin: function(actor,game) {
    var sum = this.getBoardSize() - 1;
    var lastFree = -1;
    var me = this;
    game= game || this.grid;
    var rc = _.some(this.GOALSPACE, function(r) {
      var m = _.foldl(r, function(memo, n) {
        if (actor.isValue( game[n])) {
          memo.used += 1;
        }
        if (game[n] === me.CV_Z) {
          memo.last = n;
          memo.free += 1;
        }
        return memo;
      }, {
        used: 0,
        free: 0,
        last: -1
      });
      lastFree = m.last;
      return m.used === sum && m.free === 1;
    });
    if (rc) {
      return lastFree;
    } else {
      return -1;
    }
  },

  freeMove: function(actor,game) {
    var sum = this.getBoardSize() - 1;
    var me = this;
    game= game || this.grid;
    var rc = _.some(this.GOALSPACE, function(r) {
      var m = _.foldl(r, function(memo, n) {
        if (actor.isValue(game[n])) {
          memo.used += 1;
        }
        if (game[n] === me.CV_Z) {
          memo.free += 1;
        }
        return memo;
      }, {
        used: 0,
        free: 0
      });
      return m.free === sum && m.used === 1;
    });
    return rc;
  },

  getNextMoves: function(snapshot) {
    var n, g = snapshot.state;
    var rc = [];
    for (n=0; n < g.length; ++n) {
      if (this.isNil(g[n])) {
        rc.push(n);
      }
    }
    return rc;
  },

  unmakeMove: function(snapshot,move) {
    snapshot.state[move] = this.CV_Z;
  },

  makeMove: function(snapshot,move) {
    if ( this.isNil( snapshot.state[move])) {
      snapshot.state[move] = snapshot.cur.value;
    } else {
      throw new Error("Fatal Error: cell [" + move + "] is not free.");
    }
  },

  switchPlayer: function (snapshot) {
    var t = snapshot.cur;
    snapshot.cur= snapshot.other;
    snapshot.other=t;
  },

  getOtherPlayer: function(color) {
    if (color === this.actors[1]) {
      return this.actors[2];
    }
    else if (color === this.actors[2]) {
      return this.actors[1];
    } else {
      return null;
    }
  },

  takeSnapshot: function() {
    return {
      other: this.getOtherPlayer(this.actors[0]),
      cur: this.actors[0],
      state: this.grid.slice(0),
      lastBestMove: -1
    };
  },

  getWinningScore: function() {
    return negax.INF;
  },

  evalScore: function(snapshot) {
    // if we lose, return a nega value
    return this.isWinner(snapshot.other, snapshot.state )[0] ? -100 : 0;
  },

  isOver: function(snapshot) {
    return this.isStalemate(snapshot.state) ||
           this.isWinner(snapshot.cur,snapshot.state)[0] ||
           this.isWinner(snapshot.other, snapshot.state)[0] ;
  },

  mapGoalSpace: function(size) {
    this.ROWSPACE = [];
    this.size = size;
    this.COLSPACE = [];
    var h,v;
    var dx = [];
    var dy = [];
    for (var r=0; r < this.size; ++r) {
      h = [];
      v = [];
      for (var c=0; c < this.size; ++c) {
        h.push(r * this.size + c);
        v.push(c * this.size + r);
      }
      this.ROWSPACE.push(h);
      this.COLSPACE.push(v);
      dx.push(r * this.size + r);
      dy.push((this.size - r - 1) * this.size + r);
    }
    this.DAGSPACE = [dx, dy];
    this.GOALSPACE = this.DAGSPACE.concat(this.ROWSPACE, this.COLSPACE);
  },

  ctor: function (size) {
    this.mapGoalSpace(size);
    this.initBoard();
    loggr.debug("new board init'ed");
  }

});


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
var negax= global.ZotohLabs.NegaMax;
var Player = klass.extends({

  takeTurn: function() { throw new Error("Abstract call"); },
  isRobot: function() { return !this.isHuman(); },
  isHuman: function() { return this.human; },
  isValue: function(n) { return this.value === n; },
  bindBoard: function(b) { this.arena=b; },
  ctor: function(value, human, pic, picColor) {
    this.picColor = picColor;
    this.picValue = value;
    this.entity = pic;
    this.human = human;
  }
});

Object.defineProperty(Player.prototype, "color", {
  get: function() { return this.picColor; },
  set: function(v) { this.picColor=v; }
});
Object.defineProperty(Player.prototype, "value", {
  get: function() { return this.picValue; },
  set: function(v) { this.picValue=v; }
});
Object.defineProperty(Player.prototype, "pic", {
  get: function() { return this.entity; },
  set: function(v) { this.entity=v; }
});
Object.defineProperty(Player.prototype, "board", {
  get: function() { return this.arena; },
});

var Robot = Player.extends({

  isMax: function() { return true; },
  ctor: function(idv, pic, color) {
    this.parent(idv, false, pic, color);
  }

});

asterix.TicTacToe.Human = Player.extends({

  isMax: function() { return false; },
  takeTurn: function() {},
  ctor: function (idv, pic, color) {
    this.parent(idv, true, pic, color);
  }

});

asterix.TicTacToe.AlgoBot = Robot.extends({

  takeTurn: function() {
    return this.mmAlgo.eval();
  },
  bindBoard: function(b) {
    this.parent(b);
    this.mmAlgo = new negax.Algo(b);
  },
  ctor: function ( idv, pic, color) {
    this.parent( idv, pic, color);
    this.mmAlgo= null;
  }

});





}).call(this);

