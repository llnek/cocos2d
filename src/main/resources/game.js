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
 * @requires zotohlab/p/elements
 * @requires zotohlab/p/sysobjs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/p/hud
 * @module zotohlab/p/arena
 */
define('zotohlab/p/arena', ['zotohlab/p/elements',
                           'zotohlab/p/sysobjs',
                           'zotohlab/asterix',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xscenes',
                           'zotohlab/p/hud'],

  function (cobjs, sobjs, sh, ccsx,
            scenes, huds) { "use strict";

    /** @alias module:zotohlab/p/arena */
    let exports = {},
    sjs= sh.skarojs,
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XLayer
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
     * @extends module:zotohlab/asx/xscenes.XGameLayer
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
          sjs.eachObj((v) => {
            v.removeAllChildren();
          }, this.atlases);
        } else {
          this.regoAtlas('game-pics');
        }
        this.getHUD().reset();
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

    exports = /** @lends exports# */{

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

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

