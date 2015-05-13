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
 * @requires zotohlab/asterix
 * @requires Cookies
 * @module  zotohlab/asx/highscores
 */
define("zotohlab/asx/highscores",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'Cookies'],

  function (sjs, sh, Cookies) { "use strict";

    /** @alias module:zotohlab/asx/highscores */
    var exports= {},
    R = sjs.ramda,
    undef;

    ////////////////////////////////////////////////////////////////////
    //
    function mkScore(n,v) {
      return {
        value: Number(v.trim()),
        name: n.trim()
      };
    }

    ////////////////////////////////////////////////////////////////////
    //
    /**
     * @class HighScores
     */
    exports.HighScores= sjs.Class.xtends({

      /**
       * Read the scores from the cookie.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method read
       */
      read: function() {
        var s = Cookies.get(this.KEY) || '',
        a,
        ts = sjs.safeSplit(s, '|');
        //this.reset();
        this.scores= R.reduce(function(memo,z) {
          a = sjs.safeSplit(z, ':');
          if (a.length === 2) {
            memo.push(mkScore(a[0], a[1]));
          }
          return memo;
        }.bind(this), [], ts);
      },

      /**
       * Reset the scores tp none.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method reset
       */
      reset: function() {
        this.scores=[];
      },

      /**
       * Write the scores back to the cookie.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method write
       */
      write: function() {
        var rc= R.map(function(z) {
          return z.name + ':' + n.value;
        }, this.scores);
        Cookies.set(this.KEY, rc.join('|'), this.duration);
      },

      /**
       * Test if there is more room to store a new high score.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method hasSlots
       * @return {Boolean}
       */
      hasSlots: function() {
        return this.scores.length < this.size;
      },

      /**
       * Test if we can add this score to the list of highscores.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method canAdd
       * @param {Object} score
       * @return {Boolean}
       */
      canAdd: function(score) {
        if (this.hasSlots()) {
          return true;
        } else {
          return R.any(function(z) {
            return z.value < score;
          }, this.scores);
        }
      },

      /**
       * Maybe force to insert this new score.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method insert
       * @param {String} name
       * @param {Number} score
       */
      insert: function(name, score) {
        var s= mkScore(name || '???', score),
        i,
        len= this.scores.length;

        if (! this.hasSlots()) {
          for (i = len - 1; i >= 0; --i) {
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
      },

      /**
       * Get the high scores.
       *
       * @memberof module:zotohlab/asx/highscores~HighScores
       * @method getScores
       * @return {Array} high scores.
       */
      getScores: function() {
        return this.scores;
      },

      /**
       * @private
       */
      sort: function() {
        Array.prototype.sort(this.scores, function(a,b) {
          if (a.value < b.value) { return -1; }
          else
          if (a.value > b.value) { return 1; }
          else {
            return 0;
          }
        });
      },

      /**
       * @method ctor
       * @private
       * @param {String} key
       * @param {Number} size
       * @param {Number} duration
       */
      ctor: function(key, size, duration) {
        this.duration= duration || 60*60*24*1000;
        this.size = size || 10;
        this.scores = [];
        this.KEY= key;
      }

    });

    /**
     * Create a new HighScores object.
     *
     * @method reify
     * @param {String} key
     * @param {Number} size
     * @param {Number} duration
     * @return {HighScores}
     */
    exports.reify = function(key,size,duration) {
      return new HighScores();
    }

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

