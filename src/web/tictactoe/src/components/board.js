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

function mapGoalSpace (obj,size) {
  obj.ROWSPACE = [];
  obj.COLSPACE = [];
  var dx = [],
  dy = [],
  c, r, h, v;
  for (r=0; r < size; ++r) {
    h = [];
    v = [];
    for (c=0; c < size; ++c) {
      h.push(r * size + c);
      v.push(c * size + r);
    }
    obj.ROWSPACE.push(h);
    obj.COLSPACE.push(v);
    dx.push(r * size + r);
    dy.push((size - r - 1) * size + r);
  }
  obj.DAGSPACE = [dx, dy];
  obj.GOALSPACE = this.DAGSPACE.concat(this.ROWSPACE, this.COLSPACE);
}


//////////////////////////////////////////////////////////////////////////////
//
ttt.Board = Ash.Class.extend({

  constructor: function(size) {
    this.grid= sjs.makeArray(size * size, this.CV_Z);
    this.ncells = this.grid.length;
    this.size= size;
    this.CV_Z= 0;
    mapGoalSpace(this,size);
    return this;
  }

});


//////////////////////////////////////////////////////////////////////////////
//
ttt.NetAware = Ash.Class.extend({

  constructor: function() {
    return this;
  }

});





}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF


