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

function mapGoalSpace(size) {
  var ROWSPACE = [],
  COLSPACE = [],
  dx = [],
  dy = [],
  c, r, h, v;

  for (r=0; r < size; ++r) {
    h = [];
    v = [];
    for (c=0; c < size; ++c) {
      h.push(r * size + c);
      v.push(c * size + r);
    }
    ROWSPACE.push(h);
    COLSPACE.push(v);
    dx.push(r * size + r);
    dy.push((size - r - 1) * size + r);
  }
  var DAGSPACE = [dx, dy];
  return DAGSPACE.concat(ROWSPACE, COLSPACE);
}

//////////////////////////////////////////////////////////////////////////////
//
ttt.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    this.engine=engine;
    return this;
  },

  createBoard: function(options) {
    var goals= mapGoalSpace(options.size),
    csts= sh.xcfg.csts,
    bd= new ttt.GameBoard(options.size,
                          csts.CV_Z,
                          csts.CV_X,
                          csts.CV_O, goals),
    ent = new Ash.Entity();

    ent.add(new ttt.Grid(options.size,options.seed));
    ent.add(new ttt.Board(options.size,goals));
    ent.add(new ttt.UISelection());
    ent.add(new ttt.SmartAlgo(bd));
    ent.add(new ttt.NetPlay());
    ent.add(new ttt.GridView(options.size,sh.main));

    options.GOALSPACE=goals;
    return ent;
  }



});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

