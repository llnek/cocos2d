
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
utils= png.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
png.NetworkSystem = Ash.System.extend({

  constructor: function(options) {
    this.netQ= options.netQ;
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
  },

  addToEngine: function(engine) {
    this.paddles= engine.getNodeList(png.PaddleNode);
    this.balls= engine.getNodeList(png.BallNode);
    this.fauxs= engine.getNodeList(png.FauxPaddleNode);
  },

  update: function (dt) {
    if (this.netQ.length > 0) {
      return this.onEvent(this.netQ.shift());
    }
  },

  syncScores: function(scores) {
    var actors= this.state.players,
    rc= {};
    rc[actors[2].color] = scores.p2;
    rc[actors[1].color] = scores.p1;
    sh.fireEvent('/game/hud/score/sync', { points: rc});
  },

  onEvent: function(evt) {

    sjs.loggr.debug("onEvent: => " + JSON.stringify(evt.source));

    var actors= this.state.players,
    node,
    ok= true;

    if (_.isObject(evt.source.winner)) {
      this.syncScores(evt.source.winner.scores);
      sh.fireEvent('/game/hud/end', {
        winner: actors[evt.source.winner.pnum].color
      });
      //this.ctx.updatePoints(rc);
      //this.ctx.doDone(win);
    }

    if (_.isObject(evt.source.scores)) {
      sjs.loggr.debug("server sent us new scores !!!!");
      this.syncScores(evt.source.scores);
      // once we get a new score, we reposition the entities
      // and pause the game (no moves) until the server
      // tells us to begin a new point.
      this.reposEntities();
      ok=false;
      this.state.running=false;
    }

    node= this.balls.head;
    if (_.isObject(evt.source.ball)) {
      sjs.loggr.debug("server says: Ball got SYNC'ED !!!");
      var c = evt.source.ball;
      node.ball.sprite.setPosition(c.x,c.y);
      node.velocity.vel.y= c.vy;
      node.velocity.vel.x= c.vx;
    }

    this.syncPaddles(this.paddles);
    this.syncPaddles(this.fauxs);

    return ok;
  },

  // reset back to default position, no movements
  reposPaddles: function(nl) {
    for (var node=nl.head;node;node=node.next) {
      if (node.player.pnum ===2) {
        node.paddle.sprite.setPosition(
          this.state.p2.x,
          this.state.p2.y
        )
        node.lastpos.lastDir=0;
      }
      if (node.player.pnum ===1) {
        node.paddle.sprite.setPosition(
          this.state.p1.x,
          this.state.p1.y
        )
        node.lastpos.lastDir=0;
      }
    }
  },

  reposEntities: function() {
    var node;

    this.reposPaddles(this.paddles);
    this.reposPaddles(this.fauxs);

    node=this.balls.head;
    node.ball.sprite.setPosition(
      this.state.ball.x,
      this.state.ball.y
    )
    node.velocity.vel.y=0;
    node.velocity.vel.x=0;
  },

  syncPaddles: function(nl, evt) {

    for (var node = nl.head; node; node=node.next) {

      if (_.isObject(evt.source.p2) &&
          node.player.pnum===2) {
        sjs.loggr.debug("server says: P2 got SYNC'ED !!!");
        this.syncOnePaddle(node, evt.source.p2);
      }

      if (_.isObject(evt.source.p1) &&
          node.player.pnum===1) {
        sjs.loggr.debug("server says: P1 got SYNC'ED !!!");
        this.syncOnePaddle(node, evt.source.p1);
      }
    }
  },

  syncOnePaddle: function(node, c) {
    var dir=0;
    node.paddle.sprite.setPosition(c.x, c.y);
    if (c.pv > 0) { dir = 1;}
    if (c.pv < 0) { dir = -1;}
    node.lastpos.lastDir = dir;
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



