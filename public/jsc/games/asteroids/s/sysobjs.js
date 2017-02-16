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
              * @requires s/factory
              * @requires s/collide
              * @requires s/motion
              * @requires s/move
              * @requires s/stager
              * @requires s/resolve
              * @module s/sysobjs
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _factory = require('s/factory');

var _factory2 = _interopRequireDefault(_factory);

var _collide = require('s/collide');

var _collide2 = _interopRequireDefault(_collide);

var _motion = require('s/motion');

var _motion2 = _interopRequireDefault(_motion);

var _move = require('s/move');

var _move2 = _interopRequireDefault(_move);

var _stager = require('s/stager');

var _stager2 = _interopRequireDefault(_stager);

var _resolve = require('s/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,

/** @alias module:s/sysobjs */
xbox = /** @lends xbox# */{
  /**
   * @property {Array} Collide
   */
  systems: [_collide2.default.Collide, _motion2.default.Motions, _move2.default.Move, _stager2.default.Stager, _resolve2.default.Resolve],

  /**
   * @method entityFactory
   * @param {Ash.Engine}
   * @param {Object}
   * @return {EntityFactory}
   */
  entityFactory: function entityFactory(engine, options) {
    _asterix2.default.factory = new _factory2.default.EntityFactory(engine, options);
    return _asterix2.default.factory;
  }
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF