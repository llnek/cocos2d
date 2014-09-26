
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
    for (var node= this.paddles.head; node; node=node.next) {
      this.process(node,dt);
    }
    this.processBall(this.balls.head, dt);
  },

  processBall: function(node,dt) {
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

  process: function(node,dt) {
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



