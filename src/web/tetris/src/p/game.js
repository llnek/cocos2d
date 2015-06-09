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
 * @requires p/hud
 * @requires nodes/cobjs
 * @requires s/sysobjs
 * @module p/game
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import huds from 'p/hud';
import cobjs from 'nodes/cobjs';
import sobjs from 's/sysobjs';


let sjs= sh.skarojs,
xcfg = sh.xcfg,
csts = xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/** @class BackLayer */
BackLayer = scenes.XLayer.extend({
  setup() {
    this.centerImage(sh.getImagePath('game.bg'));
  },
  rtti() { return 'BackLayer'; }
}),
//////////////////////////////////////////////////////////////////////////
/** @class GameLayer */
GameLayer = scenes.XGameLayer.extend({
  /**
   * @method reset
   * @protected
   */
  reset(newFlag) {
    if (!sjs.isEmpty(this.atlases)) {
      sjs.eachObj( v => {
        v.removeAllChildren();
      }, this.atlases);
    } else {
      this.regoAtlas('game-pics');
      this.regoAtlas('lang-pics');
    }
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },
  /**
   * @method pkInput
   * @protected
   */
  pkInput() {
    ccsx.onKeyPolls(this.keyboard);
    ccsx.onTouchOne(this.ebus);
    ccsx.onMouse(this.ebus);
  },
  /**
   * @method ctor
   * @constructs
   */
  ctor(options) {
    this._super(options);
    this.collisionMap= [];
    this.ops = {};
  },
  /**
   * @method operational
   * @protected
   */
  operational() {
    return this.options.running;
  },
  /**
   * @method onclicked
   * @protected
   */
  onclicked(mx,my) {
    if (this.options.running &&
        this.options.selQ.length === 0) {
      sjs.loggr.debug("selection made at pos = " + mx + "," + my);
      this.options.selQ.push({ x: mx, y: my, cell: -1 });
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

    sh.factory = new sobjs.Factory(this.engine);
    this.options.running=true;
    this.options.selQ=[];

    R.forEach( z => {
      this.engine.addSystem(new (z)(this.options), z.Priority);
    },
    [sobjs.Supervisor,
     sobjs.RowClearance,
     sobjs.Generator,
     sobjs.Movements,
     sobjs.MotionControl,
     sobjs.Rendering,
     sobjs.Resolution ]);
  },
  /**
   * @method endGame
   * @private
   */
  endGame() {
    this.options.running=false;
    this.getHUD().endGame();
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
      huds.HUDLayer ]).reify(options);

    scene.onmsg('/hud/end', (topic, msg) => {
      sh.main.endGame();
    }).
    onmsg('/hud/score/update', (topic, msg) => {
      sh.main.getHUD().updateScore(msg.score);
    }).
    onmsg('/hud/showmenu', (t,msg) => {
      scenes.showMenu();
    }).
    onmsg('/hud/replay', (t,msg) => {
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

