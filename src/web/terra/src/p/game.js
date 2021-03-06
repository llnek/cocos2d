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
 * @requires s/sysobjs
 * @requires s/utils
 * @requires zotohlab/asx/ccsx
 * @requires p/hud
 * @module p/game
 */

import scenes from 'zotohlab/asx/scenes';
import sobjs from 's/sysobjs';
import uts from 's/utils';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import huds from 'p/hud';


let sjs= sh.skarojs,
xcfg= sh.xcfg,
csts= xcfg.csts,
R = sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class BackLayer */
BackLayer = scenes.XLayer.extend({
  rtti() { return 'BackLayer'; },
  setup() {
    this.regoAtlas('back-tiles', 1);
    this.regoAtlas('game-pics', 0);
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
    //ccsx.onTouchOne(this.ebus);
    //ccsx.onMouse(this.ebus);
  },
  /**
   * @method reset
   */
  reset(newFlag) {
    const arr= [['op-pics', true],
      ['game-pics', false],
      ['explosions', true]];

    if (! sjs.isempty(this.atlases)) {
      R.forEach( info => {
        this.atlases[info[0]].removeAllChildren();
      }, arr);
    } else {
      R.forEach( info => {
        const b= this.regoAtlas(info[0]);
        if (info[1]) {
          b.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        }
      }, arr);
    }
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
  },
  /**
   * @method initBackTiles
   * @private
   */
  initBackTiles() {
    this.moveBackTiles();
    this.schedule(this.moveBackTiles, 5);
  },
  /**
   * @method moveBackTiles
   * @private
   */
  moveBackTiles() {
    let ps= sh.pools.BackTiles,
    wz= ccsx.vrect(),
    move,
    fun,
    tm = ps.get();

    if (!tm) {
      sh.factory.createBackTiles();
      tm= ps.get();
    }

    tm.inflate({ x: sjs.rand(wz.width),
                 y: wz.height });

    move = cc.moveBy(sjs.rand(2) + 10,
                     cc.p(0, -wz.height - wz.height * 0.5));
    fun = cc.callFunc(() => {
      tm.deflate();
    });

    tm.sprite.runAction(cc.sequence(move,fun));
  },
  /**
   * @method operational
   * @protected
   */
  operational() {
    return this.options.running;
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

    sh.sfxPlayMusic('bgMusic', {repeat: true});
    this.schedule(() => {
      // counter used to spawn enemies
      ++this.options.secCount;
    },1);

    this.options.secCount=0;
    this.options.running = true;
  },
  /**
   * @method spawnPlayer
   * @private
   */
  spawnPlayer() {
    uts.bornShip(this.options.player);
  },
  /**
   * @method onPlayerKilled
   * @private
   */
  onPlayerKilled(msg) {
    //sh.sfxPlay('xxx-explode');
    if ( this.getHUD().reduceLives(1)) {
      this.onDone();
    } else {
      this.spawnPlayer();
    }
  },
  /**
   * @method onNewGame
   * @private
   */
  onNewGame(mode) {
    //sh.sfxPlay('start_game');
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
    this.options.running=false;
    sh.sfxCancel();
    this.reset();
    this.getHUD().enableReplay();
  },
  /**
   * @method getEnclosureBox
   * @private
   */
  getEnclosureBox() {
    const wb= ccsx.vbox();
    return {
      bottom: wb.bottom,
      left: wb.left,
      top: wb.top + 10,
      right: wb.right
    };
  },
  /**
   * @method ctor
   * @constructs
   */
  ctor(options) {
    this._super(options);
  }

});

/** @alias module:p/game */
const xbox =  /** @lends xbox# */{
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

    scene.onmsg('/game/players/earnscore', msg => {
      sh.main.onEarnScore(msg);
    }).
    onmsg('/game/backtiles', msg => {
      sh.main.initBackTiles();
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

