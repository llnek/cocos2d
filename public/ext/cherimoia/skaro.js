define("cherimoia/skaro", ["exports", "global/window", "console/dbg", "ramda"], function (exports, _globalWindow, _consoleDbg, _ramda) {
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
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
  * @requires global/window
  * @requires console/dbg
  * @requires ramda
  * @requires CryptoJS
  * @module cherimoia/skaro
  */

  var _global = _interopRequireDefault(_globalWindow);

  var _DBG = _interopRequireDefault(_consoleDbg);

  var _R = _interopRequireDefault(_ramda);

  var fnTest = /xyz/.test(function () {
    xyz;
  }) ? /\b_super\b/ : /[\D|\d]*/,
      ZEROS = "00000000000000000000000000000000"; //32
  var CjsBase64 = undefined,
      CjsUtf8 = undefined,
      undef = undefined;

  if (typeof HTMLElement === "undefined") {
    // fake a type.
    _global["default"].HTMLElement = function HTMLElement() {};
  }

  if (typeof CryptoJS !== "undefined") {
    _global["default"].CryptoJS = CryptoJS;
  }

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //
  var _echt = function _echt(obj) {
    return typeof obj !== "undefined" && obj !== null;
  };

  if (_echt(_global["default"].CryptoJS)) {
    CjsBase64 = _global["default"].CryptoJS.enc.Base64;
    CjsUtf8 = _global["default"].CryptoJS.enc.Utf8;
  }

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // js inheritance - lifted from impact.js
  //----------------------------------------------------------------------------
  /** * @private */
  function _patchProto(zuper, proto, other) {
    var par = {},
        name = undefined;
    for (name in other) {
      if (typeof zuper[name] === "function" && typeof other[name] === "function" && fnTest.test(other[name])) {
        par[name] = zuper[name]; // save original function
        proto[name] = (function (name, fn) {
          return function () {
            var tmp = this._super,
                ret = undefined;
            this._super = par[name];
            ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          };
        })(name, other[name]);
      } else {
        proto[name] = other[name];
      }
    }
  }

  var wrapper = function wrapper() {},
      initing = false,
      _mixer = function _mixer(other) {
    var proto = undefined;

    initing = true;proto = new this();initing = false;
    _patchProto(this.prototype, proto, other);

    function claxx() {
      if (!initing && !!this.ctor) {
        this.ctor.apply(this, arguments);
      }
      return this;
    }

    claxx.prototype = proto;
    claxx.prototype.constructor = Claxx;
    claxx.mixes = _mixer;
    claxx.patch = function (other) {
      _patchProto(this.prototype, this.prototype, other);
    };

    return claxx;
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  /** @alias module:cherimoia/skaro */
  var xbox = /** @lends xbox# */{
    /*
      strPadRight(str,len, pad){
        return (str+new Array(len+1).join(pad)).slice(0,len);
      },
      strPadLeft(str,len,pad){
        return (new Array(len+1).join(pad)+str).slice(-len);
      },
    */
    /**
     * Maybe pad a string (right side.)
     * @function
     * @param {String} str
     * @param {Number} len
     * @param {String} s
     * @return {String}
     */
    strPadRight: function strPadRight(str, len, s) {
      return (len -= str.length) > 0 ? str + new Array(Math.ceil(len / s.length) + 1).join(s).substr(0, len) : str;
    },

    /**
     * Maybe pad a string (left side.)
     * @function
     * @param {String} str
     * @param {Number} len
     * @param {String} s
     * @return {String}
     */
    strPadLeft: function strPadLeft(str, len, s) {
      return (len -= str.length) > 0 ? new Array(Math.ceil(len / s.length) + 1).join(s).substr(0, len) + str : str;
    },

    /**
     * Safely split a string, null and empty strings are removed.
     * @function
     * @param {String} s
     * @param {String} sep
     * @return {Array.String}
     */
    safeSplit: function safeSplit(s, sep) {
      return !!s ? _R["default"].reject(function (z) {
        return z.length === 0;
      }, s.trim().split(sep)) : [];
    },

    /**
     * Get the current time.
     * @function
     * @return {Number} time in milliseconds.
     */
    now: Date.now || function () {
      return new Date().getTime();
    },

    /**
     * Capitalize the first char of the string.
     * @function
     * @param {String} str
     * @return {String} with the first letter capitalized.
     */
    capitalize: function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Pick a random number between these 2 limits.
     * @function
     * @param {Number} from
     * @param {Number} to
     * @return {Number}
     */
    randRange: function randRange(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    },

    /**
     * Return the proper mathematical modulo of x mod N.
     * @function
     * @param {Number} x
     * @param {Number} N
     * @return {Number}
     */
    xmod: function xmod(x, N) {
      if (x < 0) {
        return x - -1 * (Math.floor(-x / N) * N + N);
      } else {
        return x % N;
      }
    },

    /**
     * Create an array of len, seeding it with value.
     * @function
     * @param {Number} len
     * @param {Object} value
     * @return {Array.Any}
     */
    makeArray: function makeArray(len, value) {
      var arr = [];
      for (var n = 0; n < len; ++n) {
        arr.push(value);
      }
      return arr;
    },

    /**
     * Throw an error exception.
     * @function
     * @param {String} msg
     */
    tne: function tne(msg) {
      throw new Error(msg);
    },

    /**
     * A no-op function.
     * @function
     */
    NILFUNC: function NILFUNC() {},

    /**
     * Test if object is valid and not null.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    echt: _echt,

    /**
     * Maybe pad the number with zeroes.
     * @function
     * @param {Number} num
     * @param {Number} digits
     * @return {String}
     */
    prettyNumber: function prettyNumber(num, digits) {
      return this.strPadLeft(Number(num).toString(), digits, "0");
      /*
      var nums= Number(num).toString(),
      len= nums.length;
      if (digits > 32) { throw new Error("Too many digits to prettify."); }
      var s= ZEROS.substring(0,digits);
      if (len < digits) {
        return s.substring(0, digits - len)  + nums;
      } else {
        return nums;
      }
      */
    },

    /**
     * Get the websocket transport protocol.
     * @function
     * @return {String} transport protocol for websocket
     */
    getWebSockProtocol: function getWebSockProtocol() {
      return this.isSSL() ? "wss://" : "ws://";
    },

    /**
     * Get the current time in milliseconds.
     * @function
     * @return {Number} current time (millisecs)
     */
    nowMillis: function nowMillis() {
      return this.now();
    },

    /**
     * Cast the value to boolean.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    boolify: function boolify(obj) {
      return obj ? true : false;
    },

    /**
     * Remove some arguments from the front.
     * @function
     * @param {Javascript.arguments} args
     * @param {Number} num
     * @return {Array} remaining arguments
     */
    dropArgs: function dropArgs(args, num) {
      return args.length > num ? Array.prototype.slice(args, num) : [];
    },

    /**
     * Returns true if the web address is ssl.
     * @function
     * @return {Boolean}
     */
    isSSL: function isSSL() {
      if (!!window && window.location) {
        return window.location.protocol.indexOf("https") >= 0;
      } else {
        return false;
      }
    },

    /**
     * Format a URL based on the current web address host.
     * @function
     * @param {String} scheme
     * @param {String} uri
     * @return {String}
     */
    fmtUrl: function fmtUrl(scheme, uri) {
      if (!!window && window.location) {
        return scheme + window.location.host + uri;
      } else {
        return "";
      }
    },

    /**
     * @function
     * @param {String} s
     * @return {Object}
     */
    objectfy: function objectfy(s) {
      return !!s ? JSON.parse(s) : null;
    },

    /**
     * @function
     * @param {Object} obj
     * @return {String}
     */
    jsonfy: function jsonfy(obj) {
      return !!obj ? JSON.stringify(obj) : null;
    },

    /**
     * Test if the client is a mobile device.
     * @function
     * @param {String} navigator
     * @return {Boolean}
     */
    isMobile: function isMobile(navigator) {
      if (!!navigator) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      } else {
        return false;
      }
    },

    /**
     * Test if the client is Safari browser.
     * @function
     * @param {String} navigator
     * @return {Boolean}
     */
    isSafari: function isSafari(navigator) {
      if (!!navigator) {
        return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
      } else {
        return false;
      }
    },

    /**
     * Prevent default propagation of this event.
     * @function
     * @param {Event} e
     */
    pde: function pde(e) {
      if (!!e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    },

    /**
     * Randomly pick positive or negative.
     * @function
     * @return {Number}
     */
    randSign: function randSign() {
      if (this.rand(10) % 2 === 0) {
        return -1;
      } else {
        return 1;
      }
    },

    /**
     * Randomly choose an item from this array.
     * @function
     * @param {Array} arr
     * @return {Object}
     */
    randArrayItem: function randArrayItem(arr) {
      return arr.length === 0 ? null : arr.length === 1 ? arr[0] : arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Randomly choose a percentage in step of 10.
     * @function
     * @return {Number}
     */
    randPercent: function randPercent() {
      var pc = [0.1, 0.9, 0.3, 0.7, 0.6, 0.5, 0.4, 0.8, 0.2];
      return this.randArrayItem(pc);
    },

    /**
     * Pick a random number.
     * @function
     * @param {Number} limit
     * @return {Number}
     */
    rand: function rand(limit) {
      return Math.floor(Math.random() * limit);
    },

    /**
     * Format input into HTTP Basic Authentication.
     * @function
     * @param {String} user
     * @param {String} pwd
     * @return {Array.String} - [header, data]
     */
    toBasicAuthHeader: function toBasicAuthHeader(user, pwd) {
      var str = "Basic " + this.base64_encode("" + user + ":" + pwd);
      return ["Authorization", str];
    },

    /**
     * Convert string to utf-8 string.
     * @function
     * @param {String} s
     * @return {String}
     */
    toUtf8: function toUtf8(s) {
      return CjsUtf8.stringify(CjsUtf8.parse(s));
    },

    /**
     * Base64 encode the string.
     * @function
     * @param {String} s
     * @return {String}
     */
    base64_encode: function base64_encode(s) {
      return CjsBase64.stringify(CjsUtf8.parse(s));
    },

    /**
     * Base64 decode the string.
     * @function
     * @param {String} s
     * @return {String}
     */
    base64_decode: function base64_decode(s) {
      return CjsUtf8.stringify(CjsBase64.parse(s));
    },

    /**
     * Merge 2 objects together.
     * @function
     * @param {Object} original
     * @param {Object} extended
     * @return {Object} a new object
     */
    mergeEx: function mergeEx(original, extended) {
      return this.merge(this.merge({}, original), extended);
    },

    /**
     * Merge 2 objects in place.
     * @function
     * @param {Object} original
     * @param {Object} extended
     * @return {Object} the modified original object
     */
    merge: function merge(original, extended) {
      var key = undefined,
          ext = undefined;
      for (key in extended) {
        ext = extended[key];
        if (ext instanceof xbox.ES6Claxx || ext instanceof HTMLElement || typeof ext !== "object" || ext === null || !original[key]) {
          original[key] = ext;
        } else {
          if (typeof original[key] !== "object") {
            original[key] = ext instanceof Array ? [] : {};
          }
          this.merge(original[key], ext);
        }
      }
      return original;
    },

    /**
     * Maybe remove this item from this array.
     * @function
     * @return {Array}
     */
    removeFromArray: function removeFromArray(arr, item) {
      var index = arr.indexOf(item);
      while (index !== -1) {
        arr.splice(index, 1);
        index = arr.indexOf(item);
      }
      return arr;
    },

    /**
     * Test if the input is *undefined*.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isundef: function isundef(obj) {
      return obj === void 0;
    },

    /**
     * Test if input is null.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isnull: function isnull(obj) {
      return obj === null;
    },

    /**
     * Test if input is a Number.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isnum: function isnum(obj) {
      return toString.call(obj) === "[object Number]";
    },

    /**
     * Test if input is a Date.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isdate: function isdate(obj) {
      return toString.call(obj) === "[object Date]";
    },

    /**
     * Test if input is a Function.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isfunc: function isfunc(obj) {
      return toString.call(obj) === "[object Function]";
    },

    /**
     * Test if input is a String.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isstr: function isstr(obj) {
      return toString.call(obj) === "[object String]";
    },

    /**
     * Test if input is an Array.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isarr: function isarr(obj) {
      return !!obj && toString.call(obj) === "[object Array]";
    },

    /**
     * Test if input is an Object.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isobj: function isobj(obj) {
      var type = typeof obj;
      return type === "function" || type === "object" && !!obj;
    },

    /**
     * Test if input has *length* attribute, and if so, is it
     * empty.
     * @function
     * @param {Object} obj
     * @return {Boolean}
     */
    isempty: function isempty(obj) {
      if (this.isobj(obj)) {
        return Object.keys(obj).length === 0;
      }

      if (!!obj && typeof obj.length === "number") {
        return obj.length === 0;
      }

      return false;
    },

    /**
     * Test if this object has this key.
     * @function
     * @param {Object} obj
     * @param {Object} key
     * @return {Boolean}
     */
    hasKey: function hasKey(obj, key) {
      return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
    },

    //since R doesn't handle object :(
    /**
     * Perform reduce on this object.
     * @function
     * @param {Function} f
     * @param {Object} memo
     * @param {Object} obj
     * @return {Object}  memo
     */
    reduceObj: function reduceObj(f, memo, obj) {
      return _R["default"].reduce(function (sum, pair) {
        return f(sum, pair[1], pair[0]);
      }, memo, _R["default"].toPairs(obj));
    },

    /**
     * Iterate over this object [k,v] pairs and call f(v,k).
     * @function
     * @param {Function} f
     * @param {Object} obj
     * @return {Object} original object
     */
    eachObj: function eachObj(f, obj) {
      _R["default"].forEach(function (pair) {
        return f(pair[1], pair[0]);
      }, _R["default"].toPairs(obj));
      return obj;
    },

    /**
     * Mixin this object.
     * @function
     * @param {Object} object
     * @return {Object}
     */
    mixes: function mixes(obj) {
      return _mixer(obj);
    },

    /**
     * @property {Logger} logger Short cut to logger
     */
    logger: _DBG["default"],

    /**
     * @property {Logger} loggr Short cut to logger
     */
    loggr: _DBG["default"],

    /**
     * @property {Ramda} ramda Short cut to Ramda
     */
    ramda: _R["default"],

    /**
     * @property {Ramda} R Short cut to Ramda
     */
    R: _R["default"],

    /**
     * @property {Claxx} Claxx ES6 Class
     */
    ES6Claxx: function ES6Claxx() {
      _classCallCheck(this, ES6Claxx);
    }

  };

  xbox.merge(exports, xbox);
  
  return xbox;
  

  //////////////////////////////////////////////////////////////////////////////
  //EOF
});