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
              * @requires n/cobjs
              * @module p/hud
              */

var _scenes = require('zotohlab/asx/scenes');

var _scenes2 = _interopRequireDefault(_scenes);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/** * @class HUDLayer */
HUDLayer = _scenes2.default.XGameHUDLayer.extend({
  /**
   * @method initAtlases
   * @protected
   */

  initAtlases: function initAtlases() {
    this.regoAtlas('game-pics');
  },

  /**
   * @method initLabels
   * @protected
   */
  initLabels: function initLabels() {
    var cw = _ccsx2.default.center(),
        wz = _ccsx2.default.vrect(),
        wb = _ccsx2.default.vbox();

    this.scoreLabel = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.SmallTypeWriting'),
      text: '0',
      anchor: _ccsx2.default.acs.TopRight,
      scale: xcfg.game.scale // * 2
    });
    this.scoreLabel.setPosition(wb.right - csts.TILE * wz.width / 480, wb.top - wz.height / 320 * csts.TILE);

    this.addItem(this.scoreLabel);

    this.status = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.CoffeeBuzzed'),
      text: '',
      scale: xcfg.game.scale * 0.5,
      pos: cc.p(cw.x * 1.5, cw.y)
    });
    this.addItem(this.status);
  },

  /**
   * @method endGame
   * @private
   */
  endGame: function endGame() {
    this.replayBtn.setVisible(true);
    this.status.setVisible(true);
    this.drawStatusText(_asterix2.default.l10n('%gameover'));
  },

  /**
   * @method drawStatusText
   * @private
   */
  drawStatusText: function drawStatusText(msg) {
    this.status.setString(msg);
  },


  showStatus: sjs.NILFUNC,
  initIcons: sjs.NILFUNC,

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
    this.replayBtn.setVisible(false);
    this.status.setVisible(false);
    this.score = 0;
  },

  /**
   * @method updateScore
   */
  updateScore: function updateScore(score) {
    this.score += score;
    this.scoreLabel.setString('' + this.score);
  },

  /**
   * @method addReplayIcon
   * @protected
   */
  addReplayIcon: function addReplayIcon(menu, where) {
    var wall = _ccsx2.default.csize('gray.png').width,
        c = menu.getChildByTag(1),
        hh = _ccsx2.default.getScaledHeight(c) * 0.5,
        hw = _ccsx2.default.getScaledWidth(c) * 0.5,
        wb = _ccsx2.default.vbox(),
        cw = _ccsx2.default.center(),
        y = void 0;

    if (where === _ccsx2.default.acs.Bottom) {
      y = wb.bottom + csts.TILE + hh;
    } else {
      y = wb.top - csts.TILE - hh;
    }
    menu.setPosition(cw.x + wall * 0.5 + hw, y);
    this.replayBtn = menu;
    this.addItem(menu);
  },

  /**
   * @method ctor
   * @constructs
   */
  ctor: function ctor(options) {

    this._super(options);

    this.options.i_replay = {
      nnn: '#icon_replay.png',
      color: _ccsx2.default.white,
      where: _ccsx2.default.acs.Bottom,
      visible: false,
      cb: function cb() {
        _asterix2.default.fire('/hud/replay');
      }
    };

    this.options.i_menu = {
      nnn: '#icon_menu.png',
      where: _ccsx2.default.acs.Bottom,
      color: _ccsx2.default.white,
      cb: function cb() {
        _asterix2.default.fire('/hud/showmenu');
      }
    };
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