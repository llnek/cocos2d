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
 * @module zotohlab/asx/negamax
 */
define("zotohlab/asx/negamax",

  ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    /** @alias module:zotohlab/asx/negamax */
    var exports = {},
    PINF = 1000000,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    //
    function negamax(board, game, maxDepth, depth, alpha, beta) {

      if (depth === 0 || board.isOver(game)) {
        return board.evalScore(game);
      }

      //assert(openMoves && openMoves.length > 0);
      var openMoves = board.getNextMoves(game),
      bestValue = -PINF,
      rc,
      n,
      move,
      bestMove = openMoves[0];

      if (depth === maxDepth) {
        game.lastBestMove = openMoves[0];
      }

      for (n=0; n < openMoves.length; ++n) {
        move = openMoves[n];
        board.makeMove(game, move);
        board.switchPlayer(game);
        rc = - negamax(board, game, maxDepth, depth-1, -beta, -alpha);
        board.switchPlayer(game);
        board.unmakeMove(game,move);
        bestValue = Math.max( bestValue,  rc );
        if (alpha < rc) {
          alpha = rc;
          bestMove = move;
          if (depth === maxDepth) {
            game.lastBestMove = move;
          }
          if (alpha >= beta) { break; }
        }
      };

      return bestValue;
    }

    /**
     * @interface GameBoard
     * @class
     */
    var GameBoard = {
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method isOver
       * @param {Object} game
       * @return {Boolean}
       */
      isOver: function(game) { return false; },
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method evalScore
       * @param {Object} game
       * @return {Number} score
       */
      evalScore: function(game) { return 0; },
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method getNextMoves
       * @param {Object} game
       * @return {Array}
       */
      getNextMoves: function(game) { return []; },
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method makeMoves
       * @param {Object} game
       * @param {Number} move
       */
      makeMove: function(game,move) {},
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method switchPlayer
       * @param {Object} game
       */
      switchPlayer: function(game) {},
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method unmakeMove
       * @param {Object} game
       * @param {Number} move
       */
      unmakeMove: function(game,move) {},
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method takeSnapshot
       * @return {SnapShot}
       */
      takeSnapshot: function() { return null; }
    },
    /**
     * The negamax algorithm implementation.
     *
     * @class NegaMax
     */
    NegaMax= sjs.mixes({

      /**
       * Get the game board.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method getGameBoard
       * @return {GameBoard}
       */
      getGameBoard: function() { return this.board; },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method ctor
       * @param {GameBoard} board
       */
      ctor: function(board) { this.board= board; },

      /**
       * Run the algo for one iteration.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method eval
       * @return {Number} last best move
       */
      eval: function() {
        var snapshot= this.board.takeSnapshot();
        negamax(this.board, snapshot, 10, 10, -PINF, PINF);
        return snapshot.lastBestMove;
      }

    }),
    /**
     * Simple data structure keeping track of the state of the
     * game board.
     *
     * @class Snapshot
     */
    Snapshot= sjs.mixes({

      /**
       * @method ctor
       * @private
       */
      ctor: function() {
        this.lastBestMove= null;
        this.other= null;
        this.cur= null;
        this.state= null;
      }

    });

    exports = {
      /**
       * @property {SnapShot.Class} Snapshot
       * @static
       */
      Snapshot: Snapshot,
      /**
       * @property {Number} INF
       * @static
       */
      INF: PINF,
      /**
       * @property {NegaMax.Class} NegaMax
       * @static
       */
      NegaMax: NegaMax,
      /**
       * @property {GameBoard.Class} GameBoard
       * @static
       */
      GameBoard: GameBoard
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

