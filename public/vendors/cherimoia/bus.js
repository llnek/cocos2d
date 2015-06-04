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

/**
 * @requires cherimoia/skarojs
 * @module cherimoia/ebus
 */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define("cherimoia/ebus", ["cherimoia/skarojs"], function (sjs) {
  "use strict";

  /** @alias module:cherimoia/ebus */
  var exports = {},
      R = sjs.ramda,
      undef = undefined,
      _SEED = 0;

  //////////////////////////////////////////////////////////////////////////////
  var mkSubSCR = function mkSubSCR(topic, selector, target, repeat, args) {
    return {
      id: "sub#" + Number(++_SEED),
      repeat: sjs.boolify(repeat),
      args: args || [],
      action: selector,
      target: target,
      topic: topic,
      active: true
    };
  };

  //////////////////////////////////////////////////////////////////////////////
  var mkTreeNode = function mkTreeNode() {
    return {
      tree: {}, // children - branches
      subs: [] // subscribers (callbacks)
    };
  };

  //////////////////////////////////////////////////////////////////////////////
  /**
   * @class EventBus
   */

  var EventBus = (function () {

    /**
     * @private
     */

    function EventBus() {
      _classCallCheck(this, EventBus);

      this.rootNode = mkTreeNode();
      this.allSubs = {};
    }

    _createClass(EventBus, [{
      key: "once",

      /**
       * Subscribe to 1+ topics, returning a list of subscriber handles.
       * topics => "/hello/*  /goodbye/*"
       * @memberof module:cherimoia/ebus~EventBus
       * @method once
       * @param {String} topics - space separated if more than one.
       * @param {Function} selector
       * @param {Object} target
       * @return {Array.String} - subscription ids
       */
      value: function once(topics, selector, target /*, more args */) {
        var rc = this.pkListen(false, topics, selector, target, sjs.dropArgs(arguments, 3));
        return sjs.echt(rc) ? rc : [];
      }
    }, {
      key: "on",

      /**
       * subscribe to 1+ topics, returning a list of subscriber handles.
       * topics => "/hello/*  /goodbye/*"
       * @memberof module:cherimoia/ebus~EventBus
       * @method on
       * @param {String} topics - space separated if more than one.
       * @param {Function} selector
       * @param {Object} target
       * @return {Array.String} - subscription ids.
       */
      value: function on(topics, selector, target /*, more args */) {
        var rc = this.pkListen(true, topics, selector, target, sjs.dropArgs(arguments, 3));
        return sjs.echt(rc) ? rc : [];
      }
    }, {
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
        var tokens = sjs.safeSplit(topic, "/");
        if (tokens.length > 0) {
          return this.pkDoPub(topic, this.rootNode, tokens, 0, msg || {});
        } else {
          return false;
        }
      }
    }, {
      key: "resume",

      /**
       * Resume actions on this handle.
       * @memberof module:cherimoia/ebus~EventBus
       * @method resume
       * @param {Object} - handler id
       */
      value: function resume(handle) {
        var sub = this.allSubs[handle];
        if (!!sub) {
          sub.active = true;
        }
      }
    }, {
      key: "pause",

      /**
       * Pause actions on this handle.
       * @memberof module:cherimoia/ebus~EventBus
       * @method pause
       * @param {Object} - handler id
       */
      value: function pause(handle) {
        var sub = this.allSubs[handle];
        if (!!sub) {
          sub.active = false;
        }
      }
    }, {
      key: "off",

      /**
       * Stop actions on this handle.
       * Unsubscribe.
       * @memberof module:cherimoia/ebus~EventBus
       * @method off
       * @param {Object} - handler id
       */
      value: function off(handle) {
        var sub = this.allSubs[handle];
        if (!!sub) {
          this.pkUnSub(this.rootNode, sjs.safeSplit(sub.topic, "/"), 0, sub);
        }
      }
    }, {
      key: "removeAll",

      /**
       * Remove all subscribers.
       * @memberof module:cherimoia/ebus~EventBus
       * @method removeAll
       */
      value: function removeAll() {
        this.rootNode = mkTreeNode();
        this.allSubs = {};
      }
    }, {
      key: "pkGetSubcr",

      /**
       * @private
       */
      value: function pkGetSubcr(id) {
        return this.allSubs[id];
      }
    }, {
      key: "pkListen",

      /**
       * @private
       */
      value: function pkListen(repeat, topics, selector, target, more) {
        var _this = this;

        var ts = topics.trim().split(/\s+/);
        // for each topic, subscribe to it.
        var rc = R.map(function (t) {
          return _this.pkAddSub(repeat, t, selector, target, more);
        }, ts);
        return R.reject(function (z) {
          return z.length === 0;
        }, rc);
      }
    }, {
      key: "pkAddSub",

      /**
       * Register a subscriber to the topic leaf node, creating the path
       * when necessary.
       * @private
       */
      value: function pkAddSub(repeat, topic, selector, target, more) {
        var _this2 = this;

        var tkns = sjs.safeSplit(topic, "/");
        if (tkns.length > 0) {
          var rc = mkSubSCR(topic, selector, target, repeat, more),
              node = R.reduce(function (memo, z) {
            return _this2.pkDoSub(memo, z);
          }, this.rootNode, tkns);

          this.allSubs[rc.id] = rc;
          node.subs.push(rc);
          return rc.id;
        } else {
          return "";
        }
      }
    }, {
      key: "pkUnSub",

      /**
       * Remove the subscriber and trim if it is a dangling leaf node.
       * @private
       */
      value: function pkUnSub(node, tokens, pos, sub) {
        var _this3 = this;

        if (!sjs.echt(node)) {
          return;
        }
        if (pos < tokens.length) {
          var k = tokens[pos],
              cn = node.tree[k];
          this.pkUnSub(cn, tokens, pos + 1, sub);
          if (R.keys(cn.tree).length === 0 && cn.subs.length === 0) {
            delete node.tree[k];
          }
        } else {
          pos = -1;
          R.find(function (z) {
            pos += 1;
            if (z.id === sub.id) {
              delete _this3.allSubs[z.id];
              node.subs.splice(pos, 1);
              return true;
            } else {
              return false;
            }
          }, node.subs);
        }
      }
    }, {
      key: "pkDoPub",

      /**
       * @private
       */
      value: function pkDoPub(topic, node, tokens, pos, msg) {
        if (!sjs.echt(node)) {
          return false;
        }
        var rc = false;
        if (pos < tokens.length) {
          rc = rc || this.pkDoPub(topic, node.tree[tokens[pos]], tokens, pos + 1, msg);
          rc = rc || this.pkDoPub(topic, node.tree["*"], tokens, pos + 1, msg);
        } else {
          rc = rc || this.pkRun(topic, node, msg);
        }
        return rc;
      }
    }, {
      key: "pkRun",

      /**
       * Invoke subscribers, and for non repeating ones, remove them from
       * the list.
       * @private
       */
      value: function pkRun(topic, node, msg) {
        var _this4 = this;

        var cs = !!node ? node.subs : [];
        var purge = false,
            rc = false;

        R.forEach(function (z) {
          if (z.active && sjs.echt(z.action)) {
            // pass along any extra parameters, if any.
            z.action.apply(z.target, [topic, msg].concat(z.args));
            // if once only, kill it.
            if (!z.repeat) {
              delete _this4.allSubs[z.id];
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
      }
    }, {
      key: "pkDoSub",

      /**
       * Find or create a new child node.
       * @private
       */
      value: function pkDoSub(node, token) {
        if (!sjs.hasKey(node.tree, token)) {
          node.tree[token] = mkTreeNode();
        }
        return node.tree[token];
      }
    }]);

    return EventBus;
  })();

  ;

  /**
   * @method reify
   * @return {EventBus}
   */
  exports.reify = function () {
    return new EventBus();
  },

  /**
   * @property {EventBus} EventBus
   */
  exports.EventBus = EventBus;

  return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF