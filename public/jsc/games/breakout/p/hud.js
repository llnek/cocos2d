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
   * @method initAtlases
   * @protected
   */

  initAtlases: function initAtlases() {
    this.regoAtlas('game-pics');
  },

  /**
   * @method hudAtlas
   * @private
   */
  hudAtlas: function hudAtlas() {
    return 'game-pics';
  },

  /**
   * @method updateScore
   */
  updateScore: function updateScore(n) {
    this.score += n;
    this.drawScore();
  },

  /**
   * @method resetAsNew
   * @private
   */
  resetAsNew: function resetAsNew() {
    this.reset();
  },

  /**
   * @method reset
   * @private
   */
  reset: function reset() {
    this.replayBtn.setVisible(false);
    this.lives.resurrect();
    this.score = 0;
  },

  /**
   * @method initLabels
   * @protected
   */
  initLabels: function initLabels() {
    var wz = _ccsx2.default.vrect();

    this.scoreLabel = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.TinyBoxBB'),
      text: '0',
      anchor: _ccsx2.default.acs.BottomRight,
      scale: 12 / 72
    });
    this.scoreLabel.setPosition(wz.width - csts.TILE - csts.S_OFF, wz.height - csts.TILE - csts.S_OFF - _ccsx2.default.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },

  /**
   * @method initIcons
   * @protected
   */
  initIcons: function initIcons() {
    var wz = _ccsx2.default.vrect();

    this.lives = new _scenes2.default.XHUDLives(this, csts.TILE + csts.S_OFF, wz.height - csts.TILE - csts.S_OFF, {
      frames: ['paddle.png'],
      scale: 0.5,
      totalLives: 3
    });

    this.lives.create();
  },

  /**
   * @method drawScore
   * @private
   */
  drawScore: function drawScore() {
    this.scoreLabel.setString(Number(this.score).toString());
  },

  /**
   * @method ctor
   * @private
   */
  ctor: function ctor(options) {
    this._super(options);
    this.options.i_replay = {
      nnn: '#icon_replay.png',
      where: _ccsx2.default.acs.Bottom,
      visible: false,
      cb: function cb() {
        _asterix2.default.fire('/hud/replay');
      }
    };

    this.options.i_menu = {
      nnn: '#icon_menu.png',
      where: _ccsx2.default.acs.Bottom,
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