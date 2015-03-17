// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.

define("zotohlab/asx/highscores", ['cherimoia/skarojs',
                                  'zotohlab/asterix',
                                  'Cookies'],
  function (sjs, sh, Cookies) { "use strict";
    var R = sjs.ramda,
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
    var HighScores= sjs.Class.xtends({

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

      reset: function() {
        this.scores=[];
      },

      write: function() {
        var rc= R.map(function(z) {
          return z.name + ':' + n.value;
        }, this.scores);
        Cookies.set(this.KEY, rc.join('|'), this.duration);
      },

      hasSlots: function() {
        return this.scores.length < this.size;
      },

      canAdd: function(score) {
        if (this.hasSlots()) {
          return true;
        } else {
          return R.some(function(z) {
            return z.value < score;
          }, this.scores);
        }
      },

      insert: function(name, score) {
        var s= mkScore(name || '', score),
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

      getScores: function() {
        return this.scores;
      },

      sort: function() {
        var len = this.scores.length,
        tmp = this.scores,
        i,
        last,
        ptr;

        this.reset();

        while (tmp.length > 0) {
          last= undef;
          ptr= -1;
          for (i=0; i < tmp.length; ++i) {
            if (!last || (tmp[i].value > last.value)) {
              last = tmp[i];
              ptr = i;
            }
          }
          if (ptr !== -1) {
            tmp.splice(ptr,1);
            this.scores.push(last);
          }
        }
      },

      ctor: function(key, size, duration) {
        this.duration= duration || 60*60*24*1000;
        this.size = size || 10;
        this.scores = [];
        this.KEY= key;
      }

    });


    return HighScores;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

