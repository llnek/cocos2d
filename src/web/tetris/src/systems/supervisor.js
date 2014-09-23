
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.GameSupervisor = Ash.System.extend({

  constructor: function(options) {
    this.factory = options.factory;
    this.state = options;
    this.inited=false;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {

  },

  update: function (dt) {

  },

  onceOnly: function () {

  }


});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF


