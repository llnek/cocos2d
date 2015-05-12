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

define("cherimoia/skarojs", ['global/window',
                             'console/dbg',
                             'ramda'],

  function (global,DBG,R) { "use strict";

    var undef, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    var ZEROS= "00000000000000000000000000000000";  //32
    var CjsBase64;
    var CjsUtf8;

    if (typeof HTMLElement === 'undefined') {
      // fake a type.
      global.HTMLElement= function HTMLElement() {};
    }

    if (typeof CryptoJS !== 'undefined') {
      global.CryptoJS= CryptoJS;
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    function _echt (obj) {
      return typeof obj !== 'undefined' && obj !== null;
    }

    if (_echt( global.CryptoJS))  {
      CjsBase64= global.CryptoJS.enc.Base64;
      CjsUtf8= global.CryptoJS.enc.Utf8;
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // js inheritance - lifted from impact.js
    //----------------------------------------------------------------------------
    //
    var monkeyPatch = function(prop) {
      var proto = this.prototype,
      name,
      parent = {};
      for ( name in prop ) {
        if ( typeof(proto[name]) === "function" &&
             typeof(prop[name]) === "function" &&
             fnTest.test(prop[name])) {
          parent[name] = proto[name]; // save original function
          proto[name] = (function(name, fn){
            return function() {
              var tmp = this._super;
              this._super = parent[name];
              var ret = fn.apply(this, arguments);
              this._super = tmp;
              return ret;
            };
          })( name, prop[name] );

        } else {
          proto[name] = prop[name];
        }
      }
    };

    var klass= function() {};
    var initing = false;
    klass.xtends = function (other) {
      var name, parent = this.prototype;
      initing = true;
      var proto = new this();
      initing = false;
      for (name in other ) {
        if ( typeof(parent[name]) === "function" &&
             typeof(other[name]) === "function" &&
             fnTest.test(other[name])) {
          proto[name] = (function(name, fn){
            return function() {
              var tmp = this._super;
              this._super = parent[name];
              var ret = fn.apply(this, arguments);
              this._super = tmp;
              return ret;
            };
          })( name, other[name] );

        } else {
          proto[name] = other[name];
        }
      }
      function Claxx() {
        if ( !initing ) {
          // If this class has a staticInstantiate method, invoke it
          // and check if we got something back. If not, the normal
          // constructor (ctor) is called.
          if (_echt(this.staticInstantiate)) {
            var obj = this.staticInstantiate.apply(this, arguments);
            if (_echt(obj)) { return obj; }
          }
          if (_echt(this.ctor)) {
            this.ctor.apply(this, arguments);
          }
        }
        return this;
      }

      Claxx.prototype = proto;
      Claxx.prototype.constructor = Claxx;
      Claxx.xtends = klass.xtends;
      Claxx.inject = monkeyPatch;

      return Claxx;
    };

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /**
     * @requires module:global/window
     * @requires module:console/dbg
     * @requires module:ramda
     * @requires module:CryptoJS
     *
     * @exports cherimoia/skarojs
     */
    var skarojs = {
/*
      strPadRight: function(str,len, pad){
        return (str+new Array(len+1).join(pad)).slice(0,len);
      },

      strPadLeft: function(str,len,pad){
        return (new Array(len+1).join(pad)+str).slice(-len);
      },
*/
      /**
       * Maybe pad a string (right side.)
       *
       * @method strPadRight
       * @param {String} str
       * @param {Number} len
       * @param {String} s
       * @return {String}
       */
      strPadRight: function(str, len, s) {
        return (len -= str.length) > 0
        ? str + new Array(Math.ceil(len/s.length) + 1).join(s).substr(0, len)
        : str;
      },

      /**
       * Maybe pad a string (left side.)
       *
       * @method strPadLeft
       * @param {String} str
       * @param {Number} len
       * @param {String} s
       * @return {String}
       */
      strPadLeft: function(str, len, s) {
        return (len -= str.length) > 0
        ? new Array(Math.ceil(len/s.length) + 1).join(s).substr(0, len) + str
        : str;
      },

      /**
       * Safely split a string, null and empty strings are removed.
       *
       * @method safeSplit
       * @param {String} s
       * @param {String} sep
       * @return {Array.String}
       */
      safeSplit: function(s, sep) {
        return !!s ? R.reject(function(z) { return z.length===0; }, s.trim().split(sep)) : [];
      },

      /**
       * Get the current time.
       *
       * @method now
       * @return {Number} - time in milliseconds.
       */
      now: Date.now || function() { return new Date().getTime(); },

      /**
       * Capitalize the first char of the string.
       *
       * @method capitalize
       * @param {String} str
       * @return {String} - with the first letter capitalized.
       */
      capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },

      /**
       * Pick a random number between these 2 limits.
       *
       * @method randomRange
       * @param {Number} from
       * @param {Number} to
       * @return {Number}
       */
      randomRange: function(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
      },

      /**
       * Return the proper mathematical modulo.
       *
       * @method xmod
       * @param {Number} x
       * @param {Number} N
       * @return {Number} - x modulo N
       */
      xmod: function(x, N) {
        if (x < 0) {
          return x - (-1 * (Math.floor(-x / N) * N + N));
        } else {
          return x % N;
        }
      },

      /**
       * Create an array of len, seeding it with value.
       *
       * @method makeArray
       * @param {Number} len
       * @param {Object} value
       * @return {Array}
       */
      makeArray: function(len, value) {
        var n, arr=[];
        for (n=0; n < len; ++n) { arr.push(value); }
        return arr;
      },

      /**
       * Throw an error exception.
       *
       * @method tne
       * @param {String} msg
       */
      tne: function(msg) { throw new Error(msg); },

      /**
       * A no-op function.
       *
       * @method NILFUNC
       */
      NILFUNC: function() {},

      /**
       * Test if object is valid and not null.
       *
       * @method echt
       * @param {Object} obj
       * @return {Boolean}
       */
      echt: _echt,

      /**
       * Maybe pad the number with zeroes.
       *
       * @method prettyNumber
       * @param {Number} num
       * @param {Number} digits
       * @return {String}
       */
      prettyNumber: function (num, digits) {
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
       *
       * @method getWebSockProtocol
       * @return {String} - the transport protocol for websocket
       */
      getWebSockProtocol: function() {
        return this.isSSL() ? "wss://" : "ws://";
      },

      /**
       * Get the current time in milliseconds.
       *
       * @method nowMillis
       * @return {Number} - current time (millisecs)
       */
      nowMillis: function() {
        return this.now();
      },

      /**
       * Cast the value to boolean.
       *
       * @method boolify
       * @param {Object} obj
       * @return {Boolean}
       */
      boolify: function(obj) {
        return obj ? true : false;
      },

      /**
       * Remove some arguments from the front.
       *
       * @method dropArgs
       * @param {String} args
       * @param {Number} num
       * @return {Array} - remaining arguments
       */
      dropArgs: function(args,num) {
        return args.length > num ? Array.prototype.slice(args,num) : [];
      },

      /**
       * Returns true if the web address is ssl.
       *
       * @method isSSL
       * @return {Boolean}
       */
      isSSL: function() {
        if (window && window.location) {
          return window.location.protocol.indexOf('https') >= 0;
        } else {
          return undef;
        }
      },

      /**
       * Format a URL based on the current web address host.
       *
       * @method fmtUrl
       * @param {String} scheme
       * @param {String} uri
       * @return {String}
       */
      fmtUrl: function (scheme, uri) {
        if (window && window.location) {
          return scheme + window.location.host + uri;
        } else {
          return "";
        }
      },

      /**
       * Test if the client is a mobile device.
       *
       * @method isMobile
       * @param {String} navigator
       * @return {Boolean}
       */
      isMobile: function (navigator) {
        if (navigator) {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        } else {
          return false;
        }
      },

      /**
       * Test if the client is Safari browser.
       *
       * @method isSafari
       * @param {String} navigator
       * @return {Boolean}
       */
      isSafari: function(navigator) {
        if (navigator) {
          return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        } else {
          return false;
        }
      },

      /**
       * Prevent default propagation of this event.
       *
       * @method pde
       * @param {Event} e
       */
      pde: function (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      },

      /**
       * Randomly pick positive or negative.
       *
       * @method randSign
       * @return {Number}
       */
      randSign: function() {
        if (this.rand(10) % 2 === 0) {
          return -1;
        } else {
          return 1;
        }
      },

      /**
       * Randomly choose an item from this array.
       *
       * @method randArrayItem
       * @param {Array} arr
       * @return {Object}
       */
      randArrayItem: function(arr) {
        return arr.length === 0 ? null : arr.length === 1 ? arr[0] : arr[ Math.floor(Math.random() * arr.length) ];
      },

      /**
       * Randomly choose a percentage in step of 10.
       *
       * @method randPercent
       * @return {Number}
       */
      randPercent: function() {
        var pc = [0.1,0.9,0.3,0.7,0.6,0.5,0.4,0.8,0.2];
        return this.randArrayItem(pc);
      },

      /**
       * Pick a random number.
       *
       * @method rand
       * @param {Number} limit
       * @return {Number}
       */
      rand: function(limit) {
        return Math.floor(Math.random() * limit);
      },

      /**
       * Format input into HTTP Basic Authentication.
       *
       * @method toBasicAuthHeader
       * @param {String} user
       * @param {String} pwd
       * @return {Array.String} - [header, data]
       */
      toBasicAuthHeader: function(user,pwd) {
        var str='Basic ' + this.base64_encode(""+user+":"+pwd);
        return [ 'Authorization', str ];
      },

      /**
       * Convert string to utf-8 string.
       *
       * @method toUtf8
       * @param {String} s
       * @return {String}
       */
      toUtf8: function(s) {
        return CjsUtf8.stringify( CjsUtf8.parse(s));
      },

      /**
       * Base64 encode the string.
       *
       * @method base64_encode
       * @param {String} s
       * @return {String}
       */
      base64_encode: function(s) {
        return CjsBase64.stringify( CjsUtf8.parse(s));
      },

      /**
       * Base64 decode the string.
       *
       * @method base64_decode
       * @param {String} s
       * @return {String}
       */
      base64_decode: function(s) {
        return CjsUtf8.stringify( CjsBase64.parse(s));
      },

      /**
       * Merge 2 objects together.
       *
       * @method mergeEx
       * @param {Object} original
       * @param {Object} extended
       * @return {Object} - a new object
       */
      mergeEx:function(original,extended) {
        return this.merge(this.merge({},original), extended);
      },

      /**
       * Merge 2 objects in place.
       *
       * @method mergeEx
       * @param {Object} original
       * @param {Object} extended
       * @return {Object} - the modified original object
       */
      merge: function(original, extended) {
        for( var key in extended ) {
          var ext = extended[key];
          if ( typeof(ext) !== 'object' ||
               ext instanceof klass ||
               ext instanceof HTMLElement ||
               ext === null ) {
            original[key] = ext;
          } else {
            if( !original[key] || typeof(original[key]) !== 'object' ) {
              original[key] = (ext instanceof Array) ? [] : {};
            }
            this.merge( original[key], ext );
          }
        }
        return original;
      },

      /**
       * Maybe remove this item from this array.
       *
       * @method removeFromArray
       * @return {Array}
       */
      removeFromArray: function(arr, item) {
        if (arr && arr.indexOf && arr.splice) {
          var index = arr.indexOf(item);
          while (index !== -1) {
            arr.splice(index,1);
            index = arr.indexOf(item);
          }
        }
        return arr;
      },

      /**
       * Test if the input is *undefined*.
       *
       * @method isUndef
       * @param {Object} obj
       * @return {Boolean}
      isUndef: function(obj) {
        return obj === void 0;
      },

      /**
       * Test if input is null.
       *
       * @method isNull
       * @param {Object} obj
       * @return {Boolean}
       */
      isNull: function(obj) {
        return obj === null;
      },

      /**
       * Test if input is a Number.
       *
       * @method isNumber
       * @param {Object} obj
       * @return {Boolean}
       */
      isNumber: function(obj) {
        return toString.call(obj) === '[object Number]';
      },

      /**
       * Test if input is a Date.
       *
       * @method isDate
       * @param {Object} obj
       * @return {Boolean}
       */
      isDate: function(obj) {
        return toString.call(obj) === '[object Date]';
      },

      /**
       * Test if input is a Function.
       *
       * @method isFunction
       * @param {Object} obj
       * @return {Boolean}
       */
      isFunction: function(obj) {
        return toString.call(obj) === '[object Function]';
      },

      /**
       * Test if input is a String.
       *
       * @method isString
       * @param {Object} obj
       * @return {Boolean}
       */
      isString: function(obj) {
        return toString.call(obj) === '[object String]';
      },

      /**
       * Test if input is an Array.
       *
       * @method isArray
       * @param {Object} obj
       * @return {Boolean}
       */
      isArray: function(obj) {
        return !!obj && toString.call(obj) === '[object Array]';
      },

      /**
       * Test if input is an Object.
       *
       * @method isObject
       * @param {Object} obj
       * @return {Boolean}
       */
      isObject: function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      },

      /**
       * Test if input has *length* attribute, and if so, is it
       * empty.
       *
       * @method isEmpty
       * @param {Object} obj
       * @return {Boolean}
       */
      isEmpty: function(obj) {
        if (this.isObject(obj)) {
          return Object.keys(obj).length === 0;
        }

        if (!!obj && typeof obj.length === 'number') {
          return obj.length === 0;
        }

        return false;
      },

      /**
       * Test if this object has this key.
       *
       * @method hasKey
       * @param {Object} obj
       * @param {Object} key
       * @return {Boolean}
       */
      hasKey: function(obj, key) {
        return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
      },

      //since R doesn't handle object :(
      /**
       * Perform reduce on this object.
       *
       * @method reduceObj
       * @param {Function} f
       * @param {Object} memo
       * @param {Object} obj
       * @return {Object}  - memo
       */
      reduceObj: function(f, memo, obj) {
        return R.reduce(function(sum, pair) {
          return f(sum, pair[1], pair[0]);
        },
        memo,
        R.toPairs(obj));
      },

      /**
       * Iterate over this object [k,v] pairs and call f(v,k).
       *
       * @method eachObj
       * @param {Function} f
       * @param {Object} obj
       * @return {Object} - Original object
       */
      eachObj: function(f, obj) {
        R.forEach(function(pair) {
          return f(pair[1], pair[0]);
        },
        R.toPairs(obj));
        return obj;
      },

      /**
       * @property logger - Short cut to logger
       */
      logger: DBG,

      /**
       * @property loggr - Short cut to logger
       */
      loggr: DBG,

      /**
       * @property ramda - Short cut to Ramda
       */
      ramda: R,

      /**
       * @property R - Short cut to Ramda
       */
      R: R,

      /**
       * @property Class - Class based inheritance
       */
      Class : klass
    };

    return skarojs;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

