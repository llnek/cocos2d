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

define("cherimoia/skarojs", ['global/window',
                             'console/dbg',
                             'ramda'],

  function (global,DBG,R) { "use strict";

    var undef, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    var ZEROS= "00000000000000000000000000000000";  //32

    if (typeof HTMLElement === 'undefined') {
      // fake a type.
      global.HTMLElement= function HTMLElement() {};
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    function _echt (obj) {
      return typeof obj !== 'undefined' && obj !== null;
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
        if ( typeof(proto[name]) == "function" &&
             typeof(prop[name]) == "function" &&
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
    var skarojs = {

      padstr: function(str, len, s) {
        return (len -= str.length) > 0
              ? (s = new Array(Math.ceil(len / s.length) + 1).join(s)).substr(0, s.length) + str + s.substr(0, len - s.length)
              : str;
      },

      safeSplit: function(s, ch) {
        return !!s ? R.reject(function(z) { return z.length===0; }, s.trim().split(ch)) : [];
      },

      now: Date.now || function() { return new Date().getTime(); },

      capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },

      randomRange: function(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
      },

      //xmod: function(m, n) { return ((m % n) + n) % n; },
      xmod: function(x, N) {
        if (x < 0) {
         return x - (-1 * (Math.floor(-x / N) * N + N));
        } else {
          return x % N;
        }
      },

      makeArray: function(len, value) {
        var n, arr=[];
        for (n=0; n < len; ++n) { arr.push(value); }
        return arr;
      },

      tne: function(msg) { throw new Error(msg); },

      NILFUNC: function() {},
      echt: _echt,

      prettyNumber: function (num, digits) {
        var len= Number(num).toString().length;
        if (digits > 32) { throw new Error("Too many digits to prettify."); }
        var s= ZEROS.substring(0,digits);
        if (len < digits) {
          return s.substring(0, digits - len)  + num;
        } else {
          return "" + num;
        }
      },

      getWebSockProtocol: function() {
        return this.isSSL() ? "wss://" : "ws://";
      },

      nowMillis: function() {
        if (Date.now) {
          return Date.now();
        } else {
          return new Date().getMilliseconds();
        }
      },

      boolify: function(v) {
        return v ? true : false;
      },

      dropArgs: function(args,num) {
        return args.length > num ? Array.prototype.slice(args,num) : [];
      },

      isSSL: function() {
        if (window && window.location) {
          return window.location.protocol.indexOf('https') >= 0;
        } else {
          return undef;
        }
      },

      fmtUrl: function (scheme, uri) {
        if (window && window.location) {
          return scheme + window.location.host + uri;
        } else {
          return "";
        }
      },

      isMobile: function (navigator) {
        if (navigator) {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        } else {
          return false;
        }
      },

      isSafari: function(navigator) {
        if (navigator) {
          return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        } else {
          return false;
        }
      },

      pde: function (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      },

      randSign: function() {
        if (this.rand(10) % 2 === 0) {
          return -1;
        } else {
          return 1;
        }
      },

      randArrayItem: function(arr) {
        return arr.length === 0 ? null : arr.length === 1 ? arr[0] : arr[ Math.floor(Math.random() * arr.length) ];
      },

      randPercent: function() {
        var pc = [0.1,0.9,0.3,0.7,0.6,0.5,0.4,0.8,0.2];
        return this.randArrayItem(pc);
      },

      rand: function(limit) {
        return Math.floor(Math.random() * limit);
      },

      toBasicAuthHeader: function(user,pwd) {
        var str='Basic ' + this.base64_encode(""+user+":"+pwd);
        return [ 'Authorization', str ];
      },

      toUtf8: function(s) {
        return CryptoJS.enc.Utf8.stringify( CryptoJS.enc.Utf8.parse(s));
      },

      base64_encode: function(s) {
        return CryptoJS.enc.Base64.stringify( CryptoJS.enc.Utf8.parse(s));
      },

      base64_decode: function(s) {
        return CryptoJS.enc.Utf8.stringify( CryptoJS.enc.Base64.parse(s));
      },

      mergeEx:function(original,extended) {
        return this.merge(this.merge({},original), extended);
      },

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

      removeFromArray: function(arr, item) {
        if (arr && arr.indexOf && arr.splice) {
          var index = arr.indexOf(item);
          while (index !== -1) {
            arr.splice(index,1);
            index = arr.indexOf(item);
          }
        }
      },

      isUndef: function(obj) {
        return obj === void 0;
      },

      isNull: function(obj) {
        return obj === null;
      },

      isNumber: function(obj) {
        return toString.call(obj) === '[object Number]';
      },

      isDate: function(obj) {
        return toString.call(obj) === '[object Date]';
      },

      isFunction: function(obj) {
        return toString.call(obj) === '[object Function]';
      },

      isString: function(obj) {
        return toString.call(obj) === '[object String]';
      },

      isArray: function(obj) {
        return !!obj && toString.call(obj) === '[object Array]';
      },

      isObject: function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      },

      isEmpty: function(obj) {
        if (this.isObject(obj)) {
          return Object.keys(obj).length === 0;
        }

        if (!!obj && typeof obj.length === 'number') {
          return obj.length === 0;
        }

        return false;
      },

      hasKey: function(obj, key) {
        return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
      },

      //since R doesn't handle object :(
      reduceObj: function(f, memo, obj) {
        return R.reduce(function(sum, pair) {
          return f(sum, pair[1], pair[0]);
        },
        memo,
        R.toPairs(obj));
      },
      eachObj: function(f, obj) {
        return R.forEach(function(pair) {
          return f(pair[1], pair[0]);
        },
        R.toPairs(obj));
      },

      logger: DBG,
      loggr: DBG,

      ramda: R,
      R: R,

      Class : klass
    };

    return skarojs;

});

//////////////////////////////////////////////////////////////////////////////
//EOF

