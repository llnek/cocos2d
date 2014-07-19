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
    SESSION_MSG= 2,
    PLAYGAME_REQ= 3,
    JOINGAME_REQ= 4;

// Event code
var C_PLAYREQ_NOK = 10,
    C_JOINREQ_NOK = 11,
    C_INVALID_USER= 12,
    C_INVALID_GAME= 13,
    C_INVALID_ROOM= 14,
    C_ROOM_FILLED= 15,
    C_ROOMS_FULL=16,
    C_EXCEPTION= 100,
    C_CLOSED= 100;

var S_NOT_CONNECTED= 0,
    S_CONNECTED=1;

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

function mkPlayRequest(game,user,pwd) {
  return mkEvent(PLAYGAME_REQ, 0, [game, user, pwd]);
}

function mkJoinRequest(room,user,pwd) {
  return this.mkEvent(JOINGAME_REQ, 0, [room, user, pwd]);
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

  send: function(evt) {
    if (this.state === S_CONNECTED) {
      this.ws.send( json_encode(evt));
    }
  },

  addHandler: function(eventType, code, callback, target) {
    var h= this.ebus.on("/"+eventType+"/"+code, callback, target);
    // store the handle ids for clean up
    this.handlers=this.handlers.concat(h);
    return h;
  },

  removeHandler: function(handler) {
    SkaroJS.removeFromArray(this.handlers, handler);
    this.ebus.off(handler);
  },

  clearHandlers: function () {
    this.onmessage = noop;
    this.onerror = noop;
    this.onclose = noop;
    this.handlers= [];
    this.ebus.removeAll();
  },

  close: function () {
    SkaroJS.loggr.error("closing websocket: " + this.ws);
    this.state = S_NOT_CONNECTED;
    this.ws.close();
  },

  disconnect: function () {
    this.close();
  },

  onNetworkMsg: function(evt) {
    switch (evt.code) {
      default:
    }
  },

  onSessionMsg: function(evt) {
    switch (evt.code) {
      case C_INVALID_USER:
      case C_INVALID_GAME:
      case C_ROOMS_FULL:
      case C_ROOM_FILLED:
        me.close();
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
      SkaroJS.loggr.warn("unhandled event/code: " + evt.type);
    }
  },

  wsock: function() {
    var ws = new WebSocket(this.url),
    me=this;

    ws.onopen = function() {
      ws.send(me.getPlayGameReq());
    };

    ws.onmessage = function (e) {
      var evt = json_decode(e);
      switch (evt.type) {
        case NETWORK_MSG:
          me.onNetworkMsg(evt);
        break;
        case SESSION_MSG:
          me.onSessionMsg(evt);
        break;
        default:
          SkaroJS.loggr.warn("unhandled event from server: " +
                             evt.type +
                             ", code = " +
                             evt.code);
      }
    };

    ws.onclose = function (e) {
      me.onevent(mkEvent(NETWORK_MSG, C_CLOSED));
      me.ws=null;
    };

    ws.onerror = function (e) {
      me.state = S_NOT_CONNECTED;
      me.onevent(mkEvent(NETWORK_MSG, C_EXCEPTION, e));
      mw.ws=null;
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

