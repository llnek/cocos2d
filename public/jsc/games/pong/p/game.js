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
              * @requires zotohlab/asx/odin
              * @requires zotohlab/asx/scenes
              * @requires n/cobjs
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

var _odin = require('zotohlab/asx/odin');

var _odin2 = _interopRequireDefault(_odin);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _sysobjs = require('s/sysobjs');

var _sysobjs2 = _interopRequireDefault(_sysobjs);

var _hud = require('p/hud');

var _hud2 = _interopRequireDefault(_hud);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var evts = _odin2.default.Events,
    sjs = _asterix2.default.skarojs,
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
   * @method replay
   */
  replay: function replay() {
    sjs.loggr.debug('replay game called');
    if (sjs.isobj(this.options.wsock)) {

      // request server to restart a new game
      this.options.wsock.send({
        type: evts.MSG_SESSION,
        code: evts.REPLAY
      });
    } else {
      this.play(false);
    }
  },

  /**
   * @method play
   */
  play: function play(newFlag) {
    // sort out names of players
    var p1ids = void 0,
        p2ids = void 0;
    sjs.eachObj(function (v, k) {
      if (v[0] === 1) {
        p1ids = [k, v[1]];
      } else {
        p2ids = [k, v[1]];
      }
    }, this.options.ppids);

    this.initEngine(_sysobjs2.default.systems, _sysobjs2.default.entityFactory);
    this.reset(newFlag);
    this.initPlayers();
    this.getHUD().regoPlayers(csts.P1_COLOR, p1ids, csts.P2_COLOR, p2ids);

    this.options.world = this.getEnclosureBox();
    this.options.running = true;
    this.options.poked = false;
  },

  /**
   * @method onNewGame
   * @private
   */
  onNewGame: function onNewGame(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },

  /**
   * @method reset
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
    R.forEach(function (z) {
      if (!!z) {
        z.dispose();
      }
    }, this.players);
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
    this.players.length = 0;
  },

  /**
   * @method operational
   * @protected
   */
  operational: function operational() {
    return this.options.running;
  },

  /**
   * @method initPlayers
   * @private
   */
  initPlayers: function initPlayers() {
    var p2cat = void 0,
        p1cat = void 0,
        p2 = void 0,
        p1 = void 0;

    switch (this.options.mode) {
      case _asterix2.default.gtypes.ONLINE_GAME:
        p2cat = csts.NETP;
        p1cat = csts.NETP;
        break;
      case _asterix2.default.gtypes.P1_GAME:
        p1cat = csts.HUMAN;
        p2cat = csts.BOT;
        break;
      case _asterix2.default.gtypes.P2_GAME:
        p2cat = csts.HUMAN;
        p1cat = csts.HUMAN;
        break;
    }
    p1 = new _cobjs2.default.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
    p2 = new _cobjs2.default.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
    this.options.players = [null, p1, p2];
    this.options.colors = {};
    this.options.colors[csts.P1_COLOR] = p1;
    this.options.colors[csts.P2_COLOR] = p2;
  },

  /**
   * Scores is a map {'o': 0, 'x': 0}
   * @method updatePoints
   * @private
   */
  updatePoints: function updatePoints(scores) {
    this.getHUD().updateScores(scores);
  },

  /**
   * @method onWinner
   * @private
   */
  onWinner: function onWinner(p, score) {
    this.getHUD().updateScore(p, score || 1);
    var rc = this.getHUD().isDone();
    if (rc[0]) {
      this.doDone(rc[1]);
    } else {}
  },

  /**
   * @method doDone
   * @private
   */
  doDone: function doDone(p) {
    this.getHUD().drawResult(p);
    this.getHUD().endGame();
    //this.removeAll();
    _asterix2.default.sfxPlay('game_end');
    this.options.running = false;
  },

  /**
   * @method getEnclosureBox
   * @private
   */
  getEnclosureBox: function getEnclosureBox() {
    return _ccsx2.default.vbox();
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

    scene.onmsg('/hud/showmenu', function (msg) {
      _scenes2.default.showMenu();
    }).onmsg('/game/restart', function (msg) {
      _asterix2.default.main.play(false);
    }).onmsg('/game/stop', function (msg) {}).onmsg('/hud/replay', function (msg) {
      _asterix2.default.main.replay();
    }).onmsg('/hud/score/update', function (msg) {
      _asterix2.default.main.onWinner(msg.color, msg.score);
    }).onmsg('/hud/score/sync', function (msg) {
      _asterix2.default.main.updatePoints(msg.points);
    }).onmsg('/hud/end', function (msg) {
      _asterix2.default.main.doDone(msg.winner);
    });

    return scene;
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF