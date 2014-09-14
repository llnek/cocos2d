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

(function(undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
sh = global.ZotohLab.Asterix;

var negax= global.ZotohLab.NegaMax;
var Odin=global.ZotohLab.Odin,
evts=Odin.Events;



//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var tttBoard= sjs.Class.xtends({

  gameInProgress: false,
  ncells: 0,
  actors: null,
  grid : null,
  CV_Z : 0,

  isActive: function() { return this.gameInProgress; },
  curActor: function() { return this.actors[0]; },

  isNil: function(cellv) { return cellv === this.CV_Z; },
  getNilValue: function() { return this.CV_Z; },
  getState: function() { return this.grid; },

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

  forfeit: function() {
    this.finz();
  },

  delay: function(millis) {
    this.gameInProgress=false;
    setTimeout(function() {
      this.gameInProgress=true;
      sh.fireEvent('/game/board/activated',{});
    }.bind(this), millis);
  },

  registerPlayers: function(p1,p2) {
    p2.bindBoard(this);
    p1.bindBoard(this);
    this.gameInProgress = true;
  },

  onStopReset: function() {
    this.gameInProgress = false;
  },

  finz: function() {
    this.onStopReset();
    this.grid=[];
    this.actors=[null,null,null];
  },

  getPlayer2: function() { return this.actors[2]; },
  getPlayer1: function() { return this.actors[1]; },

  toggleActor: function(cmd, cb) {
    this.actors[0] = cmd.actor;
  },

  enqueue: function(cmd, cb) {
    if ((cmd.cell >= 0 && cmd.cell < this.ncells) &&
        this.actors[0] === cmd.actor &&
        this.CV_Z === this.grid[cmd.cell]) {
      this.onEnqueue(cmd,cb);
      //this.grid[cmd.cell] = cmd.actor.value;
      //this.checkWin(cmd,cb);
    }
  },

  ctor: function(size) {
    sjs.loggr.debug("new board(" + size + ") init'ed");
    this.ncells= size * size;
    this.size= size;
  }

});

//////////////////////////////////////////////////////////////////////////////
//
var tttNetBoard= tttBoard.xtends({

  registerPlayers: function(p1,p2) {
    this.actors= [ null, p1, p2 ];
    this._super(p1,p2);
  },

  onEnqueue: function(cmd,cb) {
    cb=null; //ignored
    var src= {
      color: cmd.actor.color,
      value: cmd.actor.value,
      grid: this.grid,
      cell: cmd.cell
    };
    var evt= {
      type: evts.SESSION_MSG,
      code: evts.C_PLAY_MOVE,
      source: JSON.stringify(src)
    };
    if (this.actors[0] &&
        _.isObject(this.actors[0].wss)) {
      this.actors[0].wss.send(evt);
    }
  },

  initBoard: function(bvals) {
    if (this.ncells !== bvals.length) {
      throw new Error("invalid grid size: " + bvals.length);
    }
    this.grid= bvals;
  },

  isOnline: function() { return true; },

  ctor: function(size) {
    this._super(size);
  }

});

