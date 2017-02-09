/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright (c) 2013-2016, Kenneth Leung. All rights reserved. */


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

