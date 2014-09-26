
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
utils= png.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
png.Resolution = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
    this.balls=null;
  },

  addToEngine: function(engine) {
    this.nodeList= engine.getNodeList(png.PaddleNode);
    this.balls= engine.getNodeList(png.BallNode);
    this.engine=engine;
  },

  update: function (dt) {
    var bnode = this.balls.head,
    winner;

    for (var node=this.nodeList.head; node; node=node.next) {
      winner =this.check(node,bnode);
      if (winner) {
        this.onWin(winner);
        return false;
      }
    }
  },

  onWin: function(winner) {
    var bnode= this.balls.head;
    sjs.loggr.debug("winner ====== " + winner);
    bnode.ball.sprite.setPosition(
    this.state.ball.x,
    this.state.ball.y);
    bnode.velocity.vel.x = this.state.ball.speed * sjs.randomSign();
    bnode.velocity.vel.y = this.state.ball.speed * sjs.randomSign();
    sh.fireEvent('/game/hud/score/update', { score: 1, color: winner });
  },

  //check win
  check: function(node,bnode) {
    var csts= sh.xcfg.csts,
    b= bnode.ball,
    pd= node.paddle,
    pc= pd.color,
    bp= b.sprite.getPosition();

    if (ccsx.isPortrait()) {

      if (pc === csts.P1_COLOR) {
        return bp.y < ccsx.getBottom(pd.sprite) ?
          csts.P2_COLOR : undef;
      } else {
        return bp.y > ccsx.getTop(pd.sprite) ?
          csts.P1_COLOR : undef;
      }

    } else {

      if (pc === csts.P1_COLOR) {
        return bp.x < ccsx.getLeft(pd.sprite) ?
          csts.P2_COLOR : undef;
      } else {
        return bp.x > ccsx.getRight(pd.sprite) ?
          csts.P1_COLOR : undef;
      }

    }

  }



});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



