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
              * @requires zotohlab/asx/ccsx
              * @module p/hud
              */

var _scenes = require('zotohlab/asx/scenes');

var _scenes2 = _interopRequireDefault(_scenes);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class HUDLayer */
HUDLayer = _scenes2.default.XGameHUDLayer.extend({
  /**
   * @memberof module:p/hud~HUDLayer
   * @method ctor
   * @param {Object} options
   */

  ctor: function ctor(options) {
    var color = cc.color('#32baf4'),
        scale = 1;

    this._super(options);
    this.scores = {};
    this.p2Long = '';
    this.p1Long = '';
    this.p2ID = '';
    this.p1ID = '';

    this.options.i_replay = {
      nnn: '#icon_replay.png',
      where: _ccsx2.default.acs.Top,
      color: color,
      scale: scale,
      visible: false,
      cb: function cb() {
        _asterix2.default.fire('/hud/replay');
      }
    };

    this.options.i_menu = {
      nnn: '#icon_menu.png',
      where: _ccsx2.default.acs.Top,
      color: color,
      scale: scale,
      cb: function cb() {
        _asterix2.default.fire('/hud/showmenu');
      }
    };
  },


  initAtlases: sjs.NILFUNC,
  initIcons: sjs.NILFUNC,

  /**
   * @memberof module:p/hud~HUDLayer
   * @method regoPlayer
   * @param {Object} p1
   * @param {Array} p1ids
   * @param {Object} p2
   * @param {Array} p2ids
   */
  regoPlayers: function regoPlayers(p1, p1ids, p2, p2ids) {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox();

    this.play2 = p2;
    this.play1 = p1;
    this.p2Long = p2ids[1];
    this.p1Long = p1ids[1];
    this.p2ID = p2ids[0];
    this.p1ID = p1ids[0];
    this.title.setString(this.p1ID + " / " + this.p2ID);

    this.score1.setPosition(cw.x - _ccsx2.default.getScaledWidth(this.title) / 2 - _ccsx2.default.getScaledWidth(this.score1) / 2 - 10, wb.top - csts.TILE * 6 / 2 - 2);
    this.score2.setPosition(cw.x + _ccsx2.default.getScaledWidth(this.title) / 2 + _ccsx2.default.getScaledWidth(this.score2) / 2 + 6, wb.top - csts.TILE * 6 / 2 - 2);
  },

  /**
   * @method resetAsNew
   */
  resetAsNew: function resetAsNew() {
    this.reset();
  },

  /**
   * @method reset
   */
  reset: function reset() {
    this.scores = {};
    this.scores[csts.P2_COLOR] = 0;
    this.scores[csts.P1_COLOR] = 0;

    this.replayBtn.setVisible(false);
    this.resultMsg.setVisible(false);
    this.drawScores();
  },

  /**
   * @method endGame
   * @private
   */
  endGame: function endGame() {
    this.replayBtn.setVisible(true);
    this.resultMsg.setVisible(true);
  },

  /**
   * @method initLabels
   * @protected
   */
  initLabels: function initLabels() {
    var color = _ccsx2.default.white,
        cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox();

    this.title = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.TinyBoxBB'),
      text: '',
      scale: xcfg.game.scale * 0.3,
      pos: cc.p(cw.x, wb.top - csts.TILE * 6 / 2)
    });
    this.addItem(this.title);

    this.score1 = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.OCR'),
      text: '8',
      scale: xcfg.game.scale * 0.25,
      color: color
    });
    this.addItem(this.score1);

    this.score2 = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.OCR'),
      text: '8',
      scale: xcfg.game.scale * 0.25,
      color: color
    });
    this.addItem(this.score2);

    this.resultMsg = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.CoffeeBuzzed'),
      text: '',
      visible: false,
      pos: cc.p(cw.x, 100),
      scale: xcfg.game.scale * 0.15
    });
    this.addItem(this.resultMsg);
  },

  /**
   * @method isDone
   * @private
   */
  isDone: function isDone() {
    var s2 = this.scores[this.play2],
        s1 = this.scores[this.play1],
        rc = [false, null];

    if (s2 >= csts.NUM_POINTS) {
      rc = [true, this.play2];
    }
    if (s1 >= csts.NUM_POINTS) {
      rc = [true, this.play1];
    }
    return rc;
  },

  /**
   * @method updateScore
   */
  updateScores: function updateScores(scores) {
    this.scores[this.play2] = scores[this.play2];
    this.scores[this.play1] = scores[this.play1];
    this.drawScores();
  },

  /**
   * @method updateScores
   */
  updateScore: function updateScore(color, value) {
    this.scores[color] = this.scores[color] + value;
    this.drawScores();
  },

  /**
   * @method drawScores
   * @private
   */
  drawScores: function drawScores() {
    var s2 = this.play2 ? this.scores[this.play2] : 0,
        s1 = this.play1 ? this.scores[this.play1] : 0,
        n2 = sjs.prettyNumber(s2, 1),
        n1 = sjs.prettyNumber(s1, 1);
    this.score1.setString(n1);
    this.score2.setString(n2);
  },

  /**
   * @method drawResult
   * @private
   */
  drawResult: function drawResult(winner) {
    var msg = "";
    if (winner === csts.P2_COLOR) {
      msg = _asterix2.default.l10n('%whowin', { who: this.p2Long });
    } else {
      msg = _asterix2.default.l10n('%whowin', { who: this.p1Long });
    }
    this.resultMsg.setString(msg);
  }
});

/** @alias module:p/hud */
var xbox = /** @lends xbox# */{
  /**
   * @property {HUDLayer} HUDLayer
   */
  HUDLayer: HUDLayer
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF