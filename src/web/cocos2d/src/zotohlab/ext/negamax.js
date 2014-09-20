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

(function (undef) { "use strict"; var global = this, _ = global._ ;

var sjs= global.SkaroJS,
PINF = 1000000;

global.ZotohLab.NegaMax= {
  INF: PINF
};

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

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
};

global.ZotohLab.NegaMax.Algo = sjs.Class.xtends({

  getGameBoard: function() {
    return this.board;
  },

  ctor: function(board) {
    this.board= board;
  },

  eval: function() {
    var snapshot= this.board.takeSnapshot();
    negamax(this.board, snapshot, 10, 10, -PINF, PINF);
    return snapshot.lastBestMove;
  }

});

global.ZotohLab.NegaMax.Snapshot = sjs.Class.xtends({

  lastBestMove: null,
  other: null,
  cur: null,
  state: null,

  ctor: function() {}

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

