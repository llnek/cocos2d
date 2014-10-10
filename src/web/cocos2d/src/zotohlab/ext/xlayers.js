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

define("zotohlab/asx/xlayers", ['cherimoia/skarojs',
                               'zotohlab/asterix',
                               'zotohlab/asx/xcfg',
                               'zotohlab/asx/ccsx',
                               'ash-js'],
  function (sjs, sh, xcfg, ccsx, Ash) { "use strict";

    var R= sjs.ramda,
    SEED = 0,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    //
    var XLive = cc.Sprite.extend({
      ctor: function(x, y, options) {
        this._super();
        this.initWithSpriteFrameName(options.frames[0]);
        if ( sjs.echt(options.scale)) {
          this.setScale(options.scale);
        }
        this.setPosition(x,y);
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    //
    var XHUDLives = sjs.Class.xtends({

      reduce: function(howmany) {
        var n;
        for (n=0; n < howmany; ++n) {
          this.hud.removeItem(this.icons.pop());
        }
        this.curLives -= howmany;
      },

      isDead: function() { return this.curLives < 0; },
      getLives: function() { return this.curLives; },

      reset:function() {
        R.forEach(function(z) {
          this.hud.removeItem(z);
        }.bind(this),
        this.icons);

        this.curLives = this.options.totalLives;
        this.icons=[];
      },

      resurrect: function() {
        this.reset();
        this.drawLives();
      },

      drawLives: function() {
        var y= this.topLeft.y - this.lifeSize.height * 0.5,
        x= this.topLeft.x + this.lifeSize.width * 0.5,
        gap=2,
        n, v;

        for (n = 0; n < this.curLives; ++n) {
          v= new XLive(x,y,this.options);
          this.hud.addItem(v);
          this.icons.push(v);
          if (this.options.direction > 0) {
            x += this.lifeSize.width + gap;
          } else {
            x -= this.lifeSize.width - gap;
          }
        }
      },

      create: function() {
        var dummy = new XLive(0,0,this.options);
        this.lifeSize = { width: ccsx.getScaledWidth(dummy), height: ccsx.getScaledHeight(dummy) } ;
        this.drawLives();
      },

      ctor: function(hud, x, y, options) {
        this.options = options || {};
        this.hud= hud;
        this.curLives= -1;
        this.topLeft= cc.p(x,y);
        this.reset();
        if ( !sjs.echt(this.options.direction)) {
          this.options.direction = 1;
        }
      }

    });


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
    var XGameHUDLayer = XLayer.extend({

      rtti: function() { return 'HUD'; },

      pkInit: function() {
        this.scoreLabel = null;
        this.lives= null;
        this.score= 0;
        this.replayBtn = null;

        this.initParentNode();
        this.initLabels();
        this.initIcons();
        this.initCtrlBtns();

        return this._super();
      },

      getScore: function() {
        return this.score;
      },

      reset: function() {
        this.disableReplay();
        this.score= 0;
        if (this.lives) { this.lives.resurrect(); }
      },

      reduceLives: function(n) {
        this.lives.reduce(n);
        return this.lives.isDead();
      },

      updateScore: function(num) {
        this.score += num;
        this.scoreLabel.setString(Number(this.score).toString());
      },

      disableReplay: function() {
        this.replayBtn.setVisible(false);
      },

      enableReplay: function() {
        this.replayBtn.setVisible(true);
      },

      initCtrlBtns: function(scale, where) {
        var csts = xcfg.csts,
        wz= ccsx.screen(),
        cw= ccsx.center(),
        y, c, menu;

        where = where || 'cc.ALIGN_BOTTOM';
        scale = scale || 1;

        menu= ccsx.pmenu1({
          imgPath: sh.getImagePath('gui.mmenu.menu'),
          scale: scale,
          selector: function() {
            sh.fireEvent('/game/hud/controls/showmenu'); }
        });
        c= menu.getChildByTag(1);
        if (where === 'cc.ALIGN_TOP') {
          y = wz.height - csts.TILE  - ccsx.getScaledHeight(c) / 2
        } else {
          y = csts.TILE  + ccsx.getScaledHeight(c) / 2
        }
        menu.setPosition(wz.width - csts.TILE - ccsx.getScaledWidth(c)/2, y);
        this.addItem(menu);

        menu = ccsx.pmenu1({
          imgPath: sh.getImagePath('gui.mmenu.replay'),
          scale : scale,
          visible: false,
          selector: function() {
            sh.fireEvent('/game/hud/controls/replay'); }
        });
        c= menu.getChildByTag(1);
        if (where === 'cc.ALIGN_TOP') {
          y = wz.height - csts.TILE  - ccsx.getScaledHeight(c) / 2
        } else {
          y = csts.TILE  + ccsx.getScaledHeight(c) / 2
        }
        menu.setPosition(csts.TILE + ccsx.getScaledWidth(c)/2, y);
        this.replayBtn=menu;
        this.addItem(menu);
      }

    });


    //////////////////////////////////////////////////////////////////////////////
    //
    var XGameLayer = XLayer.extend({

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

      keyPoll: function(k){
        return this.keyboard[k];
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
        if (this.operational()  && !!this.engine) {
          this.engine.update(dt);
        }
      },

      keys: function() { return this.keyboard; },

      ctor: function(options) {
        this._super(options);
        this.keyboard= [];
        this.players= [];
        this.level= 1;
        this.actor= null;
        sh.main = this;
      }

    });

    return {
      XGameHUDLayer: XGameHUDLayer,
      XGameLayer: XGameLayer,
      XLayer: XLayer,
      XHUDLives: XHUDLives
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF
