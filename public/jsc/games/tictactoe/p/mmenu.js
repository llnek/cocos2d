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
              * @module p/mmenu
              */

var _scenes = require('zotohlab/asx/scenes');

var _scenes2 = _interopRequireDefault(_scenes);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//////////////////////////////////////////////////////////////////////////////
var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef = void 0,
    SEED = {
  ppids: {},
  grid: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  size: 3,
  pnum: 1,
  mode: 0
},

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
      color: cc.color('#F6B17F'),
      scale: xcfg.game.scale
    });
    this.addItem(tt);
  },

  /**
   * @method onnetplay
   * @private
   */
  onnetplay: function onnetplay(msg) {
    var gl = _asterix2.default.protos[_asterix2.default.ptypes.game],
        ol = _asterix2.default.protos[_asterix2.default.ptypes.online],
        mm = _asterix2.default.protos[_asterix2.default.ptypes.mmenu];
    msg.onback = function () {
      _ccsx2.default.runScene(mm.reify());
    };
    msg.yes = function (wss, pnum, startmsg) {
      var m = sjs.mergeEx(R.omit(['yes', 'onback'], msg), {
        wsock: wss,
        pnum: pnum
      });
      sjs.merge(m, startmsg);
      _ccsx2.default.runScene(gl.reify(m));
    };
    _ccsx2.default.runScene(ol.reify(msg));
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
    this.centerImage(_asterix2.default.getImage('gui.mmenu.menu.bg'));
    this.incIndexZ();
    this.title();
    var color = cc.color('#5E3178'),
        cw = _ccsx2.default.center(),
        wb = _ccsx2.default.vbox(),
        me = this,
        p = {},
        menu = _ccsx2.default.vmenu([{ nnn: '#online.png',
      cb: function cb() {
        me.onnetplay(sjs.mergeEx(SEED, { mode: _asterix2.default.gtypes.ONLINE_GAME }));
      }
    }, { nnn: '#player2.png',
      cb: function cb() {
        p[_asterix2.default.l10n('%p1')] = [1, _asterix2.default.l10n('%player1')];
        p[_asterix2.default.l10n('%p2')] = [2, _asterix2.default.l10n('%player2')];
        me.onplay(sjs.mergeEx(SEED, { ppids: p,
          mode: _asterix2.default.gtypes.P2_GAME }));
      }
    }, { nnn: '#player1.png',
      cb: function cb() {
        p[_asterix2.default.l10n('%cpu')] = [2, _asterix2.default.l10n('%computer')];
        p[_asterix2.default.l10n('%p1')] = [1, _asterix2.default.l10n('%player1')];
        me.onplay(sjs.mergeEx(SEED, { ppids: p,
          mode: _asterix2.default.gtypes.P1_GAME }));
      }
    }], { pos: cw });
    this.addItem(menu);

    this.mkBackQuit(false, [{
      nnn: '#icon_back.png',
      color: color,
      cb: function cb() {
        me.options.onback();
      }
    }, { nnn: '#icon_quit.png',
      color: color,
      cb: function cb() {
        me.onQuit();
      }
    }], function (m, z) {
      m.setPosition(wb.left + csts.TILE + z.width * 1.1, wb.bottom + csts.TILE + z.height * 0.45);
    });

    this.mkAudio({
      pos: cc.p(wb.right - csts.TILE, wb.bottom + csts.TILE),
      color: color,
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
   * Create the Main Menu screen.
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