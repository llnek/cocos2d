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

(function(undef) { "use strict"; var global = this; var _ = global._ ;
var loggr= global.ZotohLabs.logger;
var klass= global.ZotohLabs.klass;
var echt= global.ZotohLabs.echt;
var _SEED=0;

var Subcr= klass.extends({
  ctor: function(topic, callback, context, repeat, args) {
    this.id= "sub-" + Number(++_SEED);
    this.args= args || [];
    this.context= context
    this.action= callback;
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

  once: function(topic, callback, context /*, more args */) {
    var rc= this.__listen(false,
                         topic,
                         callback,
                         context,
                         (arguments.length > 3) ? Array.prototype.slice(arguments,3) : [] );

    return echt(rc) ? rc.id : null;
  },

  on: function(topic, callback, context /*, more args */) {
    var rc= this.__listen(true,
                         topic,
                         callback,
                         context,
                         (arguments.length > 3) ? Array.prototype.slice(arguments,3) : [] );
    return echt(rc) ? rc.id : null;
  },

  fire: function(topic, msg) {
    var me=this, tokens= topic.split('/');
    var status= [ false ];

    me.__dopub(status, topic, me.rootNode, tokens, 0, msg || {} );
    if (status[0] === true) {
      ++me.msgCount;
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
      var tokens= sub.topic.split('/');
      this.__unsub(this.rootNode, tokens, 0, sub);
    }
  },

  __getSubcr: function(id) {
    return this.allSubs[ id];
  },

  __listen: function(repeat, topic, callback, context, more) {
    var ts= topic.trim().split(/\s+/);
    var me=this;
    var rc= _.map(ts, function(z) {
      me.__addsub(repeat,z,callback,context,more);
    });
    switch (ts.length) {
      case 0: return null;
      case 1: return rc[0];
      default: return rc;
    }
  },

  __addsub: function(repeat, topic, callback, context, more) {
    var rc= new Subcr(topic, callback, context, repeat, more);
    var me=this, tkns= topic.split('/');
    var node= _.reduce(tkns, function(memo, z) {
      return me.__dosub(memo,z);
    }, me.rootNode);

    this.allSubs[rc.id] = rc;
    node.subs.push(rc);

    return rc.id;
  },

  __unsub: function(node, tokens, pos, sub) {
    if (! echt(node)) { return; }
    if (pos < tokens.length) {
      var k= tokens[pos];
      var cn= node.parts[ k];
      this.__unsub(cn, tokens, pos+1, sub);
      if (_.isEmpty(cn.parts) && cn.subs.length === 0) {
        delete node.parts[ k];
      }
    } else {
      var me=this;
      _.find(node.subs, function(z,n) {
        if (z.id === sub.id) {
          delete me.allSubs[z.id];
          node.subs.splice(n,1);
          return true;
        }
        return false;
      });
    }
  },

  __dopub: function(status, topic, node, tokens, pos, msg) {
    if (! echt(node)) { return; }
    if (pos < tokens.length) {
      this.__dopub(status, topic, node.parts[ tokens[pos] ], tokens, pos+1, msg);
      this.__dopub(status, topic, node.parts['*'], tokens, pos+1,msg);
      this.__run(status, topic, node.parts['**'], msg);
    } else {
      this.__run(status, topic, node,msg);
    }
  },

  __run: function(status, topic, node, msg) {
    var cs= node ? node.subs : [];
    var me=this, purge=false;
    _.each(cs, function (z) {
      if (z.active && echt(z.action)) {
        z.action.apply(z.context, [topic, msg].concat(z.args));
        if (!z.repeat) {
          delete me.allSubs[z.id];
          z.active= false;
          z.action= null;
          purge=true;
        }
        status[0]= true;
      }
    });
    if (purge && cs.length > 0) {
      node.subs= _.filter(cs,function(z) {
        if (z.action) { return true; } else { return false; }
      });
    }
  },

  __dosub: function(node,token) {
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

global.ZotohLabs.EventBus = EventBus;

}).call(this);


