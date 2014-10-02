
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
ast= sh.Asteroids,
utils= ast.SystemUtils;



//////////////////////////////////////////////////////////////////////////////
//
ast.MotionControls = Ash.System.extend({

  constructor: function(options) {
    this.throttleWait= 80;
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    this.ships=null;
  },

  addToEngine: function(engine) {
    this.ships= engine.getNodeList(ast.ShipMotionNode);
    this.ops={};
    this.initKeyOps();
  },

  update: function (dt) {
    var node= this.ships.head;

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
      this.ops.rotRight();
    }
    if (sh.main.keyboard[cc.KEY.left]) {
      this.ops.rotLeft();
    }
    if (sh.main.keyboard[cc.KEY.down]) {
      this.ops.sftDown();
    }
    if (sh.main.keyboard[cc.KEY.up]) {
      this.ops.sftUp();
    }
  },

  shiftDown: function() {
    this.ships.head.motion.down=true;
  },

  shiftUp: function() {
    this.ships.head.motion.up=true;
  },

  rotateRight: function() {
    this.ships.head.motion.right=true;
  },

  rotateLeft: function() {
    this.ships.head.motion.left=true;
  },

  initKeyOps: function() {
    this.ops.rotRight = _.throttle(this.rotateRight.bind(this), this.throttleWait, {trailing:false});
    this.ops.rotLeft = _.throttle(this.rotateLeft.bind(this), this.throttleWait, {trailing:false});
    this.ops.sftDown= _.throttle(this.shiftDown.bind(this), this.throttleWait, {trailing:false});
    this.ops.sftUp= _.throttle(this.shiftUp.bind(this), this.throttleWait, {trailing:false});
  }

});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF



