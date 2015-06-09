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
 * @module p/splash
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';

let sjs = sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes.XLayer
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
    const cw = ccsx.center(),
    wz = ccsx.vrect(),
    menu= ccsx.vmenu([{
      nnn: '#play.png',
      cb() {
        this.onplay();
      },
      target: this
    }],
    {pos: cc.p(cw.x, wz.height * 0.1) });
    this.addItem(menu);
  },
  /**
   * @method onplay
   * @private
   */
  onplay() {
    const ss= sh.protos[sh.ptypes.start],
    mm= sh.protos[sh.ptypes.mmenu],
    dir = cc.director;
    dir.runScene( mm.reify({
      onback() { dir.runScene( ss.reify() ); }
    }));
  }

});

/** @alias module:p/splash */
const xbox= /** @lends xbox# */{
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

