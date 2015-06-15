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
 * @requires s/sysobjs
 * @requires p/hud
 * @module p/game
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import sobjs from 's/sysobjs';
import huds from 'p/hud';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class BackLayer */
BackLayer = scenes.XLayer.extend({
  rtti() { return 'BackLayer'; },
  setup() {
  }
}),
//////////////////////////////////////////////////////////////////////////
/** * @class GameLayer */
GameLayer = scenes.XGameLayer.extend({
  /**
   * @method pkInput
   * @protected
   */
  pkInput() {
    ccsx.onKeyPolls(this.keyboard);
  },
  /**
   * @method reset
   * @protected
   */
  reset(newFlag) {
    if (!sjs.isempty(this.atlases)) {
      sjs.eachObj( v => { v.removeAllChildren(); }, this.atlases);
    } else {
      this.regoAtlas('game-pics');
    }
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },
  /**
   * @method operational
   * @protected
   */
  operational() {
    return this.options.running;
  },
  /**
   * @method spawnPlayer
   * @private
   */
  spawnPlayer() {
    sh.factory.bornPaddle();
  },
  /**
   * @method getEnclosureBox
   * @private
   */
  getEnclosureBox() {
    const wz= ccsx.vrect();
    return { bottom: csts.TILE,
             top: wz.height - csts.TOP * csts.TILE,
             left: csts.TILE,
             right: wz.width - csts.TILE };
  },
  /**
   * @method onPlayerKilled
   * @private
   */
  onPlayerKilled() {
    if ( this.getHUD().reduceLives(1)) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },
  /**
   * @method onDone
   * @private
   */
  onDone() {
    this.reset();
    this.options.running=false;
    this.getHUD().enableReplay();
  },
  /**
   * @method replay
   */
  replay() {
    this.play(false);
  },
  /**
   * @method play
   */
  play(newFlag) {

    this.initEngine(sobjs.systems, sobjs.entityFactory);
    this.reset(newFlag);

    this.options.world= this.getEnclosureBox();
    this.options.running=true;
  },
  /**
   * @method onEarnScore
   * @private
   */
  onEarnScore(msg) {
    this.getHUD().updateScore(msg.value);
  },
  /**
   * @method onNewGame
   * @private
   */
  onNewGame(mode) {
    //sh.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});

/** @alias module:p/game */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti : sh.ptypes.game,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify(options) {
    const scene = new scenes.XSceneFactory([
      BackLayer,
      GameLayer,
      huds.HUDLayer
    ]).reify(options);

    scene.onmsg('/game/bricks/killed', msg => {
      sh.main.onBrickKilled(msg);
    }).
    onmsg('/game/players/killed', msg => {
      sh.main.onPlayerKilled(msg);
    }).
    onmsg('/game/players/earnscore', msg => {
      sh.main.onEarnScore(msg);
    }).
    onmsg('/hud/showmenu', msg => {
      scenes.showMenu();
    }).
    onmsg('/hud/replay', msg => {
      sh.main.replay();
    });

    return scene;
  }
};



sjs.merge(exports, xbox);
/*@@
return xbox;
@@*/
//////////////////////////////////////////////////////////////////////////////
//EOF

