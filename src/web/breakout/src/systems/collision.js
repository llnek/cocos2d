
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
    this.fences= engine.getNodeList(bko.BricksNode);
    this.engine=engine;
  },

  update: function (dt) {
    var bnode = this.balls.head,
    pnode= this.paddles.head,
    fnode= this.fences.head;

    if (!fnode) { return; }
    if (!bnode) { return; }
    if (!pnode) { return; }

    if (! this.onPlayerKilled(pnode,bnode)) {
      this.checkNodes(pnode, bnode);
      this.checkBricks(fnode, bnode,dt);
    }
  },

  onPlayerKilled: function(pnode,bnode) {
    var pos= bnode.ball.sprite.getPosition();

    if (pos.y < ccsx.getBottom(pnode.paddle.sprite)) {
      sh.main.removeItem(pnode.paddle.sprite);
      sh.main.removeItem(bnode.ball.sprite);
      this.balls.remove(bnode);
      this.engine.removeEntity(bnode.entity);
      this.paddles.remove(pnode);
      this.engine.removeEntity(pnode.entity);
      sh.fireEvent('/game/objects/players/killed');
      return true;
    } else {
      return false;
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
  },

  checkBricks: function(fence,bnode,dt) {
    var bss = fence.fence.bricks,
    n,
    m= bnode.ball;

    for (n=0; n < bss.length; ++n) {
      if (bss[n].status !== true) { continue; }
      if (ccsx.collide0(m.sprite, bss[n].sprite)) {
        this.onBrick(bnode, bss[n]);
        break;
      }
    }
  },

  onBrick: function(bnode, brick) {
    var kz= brick.sprite.getContentSize(),
    bz = bnode.ball.sprite.getContentSize(),
    velo= bnode.velocity,
    ks= brick.sprite,
    bs= bnode.ball.sprite,
    ka = { L: ccsx.getLeft(ks), T: ccsx.getTop(ks),
           R: ccsx.getRight(ks), B: ccsx.getBottom(ks) },
    ba = { L : ccsx.getLeft(bs), T: ccsx.getTop(bs),
           R: ccsx.getRight(bs), B: ccsx.getBottom(bs) };

    // ball coming down from top?
    if (ba.T > ka.T &&  ka.T > ba.B) {
      velo.vel.y = - velo.vel.y;
    }
    else
    // ball coming from bottom?
    if (ba.T > ka.B &&  ka.B > ba.B) {
      velo.vel.y = - velo.vel.y;
    }
    else
    // ball coming from left?
    if (ka.L > ba.L && ba.R > ka.L) {
      velo.vel.x = - velo.vel.x;
    }
    else
    // ball coming from right?
    if (ka.R > ba.L && ba.R > ka.R) {
      velo.vel.x = - velo.vel.x;
    }
    else {
      sjs.loggr.error("Failed to determine the collision of ball and brick.");
      return;
    }
    sh.fireEvent('/game/objects/players/earnscore', {
      value: brick.value
    });
    brick.sprite.setVisible(false);
    brick.status=false;
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



