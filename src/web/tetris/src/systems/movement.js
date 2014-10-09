
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks,
utils= bks.SystemUtils;


//////////////////////////////////////////////////////////////////////////////
//
bks.MovementSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList = engine.getNodeList(bks.ArenaNode);
  },

  update: function(dt) {
    var node= this.nodeList.head,
    shape=node.shell.shape,
    drop=node.dropper;

    if (shape &&
        ccsx.timerDone(drop.timer)) {
      this.doFall();
    }
  },

  doFall: function() {
    var node = this.nodeList.head,
    cmap= node.collision.tiles,
    emap= node.blocks.grid,
    shape= node.shell.shape,
    pu= node.pauser,
    dp= node.dropper;

    if (shape) {
      if (! utils.moveDown(sh.main, cmap, shape)) {

        // lock shape in place
        utils.lock(node,shape);

        //
        if (! pu.timer) {
          //utils.disposeShape(shape);
          node.shell.shape= null;
          shape.bricks=[];
        }
        node.shell.shape= null;
        shape.bricks=[];
      } else {
        utils.initDropper(sh.main, dp);
      }
    }
  }


});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF





