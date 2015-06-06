define("cherimoia/caesar", ["exports", "cherimoia/skarojs"], function (exports, _cherimoiaSkarojs) {
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

  /**
  * @requires cherimoia/skarojs
  * @module cherimoia/caesar
  */

  var _sjs = _interopRequireDefault(_cherimoiaSkarojs);

  var VISCHS = " @N/\\Ri2}aP`(xeT4F3mt;8~%r0v:L5$+Z{'V)\"CKIc>z.*" + "fJEwSU7juYg<klO&1?[h9=n,yoQGsW]BMHpXb6A|D#q^_d!-",
      VISCHS_LEN = VISCHS.length;

  /////////////////////////////////////////////////////////////////////////////
  var identifyChar = function identifyChar(pos) {
    return VISCHS.charAt(pos);
  };
  var locateChar = function locateChar(ch) {
    for (var n = 0; n < VISCHS_LEN; ++n) {
      if (ch === VISCHS.charAt(n)) {
        return n;
      }
    }
    return -1;
  };
  var slideForward = function slideForward(delta, cpos) {
    var ptr = cpos + delta,
        np = undefined;
    if (ptr >= VISCHS_LEN) {
      np = ptr - VISCHS_LEN;
    } else {
      np = ptr;
    }
    return identifyChar(np);
  };
  var slideBack = function slideBack(delta, cpos) {
    var ptr = cpos - delta,
        np = undefined;
    if (ptr < 0) {
      np = VISCHS_LEN + ptr;
    } else {
      np = ptr;
    }
    return identifyChar(np);
  };
  var shiftEnc = function shiftEnc(shiftpos, delta, cpos) {
    if (shiftpos < 0) {
      return slideForward(delta, cpos);
    } else {
      return slideBack(delta, cpos);
    }
  };
  var shiftDec = function shiftDec(shiftpos, delta, cpos) {
    if (shiftpos < 0) {
      return slideBack(delta, cpos);
    } else {
      return slideForward(delta, cpos);
    }
  };

  /** @alias module:cherimoia/caesar */
  var xbox = /** @lends xbox# */{
    /**
     * Encrypt the text.
     * @function
     * @param {String} clearText
     * @param {Number} shiftpos
     * @return {String} cipher text
     */
    encrypt: function encrypt(str, shiftpos) {

      if (_sjs["default"].isString(str) && str.length > 0 && shiftpos !== 0) {} else {
        return "";
      }
      var delta = _sjs["default"].xmod(Math.abs(shiftpos), VISCHS_LEN),
          out = [],
          len = str.length;
      var p = undefined,
          ch = undefined;
      for (var n = 0; n < len; ++n) {
        ch = str.charAt(n);
        p = locateChar(ch);
        if (p < 0) {} else {
          ch = shiftEnc(shiftpos, delta, p);
        }
        out.push(ch);
      }
      return out.join("");
    },

    /**
     * Decrypt the cipher.
     * @function
     * @param {String} cipher
     * @param {Number} shiftpos
     * @return {String} clear text
     */
    decrypt: function decrypt(cipher, shiftpos) {

      if (_sjs["default"].isString(cipher) && cipher.length > 0 && shiftpos !== 0) {} else {
        return "";
      }
      var delta = _sjs["default"].xmod(Math.abs(shiftpos), VISCHS_LEN),
          out = [],
          len = cipher.length;
      var p = undefined,
          ch = undefined;
      for (var n = 0; n < len; ++n) {
        ch = cipher.charAt(n);
        p = locateChar(ch);
        if (p < 0) {} else {
          ch = shiftDec(shiftpos, delta, p);
        }
        out.push(ch);
      }
      return out.join("");
    }

  };

  _sjs["default"].merge(exports, xbox);
  
  return xbox;
  

  //////////////////////////////////////////////////////////////////////////////
  //EOF
});

//ch

//ch