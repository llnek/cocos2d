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

function moduleFactory(sjs, asterix, ccsx, xcfg, Ash, undef) { "use stricts";
var sh = asterix,
SEED = 0;


//////////////////////////////////////////////////////////////////////////////
//
var XLayer = cc.Layer.extend({

  lastTag: 0,
  lastZix: 0,

  pkInit: function() {
    this.pkInput();
    return true;
  },

  pkInput: function() {
  },

  rtti: function() {
    return "" + Number(SEED++);
  },

  getNode: function() {
    return this;
  },

  removeAllItems: function(c) {
    this.getNode().removeAllChildren(c || true);
  },

  removeItem: function(n,c) {
    this.getNode().removeChild(n,c || true);
  },

  addItem: function(n,zx,tag) {
    var zOrder = sjs.echt(zx) ? zx : this.lastZix,
    p= this.getNode(),
    ptag = tag;

    if (! sjs.echt(ptag)) {
      ptag = ++this.lastTag;
    }

    if (p instanceof cc.SpriteBatchNode &&
        n instanceof cc.Sprite) {
      n.setBatchNode(p);
    }

    p.addChild(n, zOrder, ptag);
  },

  setParent: function(par) {
    this.ptScene=par;
  },

  init: function() {
    return this._super() ? this.pkInit() : false;
  },

  ctor: function(options) {
    this.options = options || {};
    this._super();
  }

});

//////////////////////////////////////////////////////////////////////////////
//
var XGameLayer = XLayer.extend({

  keyboard: [],
  players: [],
  level: 1,
  actor: null,

  pkInput: function() {
    if (cc.sys.capabilities['keyboard']) {
      sjs.loggr.debug('pkInput:  keyboard supported');
      this.cfgInputKeyPad();
    }else{
      sjs.loggr.debug('pkInput:  keyboard not supported');
    }
    if (cc.sys.capabilities['mouse']) {
      sjs.loggr.debug('pkInput:  mouse supported');
      this.cfgInputMouse();
    }else{
      sjs.loggr.debug('pkInput:  mouse not supported');
    }
    if (cc.sys.capabilities['touches']) {
      sjs.loggr.debug('pkInput:  touch supported');
      this.cfgInputTouchOne();
    }else{
      sjs.loggr.debug('pkInput:  touch not supported');
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
    sjs.loggr.debug('event === ' + JSON.stringify(event));
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
    sjs.loggr.debug("touch location [" + pt.x + "," + pt.y + "]");
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
    sjs.loggr.debug("mouse location [" + pt.x + "," + pt.y + "]");
    this.onclicked(pt.x, pt.y);
  },

  onTouchesEnded: function (touches, event) {
    sjs.loggr.debug("touch event = " + event);
    sjs.loggr.debug("touch = " + touches);
  },

  onclicked: function(x,y) {
  },

  getEnclosureRect: function() {
    var csts = xcfg.csts,
    wz = ccsx.screen();
    return { top: wz.height - csts.TILE,
             left: csts.TILE,
             bottom: csts.TILE,
             right: wz.width - csts.TILE };
  },

  setGameMode: function(mode) {
    xcfg.csts.GAME_MODE=mode;
  },

  cleanSlate: function() {
    this.engine= new Ash.Engine();
  },

  newGame: function(mode) {
    if (xcfg.sound.open) {
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

Object.defineProperty(XGameLayer.prototype, "keys", {
  get: function() { return this.keyboard; }
});


return {
  XGameLayer: XGameLayer,
  XLayer: XLayer
};

}


//////////////////////////////////////////////////////////////////////////////
// export
(function () { "use strict"; var global=this, gDefine=global.define;


  if(typeof gDefine === 'function' && gDefine.amd) {

    gDefine("cherimoia/zlab/asterix/xlayers",
            ['cherimoia/skarojs',
             'cherimoia/zlab/asterix',
             'cherimoia/zlab/asterix/ccsx',
             'cherimoia/zlab/asterix/xcfg',
             'ash-js'],
            moduleFactory);

  } else if (typeof module !== 'undefined' && module.exports) {
  } else {

    global['cherimoia']['zlab']['asterix']['xlayers'] =
      moduleFactory(global.cherimoia.skarojs,
                    global.cherimoia.zlab.asterix,
                    global.cherimoia.zlab.asterix.ccsx,
                    global.cherimoia.zlab.asterix.xcfg,
                    global.Ash);

  }

}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF



