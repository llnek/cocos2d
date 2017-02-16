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
              * @requires zotohlab/asx/asterix
              * @module n/board
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asterix = require("zotohlab/asx/asterix");

var _asterix2 = _interopRequireDefault(_asterix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    R = sjs.ramda,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
// A Tic Tac Toe board.
/**
 * @class GameBoard
 */

var GameBoard = function (_sjs$ES6Claxx) {
  _inherits(GameBoard, _sjs$ES6Claxx);

  _createClass(GameBoard, [{
    key: "isNil",


    /**
     * @memberof module:n/board~GameBoard
     * @method isNil
     * @param {Number} cellv
     * @return {Boolean}
     */
    value: function isNil(cellv) {
      return cellv === this.CV_Z;
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method constructor
     * @param {Number} size
     * @param {Number} nilValue
     * @param {Number} p1v
     * @param {Number} p2v
     * @param {Array} goals
     */

  }]);

  function GameBoard(size, nilValue, p1v, p2v, goals) {
    _classCallCheck(this, GameBoard);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameBoard).call(this));

    _this.actors = [nilValue, p1v, p2v];
    _this.CV_Z = nilValue;
    _this.grid = [];
    _this.size = size;
    _this.GOALSPACE = goals;
    return _this;
  }

  /**
   * @memberof module:n/board~GameBoard
   * @method getFirstMove
   * @return {Number}
   */


  _createClass(GameBoard, [{
    key: "getFirstMove",
    value: function getFirstMove() {
      var _this2 = this;

      var rc = R.find(function (v) {
        return v !== _this2.CV_Z;
      }, this.grid);
      if (!sjs.echt(rc)) {
        return sjs.rand(this.grid.length);
      } else {
        return undef;
      }
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method syncState
     * @param {Array} seed
     * @param {Number} actor
     */

  }, {
    key: "syncState",
    value: function syncState(seed, actor) {
      this.grid = seed.slice(0);
      this.actors[0] = actor;
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method getNextMoves
     * @param {SnapShot} snap
     * @return {Array}
     */

  }, {
    key: "getNextMoves",
    value: function getNextMoves(snap) {
      var g = snap.state,
          rc = [];
      for (var n = 0; n < g.length; ++n) {
        if (this.isNil(g[n])) {
          rc.push(n);
        }
      }
      return rc;
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method unmakeMove
     * @param {SnapShot} snap
     * @param {Number} move
     */

  }, {
    key: "unmakeMove",
    value: function unmakeMove(snap, move) {
      snap.state[move] = this.CV_Z;
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method makeMove
     * @param {SnapShot} snap
     * @param {Number} move
     */

  }, {
    key: "makeMove",
    value: function makeMove(snap, move) {
      if (this.isNil(snap.state[move])) {
        snap.state[move] = snap.cur;
      } else {
        sjs.tne("Fatal Error: cell [" + move + "] is not free.");
      }
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method switchPlayer
     * @param {SnapShot} snap
     */

  }, {
    key: "switchPlayer",
    value: function switchPlayer(snap) {
      var t = snap.cur;
      snap.cur = snap.other;
      snap.other = t;
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method getOtherPlayer
     * @param {Number} pv
     * @return {Number}
     */

  }, {
    key: "getOtherPlayer",
    value: function getOtherPlayer(pv) {
      if (pv === this.actors[1]) {
        return this.actors[2];
      } else if (pv === this.actors[2]) {
        return this.actors[1];
      } else {
        return this.CV_Z;
      }
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method takeSnapshot
     * @return {SnapShot}
     */

  }, {
    key: "takeSnapshot",
    value: function takeSnapshot() {
      return {
        other: this.getOtherPlayer(this.actors[0]),
        cur: this.actors[0],
        state: this.grid.slice(0),
        lastBestMove: -1
      };
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method evalScore
     * @param {SnapShot} snap
     * @return {Number}
     */

  }, {
    key: "evalScore",
    value: function evalScore(snap) {
      // if we lose, return a nega value
      return sjs.isnum(this.isWinner(snap.other, snap.state)[0]) ? -100 : 0;
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method isOver
     * @param {SnapShot} snap
     * @return {Boolean}
     */

  }, {
    key: "isOver",
    value: function isOver(snap) {
      return sjs.isnum(this.isWinner(snap.cur, snap.state)[0]) || sjs.isnum(this.isWinner(snap.other, snap.state)[0]) || this.isStalemate(snap.state);
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method isStalemate
     * @param {Object} game
     * @return {Boolean}
     */

  }, {
    key: "isStalemate",
    value: function isStalemate(game) {
      var _this3 = this;

      return !R.any(function (n) {
        return n === _this3.CV_Z;
      }, game || this.grid);
    }

    /**
     * @memberof module:n/board~GameBoard
     * @method isWinner
     * @param {Number} actor
     * @param {Array} gameVals
     * @return {Array} [actor, winning-combo]
     */

  }, {
    key: "isWinner",
    value: function isWinner(actor, gameVals) {
      var game = gameVals || this.grid,
          combo = void 0,
          rc = R.any(function (r) {
        combo = r;
        return R.all(function (n) {
          return n === actor;
        }, R.map(function (i) {
          return game[i];
        }, r));
      }, this.GOALSPACE);
      return rc ? [actor, combo] : [null, null];
    }
  }]);

  return GameBoard;
}(sjs.ES6Claxx);

/** @alias module:n/board */


var xbox = /** @lends xbox# */{
  /**
   * @property {GameBoard} GameBoard
   */
  GameBoard: GameBoard
};

sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF