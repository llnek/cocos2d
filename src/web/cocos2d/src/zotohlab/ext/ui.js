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

define("zotohlab/asx/ui", ['cherimoia/skarojs'],
  function (sjs) { "use strict";
    var undef;

    //////////////////////////////////////////////////////////////////////
    //
    var Circle = sjs.Class.xtends({

      draw: function(ctx, styleObj) {
        ctx.beginPath();
        ctx.strokeStyle = styleObj.stroke.style;
        ctx.lineWidth = styleObj.line.width;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        ctx.stroke();
      },

      ctor: function(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
      }

    });

    var Line = sjs.Class.xtends({

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

      ctor: function(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
      }

    });

    var Point = sjs.Class.xtends({
      ctor: function(x,y) {
        this.y=y;
        this.x=x;
      }
    });

    var Area = sjs.Class.xtends({
      ctor: function(x,y,w,h) {
        this.pos= new Point(x,y);
        this.height=h;
        this.width=w;
      }
    });

    var TextStyle = sjs.Class.xtends({

      ctor: function() {
        this.font = "14px 'Architects Daughter'";
        this.fill = "#dddddd";
        this.align = "left";
        this.base = "top";
      }

    });

    return {

      TextStyle: TextStyle,
      Circle: Circle,
      Line: Line,
      Point: Point,
      Area: Area

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

