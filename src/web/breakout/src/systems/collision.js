
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bko= sh.BreakOut,
utils= bko.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
bko.CollisionSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.paddles=null;
    this.balls=null;
  },

  addToEngine: function(engine) {
    this.paddles= engine.getNodeList(bko.PaddleMotionNode);
    this.balls= engine.getNodeList(bko.BallMotionNode);
  },

  update: function (dt) {
    var bnode = this.balls.head;

    if (this.paddles.head) {
      this.checkNodes(this.paddles.head, bnode);
    }
  },

  checkNodes: function(pnode,bnode) {
    if (ccsx.collide0(pnode.paddle.sprite,
                      bnode.ball.sprite)) {
      this.check(pnode,bnode);
    }
  },

  //ball hits paddle
  check: function(pnode,bnode) {
    var ball= bnode.ball,
    pad= pnode.paddle,
    hh= ball.sprite.getContentSize().height * 0.5,
    pos= ball.sprite.getPosition(),
    bv= bnode.velocity,
    top= ccsx.getTop(pad.sprite);

    ball.sprite.setPosition(pos.x, top+hh);
    bv.vel.y = - bv.vel.y;
  }



});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



