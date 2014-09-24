
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks,
utils=bks.SystemUtils;

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
    this.nodeList=engine.getNodeList(bks.ArenaNode);
    this.nextShapeInfo= this.randNext();
    this.nextShape=null;
  },

  update: function (dt) {
    var node = this.nodeList.head,
    shell = node.shell;
    if (shell.shape)
    {}
    else {
      shell.shape = this.reifyNextShape(node);
      //show new next shape in preview window
      this.previewNextShape();
      //activate drop timer
      node.dropper.dropSpeed=1000;
      utils.initDropper(sh.main,node.dropper);
    }
  },

  reifyNextShape: function(node) {
    var csts= sh.xcfg.csts,
    shape= new bks.Shape(5 * csts.TILE,
                             ccsx.screen().height - csts.FIELD_TOP * csts.TILE,
                             this.nextShapeInfo);
    //create new shape
    return utils.reifyShape(sh.main,node.collision.tiles,shape);
  },

  previewNextShape: function() {
    var info = this.randNext(),
    csts = sh.xcfg.csts,
    par= sh.main,
    wz = ccsx.screen(),
    cw = ccsx.center(),
    shape,
    sz = info.model.dim * csts.TILE,

    left = (csts.FIELD_W + 2) * csts.TILE,
    x = left + (wz.width - left - csts.TILE) * 0.5,
    y = cw.y;

    x -= sz * 0.5;
    y += sz * 0.5;

    this.nextShape= utils.disposeShape(this.nextShape);
    shape= new bks.Shape(x,y, info);
    this.nextShapeInfo= info;
    this.nextShape= utils.previewShape(par, shape);
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


