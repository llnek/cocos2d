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
define("zotohlab/asx/negamax", ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    /** @alias module:zotohlab/asx/negamax */
    var exports = {},
    undef,
    PINF = 1000000;

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
     * The negamax algorithm implementation.
     *
     * @class NegaMax
     */
    var NegaMax= sjs.Class.xtends({

      /**
       * Get the game board.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method getGameBoard
       * @return {Object}
       */
      getGameBoard: function() { return this.board; },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method ctor
       * @param {Object} board
       */
      ctor: function(board) { this.board= board; },

      /**
       * Run the algo for one iteration.
       *
       * @memberof module:zotohlab/asx/negamax~NegaMax
       * @method eval
       * @return {Number} last best move.
       */
      eval: function() {
        var snapshot= this.board.takeSnapshot();
        negamax(this.board, snapshot, 10, 10, -PINF, PINF);
        return snapshot.lastBestMove;
      }

    });

    /**
     * Simple data structure keeping track of the state of the
     * game board.
     *
     * @class Snapshot
     */
    var Snapshot= sjs.Class.xtends({

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

    /**
     * @property Snapshot
     * @type Snapshot.Class
     */
    exports.Snapshot= Snapshot;
    /**
     * @property INF
     * @type Number
     */
    exports.INF= PINF;
    /**
     * @property NegaMax
     * @type NegaMax.Class
     */
    exports.NegaMax= NegaMax;

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

