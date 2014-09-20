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
ttt.TurnBaseSystem = Ash.System.extend({

  constructor: function(state) {
    this.state= state;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(e) {
    this.nodeList = engine.getNodeList(BoardNode);
  },

  update: function (dt) {
    for (var node = this.nodeList.head; node; node=node.next) {
      this.process(node, dt);
    }
  },

  process: function(node, evt) {
    var ps= node.players.cache,
    cp= ps[this.state.actor],
    csts= sh.xcfg.csts,
    board= node.board,
    grid= node.grid,
    bot= node.robot,
    sel= node.selection;

    //handle online play
    if (this.state.wsock) {

      if (this.state.pnum === cp.pnum &&
          sel.cell >= 0) {
        this.enqueue(sel.cell,cp.value,grid);
      }

    }
    else
    if (cp.category === csts.BOT) {
      bot.algo.getGameBoard().syncState(grid.values);
      cell= bot.algo.eval();
      this.enqueue(cell,cp.value,grid);
    }
    else
    if (sel.cell >= 0) {
      this.enqueue(cell,cp.value,grid);
    }

    sel.cell= -1;
  },

  enqueue: function(pos, value, grid) {
    var vs= grid.values;
    if ((pos >= 0 && pos < vs.length) &&
        sh.xcfg.csts.CV_Z === vs[pos]) {

      if (this.state.wsock) {

      } else {
        vs[pos] = value;
      }

      this.toggleActor();
    }
  },

  toggleActor: function() {
    var cp= this.state.actor;
    if (cp === 'X') {
      this.state.actor= 'O';
    }
    else
    if (cp === 'O') {
      this.state.actor= 'X';
    }
  }



});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




