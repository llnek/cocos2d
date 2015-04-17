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
// Copyright (c) 2013-2014, Ken Leung. All rights reserved.
 ??*/

define("zotohlab/asx/odin", ['cherimoia/skarojs',
                            'cherimoia/ebus',
                            'zotohlab/asterix'],
  function (sjs, EventBus, sh) { "use strict";

    var undef, Events = {

    // Msg type
    MSG_NETWORK           : 1,
    MSG_SESSION           : 2,

    PLAYGAME_REQ          : 3,
    JOINGAME_REQ          : 4,

    // Event code
    PLAYREQ_NOK         : 10,
    JOINREQ_NOK         : 11,
    USER_NOK            : 12,
    GAME_NOK            : 13,
    ROOM_NOK            : 14,
    ROOM_FILLED         : 15,
    ROOMS_FULL          : 16,

    PLAYREQ_OK          : 30,
    JOINREQ_OK          : 31,

    AWAIT_START         : 40,
    SYNC_ARENA          : 45,
    POKE_RUMBLE         : 46,

    RESTART             : 50,
    START               : 51,
    STOP                : 52,
    POKE_MOVE           : 53,
    POKE_WAIT           : 54,
    PLAY_MOVE           : 55,
    REPLAY              : 56,

    QUIT_GAME           : 60,

    PLAYER_JOINED       : 90,
    STARTED             : 95,
    CONNECTED           : 98,
    ERROR               : 99,
    CLOSED              : 100,

    S_NOT_CONNECTED       : 0,
    S_CONNECTED           : 1

    };

    //////////////////////////////////////////////////////////////////////////////
    //
    function mkEvent(eventType, code, payload) {
      return {
        timeStamp: sjs.now(),
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
      if (! sjs.hasKey(evt, 'type')) {
        evt.type= -1;
      }
      if (! sjs.hasKey(evt, 'code')) {
        evt.code= -1;
      }
      if (sjs.hasKey(evt, 'source') &&
          sjs.isString(evt.source)) {
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
        this.state= Events.S_NOT_CONNECTED;
        this.ebus= new EventBus();
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
        if (sjs.isArray(h) && h.length > 0) {
          // store the handle ids for clean up
          //this.handlers=this.handlers.concat(h);
          this.handlers.push(h[0]);
          return h[0];
        } else {
          return null;
        }
      },

      subscribeAll: function(callback,target) {
        return [ this.subscribe(Events.MSG_NETWORK, '*', callback, target),
                 this.subscribe(Events.MSG_SESSION, '*', callback, target) ];
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
        if (!!this.ws) {
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
            case Events.MSG_NETWORK:
            case Events.MSG_SESSION:
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
          me.onevent(mkEvent(Events.MSG_NETWORK, Events.CLOSED));
        };

        ws.onerror= function (e) {
          me.onevent(mkEvent(Events.MSG_NETWORK, Events.ERROR, e));
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


    return {
      newSession: function(cfg) { return new Session(cfg); },
      Events: Events
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

