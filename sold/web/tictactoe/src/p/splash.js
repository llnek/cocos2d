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
 * @requires s/utils
 * @module p/splash
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import uts from 's/utils';

//////////////////////////////////////////////////////////////////////////////
let sjs=sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
/** * @class SplashLayer */
SplashLayer = scenes.XLayer.extend({
  /**
   * @method setup
   * @protected
   */
  setup() {
    this.centerImage(sh.getImage('game.bg'));
    this.incIndexZ();
    this.regoAtlas('game-pics');
    this.title();
    this.demo();
    this.btns();
  },
  /**
   * @method title
   * @private
   */
  title() {
    const cw = ccsx.center(),
    wb = ccsx.vbox();
    this.addAtlasFrame('#title.png',
                       cc.p(cw.x, wb.top * 0.9),
                       'game-pics');
  },
  /**
   * @method btns
   * @private
   */
  btns() {
    const cw = ccsx.center(),
    wb = ccsx.vbox(),
    menu= ccsx.vmenu([{
      cb() { this.onplay(); },
      target: this,
      nnn: '#play.png'
    }],
    { pos: cc.p(cw.x,
                wb.top * 0.1) });
    this.addItem(menu);
  },
  /**
   * @method onplay
   * @private
   */
  onplay() {
    const ss= sh.protos[sh.ptypes.start],
    mm= sh.protos[sh.ptypes.mmenu];
    ccsx.runScene( mm.reify({
      onback() { ccsx.runScene(ss.reify()); }
    }));
  },
  /**
   * @method demo
   * @private
   */
  demo() {
    let scale= 0.75,
    pos=0,
    fm, sp, bx;

    // we scale down the icons to make it look nicer
    R.forEach( mp => {
      // set up the grid icons
      if (pos === 1 || pos===5 || pos===6 || pos===7) { fm= '#x.png'; }
      else if (pos===0 || pos===4) { fm= '#z.png'; }
      else { fm= '#o.png'; }
      sp= new cc.Sprite(fm);
      bx=ccsx.vboxMID(mp);
      sp.attr({
        scale: scale,
        x: bx.x,
        y: bx.y
      });
      this.addAtlasItem('game-pics',sp);
      ++pos;
    },
    uts.mapGridPos(3,scale));
  }

});

/** @alias module:p/splash */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: sh.ptypes.start,
  /**
   * Create the splash screen.
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

