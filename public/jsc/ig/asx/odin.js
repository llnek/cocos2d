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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires cherimoia/ebus
              * @module zotohlab/asx/odin
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ebus = require('cherimoia/ebus');

var _ebus2 = _interopRequireDefault(_ebus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////////////
/** @alias module:zotohlab/asx/odin */
var xbox = {},
    sjs = _asterix2.default.skarojs,
    evts = void 0,
    undef = void 0;

/**
 * @enum {Number}
 * @readonly
 */
xbox.Events = {

  // Msg types

  MSG_NETWORK: 1,
  MSG_SESSION: 2,

  PLAYGAME_REQ: 3,
  JOINGAME_REQ: 4,

  PLAYREQ_NOK: 10,
  JOINREQ_NOK: 11,
  USER_NOK: 12,
  GAME_NOK: 13,
  ROOM_NOK: 14,
  ROOM_FILLED: 15,
  ROOMS_FULL: 16,

  PLAYREQ_OK: 30,
  JOINREQ_OK: 31,

  AWAIT_START: 40,
  SYNC_ARENA: 45,
  POKE_RUMBLE: 46,

  RESTART: 50,
  START: 51,
  STOP: 52,
  POKE_MOVE: 53,
  POKE_WAIT: 54,
  PLAY_MOVE: 55,
  REPLAY: 56,

  QUIT_GAME: 60,

  PLAYER_JOINED: 90,
  STARTED: 95,
  CONNECTED: 98,
  ERROR: 99,
  CLOSED: 100,

  S_NOT_CONNECTED: 0,
  S_CONNECTED: 1

};

// make a local reference
evts = xbox.Events;

//////////////////////////////////////////////////////////////////////////////
var mkEvent = function mkEvent(eventType, code, payload) {
  return {
    timeStamp: sjs.now(),
    type: eventType,
    code: code,
    source: payload
  };
};

//////////////////////////////////////////////////////////////////////////////
var mkPlayRequest = function mkPlayRequest(game, user, pwd) {
  return mkEvent(evts.PLAYGAME_REQ, -1, [game, user, pwd]);
};

//////////////////////////////////////////////////////////////////////////////
var mkJoinRequest = function mkJoinRequest(room, user, pwd) {
  return mkEvent(evts.JOINGAME_REQ, -1, [room, user, pwd]);
};

//////////////////////////////////////////////////////////////////////////////
var json_decode = function json_decode(e) {
  var evt = {},
      src = void 0;

  try {
    evt = sjs.objectfy(e.data);
  } catch (e) {}

  if (!sjs.hasKey(evt, 'type')) {
    evt.type = -1;
  }
  if (!sjs.hasKey(evt, 'code')) {
    evt.code = -1;
  }

  if (sjs.hasKey(evt, 'source') && sjs.isstr(evt.source)) {
    evt.source = sjs.objectfy(evt.source);
  }

  return evt;
};

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Session
 */

var Session = function (_sjs$ES6Claxx) {
  _inherits(Session, _sjs$ES6Claxx);

  _createClass(Session, [{
    key: 'connect',


    /**
     * Connect to this url and request a websocket upgrade.
     * @memberof module:zotohlab/asx/odin~Session
     * @method connect
     * @param {String} url
     */
    value: function connect(url) {
      this.wsock(url);
    }

    /**
     * @memberof module:zotohlab/asx/odin~Session
     * @method constructor
     * @param {Object} config
     */

  }]);

  function Session(config) {
    _classCallCheck(this, Session);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Session).call(this));

    _this.state = evts.S_NOT_CONNECTED;
    _this.options = config || {};
    _this.ebus = _ebus2.default.reifyRvBus();
    _this.handlers = [];
    _this.ws = null;
    return _this;
  }

  /**
   * Send this event through the socket.
   * @memberof module:zotohlab/asx/odin~Session
   * @method send
   * @param {Object} evt
   */


  _createClass(Session, [{
    key: 'send',
    value: function send(evt) {
      if (this.state === evts.S_CONNECTED && sjs.echt(this.ws)) {
        this.ws.send(sjs.jsonfy(evt));
      }
    }

    /**
     * Listen to this message-type and event.
     * @memberof module:zotohlab/asx/odin~Session
     * @method listen
     * @param {Number} messageType
     * @param {Number} event
     * @param {Function} callback
     * @param {Object} target
     * @return {String} handler id
     */

  }, {
    key: 'listen',
    value: function listen(messageType, event, callback, target) {
      var h = this.ebus.on(["/", messageType, "/", event].join(''), callback, target);
      if (sjs.isarr(h) && h.length > 0) {
        // store the handle ids for clean up
        //this.handlers=this.handlers.concat(h);
        this.handlers.push(h[0]);
        return h[0];
      } else {
        return null;
      }
    }

    /**
     * Listen to all message events.
     * @memberof module:zotohlab/asx/odin~Session
     * @method listenAll
     * @param {Function} callback
     * @param {Object} target
     * @return {Array} [id1, id2]
     */

  }, {
    key: 'listenAll',
    value: function listenAll(callback, target) {
      return [this.listen(evts.MSG_NETWORK, '*', callback, target), this.listen(evts.MSG_SESSION, '*', callback, target)];
    }

    /**
     * Cancel and remove all subscribers.
     * @memberof module:zotohlab/asx/odin~Session
     * @method cancelAll
     */

  }, {
    key: 'cancelAll',
    value: function cancelAll() {
      this.ebus.removeAll();
      this.handlers = [];
    }

    /**
     * Cancel this subscriber.
     * @memberof module:zotohlab/asx/odin~Session
     * @method cancel
     * @param {String} subid
     */

  }, {
    key: 'cancel',
    value: function cancel(subid) {
      sjs.removeFromArray(this.handlers, subid);
      this.ebus.off(subid);
    }

    /**
     * Reset and clear everything.
     * @memberof module:zotohlab/asx/odin~Session
     * @method reset
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.onmessage = sjs.NILFUNC;
      this.onerror = sjs.NILFUNC;
      this.onclose = sjs.NILFUNC;
      this.handlers = [];
      this.ebus.removeAll();
    }

    /**
     * Close the connection to the socket.
     * @memberof module:zotohlab/asx/odin~Session
     * @method close
     */

  }, {
    key: 'close',
    value: function close() {
      this.state = evts.S_NOT_CONNECTED;
      this.reset();
      if (!!this.ws) {
        try {
          this.ws.close();
        } catch (e) {}
      }
      this.ws = null;
    }

    /**
     * Disconnect from the socket.
     * @memberof module:zotohlab/asx/odin~Session
     * @method disconnect
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.close();
    }

    /**
     * @private
     */

  }, {
    key: 'onNetworkMsg',
    value: function onNetworkMsg(evt) {}

    /**
     * @private
     */

  }, {
    key: 'onSessionMsg',
    value: function onSessionMsg(evt) {}

    /**
     * @private
     */

  }, {
    key: 'wsock',
    value: function wsock(url) {
      var ws = new WebSocket(url),
          me = this;

      // connection success
      // send the play game request
      ws.onopen = function () {
        me.state = evts.S_CONNECTED;
        ws.send(me.getPlayRequest());
      };

      ws.onmessage = function (e) {
        var evt = json_decode(e);
        switch (evt.type) {
          case evts.MSG_NETWORK:
          case evts.MSG_SESSION:
            me.onevent(evt);
            break;
          default:
            sjs.loggr.warn("unhandled server event: " + evt.type + ", code = " + evt.code);
        }
      };

      ws.onclose = function (e) {
        sjs.loggr.debug("closing websocket.");
      };

      ws.onerror = function (e) {
        sjs.loggr.debug("websocket error.\n" + e);
      };

      return this.ws = ws;
    }

    /**
     * @private
     */

  }, {
    key: 'getPlayRequest',
    value: function getPlayRequest() {
      return sjs.jsonfy(mkPlayRequest(this.options.game, this.options.user, this.options.passwd));
    }

    /**
     * @private
     */

  }, {
    key: 'onevent',
    value: function onevent(evt) {
      this.ebus.fire(["/", evt.type, "/", evt.code].join(''), evt);
    }
  }]);

  return Session;
}(sjs.ES6Claxx);

/**
 * @method reifySession
 * @param {Object} cfg
 * @return {Session}
 */


xbox.reifySession = function (cfg) {
  return new Session(cfg);
};
sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF