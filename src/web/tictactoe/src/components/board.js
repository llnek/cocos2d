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

define("zotohlab/p/c/board",
       ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    var R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    // A Tic Tac Toe board.
    //////////////////////////////////////////////////////////////////////////////

    var GameBoard = sjs.Class.xtends({

      isNil: function(cellv) { return cellv === this.CV_Z; },

      ctor: function(size, nilValue, p1v, p2v, goals) {
        this.actors= [nilValue, p1v, p2v];
        this.CV_Z= nilValue;
        this.grid= [];
        this.size= size;
        this.GOALSPACE=goals;
      },

      getFirstMove: function() {
        var rc= R.find(function(v) {
          return v !== this.CV_Z;
        }.bind(this), this.grid );
        if (! sjs.echt(rc)) {
          return sjs.rand(this.grid.length);
        } else {
          return undef;
        }
      },

      syncState: function(seed,actor) {
        this.grid=seed.slice(0);
        this.actors[0] = actor;
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
          snapshot.state[move] = snapshot.cur;
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
        return sjs.isNumber(this.isWinner(snapshot.other, snapshot.state )[0]) ? -100 : 0;
      },

      isOver: function(snapshot) {
        return sjs.isNumber(this.isWinner(snapshot.cur,snapshot.state)[0]) ||
               sjs.isNumber(this.isWinner(snapshot.other, snapshot.state)[0]) ||
               this.isStalemate(snapshot.state);
      },

      isStalemate: function(game) {
        return ! R.some(function(n) {
          return n === this.CV_Z;
        }.bind(this),
        game || this.grid);
      },

      isWinner: function(actor, gameVals) {
        var game= gameVals || this.grid,
        combo,
        rc= R.some(function(r) {
          combo=r;
          return R.every(function (n) { return n === actor; }, R.map(function(i) {
            return game[i];
          }, r) );
        }, this.GOALSPACE);
        return rc ? [actor, combo] : [null, null];
      }

    });


    return GameBoard;

});


//////////////////////////////////////////////////////////////////////////////
//EOF

