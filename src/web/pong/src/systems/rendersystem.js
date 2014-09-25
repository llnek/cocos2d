
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
utils= png.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
png.RenderSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    //this.nodeList= engine.getNodeList(png.PaddleNode);
  },

  update: function (dt) {
  }


});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



