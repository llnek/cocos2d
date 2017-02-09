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

"use strict";/**
 * @requires cherimoia/skaro
 * @module zotohlab/asx/ui
 */

import sjs from 'cherimoia/skaro';

//////////////////////////////////////////////////////////////////////
let undef;
//////////////////////////////////////////////////////////////////////
/**
 * @class Circle
 */
class Circle extends sjs.ES6Claxx {
  /**
   * Draw this circle.
   * @memberof module:zotohlab/asx/ui~Circle
   * @method draw
   * @param {Context} ctx
   * @param {Object} styleObj
   */
  draw(ctx, styleObj) {
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
  constructor(x, y, radius) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

}

/**
 * @class Line
 */
class Line extends sjs.ES6Claxx {
  /**
   * Draw this line.
   * @memberof module:zotohlab/asx/ui~Line
   * @method draw
   * @param {Context} ctx
   * @param {Object} styleObj
   */
  draw(ctx, styleObj) {
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
  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

/**
 * @class Point
 */
class Point extends sjs.ES6Claxx {
  /**
   * @memberof module:zotohlab/asx/ui~Point
   * @method constructor
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x,y) {
    super();
    this.y=y;
    this.x=x;
  }
}

/**
 * @class Area
 */
class Area extends sjs.ES6Claxx {
  /**
   * @memberof module:zotohlab/asx/ui~Area
   * @method constructor
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  constructor(x,y,width,height) {
    super();
    this.pos= new Point(x,y);
    this.height=height;
    this.width=width;
  }
}

/**
 * @class TextStyle
 */
class TextStyle extends sjs.ES6Claxx {
  /**
   * @memberof module:zotohlab/asx/ui~TextStyle
   * @method constructor
   */
  constructor() {
    super();
    this.font = "14px 'Architects Daughter'";
    this.fill = "#dddddd";
    this.align = "left";
    this.base = "top";
  }

}

/** @alias module:zotohlab/asx/ui */
const xbox= /** @lends xbox# */{
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

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

