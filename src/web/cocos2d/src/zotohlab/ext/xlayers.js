// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013-2015, Ken Leung. All rights reserved.

/**
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires ash-js
 * @module zotohlab/asx/xlayers
 */
define("zotohlab/asx/xlayers",

       ['cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'ash-js'],

  function (sjs, sh, ccsx, Ash) { "use strict";

    /** @alias module:zotohlab/asx/xlayers */
    var exports = {},
    xcfg = sh.xcfg,
    csts = xcfg.csts,
    R= sjs.ramda,
    SEED = 0,
    undef;

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends cc.Sprite
     * @class XLive
     */
    var XLive = cc.Sprite.extend({

      /**
       * @memberof module:zotohlab/asx/xlayers~XLive
       * @method ctor
       * @param {Number} x
       * @param {Number} y
       * @param {Object} options
       */
      ctor: function(x, y, options) {
        this._super();
        this.initWithSpriteFrameName(options.frames[0]);
        if (!!options.scale) {
          this.setScale(options.scale);
        }
        this.setPosition(x,y);
      }
    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @class XHUDLives
     */
    var XHUDLives = sjs.mixes({

      /**
       * Reduce life by x amount.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method reduce
       * @param {Number} x
       */
      reduce: function(x) {
        var n;
        for (n=0; n < x; ++n) {
          this.hud.removeIcon(this.icons.pop());
        }
        this.curLives -= x;
      },

      /**
       * Test if no more lives.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method isDead
       * @return {Boolean}
       */
      isDead: function() { return this.curLives < 0; },

      /**
       * Get the count of remaining lives.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method getLives
       * @return {Number}
       */
      getLives: function() { return this.curLives; },

      /**
       * Reset the icons.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method reset
       */
      reset: function() {
        R.forEach(function(z) {
          this.hud.removeIcon(z);
        }.bind(this),
        this.icons);

        this.curLives = this.options.totalLives;
        this.icons=[];
      },

      /**
       * Reset and refresh the hud.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method resurrect
       */
      resurrect: function() {
        this.reset();
        this.drawLives();
      },

      /**
       * Draw the icons for lives.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method drawLives
       */
      drawLives: function() {
        var y= this.topLeft.y - this.lifeSize.height * 0.5,
        x= this.topLeft.x + this.lifeSize.width * 0.5,
        gap=2,
        n, v;

        for (n = 0; n < this.curLives; ++n) {
          v= new XLive(x,y,this.options);
          this.hud.addIcon(v);
          this.icons.push(v);
          if (this.options.dir> 0) {
            x += this.lifeSize.width + gap;
          } else {
            x -= this.lifeSize.width - gap;
          }
        }
      },

      /**
       * Create and show the lives.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method reify
       */
      reify: function() {
        var dummy = new XLive(0,0,this.options);
        this.lifeSize = { width: ccsx.getScaledWidth(dummy),
                          height: ccsx.getScaledHeight(dummy) } ;
        this.drawLives();
      },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/xlayers~XHUDLives
       * @method ctor
       * @param {Object} hud
       * @param {Number} x
       * @param {Number} y
       * @param {Object} options
       */
      ctor: function(hud, x, y, options) {
        this.options = options || {};
        this.topLeft= cc.p(x,y);
        this.icons= [];
        this.hud= hud;
        this.curLives= -1;
        this.reset();
        if (! sjs.echt(this.options.dir)) {
          this.options.dir= 1;
        }
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends cc.Layer
     * @class XLayer
     */
    var XLayer = cc.Layer.extend({

      /**
       * The id of this layer.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method rtti
       * @return {String}
       */
      rtti: function() { return "layer-" + Number(SEED++); },

      /**
       * Register this atlas by creating a sprite-batch-node from it
       * and mapping it to this name.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method regoAtlas
       * @param {String} name
       * @param {Number} z - z-index
       * @param {Number} tag
       * @return {cc.SpriteBatchNode}
       */
      regoAtlas: function(name, z, tag) {
        var a= new cc.SpriteBatchNode(
                 cc.textureCache.addImage( sh.getAtlasPath(name)));
        if (! sjs.echt(tag)) {
          tag = ++this.lastTag;
        }
        if (! sjs.echt(z)) {
          z = this.lastZix;
        }
        this.addChild(a, z, tag);
        this.atlases[name] = a;
        return a;
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method pkInit
       * @param {Object} options
       * @protected
       */
      pkInit: function(options) { this.pkInput(); },

      /**
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method pkInput
       * @protected
       */
      pkInput: function() {},

      /**
       * Add Audio icon to UI.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method addAudioIcon
       * @param {Object} options
       */
      addAudioIcon: function(options) {
        var off= new cc.MenuItemSprite(new cc.Sprite('#sound_off.png'),
                                       new cc.Sprite('#sound_off.png'),
                                       new cc.Sprite('#sound_off.png'),
                                       sjs.NILFUNC, this),
        on= new cc.MenuItemSprite(new cc.Sprite('#sound_on.png'),
                                  new cc.Sprite('#sound_on.png'),
                                  new cc.Sprite('#sound_on.png'),
                                  sjs.NILFUNC, this),
        audio, menu,
        wb = ccsx.vbox();

        if (!!options.color) {
          off.setColor(options.color);
          on.setColor(options.color);
        }

        if (!!options.scale) {
          off.setScale(options.scale);
          on.setScale(options.scale);
        }

        audio= new cc.MenuItemToggle(on, off, function(sender) {
          if (sender.getSelectedIndex() === 0) {
            sh.toggleSfx(true);
          } else {
            sh.toggleSfx(false);
          }
        });

        if (!!options.anchor) {
          audio.setAnchorPoint(options.anchor);
        }

        if (xcfg.sound.open) {
          audio.setSelectedIndex(0);
        } else {
          audio.setSelectedIndex(1);
        }

        menu= new cc.Menu(audio);
        menu.setPosition(options.pos);
        this.addItem(menu);
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method onQuit
       * @protected
       */
      onQuit: function() {
        var ss= sh.protos[xcfg.game.start],
        yn= sh.protos[sh.ptypes.yn],
        dir = cc.director;

        dir.pushScene( yn.reify({
          onBack: function() {
            dir.popScene();
          },
          yes: function() {
            sh.sfxPlay('game_quit');
            dir.popToRootScene();
            dir.runScene(ss.reify());
          }
        }));
      },

      /**
       * Center an image chosen from this atlas.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method centerAtlasImage
       * @param {String} frame
       * @param {Object} atlas
       */
      centerAtlasImage: function(frame,atlas) {
        var bg= new cc.Sprite(frame),
        cw = ccsx.center();
        bg.setPosition(cw);
        if (!!atlas) {
          this.addAtlasItem(atlas, bg);
        } else {
          this.addItem(bg);
        }
      },

      /**
       * Center an image.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method centerImage
       * @param {String} frame
       */
      centerImage: function(frame) {
        this.centerAtlasImage(frame);
      },

      /**
       * Add an image chosen from this atlas.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method addAtlasFrame
       * @param {String} frame
       * @param {cc.Point} pos
       * @param {String} atlas
       */
      addAtlasFrame: function(frame,pos, atlas) {
        var tt= new cc.Sprite(frame);
        tt.setPosition(pos);
        if (!!atlas) {
          this.addAtlasItem(atlas, tt);
        } else {
          this.addItem(tt);
        }
      },

      /**
       * Add an image.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method addFrame
       * @param {String} frame
       * @param {cc.Point} pos
       */
      addFrame: function(frame,pos) {
        this.addAtlasFrame(frame, pos);
      },

      /**
       * Get the atlas.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method getAtlas
       * @param {String} name
       * @return {cc.SpriteBatchNode}
       */
      getAtlas: function(name) {
        return this.atlases[name || ""];
      },

      /**
       * Remove all children from this atlas.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method removeAtlasAll
       * @param {String} atlas
       * @param {Boolean} c
       */
      removeAtlasAll: function(atlas, c) {
        var a=this.getAtlas(atlas);
        if (!!a) { a.removeAllChildren(c || true); }
      },

      /**
       * Remove child from this atlas.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method removeAtlasItem
       * @param {String} atlas
       * @param {String} n - child
       * @param {Boolean} c
       */
      removeAtlasItem: function(atlas, n,c) {
        var a= this.getAtlas(atlas);
        if (!!a) { a.removeChild(n,c || true); }
      },

      /**
       * Remove all children.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method removeAll
       * @param {Boolean} c
       */
      removeAll: function(c) {
        this.removeAllChildren(c);
      },

      /**
       * Remove a child.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method removeItem
       * @param {Object} n
       * @param {Boolean} c
       */
      removeItem: function(n,c) {
        this.removeChild(n, c);
      },

      /**
       * Add a child to this atlas.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method addAtlasItem
       * @param {String} atlas
       * @param {Object} n
       * @param {Number} zx
       * @param {Number} tag
       */
      addAtlasItem: function(atlas, n, zx, tag) {
        var p= this.getAtlas(atlas),
        pzx = zx,
        ptag = tag;

        if (! sjs.echt(pzx)) {
          pzx = this.lastZix;
        }

        if (! sjs.echt(ptag)) {
          ptag = ++this.lastTag;
        }

        if (p instanceof cc.SpriteBatchNode &&
            n instanceof cc.Sprite) {
          n.setBatchNode(p);
        }

        p.addChild(n, pzx, ptag);
      },

      /**
       * Add a child.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method addChild
       * @param {Object} n - child
       * @param {Number} zx
       * @param {Number} tag
       */
      addItem: function(n,zx,tag) {
        var pzx = zx,
        ptag = tag;

        if (! sjs.echt(pzx)) {
          pzx = this.lastZix;
        }

        if (! sjs.echt(ptag)) {
          ptag = ++this.lastTag;
        }

        this.addChild(n, pzx, ptag);
      },

      /**
       * Remember the parent scene object.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method setParentScene
       * @param {cc.Scene} par
       */
      setParentScene: function(par) {
        this.ptScene=par;
      },

      /**
       * Init.
       *
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method init
       */
      init: function() {
        this._super();
        this.pkInit();
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XLayer
       * @method ctor
       * @param {Object} options
       */
      ctor: function(options) {
        this.options = options || {};
        this._super();
        this.lastTag= 0;
        this.lastZix= 0;
        this.atlases= {};
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends XLayer
     * @class XGameHUDLayer
     */
    var XGameHUDLayer = XLayer.extend({

      /**
       * Get the id.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method rtti
       * @return {String}
       */
      rtti: function() { return 'HUD'; },

      /**
       * Remove this icon.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method removeIcon
       * @param {Object} icon
       */
      removeIcon: function(icon) {
        this.removeAtlasItem(this.hudAtlas(), icon);
      },

      /**
       * Add an icon.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method addIcon
       * @param {Object} icon
       * @param {Number} z
       * @param {Number} idx
       */
      addIcon: function(icon, z, idx) {
        this.addAtlasItem(this.hudAtlas(), icon, z, idx);
      },

      hudAtlas: function() {
        return this.options.atlasId || 'game-pics';
      },

      /**
       * @private
       */
      pkInit: function(options) {
        this._super(options);

        this.scoreLabel = null;
        this.lives= null;
        this.score= 0;
        this.replayBtn = null;

        this.initAtlases();
        this.initIcons();
        this.initLabels();
        this.initCtrlBtns();
      },

      initAtlases: sjs.NILFUNC,
      initIcons: sjs.NILFUNC,
      initLabels: sjs.NILFUNC,

      initCtrlBtns: function() {
        var opts;

        opts= this.options.i_replay;
        if (!!opts) {
          this.addReplayIcon(ccsx.pmenu1(opts), opts.where);
        }

        opts= this.options.i_menu;
        if (!!opts) {
          this.addMenuIcon(ccsx.pmenu1(opts), opts.where);
        }
      },

      /**
       * Get the score.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method getScore
       * @return {Number}
       */
      getScore: function() { return this.score; },

      /**
       * Reset the HUD.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method reset
       */
      reset: function() {
        this.disableReplay();
        this.score= 0;
        if (this.lives) {
          this.lives.resurrect();
        }
      },

      /**
       * Reduce x amount of lives.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method reduceLives
       * @param {Number} x
       * @return {Boolean} - true if no more lives.
       */
      reduceLives: function(x) {
        this.lives.reduce(x);
        return this.lives.isDead();
      },

      /**
       * Update the score.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method updateScore
       * @param {Number}
       */
      updateScore: function(num) {
        this.score += num;
        this.scoreLabel.setString(Number(this.score).toString());
      },

      /**
       * Disable the replay button.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method disableReplay
       */
      disableReplay: function() {
        this.replayBtn.setVisible(false);
      },

      /**
       * Enable the replay button.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method enableReplay
       */
      enableReplay: function() {
        this.replayBtn.setVisible(true);
      },

      /**
       * Add the main menu icon.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method addMenuItem
       * @param {cc.Menu} menu
       * @param {Object} where
       */
      addMenuIcon: function(menu, where) {
        var c= menu.getChildByTag(1),
        hh = ccsx.getScaledHeight(c) * 0.5,
        hw = ccsx.getScaledWidth(c) * 0.5,
        wz= ccsx.vbox(),
        x,y;

        if (where === ccsx.acs.Bottom) {
          y = wz.bottom + csts.TILE  + hh;
        } else {
          y = wz.top - csts.TILE - hh;
        }
        menu.setPosition(wz.right - csts.TILE - hw, y);
        this.addItem(menu);
      },

      /**
       * Add a replay icon.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameHUDLayer
       * @method addReplayIcon
       * @param {cc.Menu} menu
       * @param {Object} where
       */
      addReplayIcon: function(menu, where) {
        var c= menu.getChildByTag(1),
        wz= ccsx.vbox(),
        x, y;

        if (where === ccsx.acs.Bottom) {
          y = wz.bottom + csts.TILE  + ccsx.getScaledHeight(c) * 0.5;
        } else {
          y = wz.top - csts.TILE  - ccsx.getScaledHeight(c) * 0.5;
        }
        menu.setPosition(wz.left + csts.TILE + ccsx.getScaledWidth(c) * 0.5, y);
        this.replayBtn=menu;
        this.addItem(menu);
      }

    });

    //////////////////////////////////////////////////////////////////////////////
    /**
     * @extends XLayer
     * @class XGameLayer
     */
    var XGameLayer = XLayer.extend({

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method pkInput
       * @protected
       */
      pkInput: function() {

        if (cc.sys.capabilities['keyboard'] &&
            !cc.sys.isNative) {
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
          this.cfgTouch();
        }else{
          sjs.loggr.debug('pkInput:  touch not supported');
        }
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method cfgTouch
       * @protected
       */
      cfgTouch: function() {
        this.cfgInputTouchOne();
        //this.cfgInputTouchesAll();
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method cfgInputKeyPad
       * @protected
       */
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

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method cfgInputMouse
       * @protected
       */
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
        sjs.loggr.debug('event === ' + sjs.jsonfy(event));
        /*
        var delta = event.getDelta();
        var curPos = cc.p(this._ship.x, this._ship.y);
        curPos = cc.pAdd(curPos, delta);
        curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(winSize.width, winSize.height));
        this._ship.x = curPos.x;
        curPos = null;
        */
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method cfgInputTouchAll
       * @protected
       */
      cfgInputTouchesAll: function() {
        cc.eventManager.addListener({
          prevTouchId: -1,
          event: cc.EventListener.TOUCH_ALL_AT_ONCE,
          onTouchesMoved: function (touches, event) {
            var touch = touches[0];
            if (this.prevTouchId != touch.getId()) {
                this.prevTouchId = touch.getId();
            } else  { event.getCurrentTarget().processEvent(touches[0]); }
          }
        }, this);
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method cfgInputTouchOne
       * @protected
       */
      cfgInputTouchOne: function() {
        cc.eventManager.addListener({
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: true,
          onTouchBegan: function(t,e) { return e.getCurrentTarget().onTouchBegan(t,e);},
          onTouchMoved: function(t,e) { return e.getCurrentTarget().onTouchMoved(t,e);},
          onTouchEnded: function(t,e) { return e.getCurrentTarget().onTouchEnded(t,e);}
        }, this);
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onTouchMoved
       * @protected
       */
      onTouchMoved: function(touch,event) {
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onTouchBegan
       * @protected
       */
      onTouchBegan: function(touch,event) {
        return true;
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onTouchEnded
       * @protected
       */
      onTouchEnded: function(touch,event) {
        var pt= touch.getLocation();
        sjs.loggr.debug("touch location [" + pt.x + "," + pt.y + "]");
        this.onclicked(pt.x, pt.y);
        return true;
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onKeyDown
       * @protected
       * @param {Event} e
       */
      onKeyDown:function (e) {
        //loggr.debug('onKeyDown: e = ' + e);
        this.keyboard[e] = true;
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onKeyUp
       * @protected
       * @param {Event} e
       */
      onKeyUp:function (e) {
        //loggr.debug('onKeyUp: e = ' + e);
        this.keyboard[e] = false;
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onMouseUp
       * @protected
       * @param {Event} evt
       */
      onMouseUp: function(evt) {
        var pt= evt.getLocation();
        sjs.loggr.debug("mouse location [" + pt.x + "," + pt.y + "]");
        this.onclicked(pt.x, pt.y);
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onTouchesEnded
       * @protected
       */
      onTouchesEnded: function (touches, event) {
        sjs.loggr.debug("touch event = " + event);
        sjs.loggr.debug("touch = " + touches);
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method keyPoll
       * @protected
       * @param {Number} key
       */
      keyPoll: function(key){
        return this.keyboard[key];
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method onclicked
       * @protected
       * @param {Number} x
       * @param {Number} y
       */
      onclicked: function(x,y) {
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method getEnclosureBox
       * @return {Object} - rect box.
       */
      getEnclosureBox: function() {
        return ccsx.vbox();
        /*
        var csts = xcfg.csts,
        wz = ccsx.vrect();
        return { top: wz.height - csts.TILE,
                 left: csts.TILE,
                 bottom: csts.TILE,
                 right: wz.width - csts.TILE };
         * */
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method setGameMode
       * @param {Number} mode
       */
      setGameMode: function(mode) {
        xcfg.csts.GAME_MODE=mode;
      },

      /**
       * Reset and create new Ash Engine.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method cleanSlate
       */
      cleanSlate: function() {
        this.engine= new Ash.Engine();
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method newGame
       * @param {Number} mode
       */
      newGame: function(mode) {
        if (xcfg.sound.open) {
          cc.audioEngine.stopAllEffects();
          cc.audioEngine.stopMusic();
        }
        this.onNewGame(mode);
        this.scheduleUpdate();
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method pkInit
       * @protected
       */
      pkInit: function() {
        var m= this.options.mode;
        this._super();

        if (m === sh.gtypes.ONLINE_GAME ||
            m === sh.gtypes.P2_GAME ||
            m === sh.gtypes.P1_GAME) {
          this.newGame(m);
        }
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method operational
       * @return {Boolean}
       */
      operational: function() { return true; },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method getBackgd
       * @return {cc.Layer} - background layer
       */
      getBackgd: function() {
        var rc= this.ptScene.getLayers();
        return rc['BackLayer'];
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method getHUD
       * @return {cc.Layer}  the HUD layer
       */
      getHUD: function() {
        var rc= this.ptScene.getLayers();
        return rc['HUD'];
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method update
       */
      update: function(dt) {
        if (this.operational()  && !!this.engine) {
          this.engine.update(dt);
        }
      },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method keys
       * @return {Array}  keys
       */
      keys: function() { return this.keyboard; },

      /**
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method rtti
       * @return {String}  id
       */
      rtti: function() { return 'GameLayer'; },

      /**
       * Constructor.
       *
       * @memberof module:zotohlab/asx/xlayers~XGameLayer
       * @method ctor
       * @param {Object} options
       */
      ctor: function(options) {
        this._super(options);
        this.keyboard= [];
        this.players= [];
        this.level= 1;
        this.actor= null;
        sh.main = this;
        var vbox= ccsx.vbox();
        sjs.loggr.debug('cc.view: vbox: left: ' + vbox.left +
                        ', bottom: ' + vbox.bottom +
                        ', top: ' + vbox.top +
                        ', right: ' + vbox.right);
      }

    });

    exports= {
      /**
       * @property {XGameHUDLayer.Class} XGameHUDLayer
       * @static
       */
      XGameHUDLayer: XGameHUDLayer,
      /**
       * @property {XGameLayer} XGameLayer
       * @static
       */
      XGameLayer: XGameLayer,
      /**
       * @property {XLayer.Class} XLayer
       * @static
       */
      XLayer: XLayer,
      /**
       * @property {XLive.Class} XLive
       * @static
       */
      XLive: XLive,
      /**
       * @property {XHUDLives.Class} XHUDLives
       * @static
       */
      XHUDLives: XHUDLives
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

