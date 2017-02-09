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
 * @requires zotohlab/asx/scenes
 * @requires zotohlab/asx/ccsx
 * @module p/mmenu
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes.XMenuLayer
 * @class MainMenuLayer
 */
MainMenuLayer = scenes.XMenuLayer.extend({
  /**
   * @method setup
   * @protected
   */
  setup() {
    this.centerImage(sh.getImagePath('gui.mmenus.menu.bg'));
    this.title();
    this.btns();
    const cw = ccsx.center(),
    wz = ccsx.vrect();
  },
  /**
   * @method title
   * @private
   */
  title() {
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
  onplay(msg) {
    cc.director.runScene( sh.protos[sh.ptypes.game].reify(msg));
  }

});

/** @alias module:p/mmenu */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: sh.ptypes.mmenu,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify(options) {
    return new scenes.XSceneFactory([
      MainMenuLayer
    ]).reify(options);
  }

};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

