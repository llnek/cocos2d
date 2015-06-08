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
 * @requires nodes/gnodes
 * @module s/rendering
 */

import sh from 'zotohlab/asx/asterix';
import gnodes from 'nodes/gnodes';
import ccsx from 'zotohlab/asx/ccsx';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @class RenderSystem
 */
RenderSystem = sh.Ashley.sysDef({
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state = options;
  },
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },
  /**
   * @memberof module:s/rendering~RenderSystem
   * @method update
   * @param {Number} dt
   */
  update(dt) {
  }

});

/**
 * @memberof module:s/rendering~RenderSystem
 * @property {Number} Priority
 * @static
 */
RenderSystem.Priority = xcfg.ftypes.Render;

/** @alias module:s/rendering */
const xbox = /** @lends xbox# */{
  /**
   * @property {RenderSystem}  RenderSystem
   */
  RenderSystem : RenderSystem
};


sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
///////////////////////////////////////////////////////////////////////////////
//EOF

