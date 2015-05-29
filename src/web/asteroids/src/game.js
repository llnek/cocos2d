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
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/p/sysobjs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/p/hud
 * @module zotohlab/p/arena
 */
define('zotohlab/p/arena',

       ['zotohlab/asx/xscenes',
        'zotohlab/p/sysobjs',
        'zotohlab/asterix',
        'zotohlab/asx/ccsx',
        'zotohlab/p/hud'],

  function(scenes, sobjs, sh, ccsx, huds) { "use strict";

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
      rtti() { return 'BackLayer'; },
      /**
       * @method setup
       * @protected
       */
      setup() {
      }
    }),
    //////////////////////////////////////////////////////////////////////////
    /**
     * @extends module:zotohlab/asx/xscenes.XGameLayer
     * @class GameLayer
     */
    GameLayer = scenes.XGameLayer.extend({
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

        sh.factory=new sobjs.Factory(this.engine, this.options);
        this.options.world= this.getEnclosureBox();
        this.options.level=1;
        this.options.running=true;

        R.forEach((z) => {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        },
        [ sobjs.Supervisor,
          sobjs.Motions,
          sobjs.MissileControl,
          sobjs.MoveAsteroids,
          sobjs.MovementShip,
          sobjs.MoveMissiles,
          sobjs.Collisions,
          sobjs.Resolution ]);
      },
      /**
       * @method reset
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

    exports= /** @lends exports# */{
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

        scene.ebus.onmsg('/game/missiles/killed', (t, msg) => {
          sh.main.onMissileKilled(msg);
        }).
        onmsg('/game/ufos/killed', (t, msg) => {
          sh.main.onUfoKilled(msg);
        }).
        onmsg('/game/players/shoot',(t,msg) => {
          sh.main.onFireMissile(msg);
        }).
        onmsg('/game/players/killed',(t,msg) => {
          sh.main.onPlayerKilled(msg);
        }).
        onmsg('/game/ufos/shoot',(t,msg) => {
          sh.main.onFireLaser(msg);
        }).
        onmsg('/game/stones/create',(t,msg) => {
          sh.main.onCreateStones(msg);
        }).
        onmsg('/game/rocks/create',(t,msg) => {
          sh.main.onCreateRocks(msg);
        }).
        onmsg('/game/players/earnscore', (t, msg) => {
          sh.main.onEarnScore(msg);
        }).
        onmsg('/hud/showmenu',(t,msg) => {
          scenes.showMenu();
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

