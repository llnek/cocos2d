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
 * @requires nodes/cobjs
 * @requires s/utils
 * @module s/supervisor
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import xpool from 'zotohlab/asx/pool';
import cobjs from 'nodes/cobjs';
import utils from 's/utils';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,

/**
 * @class GameSupervisor
 */
GameSupervisor = sh.Ashley.sysDef({

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
    this.inited=false;
  },

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/supervisor~GameSupervisor
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },

  /**
   * @memberof module:s/supervisor~GameSupervisor
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
   * @property {GameSupervisor} GameSupervisor
   */
  GameSupervisor : GameSupervisor
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

