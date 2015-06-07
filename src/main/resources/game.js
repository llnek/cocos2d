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
 * @requires nodes/cobjs
 * @requires s/sysobjs
 * @requires p/hud
 * @module p/game
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import cobjs from 'nodes/cobjs';
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

    this.reset(newFlag);
    this.cleanSlate();

    sh.factory=new sobjs.Factory(this.engine,
                                 this.options);
    this.options.running = true;

    R.forEach((z) => {
      this.engine.addSystem(new (z)(this.options), z.Priority);
    },
    [ sobjs.Supervisor,
      sobjs.Motions,
      sobjs.Resolution]);
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

    scene.onmsg('/game/players/earnscore', (topic, msg) => {
      sh.main.onEarnScore(msg);
    }).
    onmsg('/hud/showmenu',(t,msg) => {
      scenes.showMenu();
    }).
    onmsg('/hud/replay',(t,msg) => {
      sh.main.replay();
    }).
    onmsg('/game/players/killed', (topic, msg) => {
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

