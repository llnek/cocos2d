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
              * @module p/mmenu
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

//////////////////////////////////////////////////////////////////////////////
/** * @class MainMenuLayer */
MainMenuLayer = _scenes2.default.XMenuLayer.extend({
  /**
   * @method title
   * @private
   */

  title: function title() {
    var wb = _ccsx2.default.vbox(),
        cw = _ccsx2.default.center(),
        tt = _ccsx2.default.bmfLabel({
      fontPath: _asterix2.default.getFont('font.JellyBelly'),
      text: _asterix2.default.l10n('%mmenu'),
      pos: cc.p(cw.x, wb.top * 0.9),
      color: cc.color(246, 177, 127),
      scale: xcfg.game.scale
    });
    this.addItem(tt);
  },

  /**
   * @method onplay
   * @private
   */
  onplay: function onplay(msg) {
    _ccsx2.default.runScene(_asterix2.default.protos[_asterix2.default.ptypes.game].reify(msg));
  },

  /**
   * @method setup
   * @protected
   */
  setup: function setup() {
    this.centerImage(_asterix2.default.getImage('gui.mmenus.menu.bg'));
    this.title();
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        menu = _ccsx2.default.pmenu1({
      nnn: '#play.png',
      pos: cw,
      cb: function cb() {
        this.onplay({ mode: _asterix2.default.gtypes.P1_GAME });
      },

      target: this
    });
    this.addItem(menu);

    this.mkBackQuit(false, [{ nnn: '#icon_back.png',
      where: _ccsx2.default.acs.Bottom,
      cb: function cb() {
        this.options.onback();
      },

      target: this }, { nnn: '#icon_quit.png',
      where: _ccsx2.default.acs.Bottom,
      cb: function cb() {
        this.onQuit();
      },

      target: this }], function (m, z) {
      m.setPosition(wb.left + csts.TILE + z.width * 1.1, wb.bottom + csts.TILE + z.height * 0.45);
    });

    this.mkAudio({
      pos: cc.p(wb.right - csts.TILE, wb.bottom + csts.TILE),
      color: _ccsx2.default.white,
      anchor: _ccsx2.default.acs.BottomRight
    });
  },

  /**
   * @method ctor
   * @private
   */
  ctor: function ctor(options) {
    this._super(options);
  }
});

/** @alias module:p/mmenu */
var xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: _asterix2.default.ptypes.mmenu,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify: function reify(options) {
    return new _scenes2.default.XSceneFactory([MainMenuLayer]).reify(options);
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF