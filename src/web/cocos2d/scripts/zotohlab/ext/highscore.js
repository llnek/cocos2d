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

(function (undef) { "use strict"; var global=this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sjs= global.SkaroJS,
CKS= global.Cookies;

////////////////////////////////////////////////////////////////////
//// score class
///////////////////////////////////////////////////////////////////

function mkScore(n,v) {
  return {
    value: Number(v.trim()),
    name: n.trim()
  };
}

asterix.HighScores= Skaro.Class.xtends({

  reset: function() {
    this.scores=[];
  },

  read: function() {
    var a, s = CKS.get(this.KEY) || '',
    ts = _.without(s.split('|'), '');
    //this.reset();
    this.scores= _.reduce(ts, function(memo,z) {
      a = _.without(z.split(':'), '');
      if (a.length === 2) {
        memo.push(mkScore(a[0], a[1]));
      }
      return memo;
    }, []);
  },

  write: function() {
    var rc= _.map(this.scores, function(z) {
      return z.name + ':' + n.value;
    });
    CKS.set(this.KEY, rc.join('|'), this.duration);
  },

  hasSlots: function() {
    return this.scores.length < this.size;
  },

  isEligible: function(score) {
    return this.hasSlots() ? true : _.some(this.scores, function(z) {
      return z.value < score;
    });
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

    this.scores = [];
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




}).call(this);

