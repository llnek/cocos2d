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
              * @requires cherimoia/skaro
              * @module zotohlab/asx/math
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skaro = require("cherimoia/skaro");

var _skaro2 = _interopRequireDefault(_skaro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////////////
var radToDeg = function radToDeg(rad) {
  return 180 * rad / Math.PI;
};
var degToRad = function degToRad(deg) {
  return deg * Math.PI / 180;
};
var undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @class Vector2
 */

var Vector2 = function (_sjs$ES6Claxx) {
  _inherits(Vector2, _sjs$ES6Claxx);

  _createClass(Vector2, [{
    key: "mult",


    /**
     * Scalar multiplication.
     * @memberof module:zotohlab/asx/math~Vector2
     * @method mult
     * @param {Number} n
     * @return {Vector2} result.
     */
    value: function mult(n) {
      return new Vector2(0, 0, this.x * n, this.y * n);
    }

    /**
     * Transpose and rotate.
     * @memberof module:zotohlab/asx/math~Vector2
     * @method rotate
     * @return {Vector2} rotate.
     */

  }, {
    key: "rotate",
    value: function rotate(cx, cy, deg) {
      var rad = degToRad(deg),
          a = [cx + (Math.cos(rad) * (this.x - cx) - Math.sin(rad) * (this.y - y0)), cy + (Math.sin(rad) * (this.x - cx) + Math.cos(rad) * (this.y - y0))];
      this.x = a[0];
      this.y = a[1];
    }

    /**
     * Calculate the length of this vector.
     * @memberof module:zotohlab/asx/math~Vector2
     * @method length
     * @return {Number}
     */

  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Self identification.
     * @memberof module:zotohlab/asx/math~Vector2
     * @method toString
     * @return {String}
     */

  }, {
    key: "toString",
    value: function toString() {
      return ["[", this.x, ",", this.y, "]"].join('');
    }

    /**
     * Add 2 vectors together.
     * @memberof module:zotohlab/asx/math~Vector2
     * @method plus
     * @param {Vector2} v2
     * @return {Vector2} result.
     */

  }, {
    key: "plus",
    value: function plus(v2) {
      return new Vector2(0, 0, this.x + v2.x, this.y + v2.y);
    }

    /**
     * Subtract another vector.
     * @memberof module:zotohlab/asx/math~Vector2
     * @method minus
     * @param {Vector2} v2
     * @return {Vector2} result
     */

  }, {
    key: "minus",
    value: function minus(v2) {
      return new Vector2(0, 0, this.x - v2.x, this.y - v2.y);
    }

    /**
     * @method constructor
     * @private
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */

  }]);

  function Vector2(x1, y1, x2, y2) {
    _classCallCheck(this, Vector2);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Vector2).call(this));

    _this.x = x2 - x1;
    _this.y = y2 - y1;
    return _this;
  }

  return Vector2;
}(_skaro2.default.ES6Claxx);

/** @alias module:zotohlab/asx/math */


var xbox = {
  /**
   * Create a Vector2 object.
   * @method reifyVect2
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @return {Vector2}
   */

  reifyVect2: function reifyVect2(x1, y1, x2, y2) {
    return new Vector2(x1, y1, x2, y2);
  }
};

_skaro2.default.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF