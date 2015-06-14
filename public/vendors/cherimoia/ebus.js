define("cherimoia/ebus", ["exports", "cherimoia/skaro"], function (exports, _cherimoiaSkaro) {
  // This library is distributed in  the hope that it will be useful but without
  // any  warranty; without  even  the  implied  warranty of  merchantability or
  // fitness for a particular purpose.
  // The use and distribution terms for this software are covered by the Eclipse
  // Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
  // can be found in the file epl-v10.html at the root of this distribution.
  // By using this software in any  fashion, you are agreeing to be bound by the
  // terms of this license. You  must not remove this notice, or any other, from
  // this software.
  // Copyright (c) 2013-2015 Ken Leung. All rights reserved.

  "use strict";
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  /**
  * @requires cherimoia/skaro
  * @module cherimoia/ebus
  */

  var _sjs = _interopRequireDefault(_cherimoiaSkaro);

  var R = _sjs["default"].ramda,
      undef = undefined,
      _SEED = 0;

  //////////////////////////////////////////////////////////////////////////////
  var mkSubSCR = function mkSubSCR(topic, selector, context, repeat, args) {
    return {
      target: !!context ? context : null,
      id: "sub#" + Number(++_SEED),
      repeat: _sjs["default"].boolify(repeat),
      args: args || [],
      action: selector,
      topic: topic,
      active: true
    };
  };

  //////////////////////////////////////////////////////////////////////////////
  var mkTreeNode = function mkTreeNode(root) {
    return root ? { tree: {} } : {
      tree: {}, // children - branches
      subs: [] // subscribers
    };
  };

  //////////////////////////////////////////////////////////////////////////////
  var _listen = function _listen(repeat, topics, selector, target, more) {
    var _this = this;

    var ts = topics.trim().split(/\s+/),

    // for each topic, subscribe to it.
    rc = R.map(function (t) {
      return _addSub.call(_this, repeat, t, selector, target, more);
    }, ts);
    return R.reject(function (z) {
      return z.length === 0;
    }, rc);
  };

  //////////////////////////////////////////////////////////////////////////////
  var _doSub = function _doSub(node, token) {
    if (!_sjs["default"].hasKey(node.tree, token)) {
      node.tree[token] = mkTreeNode();
    }
    return node.tree[token];
  };

  //////////////////////////////////////////////////////////////////////////////
  var _addSub = function _addSub(repeat, topic, selector, target, more) {
    var tkns = this.splitTopic(topic),
        rcid = "";
    if (tkns.length > 0) {
      var rc = mkSubSCR(topic, selector, target, repeat, more),
          node = R.reduce(function (memo, z) {
        return _doSub(memo, z);
      }, this.root, tkns);

      this.subs[rc.id] = rc;
      node.subs.push(rc);
      rcid = rc.id;
    }
    return rcid;
  };

  //////////////////////////////////////////////////////////////////////////////
  var _unSub = function _unSub(node, tokens, pos, sub) {
    var _this2 = this;

    if (!_sjs["default"].echt(node)) {
      return;
    }
    if (pos < tokens.length) {
      var k = tokens[pos],
          cn = node.tree[k];
      _unSub.call(this, cn, tokens, pos + 1, sub);
      if (R.keys(cn.tree).length === 0 && cn.subs.length === 0) {
        delete node.tree[k];
      }
    } else {
      pos = -1;
      R.find(function (z) {
        pos += 1;
        if (z.id === sub.id) {
          delete _this2.subs[z.id];
          node.subs.splice(pos, 1);
          return true;
        }
      }, node.subs);
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  var _doPub = function _doPub(topic, node, tokens, pos, msg) {
    if (!_sjs["default"].echt(node)) {
      return false;
    }
    var rc = false;
    if (pos < tokens.length) {
      rc = rc || _doPub.call(this, topic, node.tree[tokens[pos]], tokens, pos + 1, msg);
      rc = rc || _doPub.call(this, topic, node.tree["*"], tokens, pos + 1, msg);
    } else {
      rc = rc || _run.call(this, topic, node, msg);
    }
    return rc;
  };

  //////////////////////////////////////////////////////////////////////////////
  var _run = function _run(topic, node, msg) {
    var _this3 = this;

    var cs = !!node ? node.subs : [];
    var purge = false,
        rc = false;

    R.forEach(function (z) {
      if (z.active && _sjs["default"].echt(z.action)) {
        // pass along any extra parameters, if any.
        z.action.apply(z.target, [msg, topic].concat(z.args));
        // if once only, kill it.
        if (!z.repeat) {
          delete _this3.subs[z.id];
          z.active = false;
          z.action = null;
          purge = true;
        }
        rc = true;
      }
    }, cs);

    // get rid of unwanted ones, and reassign new set to the node.
    if (purge && cs.length > 0) {
      node.subs = R.filter(function (z) {
        return z.action ? true : false;
      }, cs);
    }

    return rc;
  };

  //////////////////////////////////////////////////////////////////////////////
  /** @class RvBus */

  var RvBus = (function (_sjs$ES6Claxx) {

    /**
     * @method constructor
     * @private
     */

    function RvBus() {
      _classCallCheck(this, RvBus);

      _get(Object.getPrototypeOf(RvBus.prototype), "constructor", this).call(this);
      this.iniz();
    }

    _inherits(RvBus, _sjs$ES6Claxx);

    _createClass(RvBus, [{
      key: "once",

      /**
       * Subscribe to 1+ topics, returning a list of subscriber handles.
       * topics => "/hello/*  /goodbye/*"
       * @memberof module:cherimoia/ebus~RvBus
       * @method once
       * @param {String} topics - space separated if more than one.
       * @param {Function} selector
       * @param {Object} target
       * @return {Array.String} - subscription ids
       */
      value: function once(topics, selector, target /*, more args */) {
        var rc = _listen.call(this, false, topics, selector, target, _sjs["default"].dropArgs(arguments, 3));
        return _sjs["default"].echt(rc) ? rc : [];
      }
    }, {
      key: "on",

      /**
       * subscribe to 1+ topics, returning a list of subscriber handles.
       * topics => "/hello/*  /goodbye/*"
       * @memberof module:cherimoia/ebus~RvBus
       * @method on
       * @param {String} topics - space separated if more than one.
       * @param {Function} selector
       * @param {Object} target
       * @return {Array.String} - subscription ids.
       */
      value: function on(topics, selector, target /*, more args */) {
        var rc = _listen.call(this, true, topics, selector, target, _sjs["default"].dropArgs(arguments, 3));
        return _sjs["default"].echt(rc) ? rc : [];
      }
    }, {
      key: "fire",

      /**
       * Trigger event on this topic.
       * @memberof module:cherimoia/ebus~RvBus
       * @method fire
       * @param {String} topic
       * @param {Object} msg
       * @return {Boolean}
       */
      value: function fire(topic, msg) {
        var tokens = this.splitTopic(topic),
            rc = false;
        if (tokens.length > 0) {
          rc = _doPub.call(this, topic, this.root, tokens, 0, msg || {});
        }
        return rc;
      }
    }, {
      key: "splitTopic",

      /**
       * @method splitTopic
       * @protected
       */
      value: function splitTopic(topic) {
        return _sjs["default"].safeSplit(topic, "/");
      }
    }, {
      key: "resume",

      /**
       * Resume actions on this handle.
       * @memberof module:cherimoia/ebus~RvBus
       * @method resume
       * @param {Object} - handler id
       */
      value: function resume(handle) {
        var sub = this.subs[handle];
        if (!!sub) {
          sub.active = true;
        }
      }
    }, {
      key: "pause",

      /**
       * Pause actions on this handle.
       * @memberof module:cherimoia/ebus~RvBus
       * @method pause
       * @param {Object} - handler id
       */
      value: function pause(handle) {
        var sub = this.subs[handle];
        if (!!sub) {
          sub.active = false;
        }
      }
    }, {
      key: "off",

      /**
       * Stop actions on this handle.
       * Unsubscribe.
       * @memberof module:cherimoia/ebus~RvBus
       * @method off
       * @param {Object} - handler id
       */
      value: function off(handle) {
        var sub = this.subs[handle];
        if (!!sub) {
          _unSub.call(this, this.root, this.splitTopic(sub.topic), 0, sub);
        }
      }
    }, {
      key: "iniz",

      /**
       * @method iniz
       * @private
       */
      value: function iniz() {
        this.root = mkTreeNode(true);
        this.subs = {};
      }
    }, {
      key: "removeAll",

      /**
       * Remove all subscribers.
       * @memberof module:cherimoia/ebus~RvBus
       * @method removeAll
       */
      value: function removeAll() {
        this.iniz();
      }
    }]);

    return RvBus;
  })(_sjs["default"].ES6Claxx);

  ;
  //////////////////////////////////////////////////////////////////////////////
  /**
   * @class EventBus
   */

  var EventBus = (function (_RvBus) {

    /**
     * @method constructor
     * @private
     */

    function EventBus() {
      _classCallCheck(this, EventBus);

      _get(Object.getPrototypeOf(EventBus.prototype), "constructor", this).call(this);
    }

    _inherits(EventBus, _RvBus);

    _createClass(EventBus, [{
      key: "fire",

      /**
       * Trigger event on this topic.
       * @memberof module:cherimoia/ebus~EventBus
       * @method fire
       * @param {String} topic
       * @param {Object} msg
       * @return {Boolean}
       */
      value: function fire(topic, msg) {
        return _run.call(this, topic, this.root.tree[topic], msg || {});
      }
    }, {
      key: "splitTopic",

      /**
       * @method splitTopic
       * @protected
       */
      value: function splitTopic(topic) {
        return [topic];
      }
    }]);

    return EventBus;
  })(RvBus);

  /** @alias module:cherimoia/ebus */
  var xbox = /** @lends xbox# */{
    /**
     * @method reifyRvBus
     * @return {RvBus}
     */
    reifyRvBus: function reifyRvBus() {
      return new RvBus();
    },
    /**
     * @method reify
     * @return {EventBus}
     */
    reify: function reify() {
      return new EventBus();
    },
    /**
     * @property {EventBus} EventBus
     */
    EventBus: EventBus,
    /**
     * @property {RvBus} RvBus
     */
    RvBus: RvBus
  };

  _sjs["default"].merge(exports, xbox);
  
  return xbox;
  

  //////////////////////////////////////////////////////////////////////////////
  //EOF
});