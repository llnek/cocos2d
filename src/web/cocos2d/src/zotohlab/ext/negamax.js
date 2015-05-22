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

    const PINF = 1000000;

    /** @alias module:zotohlab/asx/negamax */
    let exports = {},
    undef;

    //////////////////////////////////////////////////////////////////////////////
    let negamax = (board, game, maxDepth, depth, alpha, beta) => {
      if (depth === 0 || board.isOver(game)) {
        return board.evalScore(game);
      }
      //assert(openMoves && openMoves.length > 0);
      let openMoves = board.getNextMoves(game),
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
    class GameBoard {
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method isOver
       * @param {Object} game
       * @return {Boolean}
       */
      isOver(game) { return false; }
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method evalScore
       * @param {Object} game
       * @return {Number} score
       */
      evalScore(game) { return 0; }
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method getNextMoves
       * @param {Object} game
       * @return {Array}
       */
      getNextMoves(game) { return []; }
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method makeMoves
       * @param {Object} game
       * @param {Number} move
       */
      makeMove(game,move) {}
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method switchPlayer
       * @param {Object} game
       */
      switchPlayer(game) {}
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method unmakeMove
       * @param {Object} game
       * @param {Number} move
       */
      unmakeMove(game,move) {}
      /**
       * @memberof module:zotohlab/asx/negamax~GameBoard
       * @method takeSnapshot
       * @return {SnapShot}
       */
      takeSnapshot() { return null; }
    }

    /**
     * The negamax algorithm implementation.
     * @class NegaMax
     */
    class NegaMax {

      /**
       * Get the game board.
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method getGameBoard
       * @return {GameBoard}
       */
      getGameBoard() { return this.board; }

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method constructor
       * @param {GameBoard} board
       */
      constructor(board) { this.board= board; }

      /**
       * Run the algo for one iteration.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method eval
       * @return {Number} last best move
       */
      eval() {
        const snapshot= this.board.takeSnapshot();
        negamax(this.board, snapshot, 10, 10, -PINF, PINF);
        return snapshot.lastBestMove;
      }

    }

    /**
     * Simple data structure keeping track of the state of the
     * game board.
     * @class Snapshot
     */
    class Snapshot {

      /**
       * @method ctor
       * @private
       */
      constructor() {
        this.lastBestMove= null;
        this.other= null;
        this.cur= null;
        this.state= null;
      }

    }

    exports = /** @lends exports# */{
      /**
       * @property {SnapShot} Snapshot
       */
      Snapshot: Snapshot,
      /**
       * @property {Number} INF
       */
      INF: PINF,
      /**
       * @property {NegaMax} NegaMax
       */
      NegaMax: NegaMax,
      /**
       * @property {GameBoard} GameBoard
       */
      GameBoard: GameBoard
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

