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
 * @module s/factory
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef;

/** @alias module:s/factory */
const xbox = /** @lends xbox# */{
  /**
   * @property {EntityFactory} EntityFactory
   * @class EntityFactory
   */
  EntityFactory : sh.Ashley.casDef({
    /**
     * @memberof module:s/factory~EntityFactory
     * @method constructor
     * @param {Ash.Engine} engine
     */
    constructor(engine) {
      this.engine=engine;
    }
  });
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

