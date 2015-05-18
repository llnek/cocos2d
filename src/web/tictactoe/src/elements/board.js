// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @module zotohlab/p/c/board
 */
define("zotohlab/p/c/board",

       ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    /** @alias module:zotohlab/p/c/board */
    var exports= {},
    R = sjs.ramda,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    // A Tic Tac Toe board.
    /**
     * @class GameBoard
     */
    var GameBoard = sjs.mixes({

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method isNil
       * @param {Number} cellv
       * @return {Boolean}
       */
      isNil: function(cellv) { return cellv === this.CV_Z; },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method ctor
       * @param {Number} size
       * @param {Number} nilValue
       * @param {Number} p1v
       * @param {Number} p2v
       * @param {Array} goals
       */
      ctor: function(size, nilValue, p1v, p2v, goals) {
        this.actors= [nilValue, p1v, p2v];
        this.CV_Z= nilValue;
        this.grid= [];
        this.size= size;
        this.GOALSPACE=goals;
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method getFirstMove
       * @return {Number}
       */
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

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method syncState
       * @param {Array} seed
       * @param {Number} actor
       */
      syncState: function(seed, actor) {
        this.grid=seed.slice(0);
        this.actors[0] = actor;
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method getNextMoves
       * @param {SnapShot} snap
       * @return {Array}
       */
      getNextMoves: function(snap) {
        var g = snap.state,
        n,
        rc = [];
        for (n=0; n < g.length; ++n) {
          if (this.isNil(g[n])) {
            rc.push(n);
          }
        }
        return rc;
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method unmakeMove
       * @param {SnapShot} snap
       * @param {Number} move
       */
      unmakeMove: function(snap,move) {
        snap.state[move] = this.CV_Z;
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method makeMove
       * @param {SnapShot} snap
       * @param {Number} move
       */
      makeMove: function(snap,move) {
        if (this.isNil( snap.state[move])) {
          snap.state[move] = snap.cur;
        } else {
          sjs.tne("Fatal Error: cell [" + move + "] is not free.");
        }
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method switchPlayer
       * @param {SnapShot} snap
       */
      switchPlayer: function (snap) {
        var t = snap.cur;
        snap.cur= snap.other;
        snap.other=t;
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method getOtherPlayer
       * @param {Number} pv
       * @return {Number}
       */
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

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method takeSnapshot
       * @return {SnapShot}
       */
      takeSnapshot: function() {
        return {
          other: this.getOtherPlayer(this.actors[0]),
          cur: this.actors[0],
          state: this.grid.slice(0),
          lastBestMove: -1
        };
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method evalScore
       * @param {SnapShot} snap
       * @return {Number}
       */
      evalScore: function(snap) {
        // if we lose, return a nega value
        return sjs.isNumber(this.isWinner(snap.other,
                                          snap.state )[0]) ? -100 : 0;
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method isOver
       * @param {SnapShot} snap
       * @return {Boolean}
       */
      isOver: function(snap) {
        return sjs.isNumber(this.isWinner(snap.cur, snap.state)[0]) ||
               sjs.isNumber(this.isWinner(snap.other, snap.state)[0]) ||
               this.isStalemate(snap.state);
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method isStalemate
       * @param {Object} game
       * @return {Boolean}
       */
      isStalemate: function(game) {
        return ! R.any(function(n) {
          return n === this.CV_Z;
        }.bind(this),
        game || this.grid);
      },

      /**
       * @memberof module:zotohlab/p/c/board~GameBoard
       * @method isWinner
       * @param {Number} actor
       * @param {Array} gameVals
       * @return {Array} [actor, winning-combo]
       */
      isWinner: function(actor, gameVals) {
        var game= gameVals || this.grid,
        combo,
        rc= R.any(function(r) {
          combo=r;
          return R.all(function (n) { return n === actor; },
                       R.map(function(i) { return game[i]; }, r) );
        }, this.GOALSPACE);
        return rc ? [actor, combo] : [null, null];
      }

    });

    exports= GameBoard;
    return exports;
});


//////////////////////////////////////////////////////////////////////////////
//EOF

