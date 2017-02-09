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
    this.options.level=1;
    this.options.running=true;
  },
  /**
   * @method reset
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
    sh.factory.bornShip();
  },
  /**
   * @method onPlayerKilled
   * @private
   */
  onPlayerKilled(msg) {
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
    this.options.running =false;
    this.getHUD().enableReplay();
  },
  /**
   * @method onEarnScore
   * @private
   */
  onEarnScore(msg) {
    this.getHUD().updateScore(msg.score);
  },
  /**
   * @method onNewGame
   * @private
   */
  onNewGame(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  }

});

/** @alias module:p/game */
const xbox= /** @lends xbox# */{
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

    scene.onmsg('/game/missiles/killed', msg => {
      sh.main.onMissileKilled(msg);
    }).
    onmsg('/game/ufos/killed', msg => {
      sh.main.onUfoKilled(msg);
    }).
    onmsg('/game/players/shoot', msg => {
      sh.main.onFireMissile(msg);
    }).
    onmsg('/game/players/killed', msg => {
      sh.main.onPlayerKilled(msg);
    }).
    onmsg('/game/ufos/shoot', msg => {
      sh.main.onFireLaser(msg);
    }).
    onmsg('/game/stones/create', msg => {
      sh.main.onCreateStones(msg);
    }).
    onmsg('/game/rocks/create', msg => {
      sh.main.onCreateRocks(msg);
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

