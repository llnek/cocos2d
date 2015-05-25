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

/**
 * @requires zotohlab/p/sysobjs
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xmmenus
 * @requires zotohlab/p/hud
 * @module zotohlab/p/arena
 */
define('zotohlab/p/arena',

       ['zotohlab/p/sysobjs',
        'cherimoia/skarojs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus',
        'zotohlab/p/hud'],

  function(sobjs, sjs, sh, ccsx, scenes, mmenus, huds) { "use strict";

    /** @alias module:zotohlab/p/arena */
    let exports = {     },
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class GameLayer
     */
    GameLayer = scenes.XGameLayer.extend({

      /**
       * @method reset
       * @protected
       */
      reset(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj((v) => { v.removeAllChildren(); }, this.atlases);
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
        const csts= sh.xcfg.csts,
        wz= ccsx.vrect();
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

        this.reset(newFlag);
        this.cleanSlate();

        sh.factory= new sobjs.Factory(this.engine,
                                      this.options);
        this.options.world= this.getEnclosureBox();
        this.options.running=true;

        R.forEach((z) => {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        },
        [ sobjs.Supervisor,
          sobjs.Motions,
          sobjs.MovementPaddle,
          sobjs.MovementBall,
          sobjs.Collisions]);
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

    exports = /** @lends exports# */{

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
          huds.BackLayer,
          GameLayer,
          huds.HUDLayer
        ]).reify(options);

        scene.onmsg('/game/bricks/killed', (topic, msg) => {
          sh.main.onBrickKilled(msg);
        }).
        onmsg('/game/players/killed', (topic, msg) => {
          sh.main.onPlayerKilled(msg);
        }).
        onmsg('/game/players/earnscore', (topic, msg) => {
          sh.main.onEarnScore(msg);
        }).
        onmsg('/hud/showmenu',(t,msg) => {
          mmenus.showMenu();
        }).
        onmsg('/hud/replay',(t,msg) => {
          sh.main.replay();
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

