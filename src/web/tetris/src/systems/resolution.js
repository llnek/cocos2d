
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks,
utils= bks.SystemUtils;


//////////////////////////////////////////////////////////////////////////////
//
bks.ResolutionSystem = Ash.System.extend({

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

  update: function (dt) {
    var node= this.nodeList.head,
    cmap= node.collision.tiles,
    shape= node.shell.shape,
    motion = node.motion;

    if (shape) {

      if (motion.right) {
        utils.shiftRight(sh.main,cmap,shape);
      }

      if (motion.left) {
        utils.shiftLeft(sh.main,cmap,shape);
      }

      if (motion.rotr) {
        utils.rotateRight(sh.main,cmap,shape);
      }

      if (motion.rotl) {
        utils.rotateLeft(sh.main,cmap,shape);
      }

      if (motion.down) {
        this.fastDrop(node);
      }

    }

    motion.right = false;
    motion.left = false;
    motion.rotr = false;
    motion.rotl = false;
    motion.down = false;
  },

  fastDrop: function(node) {
    var dp= node.dropper;
    dp.timer=null;
    utils.setDropper(sh.main,dp,dp.dropRate,9000);
  }


});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF




