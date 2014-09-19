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

  createBoard: function(size,mode,options) {
    var p = new Ash.Entity(),
    ws2,ws1,
    p2,p1;

    if (online) { p.add(new ttt.NetAware()); }
    p.add(new ttt.Board());
    p.add(new ttt.UISelection());
    switch (mode) {
      case sh.ONLINE_GAME:
        if (options.pnum === 1) {
          ws1= options.wsock;
        } else {
          ws2= options.wsock;
        }
        p2= new ttt.NetPlayer(csts.CV_O, 2, 'O', options.p2ids, ws2);
        p1= new ttt.NetPlayer(csts.CV_X, 1, 'X', options.p1ids, ws1);
      break;
      case sh.P1_GAME:
        p2= new ttt.BotPlayer(csts.CV_O, 2, 'O', options.p2ids);
        p1= new ttt.Player(csts.CV_X, 1, 'X', options.p1ids);
      break;
      case sh.P2_GAME:
        p1= new ttt.Player(csts.CV_X, 1, 'X', options.p1ids);
        p2= new ttt.Player(csts.CV_O, 2, 'O', options.p2ids);
      break;
    }
    p.add(new ttt.Grid(size,options.seed));
    p.add(new ttt.GridView(size));
    p.add(p2);
    p.add(p1);
    return p;
  }


});



}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

