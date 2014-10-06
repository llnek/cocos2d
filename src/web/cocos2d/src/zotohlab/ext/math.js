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

function moduleFactory(sjs, undef) { "use strict";

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
var Vector2 = sjs.Class.xtends({

  mult: function (n) {
    var rc = new Vector2(0,0,this.x,this.y);
    rc.x *= n;
    rc.y *= n;
    return rc;
  },

  rotate: function(cx, cy, deg) {
    var rad = degToRad(deg);
    var a= [cx + (Math.cos(rad) * (this.x - cx) - Math.sin(rad) * (this.y - y0)),
            cy + (Math.sin(rad) * (this.x - cx) + Math.cos(rad) * (this.y - y0)) ];
    this.x= a[0];
    this.y= a[1];
  },

  length: function () {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  },

  toString: function () {
    return [ "[" , this.x , "," , this.y , "]" ].join('');
  },

  plus: function (v2) {
    var rc = new Vector2(0,0,0,0);
    rc.x = this.x + v2.x;
    rc.y = this.y + v2.y;
    return rc;
  },

  minus: function (v2) {
    var rc = new Vector2(0,0,0,0);
    rc.x = this.x - v2.x;
    rc.y = this.y - v2.y;
    return rc;
  },

  ctor: function (x1, y1, x2, y2) {
    this.x = x2 - x1;
    this.y = y2 - y1;
  }

});



return {
  Vector2: Vector2
};


}


//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("cherimoia/math", ['cherimoia/skarojs'], moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

