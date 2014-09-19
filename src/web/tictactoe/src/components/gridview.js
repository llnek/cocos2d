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

(function (undef){ "use strict"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
sh= asterix,
ttt= sh.TicTacToe;

function mapGridPos (self) {
  // memorize the co-ordinates of each cell on the board, so
  // we know which cell the user has clicked on.
  var csts= sh.xcfg.csts,
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

//////////////////////////////////////////////////////////////////////////////
//
ttt.GridView = Ash.Class.extend({

  constructor: function(size) {
    var m = sh.xcfg.assets.sprites['gamelevel1.sprites.markers'];
    this.cells= sjs.makeArray(size * size, null);
    this.width= m[1];
    this.height= m[2];
    this.url= sh.sanitizeUrl(m[0]);
    mapGridPos(this);
    return this;
  }

});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


