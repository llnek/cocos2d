
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.RenderSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    //this.nodeList=null;
  },

  addToEngine: function(engine) {
  },

  update: function (dt) {
    return;
    for (var node= this.nodeList.head; node; node= node.next) {
      this.process(node,dt);
    }
  },

  process: function(node,dt) {
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF




