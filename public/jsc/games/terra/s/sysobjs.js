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
              * @requires s/stager
              * @requires s/aliens
              * @requires s/motion
              * @requires s/move
              * @requires s/collide
              * @requires s/resolve
              * @requires s/render
              * @module s/sysobjs
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

var _factory = require('s/factory');

var _factory2 = _interopRequireDefault(_factory);

var _stager = require('s/stager');

var _stager2 = _interopRequireDefault(_stager);

var _aliens = require('s/aliens');

var _aliens2 = _interopRequireDefault(_aliens);

var _motion = require('s/motion');

var _motion2 = _interopRequireDefault(_motion);

var _move = require('s/move');

var _move2 = _interopRequireDefault(_move);

var _collide = require('s/collide');

var _collide2 = _interopRequireDefault(_collide);

var _resolve = require('s/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _render = require('s/render');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,

/** @alias module:s/sysobjs */
xbox = /** @lends xbox# */{

  /**
   * @property {Array} systems
   */
  systems: [_stager2.default.Stager, _aliens2.default.Aliens, _motion2.default.Motions, _move2.default.MoveXXX, _collide2.default.Collide, _resolve2.default.Resolve, _render2.default.Render],

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