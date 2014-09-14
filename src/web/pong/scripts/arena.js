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

  pause: function() {
    this.gameInProgress=false;
  },

  finz: function() {
    this.actors[2].dispose();
    this.actors[1].dispose();
    this.disposeBall();
    this.ball=null;
    this.onStopReset();
    this.actors=[null,null,null];
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

  reposEntities: function() {
  },

  disposeBall: function() {
    if (this.ball) {
      this.ball.dispose();
    }
    this.ball=null;
  },

  spawnNewBall: function() {
    this.disposeBall();
    this.spawnBall();
  },

  spawnBall: function() {
    var dft=this.options.ball;
    this.doSpawnBall(dft.x, dft.y, dft);
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

//////////////////////////////////////////////////////////////////////////////
// online game
png.NetArena = pngArena.xtends({

  startRumble: function() {
    sjs.loggr.debug("reply to server: session started ok");
    this.ctx.options.wsock.send({
      type: evts.SESSION_MSG,
      code: evts.C_STARTED,
      source: JSON.stringify(this.options)
    });
    // try to keep track of paddle movements
    _.each(this.actors, function(a) {
      if (a && a.wss) {
        this.lastY = a.sprite.getPosition().y;
        this.lastDir=0;
      }
    },this);
  },

  onStopReset: function() {
    //this.ctx.options.wsock.unsubscribeAll();
    this._super();
  },

  // inform the server that paddle has changed direction: up , down or stopped.
  notifyServer: function(actor,direction) {
    var vy = direction * this.options.paddle.speed;
    var pos = actor.sprite.getPosition();
    var pnum= this.ctx.options.pnum;
    var src, cmd = {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
      dir: direction,
      vy: vy
    };
    if (pnum === 2) {
      src = { p2: cmd };
    } else {
      src = { p1: cmd };
    }
    this.ctx.options.wsock.send({
      type: evts.SESSION_MSG,
      code: evts.C_PLAY_MOVE,
      source: JSON.stringify(src)
    });
  },

  onEvent: function(evt) {

    sjs.loggr.debug("onEvent: => " + JSON.stringify(evt.source));

    if (_.isObject(evt.source.winner)) {
      var win = this.actors[evt.source.winner.pnum],
      scores = evt.source.winner.scores,
      rc= {};

      rc[this.actors[2].color] = scores.p2;
      rc[this.actors[1].color] = scores.p1;

      this.ctx.updatePoints(rc);
      this.ctx.doDone(win);
    }

    if (_.isObject(evt.source.scores)) {
      sjs.loggr.debug("server sent us new scores !!!!");
      var rc= {};
      rc[this.actors[2].color] = evt.source.scores.p2;
      rc[this.actors[1].color] = evt.source.scores.p1;

      this.ctx.updatePoints(rc);
      _.each(this.actors, function(a) {
        if (a && a.wss) {
          this.lastY = a.sprite.getPosition().y;
          this.lastDir=0;
        }
      }, this);

      // once we get a new score, we reposition the entities
      // and pause the game (no moves) until the server
      // tells us to begin a new point.
      this.reposEntities();
      this.pause();
    }

    if (_.isObject(evt.source.ball) &&
        _.isObject(this.ball)) {
      sjs.loggr.debug("server says: Ball got SYNC'ED !!!");
      var c = evt.source.ball;
      this.ball.sprite.setPosition(c.x,c.y);
      this.ball.vel.y= c.vy;
      this.ball.vel.x= c.vx;
    }

    if (_.isObject(evt.source.p2)) {
      sjs.loggr.debug("server says: P2 got SYNC'ED !!!");
      var py= this.actors[2];
      var c = evt.source.p2;
      var dir=0;
      py.sprite.setPosition(c.x, c.y);
      if (c.vy > 0) { dir = 1;}
      if (c.vy < 0) { dir = -1;}
      py.setDir(dir);
    }

    if (_.isObject(evt.source.p1)) {
      sjs.loggr.debug("server says: P1 got SYNC'ED !!!");
      var py= this.actors[1];
      var c = evt.source.p1;
      var dir=0;
      py.sprite.setPosition(c.x, c.y);
      if (c.vy > 0) { dir = 1;}
      if (c.vy < 0) { dir = -1;}
      py.setDir(dir);
    }

  },

  // reset back to default position, no movements
  reposEntities: function() {
    var sp= this.actors[2].sprite,
    obj = this.options.p2;

    sp.setPosition(obj.x, obj.y);
    this.actors[2].setDir(0);

    sp= this.actors[1].sprite;
    obj= this.options.p1;
    sp.setPosition(obj.x, obj.y);
    this.actors[1].setDir(0);

    obj= this.options.ball;
    sp= this.ball.sprite;
    sp.setPosition(obj.x, obj.y);
    this.ball.vel.y=0;
    this.ball.vel.x=0;
  },

  maybeNotifyServer: function(a) {
    var y= a.sprite.getPosition().y,
    dir=0,
    delta= Math.abs(y - this.lastY);

    if (delta >= 1) {
      if (y > this.lastY) {
        dir=1;
        // moving up
      } else if (y < this.lastY) {
        // moving down
        dir= -1;
      }
    }
    this.lastY=y;
    if (this.lastDir !== dir) {
      // direction changed, tell server
      this.notifyServer(a,dir);
      this.lastDir=dir;
    }
  },

  doUpdateWorld: function(dt) {
    _.each(this.actors, function(a) {
      if (a) {
        if (a.wss) {
          a.update(dt);
          this.maybeNotifyServer(a);
        } else {
          a.simulateMove(dt);
        }
      }
    },this);
    this.ball.update(dt);
  },

  doCheckWorld: function() {

    var p1= this.actors[1];
    var p2= this.actors[2];

    var bs = this.ball.sprite,
    bp= bs.getPosition();

    /*
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
    */
    if (ccsx.collide(p2,this.ball)) {
      p2.check(this.ball);
    }
    else
    if ( ccsx.collide(p1,this.ball)) {
      p1.check(this.ball);
    }
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

//////////////////////////////////////////////////////////////////////////////
// basic game, no network
png.NonNetArena = pngArena.xtends({

  startRumble: function() {
    this.gameInProgress = true;
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





