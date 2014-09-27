
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
utils= png.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
png.CollisionSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
    this.fauxs=null;
    this.balls=null;
  },

  addToEngine: function(engine) {
    this.fauxs= engine.getNodeList(png.FauxPaddleNode);
    this.nodeList= engine.getNodeList(png.PaddleNode);
    this.balls= engine.getNodeList(png.BallNode);
  },

  update: function (dt) {
    var bnode = this.balls.head;

    this.checkNodes(this.nodeList,bnode);
    this.checkNodes(this.fauxs,bnode);
  },

  checkNodes: function(nl,bnode) {
    for (var node=nl.head; node; node=node.next) {
      if (ccsx.collide0(node.paddle.sprite,
                        bnode.ball.sprite)) {
        this.check(node,bnode);
      }
    }
  },

  //ball hits paddle
  check: function(node,bnode) {
    var pos = bnode.ball.sprite.getPosition(),
    bb4 = ccsx.bbox4(node.paddle.sprite),
    velo = bnode.velocity,
    csts = sh.xcfg.csts,
    x= pos.x,
    y= pos.y,
    hw2= ccsx.halfHW(bnode.ball.sprite);

    if (ccsx.isPortrait()) {
      velo.vel.y = - velo.vel.y;
    } else {
      velo.vel.x = - velo.vel.x;
    }

    if (node.paddle.color === csts.P1_COLOR) {
      if (ccsx.isPortrait()) {
        y=bb4.top + hw2[1];
      } else {
        x=bb4.right + hw2[0];
      }
    } else {
      if (ccsx.isPortrait()) {
        y = bb4.bottom - hw2[1];
      } else {
        x = bb4.left - hw2[0];
      }
    }

    bnode.ball.sprite.setPosition(x,y);
    sh.sfxPlay(node.paddle.snd);
  }



});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



