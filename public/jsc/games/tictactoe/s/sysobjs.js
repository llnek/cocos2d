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
              * @requires s/utils
              * @requires s/factory
              * @requires s/resolve
              * @requires s/stager
              * @requires s/logic
              * @requires s/motion
              * @module s/sysobjs
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _factory = require('s/factory');

var _factory2 = _interopRequireDefault(_factory);

var _resolve = require('s/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _stager = require('s/stager');

var _stager2 = _interopRequireDefault(_stager);

var _logic = require('s/logic');

var _logic2 = _interopRequireDefault(_logic);

var _motion = require('s/motion');

var _motion2 = _interopRequireDefault(_motion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,

/** @alias module:s/sysobjs */
xbox = /** @lends xbox# */{
  systems: [_stager2.default.Stager, _motion2.default.Motions, _logic2.default.Logic, _resolve2.default.Resolve, _utils2.default],
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