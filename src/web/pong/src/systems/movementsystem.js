
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
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList= engine.getNodeList(png.PaddleNode);
  },

  update: function (dt) {
    for (var node= this.nodeList.head; node; node=node.next) {
      this.process(node,dt);
    }
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



