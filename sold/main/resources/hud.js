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
 * @module p/hud
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
 * @extends module:zotohlab/asx/scenes.XGameHUDLayer
 * @class HUDLayer
 */
HUDLayer = scenes.XGameHUDLayer.extend({
  /**
   * @method initAtlases
   * @protected
   */
  initAtlases() {
  },
  /**
   * @method hudAtlas
   * @private
   */
  hudAtlas() {
    return 'game-pics';
  },
  /**
   * @method initLabels
   * @protected
   */
  initLabels() {
    let offset = csts.TILE - csts.S_OFF,
    wz = ccsx.vrect();

    this.scoreLabel = ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '0',
      anchor: ccsx.acs.BottomRight,
      scale: 12/72
    });

    this.scoreLabel.setPosition(wz.width - offset,
      wz.height - offset - ccsx.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },
  /**
   * @method initIcons
   * @protected
   */
  initIcons() {
    const wz = ccsx.vrect();

    this.lives = new layers.XHUDLives( this, csts.TILE + csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF, {
      frames: ['health.png'],
      totalLives: 3
    });

    this.lives.create();
  }

});

/** @alias module:p/hud */
const xbox = /** @lends xbox# */ {
  /**
   * @property {HUDLayer} HUDLayer
   */
  HUDLayer : HUDLayer
};

sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

