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

(function(undef) { "use strict"; var global = this, _ = global._  ,
klass= global.ZotohLab.klass,
echt= global.ZotohLab.echt,
_SEED=0,
loggr= global.ZotohLab.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

var Subcr= klass.extends({
  ctor: function(topic, selector, target, repeat, args) {
    this.id= "sub-" + Number(++_SEED);
    this.args= args || [];
    this.target= target
    this.action= selector;
    this.topic= topic
    this.repeat= repeat;
    this.active=true;
  }
});

var TNode= klass.extends({
  ctor: function() {
    this.parts= {};
    this.subs=[];
  }
});

var EventBus = klass.extends({

  once: function(topic, selector, target /*, more args */) {
    var rc= this.pkListen(false,
                          topic,
                          selector,
                          target,
                          (arguments.length > 3) ? Array.prototype.slice(arguments,3) : [] );
    return echt(rc) ? rc.id : null;
  },

  on: function(topic, selector, target /*, more args */) {
    var rc= this.pkListen(true,
                          topic,
                          selector,
                          target,
                          (arguments.length > 3) ? Array.prototype.slice(arguments,3) : [] );
    return echt(rc) ? rc.id : null;
  },

  fire: function(topic, msg) {
    var tokens= topic.split('/'),
    status= [ false ];

    this.pkDoPub(status, topic, this.rootNode, tokens, 0, msg || {} );
    if (status[0] === true) {
      ++this.msgCount;
    }

    return status[0];
  },

  resume: function(handle) {
    var sub= this.allSubs[ handle ];
    if (sub) {
      sub.active=true;
    }
  },

  pause: function(handle) {
    var sub= this.allSubs[ handle ];
    if (sub) {
      sub.active=false;
    }
  },

  off: function(handle) {
    var sub= this.allSubs[ handle ];
    if (sub) {
      this.pkUnSub(this.rootNode, sub.topic.split('/'), 0, sub);
    }
  },

  pkGetSubcr: function(id) {
    return this.allSubs[ id];
  },

  pkListen: function(repeat, topic, selector, target, more) {
    var ts= topic.trim().split(/\s+/),
    rc= _.map(ts, function(z) {
      this.pkAddSub(repeat,z,selector,target,more);
    }, this);
    switch (ts.length) {
      case 1: return rc[0];
      case 0: return null;
      default: return rc;
    }
  },

  pkAddSub: function(repeat, topic, selector, target, more) {
    var rc= new Subcr(topic, selector, target, repeat, more),
    tkns= topic.split('/'),
    node= _.reduce(tkns, function(memo, z) {
      return this.pkDoSub(memo,z);
    }, this.rootNode, this);

    this.allSubs[rc.id] = rc;
    node.subs.push(rc);

    return rc.id;
  },

  pkUnSub: function(node, tokens, pos, sub) {
    if (! echt(node)) { return; }
    if (pos < tokens.length) {
      var k= tokens[pos],
      cn= node.parts[k];
      this.pkUnSub(cn, tokens, pos+1, sub);
      if (_.isEmpty(cn.parts) && cn.subs.length === 0) {
        delete node.parts[k];
      }
    } else {
      _.find(node.subs, function(z,n) {
        if (z.id === sub.id) {
          delete this.allSubs[z.id];
          node.subs.splice(n,1);
          return true;
        }
        return false;
      }, this);
    }
  },

  pkDoPub: function(status, topic, node, tokens, pos, msg) {
    if (! echt(node)) { return; }
    if (pos < tokens.length) {
      this.pkDoPub(status, topic, node.parts[ tokens[pos] ], tokens, pos+1, msg);
      this.pkDoPub(status, topic, node.parts['*'], tokens, pos+1,msg);
      this.pkRun(status, topic, node.parts['**'], msg);
    } else {
      this.pkRun(status, topic, node,msg);
    }
  },

  pkRun: function(status, topic, node, msg) {
    var cs= node ? node.subs : [],
    purge=false;
    _.each(cs, function (z) {
      if (z.active && echt(z.action)) {
        z.action.apply(z.target, [topic, msg].concat(z.args));
        if (!z.repeat) {
          delete this.allSubs[z.id];
          z.active= false;
          z.action= null;
          purge=true;
        }
        status[0]= true;
      }
    }, this);
    if (purge && cs.length > 0) {
      node.subs= _.filter(cs,function(z) {
        if (z.action) { return true; } else { return false; }
      });
    }
  },

  pkDoSub: function(node,token) {
    if ( ! _.has(node.parts, token)) {
      node.parts[token] = new TNode();
    }
    return node.parts[token];
  },

  ctor: function() {
    this.rootNode = new TNode();
    this.allSubs = {};
    this.msgCount=0;
  }

});

global.ZotohLab.EventBus = EventBus;

}).call(this);
