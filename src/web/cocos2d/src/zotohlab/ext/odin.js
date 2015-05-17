// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires cherimoia/ebus
 * @requires zotohlab/asterix
 * @module zotohlab/asx/odin
 */
define("zotohlab/asx/odin",

       ['cherimoia/skarojs',
        'cherimoia/ebus',
        'zotohlab/asterix'],

  function (sjs, ebus, sh) { "use strict";

    /** @alias module:zotohlab/asx/odin */
    var exports={},
    evts,
    undef;

    /**
     * @enum {Number}
     * @readonly
     */
    exports.Events = {

      // Msg types

      MSG_NETWORK           : 1,
      MSG_SESSION           : 2,

      PLAYGAME_REQ          : 3,
      JOINGAME_REQ          : 4,

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

    // make a local reference
    evts= exports.Events;

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
    function mkPlayRequest(game,user,pwd) {
      return mkEvent(evts.PLAYGAME_REQ, -1, [game, user, pwd]);
    }

    //////////////////////////////////////////////////////////////////////////////
    //
    function mkJoinRequest(room,user,pwd) {
      return mkEvent(evts.JOINGAME_REQ, -1, [room, user, pwd]);
    }

    //////////////////////////////////////////////////////////////////////////////
    //
    function json_decode(e) {
      var evt = {},
      src;

      try {
        evt= sjs.jsonDecode(e.data);
      } catch (e) {
      }

      if (! sjs.hasKey(evt, 'type')) {
        evt.type= -1;
      }
      if (! sjs.hasKey(evt, 'code')) {
        evt.code= -1;
      }

      if (sjs.hasKey(evt, 'source') &&
          sjs.isString(evt.source)) {
        evt.source = sjs.jsonDecode(evt.source);
      }

      return evt;
    }

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class Session
     */
    var Session= sjs.mixes({

      /**
       * Connect to this url and request a websocket upgrade.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method connect
       * @param {String} url
       */
      connect: function(url) {
        this.wsock(url);
      },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method ctor
       * @param {Object} config
       */
      ctor: function(config) {
        this.state= evts.S_NOT_CONNECTED;
        this.ebus= ebus.reify();
        this.options=config || {};
        this.handlers= [];
        this.ws = null;
      },

      /**
       * Send this event through the socket.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method send
       * @param {Object} evt
       */
      send: function(evt) {
        if (this.state === evts.S_CONNECTED &&
            sjs.echt(this.ws)) {
          this.ws.send( sjs.jsonEncode(evt));
        }
      },

      /**
       * Subscribe to this message-type and event.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method subscribe
       * @param {Number} messageType
       * @param {Number} event
       * @param {Function} callback
       * @param {Object} target
       * @return {String} handler id
       */
      subscribe: function(messageType, event, callback, target) {
        var h= this.ebus.on(["/", messageType, "/", event].join(''),
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

      /**
       * Subscribe to all message events.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method subscribeAll
       * @param {Function} callback
       * @param {Object} target
       * @return {Array} [id1, id2]
       */
      subscribeAll: function(callback,target) {
        return [ this.subscribe(evts.MSG_NETWORK, '*', callback, target),
                 this.subscribe(evts.MSG_SESSION, '*', callback, target) ];
      },

      /**
       * Cancel and remove all subscribers.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method unsubscribeAll
       */
      unsubscribeAll: function() {
        this.ebus.removeAll();
        this.handlers= [];
      },

      /**
       * Cancel this subscriber.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method unsubscribe
       * @param {String} subid
       */
      unsubscribe: function(subid) {
        sjs.removeFromArray(this.handlers, subid);
        this.ebus.off(subid);
      },

      /**
       * Reset and clear everything.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method reset
       */
      reset: function () {
        this.onmessage= sjs.NILFUNC;
        this.onerror= sjs.NILFUNC;
        this.onclose= sjs.NILFUNC;
        this.handlers= [];
        this.ebus.removeAll();
      },

      /**
       * Close the connection to the socket.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method close
       */
      close: function () {
        this.state= evts.S_NOT_CONNECTED;
        this.reset();
        if (!!this.ws) {
          try {
            this.ws.close();
          } catch (e)
          {}
        }
        this.ws= null;
      },

      /**
       * Disconnect from the socket.
       *
       * @memberof module:zotohlab/asx/odin~Session
       * @method disconnect
       */
      disconnect: function () {
        this.close();
      },

      /**
       * @private
       */
      onNetworkMsg: function(evt) {
      },

      /**
       * @private
       */
      onSessionMsg: function(evt) {
      },

      /**
       * @private
       */
      wsock: function(url) {
        var ws= new WebSocket(url),
        me=this;

        // connection success
        // send the play game request
        ws.onopen= function() {
          me.state= evts.S_CONNECTED;
          ws.send(me.getPlayRequest());
        };

        ws.onmessage= function (e) {
          var evt= json_decode(e);
          switch (evt.type) {
            case evts.MSG_NETWORK:
            case evts.MSG_SESSION:
              me.onevent(evt);
            break;
            default:
              sjs.loggr.warn("unhandled server event: " +
                             evt.type +
                             ", code = " +
                             evt.code);
          }
        };

        ws.onclose= function (e) {
          sjs.loggr.debug("closing websocket.");
        };

        ws.onerror= function (e) {
          sjs.loggr.debug("websocket error.\n" + e);
        };

        return this.ws=ws;
      },

      /**
       * @private
       */
      getPlayRequest: function() {
        return sjs.jsonEncode( mkPlayRequest(this.options.game,
                                          this.options.user,
                                          this.options.passwd));
      },

      /**
       * @private
       */
      onevent: function(evt) {
        this.ebus.fire(["/",evt.type,"/",evt.code].join(''), evt);
      }

    });

    /**
     * @method reifySession
     * @static
     * @param {Object} cfg
     * @return {Session}
     */
    exports.reifySession= function(cfg) { return new Session(cfg); };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

