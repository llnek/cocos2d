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

