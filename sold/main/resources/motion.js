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
 * @requires nodes/gnodes
 * @module s/motions
 */

import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import gnodes from 'n/gnodes';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,

/**
 * @class Motions
 */
Motions = sh.Ashley.sysDef({

  /**
   * @memberof module:s/motions~Motions
   * @method constructor
   * @param {Object} options
   */
  constructor(options) {
    this.state= options;
  },

  /**
   * @memberof module:s/motions~Motions
   * @method removeFromEngine
   * @param {Ash.Engine} engine
   */
  removeFromEngine(engine) {
  },

  /**
   * @memberof module:s/motions~Motions
   * @method addToEngine
   * @param {Ash.Engine} engine
   */
  addToEngine(engine) {
  },

  /**
   * @memberof module:s/motions~Motions
   * @method update
   * @param {Number} dt
   */
  update(dt) {
    const node = this.nodeList.head;
    if (this.state.running &&
       !!node) {
      this.processMotions(node,dt);
    }
  },

  /**
   * @method scanInput
   * @private
   */
  scanInput(node, dt) {
    if (cc.sys.capabilities['keyboard'] &&
        !cc.sys.isNative) {
      this.processKeys(node,dt);
    }
    else
    if (cc.sys.capabilities['mouse']) {
    }
    else
    if (cc.sys.capabilities['touches']) {
    }
  },

  /**
   * @method processMotions
   * @private
   */
  processMotions(node,dt) {
  },

  /**
   * @method processKeys
   * @private
   */
  processKeys(node,dt) {

    if (sh.main.keyPoll(cc.KEY.right)) {
    }
    if (sh.main.keyPoll(cc.KEY.left)) {
    }

    if (sh.main.keyPoll(cc.KEY.down)) {
    }
    if (sh.main.keyPoll(cc.KEY.up)) {
    }

  }

});

/** @alias module:s/motions */
const xbox = /** @lends xbox# */{
  /**
   * @property {Motions} Motions
   */
  Motions : Motions
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

