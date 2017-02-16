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
              * @requires zotohlab/gui/msgbox
              * @requires zotohlab/gui/ynbox
              * @requires p/splash
              * @requires p/mmenu
              * @requires p/arena
              * @module p/protos
              */

var _msgbox = require('zotohlab/gui/msgbox');

var _msgbox2 = _interopRequireDefault(_msgbox);

var _ynbox = require('zotohlab/gui/ynbox');

var _ynbox2 = _interopRequireDefault(_ynbox);

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _splash = require('p/splash');

var _splash2 = _interopRequireDefault(_splash);

var _mmenu = require('p/mmenu');

var _mmenu2 = _interopRequireDefault(_mmenu);

var _game = require('p/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ps = [_splash2.default, _mmenu2.default, _msgbox2.default, _ynbox2.default, _game2.default],
    protos = _asterix2.default.protos,
    sjs = _asterix2.default.skarojs,

/** @alias module:p/protos */
xbox = protos,
    R = sjs.ramda,
    undef = void 0;

R.forEach(function (obj) {
  protos[obj.rtti] = obj;
}, ps);

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF