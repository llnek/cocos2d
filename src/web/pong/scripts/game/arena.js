// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

(function(undef) { "use strict"; var global=this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
sjs= global.SkaroJS;

var Odin= global.ZotohLab.Odin,
evts= Odin.Events;

var Cmd= {

  actor: null, // 1 or 2
  move: 0  // 1 or -1

};


//////////////////////////////////////////////////////////////////////////////
// game layer
//////////////////////////////////////////////////////////////////////////////

var pngArena = sjs.Class.xtends({

  gameInProgress; false,
  actors: [],
  ball: null,

  onStopReset: function() {
    this.gameInProgress = false;
  },

  finz: function() {
    this.onStopReset();
    this.actors=[null,null,null];
  },

  getPlayer2: function() { return this.actors[2]; },
  getPlayer1: function() { return this.actors[1]; },

  registerPlayers: function(p1,p2) {
    this.actors= [null, p1, p2];
  },

  getOtherPlayer: function(color) {
    if (color === this.actors[1]) {
      return this.actors[2];
    }
    else if (color === this.actors[2]) {
      return this.actors[1];
    } else {
      return null;
    }
  },

  checkEntities: function() {
    this.doCheckWorld();
  },

  enqueue: function(cmd) {
    if (cmd.actor === this.actors[1] ||
        cmd.actor === this.actors[2]) {
      this.onEnqueue(cmd);
    }
  },

  isOnline: function() {
    throw Error("Abstract method called.");
  },

  ctor: function(options) {

  }

});

var png.NetArena = pngArena.xtends({

  doCheckWorld: function() {
  },

  onEnqueue: function(cmd) {
    // update move to server
  },

  isOnline: function() { return true; }

});

var png.NonNetArena = pngArena.xtends({

  doCheckWorld: function(dt) {
    var p1= this.actors[1];
    var p2= this.actors[2];

    p1.update(dt);
    p2.update(dt);
    this.ball.update(dt);

    var bs = this.ball.sprite,
    bp= bs.getPosition();

    if ( bp.x < ccsx.getLeft(p1.sprite)) {
      this.onWinner(p2);
    }
    else
    if (bp.x > ccsx.getRight(p2.sprite)) {
      this.onWinner(p1);
    }
    else
    if (ccsx.collide(p2,this.ball)) {
      p2.check(this.ball);
    }
    else
    if ( ccsx.collide(p1,this.ball)) {
      p1.check(this.ball);
    }

  },

  onEnqueue: function(cmd) {
    cmd.actor.update(cmd.move);
  },

  isOnline: function() { return false; }

});



}).call(this);





