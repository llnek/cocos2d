
(function (undef) { "use strict"; var global = this, _ = global._ ;

var asterix = global.ZotohLab.Asterix,
sh = global.ZotohLab.Asterix,
sjs= global.SkaroJS,
ccsx= asterix.COCOS2DX,
bks= asterix.Bricks;

//////////////////////////////////////////////////////////////////////////////
//
bks.MovementSystem = Ash.System.extend({

  constructor: function(options) {
    this.state = options;
    return this;
  },

  removeFromEngine: function(engine) {
    //this.nodeList=null;
  },

  addToEngine: function(engine) {
  },

  update: function(dt) {
    return;
    if (ccsx.timerDone(this.state.dropper)) {
      this.doFall();
      if (this.state.dropper) {
        utils.initDropper();
      }
    }
  },

  doFall: function() {
    if (this.state.curShape && ! this.curShape.moveDown()) {

      this.dropper= null;

      // lock shape in place
      this.curShape.lock();
      this.postLockCheckLine();

      //
      if (! this.pauseTimer) {
        this.spawnNext();
      } else {
        this.curShape=null;
      }
    }
  }


});



}).call(this);

///////////////////////////////////////////////////////////////////////////////
//EOF





