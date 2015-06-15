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


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class SplashLayer */
SplashLayer = scenes.XLayer.extend({
  /**
   * @method setup
   * @protected
   */
  setup() {
    this.centerImage(sh.getImage('game.bg'));
    this.title();
    this.btns();
  },
  /**
   * @method onplay
   * @private
   */
  onplay() {
    const ss= sh.protos[sh.ptypes.start],
    mm= sh.protos[sh.ptypes.mmenu];

    ccsx.runScene( mm.reify({
      onback() { ccsx.runScene( ss.reify() ); }
    }));
  },
  /**
   * @method title
   * @private
   */
  title() {
    const cw= ccsx.center(),
    wb= ccsx.vbox();
    this.addFrame('#title.png',
                  cc.p(cw.x, wb.top * 0.9));
  },
  /**
   * @method btns
   * @private
   */
  btns() {
    const cw= ccsx.center(),
    wb= ccsx.vbox(),
    menu= ccsx.vmenu([{
      nnn: '#play.png',
      target: this,
      cb() {
        this.onplay();
      }
    }],
    {pos: cc.p(cw.x, wb.top * 0.1) });
    this.addItem(menu);
  }

});

/** @alias module:p/splash */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: sh.ptypes.start,
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

