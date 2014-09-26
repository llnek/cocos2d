
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
utils= png.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
png.MovementSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.paddles=null;
    this.balls= null;
  },

  addToEngine: function(engine) {
    this.paddles= engine.getNodeList(png.PaddleNode);
    this.balls= engine.getNodeList(png.BallNode);
  },

  update: function (dt) {
    var csts = sh.xcfg.csts,
    bnode= this.balls.head,
    node;
    for (node= this.paddles.head; node; node=node.next) {
      if (node.player.category === csts.BOT) {
        this.moveRobot(dt,node,bnode);
      } else {
        this.process(dt,node);
      }
    }
    this.processBall(dt,bnode);
  },

  //TODO: better AI please
  moveRobot: function(dt,node,bnode) {
    var bp= bnode.ball.sprite.getPosition(),
    pos = node.paddle.sprite.getPosition(),
    speed= this.state.paddle.speed,
    velo = bnode.velocity,
    y= undef,
    x= undef;

    if (ccsx.isPortrait()) {

      if (bp.x > pos.x) {
        if (velo.vel.x > 0) {
          x = pos.x + dt * speed;
        }
      } else {
        if (velo.vel.x < 0) {
          x = pos.x - dt * speed;
        }
      }

    } else {

      if (bp.y > pos.y) {
        if (velo.vel.y > 0) {
          y = pos.y + dt * speed;
        }
      } else {
        if (velo.vel.y < 0) {
          y = pos.y - dt * speed;
        }
      }

    }

    if (sjs.echt(x)) {
      node.paddle.sprite.setPosition(x,pos.y);
      this.clamp(node.paddle.sprite);
    }

    if (sjs.echt(y)) {
      node.paddle.sprite.setPosition(pos.x,y);
      this.clamp(node.paddle.sprite);
    }

  },

  processBall: function(dt,node) {
    var v = node.velocity,
    b= node.ball,
    rc,
    pos= b.sprite.getPosition(),
    rect= ccsx.bbox(b.sprite);

    rect.x = pos.x;
    rect.y = pos.y;

    rc=ccsx.traceEnclosure(dt,this.state.world,
                           rect,
                           v.vel);
    if (rc.hit) {
      v.vel.x = rc.vx;
      v.vel.y = rc.vy;
    } else {
    }
    b.sprite.setPosition(rc.x,rc.y);
  },

  process: function(dt,node) {
    var p= node.paddle,
    s= p.speed * dt,
    m= node.motion,
    x,y,
    pos= p.sprite.getPosition();

    if (m.right) {
      if (ccsx.isPortrait()) {
        x = pos.x + s;
        y = pos.y;
      } else {
        y = pos.y + s;
        x= pos.x;
      }
      p.sprite.setPosition(x,y);
    }

    if (m.left) {
      if (ccsx.isPortrait()) {
        x = pos.x - s;
        y = pos.y;
      } else {
        y = pos.y - s;
        x= pos.x;
      }
      p.sprite.setPosition(x,y);
    }

    m.right = false;
    m.left= false;

    this.clamp(p.sprite);
  },

  clamp: function(sprite) {
    var pos= sprite.getPosition(),
    world= this.state.world,
    x= undef,
    y= undef,
    hw2= ccsx.halfHW(sprite),
    bb4= ccsx.bbox4(sprite);

    if (ccsx.isPortrait()) {
      if (bb4.right > world.right) {
        x = world.right - hw2[0];
      }
      if (bb4.left < world.left) {
        x = world.left + hw2[0];
      }
    } else {
      if (bb4.top > world.top) {
        y = world.top - hw2[1];
      }
      if (bb4.bottom < world.bottom) {
        y = world.bottom + hw2[1];
      }
    }

    if (sjs.echt(x)) {
      sprite.setPosition(x, pos.y);
    }

    if (sjs.echt(y)) {
      sprite.setPosition(pos.x, y);
    }
  }


});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



