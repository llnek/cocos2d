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

  constructor: function(state,factory) {
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

    if (this.state.wsock) {
      // online play
      sjs.loggr.debug("reply to server: session started ok");
      this.state.wsock.unsubscribeAll();
      this.state.wsock.subscribeAll(this.onevent,this);
      this.state.wsock.send({
        type: evts.SESSION_MSG,
        code: evts.C_STARTED
      });
      this.state.actor= '';
    } else {
      this.state.actor = sjs.randomSign() > 0 ? 'X' : 'O';
    }
  },

  process: function(node,dt) {
  },

  onevent: function(topic, evt) {
    //sjs.loggr.debug(evt);
    switch (evt.type) {
      case evts.NETWORK_MSG:
        this.onNetworkEvent(evt);
      break;
      case evts.SESSION_MSG:
        this.onSessionEvent(evt);
      break;
    }
  },

  onNetworkEvent: function(evt) {
    var h= this.getHUD();
    switch (evt.code) {
      case evts.C_RESTART:
        sjs.loggr.debug("restarting a new game...");
        h.killTimer();
        sh.main.play(false);
      break;
      case evts.C_STOP:
        sjs.loggr.debug("game will stop");
        h.killTimer();
        this.onStop(evt);
      break;
      default:
        //TODO: fix this hack
        this.onSessionEvent(evt);
      break;
    }
  },

  onSessionEvent: function(evt) {
    var pnum= _.isNumber(evt.source.pnum) ? evt.source.pnum : -1;
    var h= this.getHUD();
    this.maybeUpdateActions(evt);
    switch (evt.code) {
      case evts.C_POKE_MOVE:
        sjs.loggr.debug("player " + pnum + ": my turn to move");
        this.actor= this.players[pnum];
        h.showTimer();
        this.board.toggleActor(Cmd(this.actor));
      break;
      case evts.C_POKE_WAIT:
        sjs.loggr.debug("player " + pnum + ": my turn to wait");
        this.actor = this.players[pnum===1 ? 2 : 1];
        h.killTimer();
        this.board.toggleActor(Cmd(this.actor));
      break;
    }
  },

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF




