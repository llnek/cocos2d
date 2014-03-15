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

(function (undef) { "use strict"; var global= this; var _ = global._ ;
var fnTest = /xyz/.test(function(){xyz;}) ? /\bparent\b/ : /.*/;
var ZEROS= "00000000000000000000000000000000";  //32
function _echt (obj) {
  return typeof obj !== 'undefined' && obj !== null;
};
var initing = false;
var ZotohLabs = {

  padstr: function(str, len, s) {
    return (len -= str.length) > 0
          ? (s = new Array(Math.ceil(len / s.length) + 1).join(s)).substr(0, s.length) + str + s.substr(0, len - s.length)
          : str;
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  randomRange: function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  },

  xmod: function(m, n) { return ((m % n) + n) % n; },

  makeArray: function(len, value) {
    var arr=[];
    for (var n=0; n < len; ++n) { arr.push(value); }
    return arr;
  },

  klass: function() {},
  echt: _echt,

  merge: function( original, extended ) {
    for( var key in extended ) {
      var ext = extended[key];
      if(
        typeof(ext) != 'object' ||
        ext instanceof ZotohLabs.klass ||
        ext instanceof HTMLElement ||
        ext === null
      ) {
        original[key] = ext;
      }
      else {
        if( !original[key] || typeof(original[key]) != 'object' ) {
          original[key] = (ext instanceof Array) ? [] : {};
        }
        ZotohLabs.klass.merge( original[key], ext );
      }
    }
    return original;
  },

  prettyNumber: function (num, digits) {
    var len= Number(num).toString().length;
    if (digits > 32) { throw Error("Too many digits to prettify."); }
    var s= ZEROS.substring(0,digits);
    if (len < digits) {
      return s.substring(0, digits - len)  + num;
    } else {
      return "" + num;
    }
  },

  logger: global.dbg

};

//----------------------------------------------------------------------------
// js inheritance - lifted from impact.js
var inject = function(prop) {
  var name, proto = this.prototype;
  var parent = {};
  for ( name in prop ) {
    if ( typeof(prop[name]) == "function" &&
        typeof(proto[name]) == "function" &&
        fnTest.test(prop[name])) {
      parent[name] = proto[name]; // save original function
      proto[name] = (function(name, fn){
        return function() {
          var tmp = this.parent;
          this.parent = parent[name];
          var ret = fn.apply(this, arguments);
          this.parent = tmp;
          return ret;
        };
      })( name, prop[name] );

    } else {
      proto[name] = prop[name];
    }
  }
};

var merge= function( original, extended ) {
  for( var key in extended ) {
    var ext = extended[key];
    if(
      typeof(ext) !== 'object' ||
      ext instanceof ZotohLabs.klass ||
      ext instanceof HTMLElement ||
      ext === null
    ) {
      original[key] = ext;
    }
    else {
      if( !original[key] || typeof(original[key]) !== 'object' ) {
        original[key] = (ext instanceof Array) ? [] : {};
      }
      merge( original[key], ext );
    }
  }
  return original;
};

ZotohLabs.klass.extends = function (other) {
  var name, parent = this.prototype;
  initing = true;
  var prototype = new this();
  initing = false;
  for (name in other ) {
    if ( typeof(other[name]) === "function" &&
         typeof(parent[name]) === "function" &&
         fnTest.test(other[name])) {
      prototype[name] = (function(name, fn){
        return function() {
          var tmp = this.parent;
          this.parent = parent[name];
          var ret = fn.apply(this, arguments);
          this.parent = tmp;
          return ret;
        };
      })( name, other[name] );

    } else {
      prototype[name] = other[name];
    }
  }
  function Class() {
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

  Class.extends = ZotohLabs.klass.extends;
  Class.prototype = prototype;
  Class.prototype.constructor = Class;
  return Class;
};

ZotohLabs.klass.patch= inject;
ZotohLabs.klass.merge= merge;

/////////////////////////////////////////////////////////
//// export your stuff
/////////////////////////////////////////////////////////
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' &&  module.exports) {
    exports = module.exports = ZotohLabs;
  }
  exports.ZotohLabs= ZotohLabs;
} else {
  global.ZotohLabs= ZotohLabs;
}

}).call(this);



