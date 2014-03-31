// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2014 Cherimoia, LLC. All rights reserved.

(function(undef) { "use stricts"; var global = this, _ = global._ ,
asterix= global.ZotohLabs.Asterix,
ccsx = asterix.COCOS2DX,
sh = asterix.Shell,
loggr= global.ZotohLabs.logger;

//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameLayer = asterix.XLayer.extend({

  keyboard: [],
  players: [],
  level: 1,
  actor: null,

  onKeyDown:function (e) {
    //loggr.debug('onKeyDown: e = ' + e);
    this.keyboard[e] = true;
  },

  onKeyUp:function (e) {
    //loggr.debug('onKeyUp: e = ' + e);
    this.keyboard[e] = false;
  },

  onMouseUp: function(evt) {
    var pt= evt.getLocation();
    //loggr.debug("mouse location [" + pt.x + "," + pt.y + "]");
    this.onclicked(pt.x, pt.y);
  },

  onTouchesEnded: function (touches, event) {
    loggr.debug("touch event = " + event);
    loggr.debug("touch = " + touches);
  },

  onclicked: function(x,y) {
  },

  setGameMode: function(mode) {
    sh.xcfg.csts.GAME_MODE=mode;
  },

  pkInit: function() {

    var rc= this._super();

    if (rc) {
      switch (this.options.mode) {

        case 2:
          this.newGame(2);
        break;

        case 1:
          this.newGame(1);
        break;

        default:
          rc= false;
        break;
      }

      if (rc) {
        this.scheduleUpdate();
      }
    }

    return rc;
  },

  updateEntities: function(dt) {
  },

  checkEntities: function(dt) {
  },

  operational: function() {
    return true;
  },

  update: function(dt) {
    if (this.operational() ) {
      this.updateEntities(dt);
      this.checkEntities(dt);
    }
  },

  ctor: function(options) {
    this._super(options);
    sh.main = this;
  }


});

Object.defineProperty(asterix.XGameLayer.prototype, "keys", {
  get: function() {
    return this.keyboard;
  }
});


}).call(this);

