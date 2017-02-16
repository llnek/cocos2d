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
              * @module zotohlab/asx/ui
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _skaro = require("cherimoia/skaro");

var _skaro2 = _interopRequireDefault(_skaro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////
var undef = void 0;
//////////////////////////////////////////////////////////////////////
/**
 * @class Circle
 */

var Circle = function (_sjs$ES6Claxx) {
  _inherits(Circle, _sjs$ES6Claxx);

  _createClass(Circle, [{
    key: "draw",

    /**
     * Draw this circle.
     * @memberof module:zotohlab/asx/ui~Circle
     * @method draw
     * @param {Context} ctx
     * @param {Object} styleObj
     */
    value: function draw(ctx, styleObj) {
      ctx.beginPath();
      ctx.strokeStyle = styleObj.stroke.style;
      ctx.lineWidth = styleObj.line.width;
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
      ctx.stroke();
    }

    /**
     * @memberof module:zotohlab/asx/ui~Circle
     * @method constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     */

  }]);

  function Circle(x, y, radius) {
    _classCallCheck(this, Circle);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this));

    _this.x = x;
    _this.y = y;
    _this.radius = radius;
    return _this;
  }

  return Circle;
}(_skaro2.default.ES6Claxx);

/**
 * @class Line
 */


var Line = function (_sjs$ES6Claxx2) {
  _inherits(Line, _sjs$ES6Claxx2);

  _createClass(Line, [{
    key: "draw",

    /**
     * Draw this line.
     * @memberof module:zotohlab/asx/ui~Line
     * @method draw
     * @param {Context} ctx
     * @param {Object} styleObj
     */
    value: function draw(ctx, styleObj) {
      ctx.beginPath();
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
      ctx.strokeStyle = styleObj.stroke.style;
      ctx.lineWidth = styleObj.line.width;
      if (styleObj.line.cap != null) {
        ctx.lineCap = styleObj.line.cap;
      }
      ctx.stroke();
    }

    /**
     * @memberof module:zotohlab/asx/ui~Line
     * @method constructor
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */

  }]);

  function Line(x1, y1, x2, y2) {
    _classCallCheck(this, Line);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Line).call(this));

    _this2.x1 = x1;
    _this2.y1 = y1;
    _this2.x2 = x2;
    _this2.y2 = y2;
    return _this2;
  }

  return Line;
}(_skaro2.default.ES6Claxx);

/**
 * @class Point
 */


var Point = function (_sjs$ES6Claxx3) {
  _inherits(Point, _sjs$ES6Claxx3);

  /**
   * @memberof module:zotohlab/asx/ui~Point
   * @method constructor
   * @param {Number} x
   * @param {Number} y
   */

  function Point(x, y) {
    _classCallCheck(this, Point);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Point).call(this));

    _this3.y = y;
    _this3.x = x;
    return _this3;
  }

  return Point;
}(_skaro2.default.ES6Claxx);

/**
 * @class Area
 */


var Area = function (_sjs$ES6Claxx4) {
  _inherits(Area, _sjs$ES6Claxx4);

  /**
   * @memberof module:zotohlab/asx/ui~Area
   * @method constructor
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */

  function Area(x, y, width, height) {
    _classCallCheck(this, Area);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Area).call(this));

    _this4.pos = new Point(x, y);
    _this4.height = height;
    _this4.width = width;
    return _this4;
  }

  return Area;
}(_skaro2.default.ES6Claxx);

/**
 * @class TextStyle
 */


var TextStyle = function (_sjs$ES6Claxx5) {
  _inherits(TextStyle, _sjs$ES6Claxx5);

  /**
   * @memberof module:zotohlab/asx/ui~TextStyle
   * @method constructor
   */

  function TextStyle() {
    _classCallCheck(this, TextStyle);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(TextStyle).call(this));

    _this5.font = "14px 'Architects Daughter'";
    _this5.fill = "#dddddd";
    _this5.align = "left";
    _this5.base = "top";
    return _this5;
  }

  return TextStyle;
}(_skaro2.default.ES6Claxx);

/** @alias module:zotohlab/asx/ui */


var xbox = /** @lends xbox# */{
  /**
   * @property {TextStyle} TextStyle
   */
  TextStyle: TextStyle,
  /**
   * @property {Circle} Circle
   */
  Circle: Circle,
  /**
   * @property {Line} Line
   */
  Line: Line,
  /**
   * @property {Point} Point
   */
  Point: Point,
  /**
   * @property {Area} Area
   */
  Area: Area
};

_skaro2.default.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF