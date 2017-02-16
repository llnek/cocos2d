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
              * @requires n/cobjs
              * @requires s/utils
              * @module s/factory
              */

var _asterix = require('zotohlab/asx/asterix');

var _asterix2 = _interopRequireDefault(_asterix);

var _ccsx = require('zotohlab/asx/ccsx');

var _ccsx2 = _interopRequireDefault(_ccsx);

var _cobjs = require('n/cobjs');

var _cobjs2 = _interopRequireDefault(_cobjs);

var _utils = require('s/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sjs = _asterix2.default.skarojs,
    xcfg = _asterix2.default.xcfg,
    csts = xcfg.csts,
    undef = void 0,

//////////////////////////////////////////////////////////////////////////
/**
 * @class EntityFactory
 */
EntityFactory = _asterix2.default.Ashley.sysDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Ash.Engine} engine
   */

  constructor: function constructor(engine) {
    this.engine = engine;
  },

  /**
   * @memberof module:s/factory~EntityFactory
   * @method createArena
   * @param {cc.Layer} layer
   * @param {Object} options
   * @return {Ash.Entity}
   */
  createArena: function createArena(layer, options) {
    var ent = _asterix2.default.Ashley.newEntity();
    ent.add(new _cobjs2.default.FilledLines());
    ent.add(new _cobjs2.default.ShapeShell());
    ent.add(new _cobjs2.default.BlockGrid());
    ent.add(new _cobjs2.default.TileGrid());
    ent.add(new _cobjs2.default.Motion());
    ent.add(new _cobjs2.default.Dropper());
    ent.add(new _cobjs2.default.Pauser());
    ent.add(new _cobjs2.default.GridBox());
    ent.add(new _cobjs2.default.CtrlPad());
    return ent;
  }
});

/** @alias module:s/factory */
var xbox = /** @lends xbox# */{
  /**
   * @property {EntityFactory} EntityFactory
   */
  EntityFactory: EntityFactory
};

sjs.merge(exports, xbox);

return xbox;

//////////////////////////////////////////////////////////////////////////////
//EOF