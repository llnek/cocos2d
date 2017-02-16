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

//////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class HUDLayer */
HUDLayer = _scenes2.default.XGameHUDLayer.extend({
  /**
   * @method ctor
   * @private
   */

  ctor: function ctor(options) {
    var color = cc.color("#5e3178"),
        scale = 1;

    this._super(options);
    this.p2Long = '';
    this.p1Long = '';
    this.p2ID = '';
    this.p1ID = '';

    this.options.i_menu = {
      cb: function cb() {
        _asterix2.default.fire('/hud/showmenu');
      },

      nnn: '#icon_menu.png',
      where: _ccsx2.default.acs.Bottom,
      color: color,
      scale: scale
    };
    this.options.i_replay = {
      cb: function cb() {
        _asterix2.default.fire('/hud/replay');
      },

      where: _ccsx2.default.acs.Bottom,
      nnn: '#icon_replay.png',
      color: color,
      scale: scale,
      visible: false
    };
    this.color = color;
    this.initScores();
  },

  /**
   * @method initScores
   * @protected
   */
  initScores: function initScores() {
    this.scores = {};
    this.scores[csts.P2_COLOR] = 0;
    this.scores[csts.P1_COLOR] = 0;
  },

  /**
   * @method initLabels
   * @protected
   */
  initLabels: function initLabels() {
    var cw = _ccsx2.default.center(),
        c = this.color,
        wb = _ccsx2.default.vbox();

    this.title = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.JellyBelly'),
      text: '',
      color: c,
      anchor: _ccsx2.default.acs.Top,
      scale: xcfg.game.scale * 0.6,
      pos: cc.p(cw.x, wb.top - 2 * csts.TILE)
    });
    this.addItem(this.title);

    this.score1 = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.SmallTypeWriting'),
      text: '0',
      scale: xcfg.game.scale,
      color: _ccsx2.default.white,
      pos: cc.p(csts.TILE + csts.S_OFF + 2, wb.top - csts.TILE - csts.S_OFF),
      anchor: _ccsx2.default.acs.TopLeft
    });
    this.addItem(this.score1);

    this.score2 = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.SmallTypeWriting'),
      text: '0',
      scale: xcfg.game.scale,
      color: _ccsx2.default.white,
      pos: cc.p(wb.right - csts.TILE - csts.S_OFF, wb.top - csts.TILE - csts.S_OFF),
      anchor: _ccsx2.default.acs.TopRight
    });
    this.addItem(this.score2);

    this.status = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.CoffeeBuzzed'),
      text: '',
      color: _ccsx2.default.white,
      scale: xcfg.game.scale * 0.3, // 0.06,
      pos: cc.p(cw.x, wb.bottom + csts.TILE * 10)
    });
    this.addItem(this.status);

    this.result = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.CoffeeBuzzed'),
      color: _ccsx2.default.white,
      text: '',
      scale: xcfg.game.scale * 0.3, // 0.06,
      pos: cc.p(cw.x, wb.bottom + csts.TILE * 10),
      visible: false
    });
    this.addItem(this.result);
  },

  /**
   * @method showTimer
   * @private
   */
  showTimer: function showTimer() {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox();

    // timer is already showing, go away
    if (this.countDownState) {
      return;
    }

    if (!this.countDown) {
      this.countDown = _ccsx2.default.bmfLabel({
        fontPath: _asterix2.default.getFont('font.AutoMission'),
        text: '',
        scale: xcfg.game.scale * 0.5,
        color: _ccsx2.default.white,
        pos: cc.p(cw.x, wb.top - 10 * csts.TILE),
        anchor: _ccsx2.default.acs.Center
      });
      this.addItem(this.countDown);
    }

    this.countDownValue = csts.PLAYER_THINK_TIME;
    this.showCountDown();

    this.schedule(this.updateTimer, 1.0);
    this.countDownState = true;
  },

  /**
   * @method updateTimer
   * @private
   */
  updateTimer: function updateTimer(dt) {
    if (!this.countDownState) {
      return;
    } else {
      this.countDownValue -= 1;
    }
    if (this.countDownValue < 0) {
      this.killTimer();
      _asterix2.default.fire('/player/timer/expired');
    } else {
      this.showCountDown();
    }
  },

  /**
   * @method showCountDown
   * @private
   */
  showCountDown: function showCountDown(msg) {
    if (!!this.countDown) {
      this.countDown.setString(msg || '' + this.countDownValue);
    }
  },

  /**
   * @method killTimer
   * @private
   */
  killTimer: function killTimer() {
    if (this.countDownState) {
      this.unschedule(this.updateTimer);
      this.showCountDown(' ');
    }
    this.countDownState = false;
    this.countDownValue = 0;
  },

  /**
   * @method updateScore
   * @private
   */
  updateScore: function updateScore(pcolor, value) {
    this.scores[pcolor] += value;
    this.drawScores();
  },

  /**
   * @method update
   * @protected
   */
  update: function update(running, pnum) {
    if (running) {
      this.drawStatus(pnum);
    } else {
      this.drawResult(pnum);
    }
  },

  /**
   * @method endGame
   * @private
   */
  endGame: function endGame(winner) {
    this.killTimer();
    this.replayBtn.setVisible(true);
    this.result.setVisible(true);
    this.status.setVisible(false);
    this.drawResult(winner);
  },

  /**
   * @method drawStatusText
   * @private
   */
  drawStatusText: function drawStatusText(obj, msg) {
    obj.setString(msg || '');
  },

  /**
   * @method drawScores
   * @private
   */
  drawScores: function drawScores() {
    var s2 = this.scores[this.play2],
        s1 = this.scores[this.play1],
        n2 = '' + s2,
        n1 = '' + s1;

    this.score1.setString(n1);
    this.score2.setString(n2);
  },

  /**
   * @method drawResult
   * @private
   */
  drawResult: function drawResult(pnum) {
    var msg = _asterix2.default.l10n('%whodraw');

    if (sjs.isnum(pnum)) {
      switch (pnum) {
        case 2:
          msg = _asterix2.default.l10n('%whowin', { who: this.p2Long });break;
        case 1:
          msg = _asterix2.default.l10n('%whowin', { who: this.p1Long });break;
      }
    }

    this.drawStatusText(this.result, msg);
  },

  /**
   * @method drawStatus
   * @private
   */
  drawStatus: function drawStatus(pnum) {
    if (sjs.isnum(pnum)) {
      var pfx = pnum === 1 ? this.p1Long : this.p2Long;
      this.drawStatusText(this.status, _asterix2.default.l10n('%whosturn', {
        who: pfx
      }));
    }
  },

  /**
   * @method regoPlayers
   * @private
   */
  regoPlayers: function regoPlayers(color1, p1ids, color2, p2ids) {
    this.play2 = color2;
    this.play1 = color1;
    this.p2Long = p2ids[1];
    this.p1Long = p1ids[1];
    this.p2ID = p2ids[0];
    this.p1ID = p1ids[0];
    this.title.setString(this.p1ID + " / " + this.p2ID);
  },

  /**
   * @method resetAsNew
   * @protected
   */
  resetAsNew: function resetAsNew() {
    this.initScores();
    this.reset();
  },

  /**
   * @method reset
   * @protected
   */
  reset: function reset() {
    this.replayBtn.setVisible(false);
    this.result.setVisible(false);
    this.status.setVisible(true);
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