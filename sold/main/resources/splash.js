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
 * @requires zotohlab/asx/scenes
 * @module p/splash
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes~XLayer
 * @class SplashLayer
 */
SplashLayer = scenes.XLayer.extend({
  /**
   * @method setup
   * @protected
   */
  setup() {
    this.centerImage(sh.getImagePath('game.bg'));
    this.btns();
  },
  /**
   * @method btns
   * @private
   */
  btns() {

  },
  /**
   * @method onplay
   * @private
   */
  onplay() {
    const ss= sh.protos[sh.ptypes.start],
    mm= sh.protos[sh.ptypes.mmenu],
    dir= cc.director;
    dir.runScene( mm.reify({
      onBack() { dir.runScene( ss.reify() ); }
    }));
  }
});

/** @alias module:p/splash */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti : sh.ptypes.start,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify(options) {
    return new scenes.XSceneFactory([
      SplashLayer
    ]).reify(options);
  }
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

