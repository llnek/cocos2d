/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright (c) 2013-2016, Kenneth Leung. All rights reserved. */


"use strict";/**
 * @requires zotohlab/asx/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/scenes
 * @requires n/cobjs
 * @requires s/sysobjs
 * @requires p/hud
 * @module p/game
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'n/cobjs';
import sobjs from 's/sysobjs';
import huds from 'p/hud';

let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef;

//////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes.XLayer
 * @class BackLayer
 */
BackLayer = scenes.XLayer.extend({
  /**
   * @method rtti
   */
  rtti{} { return 'BackLayer';},
  /**
   * @method setup
   * @protected
   */
  setup() {
    this.centerImage(sh.getImagePath('game.bg'));
  }
}),
//////////////////////////////////////////////////////////////////////////
/**
 * @extends module:zotohlab/asx/scenes.XGameLayer
 * @class GameLayer
 */
GameLayer = scenes.XGameLayer.extend({

  /**
   * @method operational
   * @protected
   */
  operational() { return this.options.running; },

  /**
   * @method reset
   */
  reset(newFlag) {
    if (!sjs.isEmpty(this.atlases)) {
      sjs.eachObj( v => {
        v.removeAllChildren();
      }, this.atlases);
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
   * @method replay
   */
  replay() {
    this.play(false);
  },

  /**
   * @method play
   */
  play(newFlag) {
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
   * @method spawnPlayer
   * @private
   */
  spawnPlayer() {
  },

  /**
   * @method onNewGame
   * @private
   */
  onNewGame(mode) {
    this.setGameMode(mode);
    this.play(true);
  },

  /**
   * @method onEarnScore
   * @private
   */
  onEarnScore(msg) {
    this.getHUD().updateScore( msg.score);
  },

  /**
   * @method onDone
   * @private
   */
  onDone() {
    this.reset();
    this.options.running=false;
    this.getHUD().enableReplay();
  }

});

/** @alias module:p/game */
const xbox = /** @lends xbox# */{
  /**
   * @property {String} rtti
   */
  rtti: sh.ptypes.game,
  /**
   * @method reify
   * @param {Object} options
   * @return {cc.Scene}
   */
  reify(options) {
    const scene = new scenes.XSceneFactory([
      BackLayer,
      GameLayer,
      huds.HUDLayer ]).reify(options);

    scene.onmsg('/game/players/earnscore',  msg => {
      sh.main.onEarnScore(msg);
    }).
    onmsg('/hud/showmenu', msg => {
      scenes.showMenu();
    }).
    onmsg('/hud/replay', msg => {
      sh.main.replay();
    }).
    onmsg('/game/players/killed', msg => {
      sh.main.onPlayerKilled(msg);
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