//////////////////////////////////////////////////////////////////////////////
//
var tttNonNetBoard= tttBoard.xtends({

  GOALSPACE : null,
  DAGSPACE : null,
  ROWSPACE : null,
  COLSPACE : null,

  registerPlayers: function(p1,p2) {
    this.actors= [ sjs.randomSign() > 0 ? p1 : p2, p1, p2 ];
    this._super(p1,p2);
  },

  isOnline: function() { return false; },

  onEnqueue: function(cmd,cb) {
    this.grid[cmd.cell] = cmd.actor.value;
    this.checkWin(cmd,cb);
  },

  checkWin: function(cmd, cb) {
    sjs.loggr.debug('checking for win "' + cmd.actor.color + '", pos = ' + cmd.cell);
    var rc= this.isWinner(cmd.actor);
    if (_.isObject(rc[0])) {
      cb(cmd, 'winning-move');
      this.endGame(rc,cb);
    }
    else
    if (this.isStalemate()) {
      cb(cmd, 'last-move');
      this.drawGame(cb);
    }
    else {
      this.toggleActor(cmd,cb);
    }
  },

  drawGame: function(cb) {
    this.onStopReset();
    cb(null, 'draw');
  },

  endGame: function(cmd, cb) {
    this.onStopReset();
    cb(cmd, 'winner');
  },

  toggleActor: function(cmd, cb) {
    this.actors[0] = this.getOtherPlayer(this.actors[0]);
    cb(cmd, 'next', this.actors[0]);
  },

  getGoalSpace: function() { return this.GOALSPACE; },
  getBoardSize: function() { return this.size; },

  getDiagX: function() { return this.DAGSPACE[0]; },
  getDiagY: function() { return this.DAGSPACE[1]; },

  initBoard: function(bvals) {
    this.grid= sjs.makeArray( this.size * this.size, this.CV_Z);
  },

  isStalemate: function(game) {
    return ! _.some(game || this.grid, function(n) {
      return n === this.CV_Z;
    }, this);
  },

  checkWinner: function() {
    var rc = undef,
    w;
    _.find(this.actors, function(actor,n) {
      switch (n) {
        case 0:
          return false;
        default:
          w= this.isWinner(actor);
          if (_.isObject(w[0])) {
            rc=actor;
            return true;
          } else {
            return false;
          }
      }
    }, this);
    return _.isObject(rc) ? [rc, w[1]] : [undef, null] ;
  },

  isWinner: function(actor, gameVals) {
    var game= gameVals || this.grid;
    var rc, combo;
    rc= _.some(this.GOALSPACE, function(r) {
      combo=r;
      return _.every(_.map(r, function(i) {
        return game[i];
      }), function(n) {
        return actor.isValue(n);
      });
    });
    return rc ? [actor, combo] : [null, null];
  },

  nextFreeCell: function(actor) {
    var fr= _.reduce(this.grid, function(memo, z, n) {
      if (z === this.CV_Z) { memo.push(n); }
      return memo;
    }, [], this);
    return (fr.length === 0) ? -1 : fr[ sjs.rand( fr.length) ];
  },

  poiseToWin: function(actor,gameVals) {
    var sum = this.getBoardSize() - 1,
    m, rc,
    lastFree = -1;
    var game= gameVals || this.grid;

    rc = _.some(this.GOALSPACE, function(r) {
      m = _.foldl(r, function(memo, n) {
        if (actor.isValue( game[n])) {
          memo.used += 1;
        }
        if (game[n] === this.CV_Z) {
          memo.free += 1;
          memo.last = n;
        }
        return memo;
      }, { used: 0, free: 0, last: -1 }, this);
      lastFree = m.last;
      return m.used === sum && m.free === 1;
    }, this);
    return rc ? lastFree : -1;
  },

  freeMove: function(actor,gameVals) {
    var sum = this.getBoardSize() - 1,
    m, rc;
    var game= gameVals || this.grid;

    rc = _.some(this.GOALSPACE, function(r) {
      m = _.foldl(r, function(memo, n) {
        if (actor.isValue(game[n])) {
          memo.used += 1;
        }
        if (game[n] === this.CV_Z) {
          memo.free += 1;
        }
        return memo;
      }, { used: 0, free: 0 }, this);
      return m.free === sum && m.used === 1;
    }, this);
    return rc;
  },

  getNextMoves: function(snapshot) {
    var n, g = snapshot.state,
    rc = [];
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
    if (this.isNil( snapshot.state[move])) {
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
    return _.isObject(this.isWinner(snapshot.other, snapshot.state )[0]) ? -100 : 0;
  },

  isOver: function(snapshot) {
    return _.isObject(this.isWinner(snapshot.cur,snapshot.state)[0]) ||
           _.isObject(this.isWinner(snapshot.other, snapshot.state)[0]) ||
           this.isStalemate(snapshot.state);
  },

  mapGoalSpace: function(size) {
    this.ROWSPACE = [];
    this.COLSPACE = [];
    var dx = [],
    dy = [],
    c, r, h, v;
    for (r=0; r < size; ++r) {
      h = [];
      v = [];
      for (c=0; c < size; ++c) {
        h.push(r * size + c);
        v.push(c * size + r);
      }
      this.ROWSPACE.push(h);
      this.COLSPACE.push(v);
      dx.push(r * size + r);
      dy.push((size - r - 1) * size + r);
    }
    this.DAGSPACE = [dx, dy];
    this.GOALSPACE = this.DAGSPACE.concat(this.ROWSPACE, this.COLSPACE);
  },

  ctor: function (size) {
    this._super(size);
    this.mapGoalSpace(size);
  }

});

asterix.TicTacToe.NewBoard = function(mode,size) {
  return mode === 3 ? new tttNetBoard(size) : new tttNonNetBoard(size);
}

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////
//
var negax= global.ZotohLab.NegaMax,
Player = sjs.Class.xtends({

  takeTurn: function() { throw new Error("Abstract call"); },
  isRobot: function() { return !this.isHuman(); },
  isHuman: function() { return this.human; },
  isValue: function(n) { return this.value === n; },
  bindBoard: function(b) { this.arena=b; },
  number: function() { return this.entity; },
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
/*
Object.defineProperty(Player.prototype, "pic", {
  get: function() { return this.entity; },
  set: function(v) { this.entity=v; }
});
*/
Object.defineProperty(Player.prototype, "board", {
  get: function() { return this.arena; },
});

var Robot = Player.xtends({

  isMax: function() { return true; },
  ctor: function(idv, pic, color) {
    this._super(idv, false, pic, color);
  }

});

var Human = Player.xtends({

  isMax: function() { return false; },
  takeTurn: function() {},
  ctor: function (idv, pic, color) {
    this._super(idv, true, pic, color);
  }

});

asterix.TicTacToe.NetPlayer = Human.xtends({

  setWEBSock: function(wss) { this.wss= wss; },
  isMax: function() { return false; },
  takeTurn: function() {},
  ctor: function (idv, pic, color) {
    this._super(idv, pic, color);
    this.wss=null;
  }

});

asterix.TicTacToe.Human = Human;


asterix.TicTacToe.AlgoBot = Robot.xtends({

  takeTurn: function() {
    return this.mmAlgo.eval();
  },
  bindBoard: function(b) {
    this._super(b);
    this.mmAlgo = new negax.Algo(b);
  },
  ctor: function ( idv, pic, color) {
    this._super( idv, pic, color);
    this.mmAlgo= null;
  }

});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

