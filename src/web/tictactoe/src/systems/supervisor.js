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
ttt= sh.TicTacToe,

Odin= global.ZotohLab.Odin,
evts= Odin.Events;


//////////////////////////////////////////////////////////////////////////////
//
ttt.GameSupervisor = Ash.System.extend({

  constructor: function(factory,state) {
    this.factory= factory;
    this.state= state;
    this.inited=false;
    this.actor=null;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    var b= this.factory.createBoard(this.state.size,
                                    this.state.mode,
                                    this.state);
    this.engine.addEntity(b);
    this.nodeList= engine.getNodeList(BoardNode);
  },

  update: function (dt) {
    for (var node = this.nodeList.head; node; node = node.next) {
      if (! this.inited) {
        this.onceOnly(node,dt);
        this.inited=true;
      } else {
        this.process(node,dt);
      }
    }
  },

  onceOnly: function(node,dt) {

    this.actor = node.board.start();
    if (this.state.wsock) {
      // online play
      sjs.loggr.debug("reply to server: session started ok");
      this.state.wsock.unsubscribeAll();
      this.state.wsock.subscribeAll(this.onevent,this);
      this.state.wsock.send({
        type: evts.SESSION_MSG,
        code: evts.C_STARTED
      });
    }
  },

  process: function(node,dt) {
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




