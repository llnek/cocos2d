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
              * @requires s/utils
              * @module p/splash
              */

var _scenes = require('zotohlab/asx/scenes');

var _scenes2 = _interopRequireDefault(_scenes);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,

/** * @class SplashLayer */
SplashLayer = _scenes2.default.XLayer.extend({
  /**
   * @method setup
   * @protected
   */

  setup: function setup() {
    this.centerImage(_asterix2.default.getImage('game.bg'));
    this.incIndexZ();
    this.regoAtlas('game-pics');
    this.title();
    this.demo();
    this.btns();
  },

  /**
   * @method title
   * @private
   */
  title: function title() {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox();
    this.addAtlasFrame('#title.png', cc.p(cw.x, wb.top * 0.9), 'game-pics');
  },

  /**
   * @method btns
   * @private
   */
  btns: function btns() {
    var cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        menu = _ccsx2.default.vmenu([{
      cb: function cb() {
        this.onplay();
      },

      target: this,
      nnn: '#play.png'
    }], { pos: cc.p(cw.x, wb.top * 0.1) });
    this.addItem(menu);
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
   * @method demo
   * @private
   */
  demo: function demo() {
    var _this = this;

    var scale = 0.75,
        pos = 0,
        fm = void 0,
        sp = void 0,
        bx = void 0;

    // we scale down the icons to make it look nicer
    R.forEach(function (mp) {
      // set up the grid icons
      if (pos === 1 || pos === 5 || pos === 6 || pos === 7) {
        fm = '#x.png';
      } else if (pos === 0 || pos === 4) {
        fm = '#z.png';
      } else {
        fm = '#o.png';
      }
      sp = new cc.Sprite(fm);
      bx = _ccsx2.default.vboxMID(mp);
      sp.attr({
        scale: scale,
        x: bx.x,
        y: bx.y
      });
      _this.addAtlasItem('game-pics', sp);
      ++pos;
    }, _utils2.default.mapGridPos(3, scale));
  }
});

/** @alias module:p/splash */
var xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: _asterix2.default.ptypes.start,
  /**
   * Create the splash screen.
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