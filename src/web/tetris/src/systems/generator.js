
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.ShapeGenerator = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    engine.getNodeList(bks.ArenaNode);
    this.next= this.randNext();
  },

  update: function (dt) {
    var node = this.nodeList.head,
    shell = node.shell;
    if (shell.shape)
    {}
    else {
      shell.shape = this.spawnNext();
    }
  },

  spawnNext: function() {
    var shape= new bks.Shape(5 * csts.TILE,
                             ccsx.screen().height - csts.FIELD_TOP * csts.TILE,
                             this.next);
    utils.reifyShape(sh.main,node.collision.tiles,shape);
    this.initDropper();
    this.getHUD().showNext();
    return rc;
  },

  randNext: function() {
    var n= sjs.rand( bks.ShapeList.length),
    proto= bks.ShapeList[n],
    csts= sh.xcfg.csts;

    return {
      png: sjs.rand( sh.xcfg.csts.BLOCK_COLORS) + 1,
      rot: sjs.rand(proto.dim),
      model: proto
    };
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF


