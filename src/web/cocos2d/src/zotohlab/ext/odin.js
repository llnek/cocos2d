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
 * @requires cherimoia/skarojs, cherimoia/ebus, zotohlab/asterix
 * @module zotohlab/asx/odin
 */
define("zotohlab/asx/odin",

       ['cherimoia/skarojs',
        'cherimoia/ebus',
        'zotohlab/asterix'],


  function (sjs, EventBus, sh) { "use strict";

    /**
     * @class Events
     * @static
     */
    var Events = {

    // Msg types

    /**
     * @property MSG_NETWORK
     * @final
     * @type Number
     */
    MSG_NETWORK           : 1,

    /**
     * @property MSG_SESSION
     * @type Number
     * @final
     */
    MSG_SESSION           : 2,

    /**
     * @property PLAYGAME_REQ
     * @final
     * @type Number
     */
    PLAYGAME_REQ          : 3,

    /**
     * @property JOINGAME_REQ
     * @final
     * @type Number
     */
    JOINGAME_REQ          : 4,

    // Event code

    /**
     * @property PLAYREQ_NOK
     * @final
     * @type Number
     */
    PLAYREQ_NOK         : 10,

    /**
     * @property JOINREQ_NOK
     * @final
     * @type Number
     */
    JOINREQ_NOK         : 11,

    /**
     * @property USER_NOK
     * @type Number
     * @final
     */
    USER_NOK            : 12,


    /**
     * @property GAME_NOK
     * @final
     * @type Number
     */
    GAME_NOK            : 13,

    /**
     * @property ROOM_NOK
     * @type Number
     * @final
     */
    ROOM_NOK            : 14,

    /**
     * @property ROOM_FILLED
     * @final
     * @type Number
     */
    ROOM_FILLED         : 15,

    /**
     * @property ROOMS_FULL
     * @final
     * @type Number
     */
    ROOMS_FULL          : 16,

    /**
     * @property PLAYREQ_OK
     * @type Number
     * @final
     */
    PLAYREQ_OK          : 30,

    /**
     * @property JOINREQ_OK
     * @final
     * @type Number
     */
    JOINREQ_OK          : 31,

    /**
     * @property AWAIT_START
     * @final
     * @type Number
     */
    AWAIT_START         : 40,

    /**
     * @property SYNC_ARENA
     * @type Number
     * @final
     */
    SYNC_ARENA          : 45,

    /**
     * @property POKE_RUMBLE
     * @final
     * @type Number
     */
    POKE_RUMBLE         : 46,

    /**
     * @property RESTART
     * @type Number
     * @final
     */
    RESTART             : 50,

    /**
     * @property START
     * @type Number
     * @final
     */
    START               : 51,

    /**
     * @property STOP
     * @final
     * @type Number
     */
    STOP                : 52,

    /**
     * @property POKE_MOVE
     * @type Number
     * @final
     */
    POKE_MOVE           : 53,

    /**
     * @property POKE_WAIT
     * @final
     * @type Number
     */
    POKE_WAIT           : 54,

    /**
     * @property PLAY_MOVE
     * @final
     * @type Number
     */
    PLAY_MOVE           : 55,

    /**
     * @property REPLAY
     * @type Number
     * @final
     */
    REPLAY              : 56,

    /**
     * @property QUIT_GAME
     * @final
     * @type Number
     */
    QUIT_GAME           : 60,

    /**
     * @property PLAYER_JOINED
     * @final
     * @type Number
     */
    PLAYER_JOINED       : 90,

    /**
     * @property STARTED
     * @final
     * @type Number
     */
    STARTED             : 95,

    /**
     * @property CONNECTED
     * @final
     * @type Number
     */
    CONNECTED           : 98,

    /**
     * @property ERROR
     * @type Number
     * @final
     */
    ERROR               : 99,

    /**
     * @property CLOSED
     * @final
     * @type Number
     */
    CLOSED              : 100,

    /**
     * @property S_NOT_CONNECTED
     * @type Number
     * @final
     */
    S_NOT_CONNECTED       : 0,

    /**
     * @property S_CONNECTED
     * @final
     * @type Number
     */
    S_CONNECTED           : 1

    },

    undef;

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
    /**
     * @class Session
     */
    var Session= sjs.Class.xtends({

      /**
       * Connect to this url and request a websocket upgrade.
       *
       * @method connect
       * @param {String} url
       */
      connect: function(url) {
        this.wsock(url);
      },

      /**
       * @constructor
       * @param {Object} config
       */
      ctor: function(config) {
        this.state= Events.S_NOT_CONNECTED;
        this.ebus= EventBus.reify();
        this.options=config || {};
        this.handlers= [];
        this.ws = null;
      },

      /**
       * Send this event through the socket.
       *
       * @method send
       * @param {Object} evt
       */
      send: function(evt) {
        if (this.state === Events.S_CONNECTED &&
            sjs.echt(this.ws)) {
          this.ws.send( json_encode(evt));
        }
      },

      /**
       * Subscribe to this message-type and event.
       *
       * @method subscribe
       * @param {Number} messageType
       * @param {Number} event
       * @param {Function} callback
       * @param {Object} target
       * @return {String} handler id.
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
       * @method subscribeAll
       * @param {Function} callback
       * @param {Object} target
       * @return {Array} [id1, id2]
       */
      subscribeAll: function(callback,target) {
        return [ this.subscribe(Events.MSG_NETWORK, '*', callback, target),
                 this.subscribe(Events.MSG_SESSION, '*', callback, target) ];
      },

      /**
       * Cancel and remove all subscribers.
       *
       * @method unsubscribeAll
       */
      unsubscribeAll: function() {
        this.ebus.removeAll();
        this.handlers= [];
      },

      /**
       * Cancel this subscriber.
       *
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
       * @method reset
       */
      reset: function () {
        this.onmessage= noop;
        this.onerror= noop;
        this.onclose= noop;
        this.handlers= [];
        this.ebus.removeAll();
      },

      /**
       * Close the connection to the socket.
       *
       * @method close
       */
      close: function () {
        this.state= Events.S_NOT_CONNECTED;
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
          sjs.loggr.debug("closing websocket.");
        };

        ws.onerror= function (e) {
          sjs.loggr.debug("websocket encountered an error.\n" + e);
        };

        return this.ws=ws;
      },

      /**
       * @private
       */
      getPlayRequest: function() {
        return json_encode( mkPlayRequest(this.options.game,
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

    return {
      newSession: function(cfg) { return new Session(cfg); },
      Events: Events
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

