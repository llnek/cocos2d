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
 * @requires n/cobjs
 * @requires n/gnodes
 * @module s/resolve
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import gnodes from 'n/gnodes';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,

/**
 * @class Resolve
 */
Resolve = sh.Ashley.sysDef({

  /**
   * @memberof module:s/resolution~Resolve
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
    this.inited=false;
  },

  /**
   * @memberof module:s/resolution~Resolve
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/resolution~Resolve
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
    this.engine=engine;
  },

  /**
   * @memberof module:s/resolution~Resolve
   * @method update
   * @param {Number} dt
   */
  update(dt) {
  }

});

/** @alias module:s/resolution */
const xbox = /** @lends xbox# */{
  /**
   * @property {Resolve} Resolve
   */
  Resolve : Resolve
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

