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
    this.regoAtlas(this.hudAtlas());
  },

  /**
   * @method hudAtlas
   * @protected
   */
  hudAtlas: function hudAtlas() {
    return 'game-pics';
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
      frames: ['ship01.png'],
      scale: 0.4,
      totalLives: 3
    });

    this.lives.create();
  },

  /**
   * @method resetAsNew
   * @protected
   */
  resetAsNew: function resetAsNew() {
    this.reset();
    this.score = 0;
  },

  /**
   * @method ctor
   * @constructs
   * @param {Object} options
   */
  ctor: function ctor(options) {
    this._super(options);
    this.options.i_menu = {
      cb: function cb() {
        _asterix2.default.fire('/hud/showmenu');
      },

      nnn: '#icon_menu.png',
      where: _ccsx2.default.acs.Bottom,
      scale: 32 / 48
    };
    this.options.i_replay = {
      cb: function cb() {
        _asterix2.default.fire('/hud/replay');
      },

      where: _ccsx2.default.acs.Bottom,
      nnn: '#icon_replay.png',
      scale: 32 / 48,
      visible: false
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