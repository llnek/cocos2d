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



//////////////////////////////////////////////////////////////////////////////
// A Tic Tac Toe board.
//////////////////////////////////////////////////////////////////////////////

var ttt.GameBoard = sjs.Class.xtends({

  isNil: function(cellv) { return cellv === this.CV_Z; },

  ctor: function(size, nilValue, p1v, p2v) {
    this.actors= [this.CV_Z, p1v, p2v];
    this.grid= [];
    this.CV_Z = nilValue;
    this.size= size;
    this.mapGoalSpace(size);
  },

  syncState: function(seed) {
    this.grid=seed.slice(0);
  },

  getNextMoves: function(snapshot) {
    var g = snapshot.state,
    n,
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
      sjs.tne("Fatal Error: cell [" + move + "] is not free.");
    }
  },

  switchPlayer: function (snapshot) {
    var t = snapshot.cur;
    snapshot.cur= snapshot.other;
    snapshot.other=t;
  },

  getOtherPlayer: function(pv) {
    if (pv === this.actors[1]) {
      return this.actors[2];
    }
    else
    if (pv === this.actors[2]) {
      return this.actors[1];
    }
    else {
      return this.CV_Z;
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

  evalScore: function(snapshot) {
    // if we lose, return a nega value
    return _.isNumber(this.isWinner(snapshot.other, snapshot.state )[0]) ? -100 : 0;
  },

  isOver: function(snapshot) {
    return _.isNumber(this.isWinner(snapshot.cur,snapshot.state)[0]) ||
           _.isNumber(this.isWinner(snapshot.other, snapshot.state)[0]) ||
           this.isStalemate(snapshot.state);
  },

  isStalemate: function(game) {
    return ! _.some(game || this.grid, function(n) {
      return n === this.CV_Z;
    }, this);
  },

  isWinner: function(actor, gameVals) {
    var game= gameVals || this.grid,
    combo,
    rc= _.some(this.GOALSPACE, function(r) {
      combo=r;
      return _.every(_.map(r, function(i) {
        return game[i];
      }), function(n) {
        return n === actor;
      });
    });
    return rc ? [actor, combo] : [null, null];
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
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

