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
    var wb = _ccsx2.default.vbox();

    this.scoreLabel = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.SmallTypeWriting'),
      text: '0',
      anchor: _ccsx2.default.acs.BottomRight,
      scale: xcfg.game.scale // * 2
    });
    this.scoreLabel.setPosition(wb.right - csts.TILE - csts.S_OFF, wb.top - csts.TILE - csts.S_OFF - _ccsx2.default.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },

  /**
   * @method initIcons
   * @protected
   */
  initIcons: function initIcons() {
    var wb = _ccsx2.default.vbox();

    this.lives = new _scenes2.default.XHUDLives(this, csts.TILE + csts.S_OFF, wb.top - csts.TILE - csts.S_OFF, {
      frames: ['health.png'],
      totalLives: 3
    });

    this.lives.create();
  },

  /**
   * @method ctor
   * @constructs
   */
  ctor: function ctor(options) {
    var color = _ccsx2.default.white,
        scale = 1;

    this._super(options);

    this.options.i_replay = {
      nnn: '#icon_replay.png',
      where: _ccsx2.default.acs.Bottom,
      color: color,
      scale: scale,
      visible: false,
      cb: function cb() {
        _asterix2.default.fire('/hud/replay');
      }
    };

    this.options.i_menu = {
      nnn: '#icon_menu.png',
      where: _ccsx2.default.acs.Bottom,
      color: color,
      scale: scale,
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