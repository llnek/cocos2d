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
 * @module cherimoia/caesar
 */
define("cherimoia/caesar",

  ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    const VISCHS= " @N/\\Ri2}aP`(xeT4F3mt;8~%r0v:L5$+Z{'V)\"CKIc>z.*" +
                "fJEwSU7juYg<klO&1?[h9=n,yoQGsW]BMHpXb6A|D#q^_d!-",
    VISCHS_LEN=  VISCHS.length;

    /////////////////////////////////////////////////////////////////////////////
    //
    let identifyChar = (pos) => VISCHS.charAt(pos);
    let locateChar = (ch) => {
      for (let n= 0; n < VISCHS_LEN; ++n) {
        if (ch === VISCHS.charAt(n)) {
          return n;
        }
      }
      return -1;
    }
    let slideForward = (delta, cpos) => {
      let ptr= cpos + delta,
      np;
      if (ptr >= VISCHS_LEN) {
        np = ptr - VISCHS_LEN;
      } else {
        np = ptr;
      }
      return identifyChar(np);
    }
    let slideBack = (delta, cpos) => {
      let ptr= cpos - delta,
      np;
      if (ptr < 0) {
        np= VISCHS_LEN + ptr;
      } else {
        np= ptr;
      }
      return identifyChar(np);
    }
    let shiftEnc = (shiftpos, delta, cpos) => {
      if (shiftpos < 0) {
        return slideForward( delta, cpos);
      } else {
        return slideBack( delta, cpos);
      }
    }
    let shiftDec = (shiftpos, delta, cpos) => {
      if ( shiftpos <  0) {
        return slideBack( delta, cpos);
      } else {
        return slideForward( delta, cpos);
      }
    }

    /** @alias module:cherimoia/caesar */
    let exports = /** @lends exports# */ {
      /**
       * Encrypt the text.
       * @function
       * @param {String} clearText
       * @param {Number} shiftpos
       * @return {String} cipher text
       */
      encrypt(str,shiftpos) {

        if (sjs.isString(str) && str.length > 0 && shiftpos !== 0) {} else {
          return "";
        }
        const delta = sjs.xmod(Math.abs(shiftpos), VISCHS_LEN);
        const out=[];
        let p, ch, n, len= str.length;
        for (n=0; n < len; ++n) {
          ch = str.charAt(n);
          p= locateChar(ch);
          if (p < 0) {
            //ch
          } else {
            ch= shiftEnc(shiftpos, delta, p);
          }
          out.push(ch);
        }
        return out.join('');
      },

      /**
       * Decrypt the cipher.
       * @function
       * @param {String} cipher
       * @param {Number} shiftpos
       * @return {String} clear text
       */
      decrypt(cipher,shiftpos) {

        if (sjs.isString(cipher) && cipher.length > 0 && shiftpos !== 0) {} else {
          return "";
        }
        const delta = sjs.xmod(Math.abs(shiftpos),VISCHS_LEN);
        const out=[];
        let p, ch, n, len= cipher.length;
        for (n=0; n < len; ++n) {
          ch= cipher.charAt(n);
          p= locateChar(ch);
          if (p < 0) {
            //ch
          } else {
            ch= shiftDec(shiftpos, delta, p);
          }
          out.push(ch);
        }
        return out.join('');
      }

    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

