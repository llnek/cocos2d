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
    if (cc.sys.capabilities['keyboard']) {
      cc.log('pkInput:  keyboard supported');
      this.cfgInputKeyPad();
    }else{
      cc.log('pkInput:  keyboard not supported');
    }
    if (cc.sys.capabilities['mouse']) {
      cc.log('pkInput:  mouse supported');
      this.cfgInputMouse();
    }else{
      cc.log('pkInput:  mouse not supported');
    }
    if (cc.sys.capabilities['touches']) {
      cc.log('pkInput:  touch supported');
      this.cfgInputTouchOne();
    }else{
      cc.log('pkInput:  touch not supported');
    }
  },

  cfgInputKeyPad: function() {
    cc.eventManager.addListener({
      onKeyPressed: function (key, event) {
        event.getCurrentTarget().onKeyDown(key);
      },
      onKeyReleased:function (key, event) {
        event.getCurrentTarget().onKeyUp(key);
      },
      event: cc.EventListener.KEYBOARD
    }, this);
  },

  cfgInputMouse: function() {
    cc.eventManager.addListener({
      onMouseUp: function(event){
        event.getCurrentTarget().onMouseUp(event);
      },
      event: cc.EventListener.MOUSE
    }, this);
  },

  //TODO: handle touch drag and move
  processEvent:function (event) {
    cc.log('event === ' + JSON.stringify(event));
    /*
    var delta = event.getDelta();
    var curPos = cc.p(this._ship.x, this._ship.y);
    curPos = cc.pAdd(curPos, delta);
    curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(winSize.width, winSize.height));
    this._ship.x = curPos.x;
    curPos = null;
    */
  },

  cfgInputTouchesAll: function() {
    cc.eventManager.addListener({
      onTouchesMoved:function (touches, event) {
        var touch = touches[0];
        if (this.prevTouchId != touch.getId()) {
          this.prevTouchId = touch.getId();
        } else {
          event.getCurrentTarget().processEvent(touches[0]);
        }
      },
      prevTouchId: -1,
      event: cc.EventListener.TOUCH_ALL_AT_ONCE
    }, this);
  },

  cfgInputTouchOne: function() {
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function(t,e) { return e.getCurrentTarget().onTouchBegan(t,e);},
      onTouchMoved: function(t,e) { return e.getCurrentTarget().onTouchMoved(t,e);},
      onTouchEnded: function(t,e) { return e.getCurrentTarget().onTouchEnded(t,e);}
    }, this);
  },

  onTouchMoved: function(touch,event) {
  },

  onTouchBegan: function(touch,event) {
    var pt= touch.getLocation();
    cc.log("touch location [" + pt.x + "," + pt.y + "]");
    this.onclicked(pt.x, pt.y);
    return true;
  },

  onTouchEnded: function(touch,event) {
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
    cc.log("mouse location [" + pt.x + "," + pt.y + "]");
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

  cleanSlate: function() {
    this.engine= new Ash.Engine();
  },

  newGame: function(mode) {
    if (sh.xcfg.sound.open) {
      cc.audioEngine.stopAllEffects();
      cc.audioEngine.stopMusic();
    }
    this.onNewGame(mode);
    this.scheduleUpdate();
  },

  pkInit: function() {

    var m= this.options.mode,
    rc= this._super();

    if (rc) {
      if (m === sh.ONLINE_GAME ||
          m === sh.P2_GAME ||
          m === sh.P1_GAME) {
        this.newGame(m);
      } else {
        rc=false;
      }
    }

    return rc;
  },

  operational: function() { return true; },

  updateEntities: function(dt) {
  },

  checkEntities: function(dt) {
  },

  update: function(dt) {
    if (this.operational() ) {
      if (this.engine) {
        this.engine.update(dt);
      } else {
        this.updateEntities(dt);
        this.checkEntities(dt);
      }
    }
  },

  ctor: function(options) {
    this._super(options);
    sh.main = this;
  }

});

Object.defineProperty(asterix.XGameLayer.prototype, "keys", {
  get: function() { return this.keyboard; }
});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

