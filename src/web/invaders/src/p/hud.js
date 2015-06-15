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
/** * @class HUDLayer */
HUDLayer = scenes.XGameHUDLayer.extend({
  /**
   * @method initAtlases
   * @protected
   */
  initAtlases() {
    this.regoAtlas('game-pics');
  },
  /**
   * @method initLabels
   * @protected
   */
  initLabels() {
    const wb = ccsx.vbox();

    this.scoreLabel = ccsx.bmfLabel({
      fontPath: sh.getFont('font.SmallTypeWriting'),
      text: '0',
      anchor: ccsx.acs.BottomRight,
      scale: xcfg.game.scale// * 2
    });
    this.scoreLabel.setPosition(wb.right - csts.TILE - csts.S_OFF,
      wb.top - csts.TILE - csts.S_OFF - ccsx.getScaledHeight(this.scoreLabel));

    this.addChild(this.scoreLabel, this.lastZix, ++this.lastTag);
  },
  /**
   * @method initIcons
   * @protected
   */
  initIcons() {
    const wb = ccsx.vbox();

    this.lives = new scenes.XHUDLives( this, csts.TILE + csts.S_OFF,
      wb.top - csts.TILE - csts.S_OFF, {
      frames: ['health.png'],
      totalLives: 3
    });

    this.lives.create();
  },
  /**
   * @method ctor
   * @constructs
   */
  ctor(options) {
    const color= ccsx.white,
    scale=1;

    this._super(options);

    this.options.i_replay= {
      nnn: '#icon_replay.png',
      where: ccsx.acs.Bottom,
      color: color,
      scale : scale,
      visible: false,
      cb() {
        sh.fire('/hud/replay');
      }
    };

    this.options.i_menu= {
      nnn: '#icon_menu.png',
      where: ccsx.acs.Bottom,
      color: color,
      scale: scale,
      cb() {
        sh.fire('/hud/showmenu');
      }
    };

  }

});


/** @alias module:p/hud */
const xbox= /** @lends xbox# */{
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

