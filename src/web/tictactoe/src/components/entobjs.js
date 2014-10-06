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

function moduleFactory(sjs, sh, xcfg, negax, Ash) { "use strict";
var lib= {},
undef;

//////////////////////////////////////////////////////////////////////////////
//
lib.SmartAlgo = Ash.Class.extend({

  constructor: function(board) {
    this.algo= new negax.Algo(board);
  }

});

//////////////////////////////////////////////////////////////////////////////
//
lib.Board = Ash.Class.extend({

  constructor: function(size, goals) {
    this.GOALSPACE= goals;
    this.size=size;
  }

});

//////////////////////////////////////////////////////////////////////////////
//
lib.Grid = Ash.Class.extend({

  constructor: function(size,seed) {
    //ignore seed for now
    this.values= sjs.makeArray(size * size, xcfg.csts.CV_Z);
    this.size=size;
  }

});


//////////////////////////////////////////////////////////////////////////////
//
function mapGridPos (self) {
  // memorize the co-ordinates of each cell on the board, so
  // we know which cell the user has clicked on.
  var csts= xcfg.csts,
  gzh = 3 * csts.HOLE + 2 * csts.R_GAP,
  y2, y1 = csts.TILE * ((csts.GRID_H + gzh) * 0.5),
  x2, x1 = csts.LEFT * csts.TILE,
  hz = csts.TILE * csts.HOLE,
  r,c,n, _results = [];

  for (n=0; n < csts.CELLS; ++n) { self.gridMap[n] = []; }
  for (r=0; r < csts.GRID_SIZE; ++r) {
    for (c= 0; c < csts.GRID_SIZE; ++c) {
      x2 = x1 + hz;
      y2 = y1 - hz;
      self.gridMap[r * csts.GRID_SIZE + c] = [x1, y1, x2, y2];
      x1 = x2 + csts.C_GAP * csts.TILE;
    }
    y1 = y1 - (csts.HOLE + csts.R_GAP) * csts.TILE;
    x1 = csts.LEFT * csts.TILE;
    _results.push(x1);
  }
}

lib.GridView = Ash.Class.extend({

  constructor: function(size, layer) {
    var m = xcfg.assets.sprites['gamelevel1.sprites.markers'];
    this.gridMap= sjs.makeArray(size * size, null);
    this.cells= sjs.makeArray(size * size, null);
    this.layer= layer;
    this.width= m[1];
    this.height= m[2];
    this.url= sh.sanitizeUrl(m[0]);
    mapGridPos(this);
  }

});

//////////////////////////////////////////////////////////////////////////////
//
lib.NetPlay = Ash.Class.extend({

  constructor: function() {
    this.event= null;
  }

});


//////////////////////////////////////////////////////////////////////////////
//
lib.Player = Ash.Class.extend({

  constructor: function(category,value,id,color,labels) {
    this.color= color;
    this.pnum=id;
    this.category= category;
    this.value= value;
    this.offset = id === 1 ? 0 : 1;
  }

});

//////////////////////////////////////////////////////////////////////////////
//
lib.UISelection = Ash.Class.extend({

  constructor: function() {
    this.cell = -1;
    this.px = -1;
    this.py = -1;
  }

});


return lib;
}

//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;

  if (typeof gDefine === 'function' && gDefine.amd) {

    gDefine("zotohlab/p/entobjs",
            ['cherimoia/skarojs',
             'zotohlab/asterix',
             'zotohlab/asx/xcfg',
             'zotohlab/asx/negamax',
             'ash-js'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {
  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

