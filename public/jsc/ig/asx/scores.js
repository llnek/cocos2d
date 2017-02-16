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
              * @requires Cookies
              * @module  zotohlab/asx/scores
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _Cookies = require('Cookies');

var _Cookies2 = _interopRequireDefault(_Cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    R = sjs.ramda,
    undef = void 0;

////////////////////////////////////////////////////////////////////
var mkScore = function mkScore(n, v) {
  return {
    value: Number(v.trim()),
    name: n.trim()
  };
};

////////////////////////////////////////////////////////////////////
/**
 * @class HighScores
 */

var HighScores = function (_sjs$ES6Claxx) {
  _inherits(HighScores, _sjs$ES6Claxx);

  _createClass(HighScores, [{
    key: 'read',


    /**
     * Read the scores from the cookie.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method read
     */
    value: function read() {
      var s = _Cookies2.default.get(this.KEY) || '',
          ts = sjs.safeSplit(s, '|');
      //this.reset();
      this.scores = R.reduce(function (memo, z) {
        var a = sjs.safeSplit(z, ':');
        if (a.length === 2) {
          memo.push(mkScore(a[0], a[1]));
        }
        return memo;
      }, [], ts);
    }

    /**
     * Reset the scores tp none.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method reset
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.scores = [];
    }

    /**
     * Write the scores back to the cookie.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method write
     */

  }, {
    key: 'write',
    value: function write() {
      var rc = R.map(function (z) {
        return z.name + ':' + n.value;
      }, this.scores);
      _Cookies2.default.set(this.KEY, rc.join('|'), this.duration);
    }

    /**
     * Test if there is more room to store a new high score.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method hasSlots
     * @return {Boolean}
     */

  }, {
    key: 'hasSlots',
    value: function hasSlots() {
      return this.scores.length < this.size;
    }

    /**
     * Test if we can add this score to the list of highscores.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method canAdd
     * @param {Object} score
     * @return {Boolean}
     */

  }, {
    key: 'canAdd',
    value: function canAdd(score) {
      if (this.hasSlots()) {
        return true;
      }
      return R.any(function (z) {
        return z.value < score;
      }, this.scores);
    }

    /**
     * Maybe force to insert this new score.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method insert
     * @param {String} name
     * @param {Number} score
     */

  }, {
    key: 'insert',
    value: function insert(name, score) {
      var s = mkScore(name || '???', score),
          len = this.scores.length;

      if (!this.hasSlots()) {
        for (var i = len - 1; i >= 0; --i) {
          if (this.scores[i].value < score) {
            this.scores.splice(i, 1);
            break;
          }
        }
      };

      if (this.hasSlots()) {
        this.scores.push(s);
        this.sort();
        this.write();
      }
    }

    /**
     * Get the high scores.
     * @memberof module:zotohlab/asx/scores~HighScores
     * @method getScores
     * @return {Array} high scores
     */

  }, {
    key: 'getScores',
    value: function getScores() {
      return this.scores;
    }

    /**
     * @private
     */

  }, {
    key: 'sort',
    value: function sort() {
      Array.prototype.sort(this.scores, function (a, b) {
        if (a.value < b.value) {
          return -1;
        } else if (a.value > b.value) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    /**
     * @method constructor
     * @private
     * @param {String} key
     * @param {Number} size
     * @param {Number} duration
     */

  }]);

  function HighScores(key, size, duration) {
    _classCallCheck(this, HighScores);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HighScores).call(this));

    _this.duration = duration || 60 * 60 * 24 * 1000;
    _this.size = size || 10;
    _this.scores = [];
    _this.KEY = key;
    return _this;
  }

  return HighScores;
}(sjs.ES6Claxx);

/** @alias module:zotohlab/asx/scores */


var xbox = /** @lends xbox# */{
  /**
   * Create a new HighScores object.
   * @method reify
   * @param {String} key
   * @param {Number} size
   * @param {Number} duration
   * @return {HighScores}
   */

  reify: function reify(key, size, duration) {
    return new HighScores();
  }
};

sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF