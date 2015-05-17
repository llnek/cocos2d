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
 * @module zotohlab/asx/ui
 */
define("zotohlab/asx/ui",

  ['cherimoia/skarojs'],

  function (sjs) { "use strict";

    /** @alias module:zotohlab/asx/ui */
    var exports = {},
    undef;

    //////////////////////////////////////////////////////////////////////
    /**
     * @class Circle
     */
    var Circle = sjs.mixes({

      /**
       * Draw this circle.
       *
       * @memberof module:zotohlab/asx/ui~Circle
       * @method draw
       * @param {Context} ctx
       * @param {Object} styleObj
       */
      draw: function(ctx, styleObj) {
        ctx.beginPath();
        ctx.strokeStyle = styleObj.stroke.style;
        ctx.lineWidth = styleObj.line.width;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.stroke();
      },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/ui~Circle
       * @method ctor
       * @param {Number} x
       * @param {Number} y
       * @param {Number} radius
       */
      ctor: function(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
      }

    });

    /**
     * @class Line
     */
    var Line = sjs.mixes({

      /**
       * Draw this line.
       *
       * @memberof module:zotohlab/asx/ui~Line
       * @method draw
       * @param {Context} ctx
       * @param {Object} styleObj
       */
      draw: function(ctx, styleObj) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = styleObj.stroke.style;
        ctx.lineWidth = styleObj.line.width;
        if (styleObj.line.cap != null) {
          ctx.lineCap = styleObj.line.cap;
        }
        ctx.stroke();
      },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/ui~Line
       * @method ctor
       * @param {Number} x1
       * @param {Number} y1
       * @param {Number} x2
       * @param {Number} y2
       */
      ctor: function(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
      }

    });

    /**
     * @class Point
     */
    var Point = sjs.mixes({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/ui~Point
       * @method ctor
       * @param {Number} x
       * @param {Number} y
       */
      ctor: function(x,y) {
        this.y=y;
        this.x=x;
      }
    });

    /**
     * @class Area
     */
    var Area = sjs.mixes({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/ui~Area
       * @method ctor
       * @param {Number} x
       * @param {Number} y
       * @param {Number} width
       * @param {Number} height
       */
      ctor: function(x,y,width,height) {
        this.pos= new Point(x,y);
        this.height=height;
        this.width=width;
      }
    });

    /**
     * @class TextStyle
     */
    var TextStyle = sjs.mixes({

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/ui~TextStyle
       * @method ctor
       */
      ctor: function() {
        this.font = "14px 'Architects Daughter'";
        this.fill = "#dddddd";
        this.align = "left";
        this.base = "top";
      }

    });

    exports= {
      /**
       * @property {TextStyle.Class} TextStyle
       * @static
       */
      TextStyle: TextStyle,
      /**
       * @property {Circle.Class} Circle
       * @static
       */
      Circle: Circle,
      /**
       * @property {Line.Class} Line
       * @static
       */
      Line: Line,
      /**
       * @property {Point.Class} Point
       * @static
       */
      Point: Point,
      /**
       * @property {Area.Class} Area
       * @static
       */
      Area: Area
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

