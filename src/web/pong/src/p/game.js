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
 * @requires zotohlab/asx/odin
 * @requires zotohlab/asx/scenes
 * @requires n/cobjs
 * @requires s/sysobjs
 * @requires p/hud
 * @module p/game
 */

import scenes from 'zotohlab/asx/scenes';
import sh from 'zotohlab/asx/asterix';
import ccsx from 'zotohlab/asx/ccsx';
import odin from 'zotohlab/asx/odin';
import cobjs from 'n/cobjs';
import sobjs from 's/sysobjs';
import huds from 'p/hud';


let evts= odin.Events,
sjs= sh.skarojs,
xcfg = sh.xcfg,
csts= xcfg.csts,
R= sjs.ramda,
undef,
//////////////////////////////////////////////////////////////////////////
/** * @class BackLayer */
BackLayer = scenes.XLayer.extend({
  setup() {
    this.centerImage(sh.getImage('game.bg'));
  },
  rtti() { return 'BackLayer'; }
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
    sjs.loggr.debug('replay game called');
    if (sjs.isobj(this.options.wsock)) {

      // request server to restart a new game
      this.options.wsock.send({
        type: evts.MSG_SESSION,
        code: evts.REPLAY
      });
    } else {
      this.play(false);
    }
  },
  /**
   * @method play
   */
  play(newFlag) {
    // sort out names of players
    let p1ids,
    p2ids;
    sjs.eachObj((v,k) => {
      if (v[0] === 1) {
        p1ids= [k, v[1] ];
      } else {
        p2ids= [k, v[1] ];
      }
    }, this.options.ppids);

    this.initEngine(sobjs.systems, sobjs.entityFactory);
    this.reset(newFlag);
    this.initPlayers();
    this.getHUD().regoPlayers(csts.P1_COLOR,p1ids,
                              csts.P2_COLOR,p2ids);

    this.options.world = this.getEnclosureBox();
    this.options.running=true;
    this.options.poked=false;
  },
  /**
   * @method onNewGame
   * @private
   */
  onNewGame(mode) {
    //sh.xcfg.sfxPlay('start_game');
    this.setGameMode(mode);
    this.play(true);
  },
  /**
   * @method reset
   */
  reset(newFlag) {
    if (!sjs.isempty(this.atlases)) {
      sjs.eachObj( v => { v.removeAllChildren(); }, this.atlases);
    } else {
      this.regoAtlas('game-pics');
      this.regoAtlas('lang-pics');
    }
    R.forEach( z => {
      if (!!z) { z.dispose(); }
    }, this.players);
    if (newFlag) {
      this.getHUD().resetAsNew();
    } else {
      this.getHUD().reset();
    }
    this.players.length=0;
  },
  /**
   * @method operational
   * @protected
   */
  operational() {
    return this.options.running;
  },
  /**
   * @method initPlayers
   * @private
   */
  initPlayers() {
    let p2cat, p1cat,
    p2, p1;

    switch (this.options.mode) {
      case sh.gtypes.ONLINE_GAME:
        p2cat = csts.NETP;
        p1cat = csts.NETP;
      break;
      case sh.gtypes.P1_GAME:
        p1cat= csts.HUMAN;
        p2cat= csts.BOT;
      break;
      case sh.gtypes.P2_GAME:
        p2cat= csts.HUMAN;
        p1cat= csts.HUMAN;
      break;
    }
    p1= new cobjs.Player(p1cat, csts.CV_X, 1, csts.P1_COLOR);
    p2= new cobjs.Player(p2cat, csts.CV_O, 2, csts.P2_COLOR);
    this.options.players = [null, p1, p2];
    this.options.colors={};
    this.options.colors[csts.P1_COLOR] = p1;
    this.options.colors[csts.P2_COLOR] = p2;
  },
  /**
   * Scores is a map {'o': 0, 'x': 0}
   * @method updatePoints
   * @private
   */
  updatePoints(scores) {
    this.getHUD().updateScores(scores);
  },
  /**
   * @method onWinner
   * @private
   */
  onWinner(p,score) {
    this.getHUD().updateScore(p,score || 1);
    const rc= this.getHUD().isDone();
    if (rc[0]) {
      this.doDone( rc[1] );
    } else {
    }
  },
  /**
   * @method doDone
   * @private
   */
  doDone(p) {
    this.getHUD().drawResult(p);
    this.getHUD().endGame();
    //this.removeAll();
    sh.sfxPlay('game_end');
    this.options.running=false;
  },
  /**
   * @method getEnclosureBox
   * @private
   */
  getEnclosureBox() {
    return ccsx.vbox();
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
      huds.HUDLayer
    ]).reify(options);

    scene.onmsg('/hud/showmenu', msg => {
      scenes.showMenu();
    }).
    onmsg('/game/restart', msg => {
      sh.main.play(false);
    }).
    onmsg('/game/stop', msg => {
    }).
    onmsg('/hud/replay', msg => {
      sh.main.replay();
    }).
    onmsg('/hud/score/update', msg => {
      sh.main.onWinner(msg.color, msg.score);
    }).
    onmsg('/hud/score/sync', msg => {
      sh.main.updatePoints(msg.points);
    }).
    onmsg('/hud/end', msg => {
      sh.main.doDone(msg.winner);
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

