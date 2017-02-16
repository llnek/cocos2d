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
              * @requires n/cobjs
              * @requires n/gnodes
              * @requires s/utils
              * @requires s/factory
              * @requires s/clear
              * @requires s/generate
              * @requires s/motion
              * @requires s/move
              * @requires s/resolve
              * @requires s/stager
              * @module s/sysobjs
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _gnodes = require('n/gnodes');

var _gnodes2 = _interopRequireDefault(_gnodes);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _factory = require('s/factory');

var _factory2 = _interopRequireDefault(_factory);

var _clear = require('s/clear');

var _clear2 = _interopRequireDefault(_clear);

var _generate = require('s/generate');

var _generate2 = _interopRequireDefault(_generate);

var _motion = require('s/motion');

var _motion2 = _interopRequireDefault(_motion);

var _move = require('s/move');

var _move2 = _interopRequireDefault(_move);

var _resolve = require('s/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _stager = require('s/stager');

var _stager2 = _interopRequireDefault(_stager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,

/** @alias module:s/sysobjs */
xbox = /** @lends xbox# */{
  /**
   * @property {Array} systems
   */
  systems: [_clear2.default.Clear, _generate2.default.Generate, _motion2.default.Motions, _move2.default.Move, _resolve2.default.Resolve, _stager2.default.Stager, _utils2.default],
  /**
   * @method entityFactory
   * @param {Ash.Engine}
   * @return {EntityFactory}
   */
  entityFactory: function entityFactory(engine) {
    _asterix2.default.factory = new _factory2.default.EntityFactory(engine);
    return _asterix2.default.factory;
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF