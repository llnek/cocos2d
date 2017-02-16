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

"use strict"; /**
              * @requires cherimoia/skaro
              * @module zotohlab/asx/negamax
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skaro = require("cherimoia/skaro");

var _skaro2 = _interopRequireDefault(_skaro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////////////
var PINF = 1000000;
var undef = void 0,
    negamax = function negamax(board, game, maxDepth, depth, alpha, beta) {
  if (depth === 0 || board.isOver(game)) {
    return board.evalScore(game);
  }
  //assert(openMoves && openMoves.length > 0);
  var openMoves = board.getNextMoves(game),
      bestValue = -PINF,
      rc = void 0,
      move = void 0,
      bestMove = openMoves[0];

  if (depth === maxDepth) {
    game.lastBestMove = openMoves[0];
  }

  for (var n = 0; n < openMoves.length; ++n) {
    move = openMoves[n];
    board.makeMove(game, move);
    board.switchPlayer(game);
    rc = -negamax(board, game, maxDepth, depth - 1, -beta, -alpha);
    board.switchPlayer(game);
    board.unmakeMove(game, move);
    bestValue = Math.max(bestValue, rc);
    if (alpha < rc) {
      alpha = rc;
      bestMove = move;
      if (depth === maxDepth) {
        game.lastBestMove = move;
      }
      if (alpha >= beta) {
        break;
      }
    }
  };
  return bestValue;
};

/**
 * @interface GameBoard
 * @class
 */

var GameBoard = function (_sjs$ES6Claxx) {
  _inherits(GameBoard, _sjs$ES6Claxx);

  function GameBoard() {
    _classCallCheck(this, GameBoard);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GameBoard).apply(this, arguments));
  }

  _createClass(GameBoard, [{
    key: "isOver",

    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method isOver
     * @param {Object} game
     * @return {Boolean}
     */
    value: function isOver(game) {
      return false;
    }
    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method evalScore
     * @param {Object} game
     * @return {Number} score
     */

  }, {
    key: "evalScore",
    value: function evalScore(game) {
      return 0;
    }
    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method getNextMoves
     * @param {Object} game
     * @return {Array}
     */

  }, {
    key: "getNextMoves",
    value: function getNextMoves(game) {
      return [];
    }
    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method makeMoves
     * @param {Object} game
     * @param {Number} move
     */

  }, {
    key: "makeMove",
    value: function makeMove(game, move) {}
    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method switchPlayer
     * @param {Object} game
     */

  }, {
    key: "switchPlayer",
    value: function switchPlayer(game) {}
    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method unmakeMove
     * @param {Object} game
     * @param {Number} move
     */

  }, {
    key: "unmakeMove",
    value: function unmakeMove(game, move) {}
    /**
     * @memberof module:zotohlab/asx/negamax~GameBoard
     * @method takeSnapshot
     * @return {SnapShot}
     */

  }, {
    key: "takeSnapshot",
    value: function takeSnapshot() {
      return null;
    }
  }]);

  return GameBoard;
}(_skaro2.default.ES6Claxx);

/**
 * The negamax algorithm implementation.
 * @class NegaMax
 */


var NegaMax = function (_sjs$ES6Claxx2) {
  _inherits(NegaMax, _sjs$ES6Claxx2);

  _createClass(NegaMax, [{
    key: "getGameBoard",


    /**
     * Get the game board.
     * @memberof module:zotohlab/asx/negamax~NegaMax
     * @method getGameBoard
     * @return {GameBoard}
     */
    value: function getGameBoard() {
      return this.board;
    }

    /**
     * Constructor.
     *
     * @memberof module:zotohlab/asx/negamax~NegaMax
     * @method constructor
     * @param {GameBoard} board
     */

  }]);

  function NegaMax(board) {
    _classCallCheck(this, NegaMax);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(NegaMax).call(this));

    _this2.board = board;return _this2;
  }

  /**
   * Run the algo for one iteration.
   *
   * @memberof module:zotohlab/asx/negamax~NegaMax
   * @method eval
   * @return {Number} last best move
   */


  _createClass(NegaMax, [{
    key: "eval",
    value: function _eval() {
      var snapshot = this.board.takeSnapshot();
      negamax(this.board, snapshot, 10, 10, -PINF, PINF);
      return snapshot.lastBestMove;
    }
  }]);

  return NegaMax;
}(_skaro2.default.ES6Claxx);

/**
 * Simple data structure keeping track of the state of the
 * game board.
 * @class Snapshot
 */


var Snapshot = function (_sjs$ES6Claxx3) {
  _inherits(Snapshot, _sjs$ES6Claxx3);

  /**
   * @method ctor
   * @private
   */

  function Snapshot() {
    _classCallCheck(this, Snapshot);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Snapshot).call(this));

    _this3.lastBestMove = null;
    _this3.other = null;
    _this3.cur = null;
    _this3.state = null;
    return _this3;
  }

  return Snapshot;
}(_skaro2.default.ES6Claxx);

/** @alias module:zotohlab/asx/negamax */


var xbox = /** @lends xbox# */{
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

_skaro2.default.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF