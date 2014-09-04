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

(function(undef) { "use stricts"; var global = this, _ = global._ ;

var asterix= global.ZotohLab.Asterix,
sh= global.ZotohLab.Asterix,
ccsx = asterix.COCOS2DX,
sjs = global.SkaroJS;


//////////////////////////////////////////////////////////////////////////////
// module def
//////////////////////////////////////////////////////////////////////////////

asterix.XGameLayer = asterix.XLayer.extend({

  keyboard: [],
  players: [],
  level: 1,
  actor: null,

  pkInput: function() {
    if (_.has(cc.sys.capabilities, 'keyboard')) {
      this.cfgInputKeyPad();
    }
    if (_.has(cc.sys.capabilities, 'mouse')) {
      this.cfgInputMouse();
    }
    if (_.has(cc.sys.capabilities, 'touches')) {
      //this.setTouchEnabled(true);
      //this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
    }
  },

  cfgInputKeyPad: function() {
    var me=this;
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed:function (key, event) {
        me.onKeyDown(key);
      },
      onKeyReleased:function (key, event) {
        me.onKeyUp(key);
      }
    }, this);
  },

  cfgInputMouse: function() {
    var me=this;
    cc.eventManager.addListener({
      event: cc.EventListener.MOUSE,
      onMouseUp: function(event){
        me.onMouseUp(event);
      }
    }, this);
  },

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
    sjs.loggr.debug("touch event = " + event);
    sjs.loggr.debug("touch = " + touches);
  },

  onclicked: function(x,y) {
  },

  getEnclosureRect: function() {
    var csts = sh.xcfg.csts,
    wz = ccsx.screen();
    return { top: wz.height - csts.TILE,
             left: csts.TILE,
             bottom: csts.TILE,
             right: wz.width - csts.TILE };
  },

  setGameMode: function(mode) {
    sh.xcfg.csts.GAME_MODE=mode;
  },

  newGame: function(mode) {
    cc.audioEngine.stopMusic();
    cc.audioEngine.stopAllEffects();
    this.onNewGame(mode);
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

        case 3:
          this.newGame(3);
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

