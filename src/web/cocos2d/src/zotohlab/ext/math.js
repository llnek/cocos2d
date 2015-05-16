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
 * @requires cherimoia/skarojs
 * @module zotohlab/asx/math
 */
define("zotohlab/asx/math", ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    /** @alias module:zotohlab/asx/math */
    var exports = {},
    undef;

    //////////////////////////////////////////////////////////////////////////////
    //
    function radToDeg(rad) {
      return 180 * rad / Math.PI;
    }

    function degToRad(deg) {
      return deg * Math.PI / 180;
    }

    //////////////////////////////////////////////////////////////////////////////
    //
    /**
     * @class Vector2
     */
    var Vector2 = sjs.mixes({

      /**
       * Scalar multiplication.
       *
       * @memberof module:zotohlab/asx/math~Vector2
       * @method mult
       * @param {Number} n
       * @return {Vector2} result.
       */
      mult: function (n) {
        return new Vector2(0,0,this.x * n,this.y * n);
      },

      /**
       * Transpose and rotate.
       *
       * @memberof module:zotohlab/asx/math~Vector2
       * @method rotate
       * @return {Vector2} rotate.
       */
      rotate: function(cx, cy, deg) {
        var rad = degToRad(deg),
        a= [cx + (Math.cos(rad) * (this.x - cx) - Math.sin(rad) * (this.y - y0)),
            cy + (Math.sin(rad) * (this.x - cx) + Math.cos(rad) * (this.y - y0)) ];
        this.x= a[0];
        this.y= a[1];
      },

      /**
       * Calculate the length of this vector.
       *
       * @memberof module:zotohlab/asx/math~Vector2
       * @method length
       * @return {Number}
       */
      length: function () {
        return Math.sqrt(this.x*this.x + this.y*this.y);
      },

      /**
       * Self identification.
       *
       * @memberof module:zotohlab/asx/math~Vector2
       * @method toString
       * @return {String}
       */
      toString: function () {
        return [ "[" , this.x , "," , this.y , "]" ].join('');
      },

      /**
       * Add 2 vectors together.
       *
       * @memberof module:zotohlab/asx/math~Vector2
       * @method plus
       * @param {Vector2} v2
       * @return {Vector2} result.
       */
      plus: function (v2) {
        return new Vector2(0,0,
        this.x + v2.x,
        this.y + v2.y);
      },

      /**
       * Subtract another vector.
       *
       * @memberof module:zotohlab/asx/math~Vector2
       * @method minus
       * @param {Vector2} v2
       * @return {Vector2} result
       */
      minus: function (v2) {
        return new Vector2(0,0,
        this.x - v2.x,
        this.y - v2.y);
      },

      /**
       * @method ctor
       * @private
       * @param {Number} x1
       * @param {Number} y1
       * @param {Number} x2
       * @param {Number} y2
       */
      ctor: function (x1, y1, x2, y2) {
        this.x = x2 - x1;
        this.y = y2 - y1;
      }

    });

    /**
     * Create a Vector2 object.
     *
     * @method reifyVect2
     * @static
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @return {Vector2}
     */
    exports.reifyVect2 = function(x1,y1,x2,y2) {
      return new Vector2(x1,y1,x2,y2);
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

