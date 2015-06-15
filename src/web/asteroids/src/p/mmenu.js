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
/** * @class MainMenuLayer */
MainMenuLayer = scenes.XMenuLayer.extend({
  /**
   * @method title
   * @private
   */
  title() {
    const wb=ccsx.vbox(),
    cw= ccsx.center(),
    tt=ccsx.bmfLabel({
      fontPath: sh.getFont('font.JellyBelly'),
      text: sh.l10n('%mmenu'),
      pos: cc.p(cw.x, wb.top * 0.9),
      color: cc.color(246,177,127),
      scale: xcfg.game.scale
    });
    this.addItem(tt);
  },
  /**
   * @method onplay
   * @private
   */
  onplay(msg) {
    ccsx.runScene( sh.protos[sh.ptypes.game].reify(msg));
  },
  /**
   * @method setup
   * @protected
   */
  setup() {
    this.centerImage(sh.getImage('gui.mmenus.menu.bg'));
    this.title();
    const cw = ccsx.center(),
    wb = ccsx.vbox(),
    menu= ccsx.pmenu1({
      nnn: '#play.png',
      pos: cw,
      cb() {
        this.onplay( { mode: sh.gtypes.P1_GAME});
      },
      target: this
    });
    this.addItem(menu);

    this.mkBackQuit(false, [
      { nnn: '#icon_back.png',
        where: ccsx.acs.Bottom,
        cb() {
          this.options.onback();
        },
        target: this },
      { nnn: '#icon_quit.png',
        where: ccsx.acs.Bottom,
        cb() { this.onQuit(); },
        target: this }
    ],
    (m,z) => {
      m.setPosition(wb.left + csts.TILE + z.width * 1.1,
                    wb.bottom + csts.TILE + z.height * 0.45);
    });

    this.mkAudio({
      pos: cc.p(wb.right - csts.TILE,
                wb.bottom + csts.TILE),
      color: ccsx.white,
      anchor: ccsx.acs.BottomRight
    });

  },
  /**
   * @method ctor
   * @private
   */
  ctor(options) {
    this._super(options);
  }

});

/** @alias module:p/mmenu */
const xbox= /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti : sh.ptypes.mmenu,
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

