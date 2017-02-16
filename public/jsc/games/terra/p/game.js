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
              * @requires zotohlab/asx/scenes
              * @requires s/sysobjs
              * @requires s/utils
              * @requires zotohlab/asx/ccsx
              * @requires p/hud
              * @module p/game
              */

var _scenes = require('zotohlab/asx/scenes');

var _scenes2 = _interopRequireDefault(_scenes);

var _sysobjs = require('s/sysobjs');

var _sysobjs2 = _interopRequireDefault(_sysobjs);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _hud = require('p/hud');

var _hud2 = _interopRequireDefault(_hud);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class BackLayer */
BackLayer = _scenes2.default.XLayer.extend({
  rtti: function rtti() {
    return 'BackLayer';
  },
  setup: function setup() {
    this.regoAtlas('back-tiles', 1);
    this.regoAtlas('game-pics', 0);
  }
}),

//////////////////////////////////////////////////////////////////////////
/** * @class GameLayer */
GameLayer = _scenes2.default.XGameLayer.extend({
  /**
   * @method pkInput
   * @protected
   */

  pkInput: function pkInput() {
    _ccsx2.default.onKeyPolls(this.keyboard);
    //ccsx.onTouchOne(this.ebus);
    //ccsx.onMouse(this.ebus);
  },

  /**
   * @method reset
   */
  reset: function reset(newFlag) {
    var _this = this;

    var arr = [['op-pics', true], ['game-pics', false], ['explosions', true]];

    if (!sjs.isempty(this.atlases)) {
      R.forEach(function (info) {
        _this.atlases[info[0]].removeAllChildren();
      }, arr);
    } else {
      R.forEach(function (info) {
        var b = _this.regoAtlas(info[0]);
        if (info[1]) {
          b.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        }
      }, arr);
    }
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },

  /**
   * @method initBackTiles
   * @private
   */
  initBackTiles: function initBackTiles() {
    this.moveBackTiles();
    this.schedule(this.moveBackTiles, 5);
  },

  /**
   * @method moveBackTiles
   * @private
   */
  moveBackTiles: function moveBackTiles() {
    var ps = _asterix2.default.pools.BackTiles,
        wz = _ccsx2.default.vrect(),
        move = void 0,
        fun = void 0,
        tm = ps.get();

    if (!tm) {
      _asterix2.default.factory.createBackTiles();
      tm = ps.get();
    }

    tm.inflate({ x: sjs.rand(wz.width),
      y: wz.height });

    move = cc.moveBy(sjs.rand(2) + 10, cc.p(0, -wz.height - wz.height * 0.5));
    fun = cc.callFunc(function () {
      tm.deflate();
    });

    tm.sprite.runAction(cc.sequence(move, fun));
  },

  /**
   * @method operational
   * @protected
   */
  operational: function operational() {
    return this.options.running;
  },

  /**
   * @method replay
   */
  replay: function replay() {
    this.play(false);
  },

  /**
   * @method play
   */
  play: function play(newFlag) {
    var _this2 = this;

    this.initEngine(_sysobjs2.default.systems, _sysobjs2.default.entityFactory);
    this.reset(newFlag);

    _asterix2.default.sfxPlayMusic('bgMusic', { repeat: true });
    this.schedule(function () {
      // counter used to spawn enemies
      ++_this2.options.secCount;
    }, 1);

    this.options.secCount = 0;
    this.options.running = true;
  },

  /**
   * @method spawnPlayer
   * @private
   */
  spawnPlayer: function spawnPlayer() {
    _utils2.default.bornShip(this.options.player);
  },

  /**
   * @method onPlayerKilled
   * @private
   */
  onPlayerKilled: function onPlayerKilled(msg) {
    //sh.sfxPlay('xxx-explode');
    if (this.getHUD().reduceLives(1)) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },

  /**
   * @method onNewGame
   * @private
   */
  onNewGame: function onNewGame(mode) {
    //sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  /**
   * @method onEarnScore
   * @private
   */
  onEarnScore: function onEarnScore(msg) {
    this.getHUD().updateScore(msg.score);
  },

  /**
   * @method onDone
   * @private
   */
  onDone: function onDone() {
    this.options.running = false;
    _asterix2.default.sfxCancel();
    this.reset();
    this.getHUD().enableReplay();
  },

  /**
   * @method getEnclosureBox
   * @private
   */
  getEnclosureBox: function getEnclosureBox() {
    var wb = _ccsx2.default.vbox();
    return {
      bottom: wb.bottom,
      left: wb.left,
      top: wb.top + 10,
      right: wb.right
    };
  },

  /**
   * @method ctor
   * @constructs
   */
  ctor: function ctor(options) {
    this._super(options);
  }
});

/** @alias module:p/game */
var xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: _asterix2.default.ptypes.game,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify: function reify(options) {
    var scene = new _scenes2.default.XSceneFactory([BackLayer, GameLayer, _hud2.default.HUDLayer]).reify(options);

    scene.onmsg('/game/players/earnscore', function (msg) {
      _asterix2.default.main.onEarnScore(msg);
    }).onmsg('/game/backtiles', function (msg) {
      _asterix2.default.main.initBackTiles();
    }).onmsg('/hud/showmenu', function (msg) {
      _scenes2.default.showMenu();
    }).onmsg('/hud/replay', function (msg) {
      _asterix2.default.main.replay();
    }).onmsg('/game/players/killed', function (msg) {
      _asterix2.default.main.onPlayerKilled(msg);
    });

    return scene;
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF