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
Odin= global.ZotohLab.Odin,
ccsx= asterix.CCS2DX,
sjs= global.SkaroJS,
evts= Odin.Events,
sh= asterix,
ttt= sh.TicTacToe;



//////////////////////////////////////////////////////////////////////////////
//
ttt.TurnBaseSystem = Ash.System.extend({

  constructor: function(options) {
    this.state= options;
    this.botTimer=null;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList = engine.getNodeList(ttt.BoardNode);
  },

  update: function (dt) {
    if (this.state.running) {
      for (var node = this.nodeList.head; node; node=node.next) {
        this.process(node, dt);
      }
    }
  },

  process: function(node, evt) {
    var ps= this.state.players,
    cp= ps[this.state.actor],
    csts= sh.xcfg.csts,
    board= node.board,
    grid= node.grid,
    bot= node.robot,
    sel= node.selection;

    //handle online play
    if (this.state.wsock) {
      //if the mouse click is from the valid user, handle it
      if (cp && (this.state.pnum === cp.pnum)) {
        this.enqueue(sel.cell,cp.value,grid);
      }

    }
    else
    if (cp.category === csts.BOT) {
      //create some small delay...
      if (this.botTimer) {} else {
        this.botTimer = setTimeout(function() {
          var bd= bot.algo.getGameBoard();
          bd.syncState(grid.values, this.state.players[this.state.actor].value);
          var rc= bd.getFirstMove();
          if (!sjs.echt(rc)) { rc = bot.algo.eval(); }
          this.enqueue(rc,cp.value,grid);
          this.botTimer=null;
        }.bind(this), 1000);
      }
    }
    else
    if (sel.cell >= 0) {
      //possibly a valid click ? handle it
      this.enqueue(sel.cell,cp.value,grid);
    }

    sel.cell= -1;
  },

  enqueue: function(pos, value, grid) {

    if ((pos >= 0 && pos < grid.values.length) &&
        sh.xcfg.csts.CV_Z === grid.values[pos]) {

      var pnum;

      sh.fireEvent('/game/hud/timer/hide');

      if (this.state.wsock) {
        this.onEnqueue(grid,this.state.actor,pos);
      } else {
        pnum = this.state.actor===1 ? 2 : 1;
        this.state.actor = pnum;
        grid.values[pos] = value;
        if (this.state.players[pnum].category === sh.xcfg.csts.HUMAN) {
          sh.fireEvent('/game/hud/timer/show');
        }
      }

    }
  },

  onEnqueue: function(grid,pnum,cell) {
    var src= {
      color: this.state.players[pnum].color,
      value: this.state.players[pnum].value,
      grid: grid.values,
      cell: cell
    },
    evt= {
      source: JSON.stringify(src),
      type: evts.SESSION_MSG,
      code: evts.C_PLAY_MOVE
    };
    this.state.wsock.send(evt);
    this.state.actor=0;
  }


});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




