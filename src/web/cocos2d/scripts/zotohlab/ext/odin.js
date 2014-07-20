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
var PLAYGAME_REQ          = 1,
    JOINGAME_REQ          = 2,
    NETWORK_MSG           = 3,
    SESSION_MSG           = 4;

// Event code
var C_PLAYREQ_NOK         = 10,
    C_JOINREQ_NOK         = 11,
    C_USER_NOK            = 12,
    C_GAME_NOK            = 13,
    C_ROOM_NOK            = 14,
    C_ROOM_FILLED         = 15,
    C_ROOMS_FULL          = 16,

    C_AWAIT_START         = 50,
    C_START               = 51,
    C_STOP                = 52,
    C_POKE_MOVE           = 53,
    C_POKE_WAIT           = 54,

    C_ERROR               = 99,
    C_CLOSED              = 100;

var S_NOT_CONNECTED       = 0,
    S_CONNECTED           = 1;

//////////////////////////////////////////////////////////////////////////////
//
function mkEvent(eventType, code, payload) {
  return {
    timeStamp : new Date().getTime(),
    type : eventType,
    code: code,
    source : payload
  };
}

//////////////////////////////////////////////////////////////////////////////
//
function noop() {
}

//////////////////////////////////////////////////////////////////////////////
//
function mkPlayRequest(game,user,pwd) {
  return mkEvent(PLAYGAME_REQ, -1, [game, user, pwd]);
}

function mkJoinRequest(room,user,pwd) {
  return mkEvent(JOINGAME_REQ, -1, [room, user, pwd]);
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

  connect: function(url) {
    this.ws= wock(url);
  },

  ctor: function(config) {
    this.state = S_NOT_CONNECTED;
    this.ebus= new EventBus();
    this.handlers= [];
    this.options=config;
    this.ws = null;
  },

  send: function(evt) {
    if (this.state === S_CONNECTED &&
        this.ws) {
      this.ws.send( json_encode(evt));
    }
  },

  subscribe: function(eventType, code, callback, target) {
    var h= this.ebus.on("/"+eventType+"/"+code, callback, target);
    if (h && h.length > 0) {
      // store the handle ids for clean up
      //this.handlers=this.handlers.concat(h);
      this.handlers.push(h[0]);
      return h[0];
    } else {
      return null;
    }
  },

  unsubscribe: function(subid) {
    SkaroJS.removeFromArray(this.handlers, subid);
    this.ebus.off(subid);
  },

  reset: function () {
    this.onmessage = noop;
    this.onerror = noop;
    this.onclose = noop;
    this.handlers= [];
    this.ebus.removeAll();
  },

  close: function () {
    this.state = S_NOT_CONNECTED;
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e)
      {}
    }
    this.ws= null;
  },

  disconnect: function () {
    this.close();
  },

  onNetworkMsg: function(evt) {
    switch (evt.code) {
      case C_CLOSED:
      break;
      default:
      SkaroJS.loggr.warn("unhandled network event/code: " + evt.code);
    }
  },

  onSessionMsg: function(evt) {
    switch (evt.code) {
      case C_ROOM_FILLED:
      case C_ROOMS_FULL:
      case C_USER_NOK:
      case C_GAME_NOK:
      case C_AWAIT_START:
      case C_START:
      case C_STOP:
      case C_POKE_MOVE:
      case C_POKE_WAIT:
      break;
        this.onevent(evt);
      default:
      SkaroJS.loggr.warn("unhandled session event/code: " + evt.code);
    }
  },

  wsock: function(url) {
    var ws = new WebSocket(url),
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
    };

    ws.onerror = function (e) {
      me.onevent(mkEvent(NETWORK_MSG, C_ERROR, e));
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

  newSession: function(config) {
    return new Session(config);
  },

};


}).call(this);

