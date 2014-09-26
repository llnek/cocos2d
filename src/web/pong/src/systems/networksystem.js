
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
png= asterix.Pong,
utils= png.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
png.NetworkSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList= engine.getNodeList(png.NetPNode);
  },

  update: function (dt) {
    for (var node= this.nodeList.head; node; node=node.next) {
      if (cc.sys.capabilities['keyboard']) {
        this.processKeys(node,dt);
      }
      else
      if (cc.sys.capabilities['mouse']) {
      }
      else
      if (cc.sys.capabilities['touches']) {
      }
    }
  },

  processKeys: function(node,dt) {
    var p= node.paddle,
    m= node.motion,
    cs = p.kcodes;

    if (sh.main.keyboard[cs[0]]) {
      m.left=true;
    }

    if (sh.main.keyboard[cs[1]]) {
      m.right=true;
    }

  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



