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
              * @module zotohlab/gui/msgbox
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
    R = sjs.ramda,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes.XLayer
 * @class UILayer
 */
UILayer = _scenes2.default.XLayer.extend({
  /**
   * @method rtti
   */

  rtti: function rtti() {
    return 'MBoxLayer';
  },

  /**
   * @method setup
   * @protected
   */
  setup: function setup() {
    var qn = new cc.LabelBMFont(_asterix2.default.l10n(this.options.msg), _asterix2.default.getFont('font.OCR')),
        cw = _ccsx2.default.center(),
        wz = _ccsx2.default.vrect(),
        wb = _ccsx2.default.vbox(),
        menu = void 0;

    this.centerImage(_asterix2.default.getImage('game.bg'));
    qn.setPosition(cw.x, wb.top * 0.75);
    qn.setScale(xcfg.game.scale * 0.25);
    qn.setOpacity(0.9 * 255);
    this.addItem(qn);

    menu = _ccsx2.default.vmenu([{ nnn: '#ok.png',
      cb: function cb() {
        this.options.yes();
      },

      target: this
    }], { pos: cc.p(cw.x, wb.top * 0.1) });
    this.addItem(menu);
  }
});

/** @alias module:zotohlab/asx/msgbox */
var xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: _asterix2.default.ptypes.mbox,
  /**
   * Create a scene to display the message.
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify: function reify(options) {
    return new _scenes2.default.XSceneFactory([UILayer]).reify(options);
  }
};

sjs.merge(exports, xbox);

return xbox;


//////////////////////////////////////////////////////////////////////////////
//EOF