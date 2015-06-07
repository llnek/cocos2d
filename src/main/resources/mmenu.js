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

