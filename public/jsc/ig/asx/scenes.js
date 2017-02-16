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

"use strict"; /**
              * @requires zotohlab/asx/asterix
              * @requires cherimoia/ebus
              * @requires zotohlab/asx/ccsx
              * @requires ash-js
              * @module zotohlab/asx/scenes
              */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ebus = require('cherimoia/ebus');

var _ebus2 = _interopRequireDefault(_ebus);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _ashJs = require('ash-js');

var _ashJs2 = _interopRequireDefault(_ashJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    SEED = 0,
    undef = void 0;

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends cc.Sprite
 * @class XLive
 */
var XLive = cc.Sprite.extend({

  /**
   * @memberof module:zotohlab/asx/scenes~XLive
   * @method ctor
   * @param {Number} x
   * @param {Number} y
   * @param {Object} options
   */

  ctor: function ctor(x, y, options) {
    this._super();
    this.initWithSpriteFrameName(options.frames[0]);
    if (!!options.scale) {
      this.setScale(options.scale);
    }
    this.setPosition(x, y);
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class XHUDLives
 */

var XHUDLives = function (_sjs$ES6Claxx) {
  _inherits(XHUDLives, _sjs$ES6Claxx);

  _createClass(XHUDLives, [{
    key: 'reduce',


    /**
     * Reduce life by x amount.
     *
     * @memberof module:zotohlab/asx/scenes~XHUDLives
     * @method reduce
     * @param {Number} x
     */
    value: function reduce(x) {
      for (var n = 0; n < x; ++n) {
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

  }, {
    key: 'isDead',
    value: function isDead() {
      return this.curLives < 0;
    }

    /**
     * Get the count of remaining lives.
     * @memberof module:zotohlab/asx/scenes~XHUDLives
     * @method getLives
     * @return {Number}
     */

  }, {
    key: 'getLives',
    value: function getLives() {
      return this.curLives;
    }

    /**
     * Reset the icons.
     * @memberof module:zotohlab/asx/scenes~XHUDLives
     * @method reset
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _this2 = this;

      R.forEach(function (z) {
        _this2.hud.removeIcon(z);
      }, this.icons);
      this.curLives = this.options.totalLives;
      this.icons = [];
    }

    /**
     * Reset and refresh the hud.
     * @memberof module:zotohlab/asx/scenes~XHUDLives
     * @method resurrect
     */

  }, {
    key: 'resurrect',
    value: function resurrect() {
      this.reset();
      this.drawLives();
    }

    /**
     * Draw the icons for lives.
     * @memberof module:zotohlab/asx/scenes~XHUDLives
     * @method drawLives
     */

  }, {
    key: 'drawLives',
    value: function drawLives() {
      var y = this.topLeft.y - this.lifeSize.height * 0.5,
          x = this.topLeft.x + this.lifeSize.width * 0.5,
          gap = 2;

      for (var n = 0; n < this.curLives; ++n) {
        var v = new XLive(x, y, this.options);
        this.hud.addIcon(v);
        this.icons.push(v);
        if (this.options.dir > 0) {
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

  }, {
    key: 'create',
    value: function create() {
      var dummy = new XLive(0, 0, this.options);
      this.lifeSize = { width: _ccsx2.default.getScaledWidth(dummy),
        height: _ccsx2.default.getScaledHeight(dummy) };
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

  }]);

  function XHUDLives(hud, x, y, options) {
    _classCallCheck(this, XHUDLives);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(XHUDLives).call(this));

    _this.options = options || {};
    _this.topLeft = cc.p(x, y);
    _this.icons = [];
    _this.hud = hud;
    _this.curLives = -1;
    _this.reset();
    if (!sjs.echt(_this.options.dir)) {
      _this.options.dir = 1;
    }
    return _this;
  }

  return XHUDLives;
}(sjs.ES6Claxx);

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends cc.Layer
 * @class XLayer
 */


var XLayer = cc.Layer.extend({

  /**
   * The id of this layer.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method rtti
   * @return {String}
   */

  rtti: function rtti() {
    return "layer-" + Number(SEED++);
  },


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
  regoAtlas: function regoAtlas(name, z, tag) {
    var a = new cc.SpriteBatchNode(cc.textureCache.addImage(_asterix2.default.getAtlas(name)));
    if (!sjs.echt(tag)) {
      tag = ++this.lastTag;
    }
    if (!sjs.echt(z)) {
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
  setup: function setup() {},


  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method pkInput
   * @protected
   */
  pkInput: function pkInput() {},


  /**
   * Add Audio icon to UI.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method addAudioIcon
   * @param {Object} options
   */
  addAudioIcon: function addAudioIcon(options) {
    var off = new cc.MenuItemSprite(new cc.Sprite('#sound_off.png'), new cc.Sprite('#sound_off.png'), new cc.Sprite('#sound_off.png'), sjs.NILFUNC, this),
        on = new cc.MenuItemSprite(new cc.Sprite('#sound_on.png'), new cc.Sprite('#sound_on.png'), new cc.Sprite('#sound_on.png'), sjs.NILFUNC, this),
        audio = void 0,
        menu = void 0,
        wb = _ccsx2.default.vbox();

    if (!!options.color) {
      off.setColor(options.color);
      on.setColor(options.color);
    }

    if (!!options.scale) {
      off.setScale(options.scale);
      on.setScale(options.scale);
    }

    audio = new cc.MenuItemToggle(on, off, function (sender) {
      if (sender.getSelectedIndex() === 0) {
        _asterix2.default.toggleSfx(true);
      } else {
        _asterix2.default.toggleSfx(false);
      }
    });

    if (!!options.anchor) {
      audio.setAnchorPoint(options.anchor);
    }

    audio.setSelectedIndex(xcfg.sound.open ? 0 : 1);
    menu = new cc.Menu(audio);
    menu.setPosition(options.pos);

    this.addItem(menu);
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method onQuit
   * @protected
   */
  onQuit: function onQuit() {
    var ss = _asterix2.default.protos[xcfg.game.start],
        yn = _asterix2.default.protos[_asterix2.default.ptypes.yn],
        dir = cc.director;

    dir.pushScene(yn.reify({
      onback: function onback() {
        dir.popScene();
      },
      yes: function yes() {
        //sh.sfxPlay('game_quit');
        dir.popToRootScene();
        _ccsx2.default.runScene(ss.reify());
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
  centerAtlasImage: function centerAtlasImage(frame, atlas) {
    var bg = new cc.Sprite(frame),
        cw = _ccsx2.default.center();
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
  centerImage: function centerImage(frame) {
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
  addAtlasFrame: function addAtlasFrame(frame, pos, atlas) {
    var tt = new cc.Sprite(frame);
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
  addFrame: function addFrame(frame, pos) {
    this.addAtlasFrame(frame, pos);
  },


  /**
   * Get the atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method getAtlas
   * @param {String} name
   * @return {cc.SpriteBatchNode}
   */
  getAtlas: function getAtlas(name) {
    return this.atlases[name || ""];
  },


  /**
   * Remove all children from this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeAtlasAll
   * @param {String} atlas
   * @param {Boolean} c
   */
  removeAtlasAll: function removeAtlasAll(atlas, c) {
    var a = this.getAtlas(atlas);
    if (!!a) {
      a.removeAllChildren(c || true);
    }
  },


  /**
   * Remove child from this atlas.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeAtlasItem
   * @param {String} atlas
   * @param {String} n - child
   * @param {Boolean} c
   */
  removeAtlasItem: function removeAtlasItem(atlas, n, c) {
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
  removeAll: function removeAll(c) {
    this.removeAllChildren(c);
  },


  /**
   * Remove a child.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method removeItem
   * @param {Object} n
   * @param {Boolean} c
   */
  removeItem: function removeItem(n, c) {
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
  addAtlasItem: function addAtlasItem(atlas, n, zx, tag) {
    var p = this.getAtlas(atlas),
        pzx = zx,
        ptag = tag;

    if (!sjs.echt(pzx)) {
      pzx = this.lastZix;
    }

    if (!sjs.echt(ptag)) {
      ptag = ++this.lastTag;
    }

    if (p instanceof cc.SpriteBatchNode && n instanceof cc.Sprite) {
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
  addItem: function addItem(n, zx, tag) {
    var pzx = zx,
        ptag = tag;

    if (!sjs.echt(pzx)) {
      pzx = this.lastZix;
    }

    if (!sjs.echt(ptag)) {
      ptag = ++this.lastTag;
    }

    this.addChild(n, pzx, ptag);
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method incIndexZ
   * @param {cc.Scene} par
   */
  incIndexZ: function incIndexZ() {
    ++this.lastZix;
  },

  /**
   * Remember the parent scene object.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method setParentScene
   * @param {cc.Scene} par
   */
  setParentScene: function setParentScene(par) {
    this.ptScene = par;
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method scene
   * @return {cc.Scene}
   */
  scene: function scene() {
    return ptScene;
  },


  /**
   * Init.
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method init
   */
  init: function init() {
    this._super();
    this.setup();
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XLayer
   * @method ctor
   * @param {Object} options
   */
  ctor: function ctor(options) {
    this.options = options || {};
    this._super();
    this.lastTag = 0;
    this.lastZix = 0;
    this.atlases = {};
  }
});

/**
 * @extends module:zotohlab/asx/scenes~XLayer
 * @class XMenuLayer
 */
var XMenuLayer = XLayer.extend({
  /**
   * @memberof module:zotohlab/asx/scenes~XMenuLayer
   * @method rtti
   * @return {String}
   */

  rtti: function rtti() {
    return 'XMenuLayer';
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XMenuLayer
   * @method mkBackQuit
   * @protected
   */
  mkBackQuit: function mkBackQuit(vert, btns, posfn) {
    var sz = void 0,
        menu = void 0;
    if (vert) {
      menu = _ccsx2.default.vmenu(btns);
    } else {
      menu = _ccsx2.default.hmenu(btns);
    }
    sz = menu.getChildren()[0].getContentSize();
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
  mkAudio: function mkAudio(options) {
    this.addAudioIcon(options);
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
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method rtti
   * @return {String}
   */

  rtti: function rtti() {
    return 'HUD';
  },


  /**
   * Remove this icon.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method removeIcon
   * @param {Object} icon
   */
  removeIcon: function removeIcon(icon) {
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
  addIcon: function addIcon(icon, z, idx) {
    this.addAtlasItem(this.hudAtlas(), icon, z, idx);
  },
  hudAtlas: function hudAtlas() {
    return this.atlasId;
  },


  /**
   * @protected
   */
  setup: function setup() {
    //this._super();
    this.atlasId = this.options.hudAtlas || 'game-pics';
    this.scoreLabel = null;
    this.lives = null;
    this.score = 0;
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
  initCtrlBtns: function initCtrlBtns() {
    var opts = this.options.i_replay;

    if (!!opts) {
      this.addReplayIcon(_ccsx2.default.pmenu1(opts), opts.where);
    }

    opts = this.options.i_menu;
    if (!!opts) {
      this.addMenuIcon(_ccsx2.default.pmenu1(opts), opts.where);
    }
  },


  /**
   * Get the score.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method getScore
   * @return {Number}
   */
  getScore: function getScore() {
    return this.score;
  },

  /**
   * Reset the HUD as a new game.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method resetAsNew
   */
  resetAsNew: function resetAsNew() {
    this.reset();
  },

  /**
   * Reset the HUD.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method reset
   */
  reset: function reset() {
    this.disableReplay();
    this.score = 0;
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
  reduceLives: function reduceLives(x) {
    this.lives.reduce(x);
    return this.lives.isDead();
  },


  /**
   * Update the score.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method updateScore
   * @param {Number}
   */
  updateScore: function updateScore(num) {
    this.score += num;
    this.scoreLabel.setString(Number(this.score).toString());
  },


  /**
   * Disable the replay button.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method disableReplay
   */
  disableReplay: function disableReplay() {
    this.replayBtn.setVisible(false);
  },


  /**
   * Enable the replay button.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method enableReplay
   */
  enableReplay: function enableReplay() {
    this.replayBtn.setVisible(true);
  },


  /**
   * Add the main menu icon.
   * @memberof module:zotohlab/asx/scenes~XGameHUDLayer
   * @method addMenuItem
   * @param {cc.Menu} menu
   * @param {Object} where
   */
  addMenuIcon: function addMenuIcon(menu, where) {
    var c = menu.getChildByTag(1),
        hh = _ccsx2.default.getScaledHeight(c) * 0.5,
        hw = _ccsx2.default.getScaledWidth(c) * 0.5,
        wz = _ccsx2.default.vbox(),
        x = void 0,
        y = void 0;

    if (where === _ccsx2.default.acs.Bottom) {
      y = wz.bottom + csts.TILE + hh;
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
  addReplayIcon: function addReplayIcon(menu, where) {
    var c = menu.getChildByTag(1),
        hh = _ccsx2.default.getScaledHeight(c) * 0.5,
        hw = _ccsx2.default.getScaledWidth(c) * 0.5,
        wz = _ccsx2.default.vbox(),
        x = void 0,
        y = void 0;

    if (where === _ccsx2.default.acs.Bottom) {
      y = wz.bottom + csts.TILE + hh;
    } else {
      y = wz.top - csts.TILE - hh;
    }
    menu.setPosition(wz.left + csts.TILE + hw, y);
    this.replayBtn = menu;
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
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method pkInput
   * @protected
   */

  pkInput: function pkInput() {
    //ccsx.onKeyPolls(this.keyboard);
    //ccsx.onTouchOne(this.ebus);
    //ccsx.onMouse(this.ebus);
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getLCfg
   * @return {Object}
   */
  getLCfg: function getLCfg() {
    return _asterix2.default.getLevelCfg(this.level);
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method signal
   * @protected
   * @param {String} topic
   * @param {Function} cb
   */
  signal: function signal(topic, cb) {
    this.ebus.on(topic, cb);
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method keyPoll
   * @protected
   * @param {Number} key
   */
  keyPoll: function keyPoll(key) {
    return this.keyboard[key];
  },

  /**
   * @method initEngine
   * @protected
   */
  initEngine: function initEngine(syss, fact) {
    var _this3 = this;

    this.engine = this.newFlow();
    if (sjs.isfunc(fact)) {
      fact(this.engine, this.options);
    }
    R.forEach(function (z) {
      _this3.engine.addSystem(new z(_this3.options), z.Priority);
    }, R.filter(function (x) {
      return sjs.isfunc(x);
    }, syss));
  },

  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getEnclosureBox
   * @return {Object} rect box.
   */
  getEnclosureBox: function getEnclosureBox() {
    return _ccsx2.default.vbox();
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
  setGameMode: function setGameMode(mode) {
    xcfg.csts.GAME_MODE = mode;
  },


  /**
   * Reset and create new Ash Engine.
   *
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method newFlow
   */
  newFlow: function newFlow() {
    return this.engine = new _ashJs2.default.Engine();
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method newGame
   * @param {Number} mode
   */
  newGame: function newGame(mode) {
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
  setup: function setup() {
    var m = this.options.mode;
    if (m === _asterix2.default.gtypes.ONLINE_GAME || m === _asterix2.default.gtypes.P2_GAME || m === _asterix2.default.gtypes.P1_GAME) {
      this.newGame(m);
    }
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method operational
   * @return {Boolean}
   */
  operational: function operational() {
    return true;
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getBackgd
   * @return {cc.Layer} - background layer
   */
  getBackgd: function getBackgd() {
    var rc = this.ptScene.getLayers();
    return rc['BackLayer'];
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method getHUD
   * @return {cc.Layer}  the HUD layer
   */
  getHUD: function getHUD() {
    var rc = this.ptScene.getLayers();
    return rc['HUD'];
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method update
   */
  update: function update(dt) {
    if (this.operational() && !!this.engine) {
      this.engine.update(dt);
    }
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method keys
   * @return {Array}  keys
   */
  keys: function keys() {
    return this.keyboard;
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method rtti
   * @return {String}  id
   */
  rtti: function rtti() {
    return 'GameLayer';
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XGameLayer
   * @method ctor
   * @param {Object} options
   */
  ctor: function ctor(options) {
    this.ebus = _ebus2.default.reify();
    this._super(options);
    this.keyboard = [];
    this.players = [];
    this.level = 1;
    this.actor = null;
    _asterix2.default.main = this;
    var vbox = _ccsx2.default.vbox();
    sjs.loggr.debug('cc.view: vbox: left: ' + vbox.left + ', bottom: ' + vbox.bottom + ', top: ' + vbox.top + ', right: ' + vbox.right);
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @extends cc.Scene
 * @class XScene
 */
var XScene = cc.Scene.extend({

  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method getLayers
   * @return {Array}
   */

  getLayers: function getLayers() {
    return this.layers;
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method init
   */
  init: function init() {
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
  createLayers: function createLayers() {
    var _this4 = this;

    var a = this.lays || [],
        glptr = undef,
        rc = void 0,
        obj = void 0;
    //hold off init'ing game layer, leave that as last
    rc = R.any(function (proto) {
      obj = new proto(_this4.options);
      if (obj instanceof XGameLayer) {
        glptr = obj;
      } else if (obj instanceof XLayer) {
        obj.init();
      }

      if (obj instanceof XLayer) {
        obj.setParentScene(_this4);
      }

      _this4.layers[obj.rtti()] = obj;
      _this4.addChild(obj);
      return false;
    }, a);

    if (a.length > 0 && rc === false) {
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
  onmsg: function onmsg(topic, cb) {
    this.ebus.on(topic, cb);
    return this;
  },


  /**
   * @memberof module:zotohlab/asx/scenes~XScene
   * @method ctor
   * @param {Array} ls - list of layers
   * @param {Object} options
   */
  ctor: function ctor(ls, options) {
    this.options = options || {};
    this._super();
    this.lays = ls || [];
    this.layers = {};
    this.ebus = _ebus2.default.reify();
  }
});

//////////////////////////////////////////////////////////////////////////////
/**
 * @class XSceneFactory
 */

var XSceneFactory = function (_sjs$ES6Claxx2) {
  _inherits(XSceneFactory, _sjs$ES6Claxx2);

  _createClass(XSceneFactory, [{
    key: 'reify',


    /**
     * @memberof module:zotohlab/asx/scenes~XSceneFactory
     * @method reify
     * @param {Object} options
     * @return {cc.Scene}
     */
    value: function reify(options) {
      var itemKey = 'layers',
          arr = this.layers,
          cfg = void 0;
      if (options && sjs.hasKey(options, itemKey) && sjs.isarr(options.layers)) {
        arr = options.layers;
        cfg = R.omit(itemKey, options);
      } else {
        cfg = options || {};
      }
      var scene = new XScene(arr, cfg);
      scene.init();
      return scene;
    }

    /**
     * @memberof module:zotohlab/asx/scenes~XSceneFactory
     * @method constructor
     * @param {Array} list of layers
     */

  }]);

  function XSceneFactory(ls) {
    _classCallCheck(this, XSceneFactory);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(XSceneFactory).call(this));

    _this5.layers = ls || [];
    return _this5;
  }

  return XSceneFactory;
}(sjs.ES6Claxx);

/** @alias module:zotohlab/asx/scenes */


var xbox = /** @lends xbox# */{
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
  showMenu: function showMenu() {
    var dir = cc.director;
    dir.pushScene(_asterix2.default.protos[_asterix2.default.ptypes.mmenu].reify({
      onback: function onback() {
        dir.popScene();
      }
    }));
  }
};

sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF