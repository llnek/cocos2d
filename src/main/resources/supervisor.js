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
 * @requires zotohlab/asx/pool
 * @requires n/cobjs
 * @module s/supervisor
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import xpool from 'zotohlab/asx/pool';
import cobjs from 'nodes/cobjs';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,

/**
 * @class Supervisor
 */
Supervisor = sh.Ashley.sysDef({

  /**
   * @memberof module:s/supervisor~Supervisor
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
    this.inited=false;
  },

  /**
   * @memberof module:s/supervisor~Supervisor
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/supervisor~Supervisor
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },

  /**
   * @memberof module:s/supervisor~Supervisor
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    if (! this.inited) {
      this.onceOnly();
      this.inited=true;
    }
  },

  /**
   * @method onceOnly
   * @private
   */
  onceOnly() {
  }

});

/** @alias module:s/supervisor */
const xbox = /** @lends xbox# */{
  /**
   * @property {Supervisor} Supervisor
   */
  Supervisor : Supervisor
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

