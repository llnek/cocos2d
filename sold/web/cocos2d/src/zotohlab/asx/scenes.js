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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires cherimoia/ebus
 * @requires zotohlab/asx/ccsx
 * @requires ash-js
 * @module zotohlab/asx/scenes
 */

import sh from 'zotohlab/asx/asterix';
import ebus from 'cherimoia/ebus';
import ccsx from 'zotohlab/asx/ccsx';
import Ash from 'ash-js';

//////////////////////////////////////////////////////////////////////////////
let sjs= sh.skarojs,
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
const XLive = cc.Sprite.extend({

  /**
   * @memberof module:zotohlab/asx/scenes~XLive
   * @method ctor
   * @param {Number} x
   * @param {Number} y
   * @param {Object} options
   */
  ctor(x, y, options) {
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
class XHUDLives extends sjs.ES6Claxx {

  /**
   * Reduce life by x amount.
   *
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method reduce
   * @param {Number} x
   */
  reduce(x) {
    for (let n=0; n < x; ++n) {
      this.hud.removeIcon(this.icons.pop());
    }
    this.curLives -= x;
  }

  /**
   * Test if no more lives.
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method isDead
   * @return {Boolean}
   */
  isDead() { return this.curLives < 0; }

  /**
   * Get the count of remaining lives.
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method getLives
   * @return {Number}
   */
  getLives() { return this.curLives; }

  /**
   * Reset the icons.
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method reset
   */
  reset() {
    R.forEach((z) => { this.hud.removeIcon(z); }, this.icons);
    this.curLives = this.options.totalLives;
    this.icons=[];
  }

  /**
   * Reset and refresh the hud.
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method resurrect
   */
  resurrect() {
    this.reset();
    this.drawLives();
  }

  /**
   * Draw the icons for lives.
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method drawLives
   */
  drawLives() {
    let y= this.topLeft.y - this.lifeSize.height * 0.5,
    x= this.topLeft.x + this.lifeSize.width * 0.5,
    gap=2;

    for (let n = 0; n < this.curLives; ++n) {
      let v= new XLive(x,y,this.options);
      this.hud.addIcon(v);
      this.icons.push(v);
      if (this.options.dir> 0) {
        x += this.lifeSize.width + gap;
      } else {
        x -= this.lifeSize.width - gap;
      }
    }
  }

  /**
   * Create and show the lives.
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method reify
   */
  create() {
    const dummy = new XLive(0,0,this.options);
    this.lifeSize = { width: ccsx.getScaledWidth(dummy),
                      height: ccsx.getScaledHeight(dummy) } ;
    this.drawLives();
  }

  /**
   * @memberof module:zotohlab/asx/scenes~XHUDLives
   * @method constructor
   * @param {Object} hud
   * @param {Number} x
   * @param {Number} y
   * @param {Object} options
   */
  constructor(hud, x, y, options) {
    super();
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

}

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends cc.Layer
 * @class XLayer
 */
const XLayer = cc.Layer.extend({

  /**
   * The id of this layer.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method rtti
   * @return {String}
   */
  rtti() { return "layer-" + Number(SEED++); },

  /**
   * Register this atlas by creating a sprite-batch-node from it
   * and mapping it to this name.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method regoAtlas
   * @param {String} name
   * @param {Number} z - z-index
   * @param {Number} tag
   * @return {cc.SpriteBatchNode}
   */
  regoAtlas(name, z, tag) {
    let a= new cc.SpriteBatchNode( cc.textureCache.addImage( sh.getAtlas(name)));
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
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method setup
   * @param {Object} options
   * @protected
   */
  setup() {},

  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method pkInput
   * @protected
   */
  pkInput() {},

  /**
   * Add Audio icon to UI.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method addAudioIcon
   * @param {Object} options
   */
  addAudioIcon(options) {
    let off= new cc.MenuItemSprite(new cc.Sprite('#sound_off.png'),
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

    audio= new cc.MenuItemToggle(on, off, (sender) => {
      if (sender.getSelectedIndex() === 0) {
        sh.toggleSfx(true);
      } else {
        sh.toggleSfx(false);
      }
    });

    if (!!options.anchor) {
      audio.setAnchorPoint(options.anchor);
    }

    audio.setSelectedIndex(xcfg.sound.open ? 0 : 1);
    menu= new cc.Menu(audio);
    menu.setPosition(options.pos);

    this.addItem(menu);
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method onQuit
   * @protected
   */
  onQuit() {
    let ss= sh.protos[xcfg.game.start],
    yn= sh.protos[sh.ptypes.yn],
    dir = cc.director;

    dir.pushScene( yn.reify({
      onback() {
        dir.popScene();
      },
      yes() {
        //sh.sfxPlay('game_quit');
        dir.popToRootScene();
        ccsx.runScene(ss.reify());
      }
    }));
  },

  /**
   * Center an image chosen from this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method centerAtlasImage
   * @param {String} frame
   * @param {Object} atlas
   */
  centerAtlasImage(frame,atlas) {
    let bg= new cc.Sprite(frame),
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
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method centerImage
   * @param {String} frame
   */
  centerImage(frame) {
    this.centerAtlasImage(frame);
  },

  /**
   * Add an image chosen from this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method addAtlasFrame
   * @param {String} frame
   * @param {cc.Point} pos
   * @param {String} atlas
   */
  addAtlasFrame(frame,pos, atlas) {
    let tt= new cc.Sprite(frame);
    tt.setPosition(pos);
    if (!!atlas) {
      this.addAtlasItem(atlas, tt);
    } else {
      this.addItem(tt);
    }
  },

  /**
   * Add an image.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method addFrame
   * @param {String} frame
   * @param {cc.Point} pos
   */
  addFrame(frame,pos) {
    this.addAtlasFrame(frame, pos);
  },

  /**
   * Get the atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method getAtlas
   * @param {String} name
   * @return {cc.SpriteBatchNode}
   */
  getAtlas(name) {
    return this.atlases[name || ""];
  },

  /**
   * Remove all children from this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeAtlasAll
   * @param {String} atlas
   * @param {Boolean} c
   */
  removeAtlasAll(atlas, c) {
    const a=this.getAtlas(atlas);
    if (!!a) { a.removeAllChildren(c || true); }
  },

  /**
   * Remove child from this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeAtlasItem
   * @param {String} atlas
   * @param {String} n - child
   * @param {Boolean} c
   */
  removeAtlasItem(atlas, n,c) {
    if (!!n) {
      n.removeFromParent(c);
    }
  },

  /**
   * Remove all children.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeAll
   * @param {Boolean} c
   */
  removeAll(c) {
    this.removeAllChildren(c);
  },

  /**
   * Remove a child.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeItem
   * @param {Object} n
   * @param {Boolean} c
   */
  removeItem(n,c) {
    if (!!n) {
      n.removeFromParent(c);
    }
  },

  /**
   * Add a child to this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method addAtlasItem
   * @param {String} atlas
   * @param {Object} n
   * @param {Number} zx
   * @param {Number} tag
   */
  addAtlasItem(atlas, n, zx, tag) {
    let p= this.getAtlas(atlas),
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
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method addChild
   * @param {Object} n - child
   * @param {Number} zx
   * @param {Number} tag
   */
  addItem(n,zx,tag) {
    let pzx = zx,
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
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method incIndexZ
   * @param {cc.Scene} par
   */
  incIndexZ() {
    ++this.lastZix;
  },
  /**
   * Remember the parent scene object.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method setParentScene
   * @param {cc.Scene} par
   */
  setParentScene(par) {
    this.ptScene=par;
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method scene
   * @return {cc.Scene}
   */
  scene() {
    return ptScene;
  },

  /**
   * Init.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method init
   */
  init() {
    this._super();
    this.setup();
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method ctor
   * @param {Object} options
   */
  ctor(options) {
    this.options = options || {};
    this._super();
    this.lastTag= 0;
    this.lastZix= 0;
    this.atlases= {};
  }

});

/**
 * @extends module:zotohlab/asx/scenes~XLayer
 * @class XMenuLayer
 */
const XMenuLayer= XLayer.extend({
  /**
   * @memberof module:zotohlab/asx/scenes~XMenuLayer
   * @method rtti
   * @return {String}
   */
  rtti() { return 'XMenuLayer'; },
  /**
   * @memberof module:zotohlab/asx/scenes~XMenuLayer
   * @method mkBackQuit
   * @protected
   */
  mkBackQuit(vert, btns, posfn) {
    let sz, menu;
    if (vert) {
      menu = ccsx.vmenu(btns);
    } else {
      menu= ccsx.hmenu(btns);
    }
    sz= menu.getChildren()[0].getContentSize();
    if (posfn) {
      posfn(menu, sz);
    }
    this.addItem(menu);
  },
  /**
   * @memberof module:zotohlab/asx/scenes~XMenuLayer
   * @method mkAudio
   * @protected
   */
  mkAudio(options) {
    this.addAudioIcon(options);
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends XLayer
 * @class XGameHUDLayer
 */
const XGameHUDLayer = XLayer.extend({

  /**
   * Get the id.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method rtti
   * @return {String}
   */
  rtti() { return 'HUD'; },

  /**
   * Remove this icon.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method removeIcon
   * @param {Object} icon
   */
  removeIcon(icon) {
    this.removeAtlasItem(this.hudAtlas(), icon);
  },

  /**
   * Add an icon.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method addIcon
   * @param {Object} icon
   * @param {Number} z
   * @param {Number} idx
   */
  addIcon(icon, z, idx) {
    this.addAtlasItem(this.hudAtlas(), icon, z, idx);
  },

  hudAtlas() {
    return this.atlasId;
  },

  /**
   * @protected
   */
  setup() {
    //this._super();
    this.atlasId = this.options.hudAtlas || 'game-pics';
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

  /**
   * @protected
   */
  initCtrlBtns() {
    let opts = this.options.i_replay;

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
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method getScore
   * @return {Number}
   */
  getScore() { return this.score; },
  /**
   * Reset the HUD as a new game.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method resetAsNew
   */
  resetAsNew() {
    this.reset();
  },
  /**
   * Reset the HUD.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method reset
   */
  reset() {
    this.disableReplay();
    this.score= 0;
    if (this.lives) {
      this.lives.resurrect();
    }
  },

  /**
   * Reduce x amount of lives.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method reduceLives
   * @param {Number} x
   * @return {Boolean} - true if no more lives.
   */
  reduceLives(x) {
    this.lives.reduce(x);
    return this.lives.isDead();
  },

  /**
   * Update the score.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method updateScore
   * @param {Number}
   */
  updateScore(num) {
    this.score += num;
    this.scoreLabel.setString(Number(this.score).toString());
  },

  /**
   * Disable the replay button.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method disableReplay
   */
  disableReplay() {
    this.replayBtn.setVisible(false);
  },

  /**
   * Enable the replay button.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method enableReplay
   */
  enableReplay() {
    this.replayBtn.setVisible(true);
  },

  /**
   * Add the main menu icon.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method addMenuItem
   * @param {cc.Menu} menu
   * @param {Object} where
   */
  addMenuIcon(menu, where) {
    let c= menu.getChildByTag(1),
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
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method addReplayIcon
   * @param {cc.Menu} menu
   * @param {Object} where
   */
  addReplayIcon(menu, where) {
    let c= menu.getChildByTag(1),
    hh = ccsx.getScaledHeight(c) * 0.5,
    hw = ccsx.getScaledWidth(c) * 0.5,
    wz= ccsx.vbox(),
    x, y;

    if (where === ccsx.acs.Bottom) {
      y = wz.bottom + csts.TILE  + hh;
    } else {
      y = wz.top - csts.TILE  - hh;
    }
    menu.setPosition(wz.left + csts.TILE + hw, y);
    this.replayBtn=menu;
    this.addItem(menu);
  }

});

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends XLayer
 * @class XGameLayer
 */
const XGameLayer = XLayer.extend({
  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method pkInput
   * @protected
   */
  pkInput() {
    //ccsx.onKeyPolls(this.keyboard);
    //ccsx.onTouchOne(this.ebus);
    //ccsx.onMouse(this.ebus);
  },
  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getLCfg
   * @return {Object}
   */
  getLCfg() {
    return sh.getLevelCfg(this.level);
  },
  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method signal
   * @protected
   * @param {String} topic
   * @param {Function} cb
   */
  signal(topic, cb) {
    this.ebus.on(topic,cb);
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method keyPoll
   * @protected
   * @param {Number} key
   */
  keyPoll(key){
    return this.keyboard[key];
  },
  /**
   * @method initEngine
   * @protected
   */
  initEngine(syss, fact) {
    this.engine = this.newFlow();
    if (sjs.isfunc(fact)) {
      fact(this.engine, this.options);
    }
    R.forEach( z => {
      this.engine.addSystem(new (z)(this.options), z.Priority);
    }, R.filter( x => {
      return sjs.isfunc(x);
    }, syss));
  },
  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getEnclosureBox
   * @return {Object} rect box.
   */
  getEnclosureBox() {
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
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method setGameMode
   * @param {Number} mode
   */
  setGameMode(mode) {
    xcfg.csts.GAME_MODE=mode;
  },

  /**
   * Reset and create new Ash Engine.
   *
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method newFlow
   */
  newFlow() {
    return this.engine= new Ash.Engine();
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method newGame
   * @param {Number} mode
   */
  newGame(mode) {
    if (xcfg.sound.open) {
      cc.audioEngine.stopAllEffects();
      cc.audioEngine.stopMusic();
    }
    this.onNewGame(mode);
    this.scheduleUpdate();
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method setup
   * @protected
   */
  setup() {
    const m= this.options.mode;
    if (m === sh.gtypes.ONLINE_GAME ||
        m === sh.gtypes.P2_GAME ||
        m === sh.gtypes.P1_GAME) {
      this.newGame(m);
    }
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method operational
   * @return {Boolean}
   */
  operational() { return true; },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getBackgd
   * @return {cc.Layer} - background layer
   */
  getBackgd() {
    const rc= this.ptScene.getLayers();
    return rc['BackLayer'];
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getHUD
   * @return {cc.Layer}  the HUD layer
   */
  getHUD() {
    const rc= this.ptScene.getLayers();
    return rc['HUD'];
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method update
   */
  update(dt) {
    if (this.operational()  && !!this.engine) {
      this.engine.update(dt);
    }
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method keys
   * @return {Array}  keys
   */
  keys() { return this.keyboard; },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method rtti
   * @return {String}  id
   */
  rtti() { return 'GameLayer'; },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method ctor
   * @param {Object} options
   */
  ctor(options) {
    this.ebus= ebus.reify();
    this._super(options);
    this.keyboard= [];
    this.players= [];
    this.level= 1;
    this.actor= null;
    sh.main = this;
    const vbox= ccsx.vbox();
    sjs.loggr.debug('cc.view: vbox: left: ' + vbox.left +
                    ', bottom: ' + vbox.bottom +
                    ', top: ' + vbox.top +
                    ', right: ' + vbox.right);
  }

});

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends cc.Scene
 * @class XScene
 */
const XScene = cc.Scene.extend({

  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method getLayers
   * @return {Array}
   */
  getLayers() {
    return this.layers;
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method init
   */
  init() {
    if (this._super()) {
      this.createLayers();
      return true;
    } else {
      return false;
    }
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method createLayers
   */
  createLayers() {
    let a = this.lays || [],
    glptr = undef,
    rc,
    obj;
    //hold off init'ing game layer, leave that as last
    rc = R.any((proto) => {
      obj= new (proto)(this.options);
      if ( obj instanceof XGameLayer ) {
        glptr = obj;
      }
      else
      if (obj instanceof XLayer) {
        obj.init();
      }

      if (obj instanceof XLayer) {
        obj.setParentScene(this);
      }

      this.layers[ obj.rtti() ] = obj;
      this.addChild(obj);
      return false;
    }, a);

    if (a.length > 0 && rc===false ) {
      if (!!glptr) {
        glptr.init();
      }
    }
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method onmsg
   * @chainable
   * @param {String} topic
   * @param {Function} cb
   * @return {cc.Scene}
   */
  onmsg(topic, cb) {
    this.ebus.on(topic, cb);
    return this;
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method ctor
   * @param {Array} ls - list of layers
   * @param {Object} options
   */
  ctor(ls, options) {
    this.options = options || {};
    this._super();
    this.lays= ls || [];
    this.layers= {};
    this.ebus= ebus.reify();
  }

});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class XSceneFactory
 */
class XSceneFactory extends sjs.ES6Claxx {

  /**
   * @memberof module:zotohlab/asx/scenes~XSceneFactory
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify(options) {
    let itemKey= 'layers',
    arr= this.layers,
    cfg;
    if (options && sjs.hasKey(options, itemKey ) &&
        sjs.isarr(options.layers)) {
      arr= options.layers;
      cfg= R.omit(itemKey, options);
    } else {
      cfg= options || {};
    }
    const scene = new XScene(arr, cfg);
    scene.init()
    return scene;
  }

  /**
   * @memberof module:zotohlab/asx/scenes~XSceneFactory
   * @method constructor
   * @param {Array} list of layers
   */
  constructor(ls) {
    super();
    this.layers= ls || [];
  }

}

/** @alias module:zotohlab/asx/scenes */
const xbox= /** @lends xbox# */{
  /**
   * @property {XMenuLayer} XMenuLayer
   */
  XMenuLayer: XMenuLayer,
  /**
   * @property {XGameHUDLayer} XGameHUDLayer
   */
  XGameHUDLayer: XGameHUDLayer,
  /**
   * @property {XGameLayer} XGameLayer
   */
  XGameLayer: XGameLayer,
  /**
   * @property {XLayer} XLayer
   */
  XLayer: XLayer,
  /**
   * @property {XLive} XLive
   */
  XLive: XLive,
  /**
   * @property {XHUDLives} XHUDLives
   */
  XHUDLives: XHUDLives,

  /**
   * @property {XSceneFactory} XSceneFactory
   */
  XSceneFactory: XSceneFactory,
  /**
   * @property {XScene} XScene
   */
  XScene: XScene,
  /**
   * @method showMenu
   */
  showMenu() {
    const dir= cc.director;
    dir.pushScene(sh.protos[sh.ptypes.mmenu].reify({
      onback() { dir.popScene(); }
    }));
  }
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/

//////////////////////////////////////////////////////////////////////////////
//EOF

