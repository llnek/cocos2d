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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires Cookies
 * @module  zotohlab/asx/scores
 */

import sh from 'zotohlab/asx/asterix';
import Cookies from 'Cookies';

////////////////////////////////////////////////////////////////////
let sjs= sh.skarojs,
R = sjs.ramda,
undef;

////////////////////////////////////////////////////////////////////
let mkScore = (n,v) => {
  return {
    value: Number(v.trim()),
    name: n.trim()
  };
}

////////////////////////////////////////////////////////////////////
/**
 * @class HighScores
 */
class HighScores extends sjs.ES6Claxx {

  /**
   * Read the scores from the cookie.
   * @memberof module:zotohlab/asx/scores~HighScores
   * @method read
   */
  read() {
    const s = Cookies.get(this.KEY) || '',
    ts = sjs.safeSplit(s, '|');
    //this.reset();
    this.scores= R.reduce((memo,z) => {
      const a = sjs.safeSplit(z, ':');
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
  reset() {
    this.scores=[];
  }

  /**
   * Write the scores back to the cookie.
   * @memberof module:zotohlab/asx/scores~HighScores
   * @method write
   */
  write() {
    const rc= R.map((z) => {
      return z.name + ':' + n.value;
    },
    this.scores);
    Cookies.set(this.KEY, rc.join('|'), this.duration);
  }

  /**
   * Test if there is more room to store a new high score.
   * @memberof module:zotohlab/asx/scores~HighScores
   * @method hasSlots
   * @return {Boolean}
   */
  hasSlots() {
    return this.scores.length < this.size;
  }

  /**
   * Test if we can add this score to the list of highscores.
   * @memberof module:zotohlab/asx/scores~HighScores
   * @method canAdd
   * @param {Object} score
   * @return {Boolean}
   */
  canAdd(score) {
    if (this.hasSlots()) { return true; }
    return R.any((z) => {
      return z.value < score;
    },
    this.scores);
  }

  /**
   * Maybe force to insert this new score.
   * @memberof module:zotohlab/asx/scores~HighScores
   * @method insert
   * @param {String} name
   * @param {Number} score
   */
  insert(name, score) {
    const s= mkScore(name || '???', score),
    len= this.scores.length;

    if (! this.hasSlots()) {
      for (let i = len - 1; i >= 0; --i) {
        if (this.scores[i].value < score) {
          this.scores.splice(i,1);
          break;
        }
    }};

    if (this.hasSlots()) {
      this.scores.push( s);
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
  getScores() {
    return this.scores;
  }

  /**
   * @private
   */
  sort() {
    Array.prototype.sort(this.scores, (a,b) => {
      if (a.value < b.value) { return -1; }
      else
      if (a.value > b.value) { return 1; }
      else {
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
  constructor(key, size, duration) {
    super();
    this.duration= duration || 60*60*24*1000;
    this.size = size || 10;
    this.scores = [];
    this.KEY= key;
  }
}

/** @alias module:zotohlab/asx/scores */
const xbox= /** @lends xbox# */{
  /**
   * Create a new HighScores object.
   * @method reify
   * @param {String} key
   * @param {Number} size
   * @param {Number} duration
   * @return {HighScores}
   */
  reify(key,size,duration) {
    return new HighScores();
  }
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

