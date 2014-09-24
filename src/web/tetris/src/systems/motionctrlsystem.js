
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.MotionCtrlSystem = Ash.System.extend({

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
    if (cc.sys.capabilities['keyboard']) {
      this.processKeys(node,dt);
    }
    else
    if (cc.sys.capabilities['mouse']) {
    }
    else
    if (cc.sys.capabilities['touches']) {
    }
  },

  processKeys: function(node,dt) {
    var rc = new bks.Motion();
    if (sh.main.keyboard[cc.KEY.right]) {
      rc.right=true;
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      rc.left=true;
    }
    if (sh.main.keyboard[cc.KEY.down]) {
      rc.rotr=true;
    }
    if (sh.main.keyboard[cc.KEY.up]) {
      rc.rotl=true;
    }
    if (sh.main.keyboard[cc.KEY.space]) {
      rc.down=true;
    }
    this.state.eventQ.push(rc);
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



