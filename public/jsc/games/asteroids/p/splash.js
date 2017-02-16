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
              * @module p/splash
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
/** * @class SplashLayer */
SplashLayer = _scenes2.default.XLayer.extend({
  /**
   * @method setup
   * @protected
   */

  setup: function setup() {
    this.centerImage(_asterix2.default.getImage('game.bg'));
    this.btns();
  },

  /**
   * @method onplay
   * @private
   */
  onplay: function onplay() {
    var ss = _asterix2.default.protos[_asterix2.default.ptypes.start],
        mm = _asterix2.default.protos[_asterix2.default.ptypes.mmenu];

    _ccsx2.default.runScene(mm.reify({
      onback: function onback() {
        _ccsx2.default.runScene(ss.reify());
      }
    }));
  },

  /**
   * @method btns
   * @private
   */
  btns: function btns() {
    var cw = _ccsx2.default.center(),
        wz = _ccsx2.default.vrect(),
        menu = _ccsx2.default.vmenu([{
      nnn: '#play.png',
      cb: function cb() {
        this.onplay();
      },

      target: this
    }], { pos: cc.p(cw.x, wz.height * 0.1) });
    this.addItem(menu);
  }
});

/** @alias module:p/splash */
var xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: _asterix2.default.ptypes.start,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify: function reify(options) {
    return new _scenes2.default.XSceneFactory([SplashLayer]).reify(options);
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF