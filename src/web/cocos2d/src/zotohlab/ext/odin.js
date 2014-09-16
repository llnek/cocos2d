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

(function(undef) { "use strict"; var global = this, _ = global._ ;

var sjs= global.SkaroJS,
Events = {

// Event type
NETWORK_MSG           : 1,
SESSION_MSG           : 2,

PLAYGAME_REQ          : 3,
JOINGAME_REQ          : 4,

// Event code
C_PLAYREQ_NOK         : 10,
C_JOINREQ_NOK         : 11,
C_USER_NOK            : 12,
C_GAME_NOK            : 13,
C_ROOM_NOK            : 14,
C_ROOM_FILLED         : 15,
C_ROOMS_FULL          : 16,

C_PLAYREQ_OK          : 30,
C_JOINREQ_OK          : 31,

C_AWAIT_START         : 40,
C_SYNC_ARENA          : 45,
C_POKE_RUMBLE         : 46,

C_RESTART             : 50,
C_START               : 51,
C_STOP                : 52,
C_POKE_MOVE           : 53,
C_POKE_WAIT           : 54,
C_PLAY_MOVE           : 55,
C_REPLAY              : 56,

C_PLAYER_JOINED       : 90,
C_STARTED             : 95,
C_CONNECTED           : 98,
C_ERROR               : 99,
C_CLOSED              : 100,

S_NOT_CONNECTED       : 0,
S_CONNECTED           : 1

};

//////////////////////////////////////////////////////////////////////////////
//
function mkEvent(eventType, code, payload) {
  return {
    timeStamp: _.now(),
    type: eventType,
    code: code,
    source: payload
  };
}

//////////////////////////////////////////////////////////////////////////////
//
function noop() {
}

//////////////////////////////////////////////////////////////////////////////
//
function mkPlayRequest(game,user,pwd) {
  return mkEvent(Events.PLAYGAME_REQ, -1, [game, user, pwd]);
}

//////////////////////////////////////////////////////////////////////////////
//
function mkJoinRequest(room,user,pwd) {
  return mkEvent(Events.JOINGAME_REQ, -1, [room, user, pwd]);
}

//////////////////////////////////////////////////////////////////////////////
//
function json_encode(e) {
  return JSON.stringify(e);
}

//////////////////////////////////////////////////////////////////////////////
//
function json_decode(e) {
  var src, evt = {};
  try {
    evt= JSON.parse(e.data);
  } catch (e) {
    evt= {};
  }
  if (! _.has(evt, 'type')) {
    evt.type= -1;
  }
  if (! _.has(evt, 'code')) {
    evt.code= -1;
  }
  if (_.has(evt, 'source') &&
      _.isString(evt.source)) {
    // assume json for now
    evt.source = JSON.parse(evt.source);
  }
  return evt;
}

//////////////////////////////////////////////////////////////////////////////
//
var Session= sjs.Class.xtends({

  connect: function(url) {
    this.wsock(url);
  },

  ctor: function(config) {
    this.ebus= global.ZotohLab.MakeEventBus();
    this.state= Events.S_NOT_CONNECTED;
    this.handlers= [];
    this.options=config;
    this.ws = null;
  },

  send: function(evt) {
    if (this.state === Events.S_CONNECTED &&
        sjs.echt(this.ws)) {
      this.ws.send( json_encode(evt));
    }
  },

  subscribe: function(eventType, code, callback, target) {
    var h= this.ebus.on(["/",eventType,"/",code].join(''),
                        callback, target);
    if (_.isArray(h) && h.length > 0) {
      // store the handle ids for clean up
      //this.handlers=this.handlers.concat(h);
      this.handlers.push(h[0]);
      return h[0];
    } else {
      return null;
    }
  },

  subscribeAll: function(callback,target) {
    return [ this.subscribe(Events.NETWORK_MSG, '*', callback, target),
             this.subscribe(Events.SESSION_MSG, '*', callback, target) ];
  },

  unsubscribeAll: function() {
    this.ebus.removeAll();
    this.handlers= [];
  },

  unsubscribe: function(subid) {
    sjs.removeFromArray(this.handlers, subid);
    this.ebus.off(subid);
  },

  reset: function () {
    this.onmessage= noop;
    this.onerror= noop;
    this.onclose= noop;
    this.handlers= [];
    this.ebus.removeAll();
  },

  close: function () {
    this.state= Events.S_NOT_CONNECTED;
    if (sjs.echt(this.ws)) {
      this.reset();
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
  },

  onSessionMsg: function(evt) {
  },

  wsock: function(url) {
    var ws= new WebSocket(url),
    me=this;

    ws.onopen= function() {
      me.state= Events.S_CONNECTED;
      ws.send(me.getPlayRequest());
    };

    ws.onmessage= function (e) {
      var evt= json_decode(e);
      switch (evt.type) {
        case Events.NETWORK_MSG:
        case Events.SESSION_MSG:
          me.onevent(evt);
        break;
        default:
          sjs.loggr.warn("unhandled event from server: " +
                         evt.type +
                         ", code = " +
                         evt.code);
      }
    };

    ws.onclose= function (e) {
      me.onevent(mkEvent(Events.NETWORK_MSG, Events.C_CLOSED));
    };

    ws.onerror= function (e) {
      me.onevent(mkEvent(Events.NETWORK_MSG, Events.C_ERROR, e));
    };

    return this.ws=ws;
  },

  getPlayRequest: function() {
    return json_encode( mkPlayRequest(this.options.game,
                                      this.options.user,
                                      this.options.passwd));
  },

  onevent: function(evt) {
    this.ebus.fire(["/",evt.type,"/",evt.code].join(''), evt);
  }

});


global.ZotohLab.Odin= {

  newSession: function(config) {
    return new Session(config);
  },

  Events: Events
};


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

