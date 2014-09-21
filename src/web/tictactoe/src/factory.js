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

//////////////////////////////////////////////////////////////////////////////
//
ttt.EntityFactory = Ash.Class.extend({

  constructor: function(engine) {
    return this;
  },

  createBoard: function(options) {
    var csts= sh.xcfg.csts, bd= new ttt.GameBoard(options.size,
                                                  csts.CV_Z,
                                                  csts.CV_X,
                                                  csts.CV_O),
    ent = new Ash.Entity(),
    p2cat,p1cat,
    p2,p1;

    ent.add(new ttt.Board(options.size));
    ent.add(new ttt.UISelection());
    ent.add(new ttt.SmartAlgo(bd));
    ent.add(new ttt.NetPlay());

    switch (options.mode) {
      case sh.ONLINE_GAME:
        p2cat = csts.NETP;
        p1cat = csts.NETP;
      break;
      case sh.P1_GAME:
        p1cat= csts.HUMAN;
        p2cat= csts.BOT;
      break;
      case sh.P2_GAME:
        p2cat= csts.HUMAN;
        p1cat= csts.HUMAN;
      break;
    }
    p1= new ttt.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
    p2= new ttt.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
    options.players = [null,p1,p2];
    options.colors={};
    options.colors[csts.P1_COLOR] = p1;
    options.colors[csts.P2_COLOR] = p2;

    ent.add(new ttt.Grid(size,options.seed));
    ent.add(new ttt.GridView(size,sh.main));

    return ent;
  }


});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

