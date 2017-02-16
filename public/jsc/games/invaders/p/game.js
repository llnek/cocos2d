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
              * @requires zotohlab/asx/ccsx
              * @requires zotohlab/asx/scenes
              * @requires s/sysobjs
              * @requires p/hud
              * @module p/game
              */

var _scenes = require('zotohlab/asx/scenes');

var _scenes2 = _interopRequireDefault(_scenes);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _sysobjs = require('s/sysobjs');

var _sysobjs2 = _interopRequireDefault(_sysobjs);

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
  setup: function setup() {
    this.centerImage(_asterix2.default.getImage('game.bg'));
  },
  rtti: function rtti() {
    return 'BackLayer';
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
  },

  /**
   * @method reset
   * @protected
   */
  reset: function reset(newFlag) {
    if (!sjs.isempty(this.atlases)) {
      sjs.eachObj(function (v) {
        v.removeAllChildren();
      }, this.atlases);
    } else {
      this.regoAtlas('game-pics');
      this.regoAtlas('lang-pics');
    }
    this.getHUD().reset();
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

    this.initEngine(_sysobjs2.default.systems, _sysobjs2.default.entityFactory);
    this.reset(newFlag);

    this.options.running = true;
  },

  /**
   * @method spawnPlayer
   * @private
   */
  spawnPlayer: function spawnPlayer() {
    _asterix2.default.factory.bornShip();
  },

  /**
   * @method onPlayerKilled
   * @private
   */
  onPlayerKilled: function onPlayerKilled(msg) {
    _asterix2.default.sfxPlay('xxx-explode');
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
    this.reset();
    this.getHUD().enableReplay();
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