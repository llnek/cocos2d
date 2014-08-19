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

  gameInProgress: false,
  actors: [],
  ball: null,

  onStopReset: function() {
    this.gameInProgress = false;
  },

  isActive: function() {
    return this.gameInProgress;
  },

  startRumble: function() {
  },

  animate: function() {
  },

  finz: function() {
    this.actors[2].dispose();
    this.actors[1].dispose();
    this.onStopReset();
    this.actors=[null,null,null];
    this.ball=null;
  },

  getPlayer2: function() { return this.actors[2]; },
  getPlayer1: function() { return this.actors[1]; },

  registerPlayers: function(ctx,p1,p2) {
    this.actors= [null, p1, p2];
    this.ctx=ctx;
    this.prepareGameEntities();
  },

  prepareGameEntities: function() {
    this.ctx.addItem(this.actors[1].create());
    this.ctx.addItem(this.actors[2].create());
    this.spawnBall();
  },

  disposeBall: function() {
    if (this.ball) {
      this.ball.dispose();
    }
    this.ball=null;
  },

  spawnNewBall: function() {
    this.spawnBall();
  },

  spawnBall: function() {
    var cw= ccsx.center();

    this.doSpawnBall(cw.x, cw.y, {});
    this.ctx.addItem(this.ball.create());
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

  updateEntities: function(dt) {
    this.doUpdateWorld(dt);
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
    this.options=options || {};
  }

});

png.NetArena = pngArena.xtends({

  startRumble: function() {
    sjs.loggr.debug("reply to server: session started ok");
    this.ctx.options.wsock.send({
      type: evts.SESSION_MSG,
      code: evts.C_STARTED,
      source: JSON.stringify(this.options)
    });
    _.each(this.actors, function(a) {
      if (a && a.wss) {
        this.lastY = a.sprite.getPosition().y;
        this.lastDir=0;
      }
    },this);
  },

  testMove: function(a) {
    var y= a.sprite.getPosition().y;
    var dir;
    if (y > this.lastY) {
      dir=1;
      // moving up
    } else if (y < this.lastY) {
      // moving down
      dir= -1;
    }
    else {
      dir=0;
    }
    this.lastY=y;
    if (this.lastDir !== dir) {
      // direction changed, tell server
      this.notifyServer(a,dir);
      this.lastDir=dir;
    }
  },

  notifyServer: function(actor,direction) {
    var pos = actor.sprite.getPosition();
    var src = {
      pos: { x: Math.floor(pos.x), y: Math.floor(pos.y) },
      dir: direction
    };
    this.ctx.options.wsock.send({
      type: evts.SESSION_MSG,
      code: evts.C_PLAY_MOVE,
      source: JSON.stringify(src)
    });
  },

  onEvent: function(evt) {
    if (_.isNumber(evt.source.dir) && _.isNumber(evt.source.pnum)) {
      var py= this.actors[evt.source.pnum];
      if (evt.source.pos) {
        py.sprite.setPosition(evt.source.pos.x, evt.source.pos.y);
      }
      py.setDir(evt.source.dir);
    }
    else if (evt.source.pos) {
      //this.ball.sprite.setPosition(pos.x,pos.y);
    }
  },

  doUpdateWorld: function(dt) {
    _.each(this.actors, function(a) {
      if (a && a.wss) {
        a.update(dt);
        this.testMove(a);
      }
    },this);
  },

  doCheckWorld: function() {
  },

  onEnqueue: function(cmd) {
    // update move to server
  },

  doSpawnBall: function(x,y,options) {
    this.ball = new png.NetBall(x,y,options);
  },

  animate: function() {
    this.gameInProgress = true;
  },

  isOnline: function() { return true; }


});

png.NonNetArena = pngArena.xtends({

  startRumble: function() {
    this.gameInProgress = true;
  },

  animate: function() {
  },

  doUpdateWorld: function(dt) {
    this.actors[2].update(dt);
    this.actors[1].update(dt);
    this.ball.update(dt);
  },

  doCheckWorld: function(dt) {
    var p1= this.actors[1];
    var p2= this.actors[2];

    var bs = this.ball.sprite,
    bp= bs.getPosition();

    if ( bp.x < ccsx.getLeft(p1.sprite)) {
      this.disposeBall();
      this.ctx.onWinner(p2);
    }
    else
    if (bp.x > ccsx.getRight(p2.sprite)) {
      this.disposeBall();
      this.ctx.onWinner(p1);
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

  doSpawnBall: function(x,y,options) {
    this.ball = new png.EntityBall( x, y, options);
    if (this.actors[2].isRobot()) {
        this.actors[2].bindBall(this.ball);
    }
  },

  isOnline: function() { return false; }

});



}).call(this);





