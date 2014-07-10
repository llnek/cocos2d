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
                                     SkaroJS= global.SkaroJS;

    // Event code Constants
var PROTOCOL_VERSION = 0x01,
CONNECT = 0x02,
RECONNECT = 0x03,
CONNECT_NOK = 0x06,
LOGIN = 0x08,
LOGOUT = 0x0a,
LOGIN_OK = 0x0b,
LOGIN_NOK = 0x0c,
LOGOUT_OK = 0x0e,
LOGOUT_NOK = 0x0f,
GAME_LIST = 0x10,
ROOM_LIST = 0x12,
GAMEROOM_JOIN = 0x14,
GAMEROOM_QUIT = 0x16,
GAMEROOM_JOIN_OK = 0x18,
GAMEROOM_JOIN_NOK = 0x19,
ANY = 0x00,
START = 0x1a, //server to client to start messaging.
STOP = 0x1b,  //messaging to stop.
SESSION_MSG = 0x1c, // from server or another session.
NETWORK_MSG = 0x1d, // from the current machine to remote server
CHANGE_ATTRIBUTE = 0x20,
DISCONNECT = 0x22,// close the websocket.
EXCEPTION = 0x24,

NOOP= function() {},

// 0=CONNECTING, 1=CONNECTED, 2=NOT CONNECTED, 3=CLOSED
S_NOT_CONNECTED = 2,
S_CONNECTED = 1,
S_CONNECTING = 0,
S_CLOSED= 3;

var Odin= {

  mkEvent : function(eventType, payload, session, date) {
    return {
      timeStamp : new Date().getTime(),
      type : eventType,
      source : payload,
      target: session
    };
  },

  mkLoginEvent : function (connKey,user,pwd) {
    return this.mkEvent(LOGIN, [connKey, user, pwd]);
  },

  reconnect : function(session, reconnPolicy, callback) {
    if (reconnPolicy) {
      reconnPolicy(session, callback);
    }
  },

  encode: function(e) {
    return JSON.stringify(e);
  },

  decode: function (e) {
    var evt = JSON.parse(e);
    if (!SkaroJS.echt(evt.type)) { throw new Error("Event object missing 'type' property."); }
    if (evt.type === NETWORK_MSG) {
      evt.type = SESSION_MSG;
    }
    return evt;
  },

  connect: function(url, callback, options) {
    return new Session(url,callback, options || {});
  },

  reconnetPolicies: function() {
    return {
      noReconnect : function (session, callback) { session.close() },
      reconnectOnce : function (session, callback) {
        session.reconnect(callback);
      }
    };
  }

};

var Session= SkaroJS.Class.xtends({

  ctor: function(url, callback, config) {
    this.reconnectKey= undef;
    this.onStart = callback;
    this.callbacks = {};
    this.options=config;
    this.state = S_CONNECTING;
    this.ws = this.wsock();
  },

  send : function(evt) {
    if (this.state === S_CONNECTED ||
        (this.state === S_NOT_CONNECTED && evt.type === RECONNECT)) {} else {
      throw new Error("Session is not in connected state");
    }
    this.ws.send( Odin.encode(evt) );
    return this;
  },

  addHandler : function(eventType, callback) {
    if (this.callbacks[eventType]) {} else {
      this.callbacks[eventType] = [];
    }
    this.callbacks[eventType].push(callback);
    return this;
  },

  removeHandler : function(eventType, handler) {
    SkaroJS.removeFromArray(this.callbacks[eventType], handler);
    return this;
  },

  clearHandlers : function () {
    this.onmessage = NOOP;
    this.onerror = NOOP;
    this.onclose = NOOP;
    this.callbacks = {};
    return this;
  },

  close : function () {
    this.state = S_CLOSED;
    this.ws.close();
    this.dispatch( Odin.mkEvent(CLOSED));
  },

  disconnect : function () {
    this.state = S_NOT_CONNECTED;
    this.ws.close();
  },

  reconnect : function (callback) {
    if (this.state !== S_NOT_CONNECTED) {
      throw new Error("Session is not in not-connected state. " +
                      "Cannot reconnect.");
    }
    this.onStart = callback;
    this.ws = this.wsock();
  },

  setState : function (newState) {
    this.state = newState
  },

  wsock : function() {
    var ws = new WebSocket(this.url),
    me=this;
    ws.onopen = function() {
      switch (me.state) {
        case S_NOT_CONNECTED:
          ws.send(me.getReconnect());
        break;
        case S_CONNECTING:
          ws.send(me.getLogin());
        break;
        default:
          var evt = Odin.mkEvent(EXCEPTION, "Cannot reconnect when session state is: " + me.state);
          //me.onerror(evt);
          me.dispatch(evt);
      }
    };

    // login to server when the start event is received
    // the callback will return the session.
    ws.onmessage = function (e) {
      var evt = Odin.decode(e.data);
      if (evt.type === GAMEROOM_JOIN_NOK ||
          evt.type === LOGIN_NOK ) {
        ws.close();
      }
      else
      if (evt.type === GAMEROOM_JOIN_OK) {
        if ( _.isString(evt.source)) {
          me.reconnectKey = evt.source;
        }
      }
      else
      if (evt.type === START) {
        if (_.isFunction(me.onStart)) {
          me.state = S_CONNECTED;
          me.applyProtocol(ws);
          me.onStart(me);
        }
      }
      else {
        SkaroJS.loggr.warn("unhandled event: " + evt.type);
      }
    };

    ws.onclose = function (e) {
      me.state = S_NOT_CONNECTED;
      me.dispatch(Odin.mkEvent(DISCONNECT, e, me));
    };

    ws.onerror = function (e) {
      me.state = S_NOT_CONNECTED;
      me.dispatch(Odin.mkEvent(EXCEPTION, e, me));
    };

    return ws;
  },

  dispatch : function (evt) {
    if (!SkaroJS.echt( evt.target)) {
      evt.target = this;
    }
    if (evt.type === SESSION_MSG) {
      this.onmessage(evt);
    }
    else
    if (evt.type === CLOSED){
      this.onclose(evt);
    }
    else
    if (evt.type === EXCEPTION) {
      this.onerror(evt);
    }
    this.dispatchToHandlers(this.callbacks[ANY], evt);
    this.dispatchToHandlers(this.callbacks[evt.type], evt);
  },

  dispatchToHandlers : function(chain, evt) {
    if (chain) {
      _.each(chain, function(z){ z(evt); });
    }
  },

  getLogin : function() {
    return Odin.encode( Odin.mkLoginEvent(this.options.connectionKey,
                                          this.options.user,
                                          this.options.passwd));
  },

  getReconnect : function() {
    if (!_.isString(this.reconnectKey)) {
      throw new Error("Session does not have reconnect key");
    }
    return Odin.encode(Odin.mkEvent(RECONNECT, this.reconnectKey));
  },

  applyProtocol : function(ws) {
    ws.onmessage = this.protocol.bind(this);
  },

  protocol: function(e) {
    this.dispatch( Odin.decode(e.data));
  },

  onevent: function(evt) {
    this.dispatch(evt);
  }

});


global.ZotohLab.Odin = Odin;

}).call(this);

