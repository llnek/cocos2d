
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks,
utils= bks.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
bks.MotionCtrlSystem = Ash.System.extend({

  constructor: function(options) {
    this.throttleWait= 100;
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.nodeList=null;
  },

  addToEngine: function(engine) {
    this.nodeList= engine.getNodeList(bks.ArenaNode);
    this.ops={};
    this.initKeyOps();
  },

  update: function (dt) {
    var node= this.nodeList.head;

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

    if (sh.main.keyboard[cc.KEY.right]) {
      this.ops.sftRight();
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      this.ops.sftLeft();
    }
    if (sh.main.keyboard[cc.KEY.down]) {
      this.ops.rotRight();
    }
    if (sh.main.keyboard[cc.KEY.up]) {
      this.ops.rotLeft();
    }
    if (sh.main.keyboard[cc.KEY.space]) {
      this.ops.sftDown();
    }

  },

  shiftRight: function() {
    this.nodeList.head.motion.right=true;
  },

  shiftLeft: function() {
    this.nodeList.head.motion.left=true;
  },

  shiftDown: function() {
    this.nodeList.head.motion.down=true;
  },

  rotateRight: function() {
    this.nodeList.head.motion.rotr=true;
  },

  rotateLeft: function() {
    this.nodeList.head.motion.rotl=true;
  },

  initKeyOps: function() {
    this.ops.sftRight = _.throttle(this.shiftRight.bind(this), this.throttleWait,{ trailing:false});
    this.ops.sftLeft= _.throttle(this.shiftLeft.bind(this), this.throttleWait, {trailing:false});
    this.ops.rotRight = _.throttle(this.rotateRight.bind(this), this.throttleWait, {trailing:false});
    this.ops.rotLeft = _.throttle(this.rotateLeft.bind(this), this.throttleWait, {trailing:false});
    this.ops.sftDown= _.throttle(this.shiftDown.bind(this), this.throttleWait, {trailing:false});
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



