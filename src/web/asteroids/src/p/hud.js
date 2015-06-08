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
 * @requires zotohlab/asx/scenes
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
   * @method updateScore
   */
  updateScore(n) {
    this.score += n;
    this.drawScore();
  },
  /**
   * @method resetAsNew
   */
  resetAsNew() {
    this.score = 0;
    this.reset();
  },
  /**
   * @method reset
   */
  reset() {
    this.replayBtn.setVisible(false);
    this.lives.resurrect();
  },
  /**
   * @method initAtlases
   * @protected
   */
  initAtlases() {
    this.regoAtlas( this.hudAtlas());
  },
  /**
   * @method hudAtlas
   * @private
   */
  hudAtlas() {
    return 'game-pics';
  },
  /**
   * @method drawScore
   * @private
   */
  drawScore() {
    this.scoreLabel.setString(Number(this.score).toString());
  },
  /**
   * @method initLabels
   * @private
   */
  initLabels() {
    const wz = ccsx.vrect();

    this.scoreLabel = ccsx.bmfLabel({
      fontPath: sh.getFontPath('font.TinyBoxBB'),
      text: '0',
      anchor: ccsx.acs.BottomRight,
      scale: 12/72
    });
    this.scoreLabel.setPosition( wz.width - csts.TILE - csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },
  /**
   * @method initIcons
   * @protected
   */
  initIcons() {
    const wz = ccsx.vrect();

    this.lives = new scenes.XHUDLives( this, csts.TILE + csts.S_OFF,
      wz.height - csts.TILE - csts.S_OFF, {
      frames: ['rship_1.png'],
      scale: 0.5,
      totalLives: 3
    });

    this.lives.create();
  }

});

/** @alias module:p/hud */
const xbox = /** @lends xbox# */{
  /**
   * @property {HUDLayer} HUDLayer
   */
  HUDLayer: HUDLayer
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

