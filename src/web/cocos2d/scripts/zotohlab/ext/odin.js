/*??
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
 ??*/

(function(undef) { "use strict"; var global = this,
                                     _ = global._ ,
                                     SkaroJS= global.SkaroJS,
                                     EventBus= global.ZotohLab.EventBus;

// Event type
var NETWORK_MSG= 1,
    SESSION_MSG= 2;

// Event code
var PLAYREQ_NOK = 10,
    JOINREQ_NOK = 11,
    INVALID_USER= 12,
    INVALID_GAME= 13,
    INVALID_ROOM= 14,
    NO_MORE_ROOM= 15;

function mkPlayRequest(game,user,pwd) {
  return mkEvent(PLAYGAME_REQ, 0, [game, user, pwd]);
}

function mkJoinRequest(room,user,pwd) {
  return this.mkEvent(JOINGAME_REQ, 0, [room, user, pwd]);
}

function mkEvent(eventType, code, payload) {
  return {
    timeStamp : new Date().getTime(),
    type : eventType,
    code: code,
    source : payload
  };
}

function noop() {
}

function json_encode(e) {
  return JSON.stringify(e);
}

function json_decode(e) {
  var evt = {};
  try {
    evt= JSON.parse(e.data);
  } catch (e) {
    evt= {};
  }
  if (! _.has(evt, 'type')) {
    evt.type = -1;
  }
  if (! _.has(evt, 'code')) {
    evt.code = -1;
  }
  return evt;
}


var Session= SkaroJS.Class.xtends({

  ctor: function(url, callback, config) {
    this.state = S_NOT_CONNECTED;
    this.ebus= new EventBus();
    this.handlers= [];
    this.onStart = callback;
    this.options=config;
    this.ws = this.wsock();
  },

  send : function(evt) {
    if (this.state === S_CONNECTED) {
      this.ws.send( json_encode(evt));
    }
  },

  addHandler : function(eventType, code, callback, target) {
    var h= this.ebus.on("/"+eventType+"/"+code, callback, target);
    // store the handle ids for clean up
    this.handlers.concat(h);
    return h;
  },

  removeHandler : function(handler) {
    SkaroJS.removeFromArray(this.handlers, handler);
    this.ebus.off(handler);
  },

  clearHandlers : function () {
    this.onmessage = noop;
    this.onerror = noop;
    this.onclose = noop;
    this.handlers= [];
    this.ebus.removeAll();
  },

  close : function () {
    this.state = S_NOT_CONNECTED;
    this.ws.close();
    this.onevent( mkEvent(NETWORK_MSG, CLOSED));
  },

  disconnect : function () {
    this.close();
  },

  wsock : function() {
    var ws = new WebSocket(this.url),
    me=this;

    ws.onopen = function() {
      // login to play a game
      ws.send(me.getPlayGameReq());
    };

    ws.onmessage = function (e) {
      var evt = Odin.decode(e.data);
      switch (evt.type) {
        case INVALID_USER:
        case INVALID_GAME:
        case ROOM_UNAVAILABLE:
        case ROOM_FULL:
          SkaroJS.loggr.error("closing websocket: error " + evt.type);
          ws.close();
        break;
        case AWAIT_START:
        break;
        case START:
          me.onStart(evt);
        break;
        case POKE_MOVE:
          me.onMove(evt);
        break;
        case POKE_WAIT:
          me.onWait(evt);
        break;
        default:
        SkaroJS.loggr.warn("unhandled event: " + evt.type);
      }
    };

    ws.onclose = function (e) {
      me.state = S_NOT_CONNECTED;
      me.onevent(mkEvent(DISCONNECT, e, me));
    };

    ws.onerror = function (e) {
      me.state = S_NOT_CONNECTED;
      me.onevent(mkEvent(EXCEPTION, e, me));
    };

    return ws;
  },

  getPlayRequest: function() {
    return json_encode( mkPlayRequest(this.options.game,
                                      this.options.user,
                                      this.options.passwd));
  },

  onevent: function(evt) {
    this.ebus.fire("/"+evt.type+"/"+evt.code, evt);
  }

});


global.ZotohLab.Odin = {

  connect: function(url, callback, options) {
    return new Session(url, callback, options || {});
  }

};


}).call(this);

