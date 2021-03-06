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

"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/ccsx
 * @requires n/cobjs
 * @requires s/utils
 * @module s/factory
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import utils from 's/utils';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class EntityFactory
 */
EntityFactory = sh.Ashley.sysDef({
  /**
   * @memberof module:s/factory~EntityFactory
   * @method constructor
   * @param {Ash.Engine} engine
   */
  constructor(engine) {
    this.engine=engine;
  },
  /**
   * @memberof module:s/factory~EntityFactory
   * @method createArena
   * @param {cc.Layer} layer
   * @param {Object} options
   * @return {Ash.Entity}
   */
  createArena(layer, options) {
    const ent = sh.Ashley.newEntity();
    ent.add(new cobjs.FilledLines());
    ent.add(new cobjs.ShapeShell());
    ent.add(new cobjs.BlockGrid());
    ent.add(new cobjs.TileGrid());
    ent.add(new cobjs.Motion());
    ent.add(new cobjs.Dropper());
    ent.add(new cobjs.Pauser());
    ent.add(new cobjs.GridBox());
    ent.add(new cobjs.CtrlPad());
    return ent;
  }

});

/** @alias module:s/factory */
const xbox = /** @lends xbox# */{
  /**
   * @property {EntityFactory} EntityFactory
   */
  EntityFactory : EntityFactory
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

