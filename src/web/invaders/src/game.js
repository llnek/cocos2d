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
 * @requires zotohlab/p/s/utils
 * @requires zotohlab/p/sysobjs
 * @requires cherimoia/skarojs
 * @requires zotohlab/asterix
 * @requires zotohlab/asx/ccsx
 * @requires zotohlab/asx/xlayers
 * @requires zotohlab/asx/xscenes
 * @requires zotohlab/asx/xmmenus
 * @requires zotohlab/p/hud
 * @module zotohlab/p/arena
 */
define('zotohlab/p/arena',

       ['zotohlab/p/s/utils',
       'zotohlab/p/sysobjs',
       'cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers',
       'zotohlab/asx/xscenes',
       'zotohlab/asx/xmmenus',
       'zotohlab/p/hud'],

  function (utils, sobjs, sjs, sh, ccsx,
            layers, scenes, mmenus, huds) { "use strict";

    /** @alias module:zotohlab/p/arena */
    var exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @class GameLayer
     */
    GameLayer = layers.XGameLayer.extend({

      /**
       * @protected
       */
      reset: function(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj(function(v){ v.removeAllChildren(); }, this.atlases);
        } else {
          this.regoAtlas('game-pics');
          this.regoAtlas('lang-pics');
        }
        this.getHUD().reset();
      },

      /**
       */
      operational: function() {
        return this.options.running;
      },

      /**
       */
      replay: function() {
        this.play(false);
      },

      /**
       */
      play: function(newFlag) {

        var pss = sobjs.Priorities;

        this.reset(newFlag);
        this.cleanSlate();

        sh.factory=new sobjs.Factory(this.engine,
                                     this.options);
        this.options.running = true;

        R.forEach(function(z) {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        }.bind(this),
        [ sobjs.Supervisor,
          sobjs.Motions,
          sobjs.CannonControl,
          sobjs.MovementAliens,
          sobjs.MovementBombs,
          sobjs.MovementShip,
          sobjs.MovementMissiles,
          sobjs.CollisionSystem,
          sobjs.Resolution ]);

      },

      /**
       */
      spawnPlayer: function() {
        sh.factory.bornShip();
      },

      /**
       */
      onPlayerKilled: function(msg) {
        sh.sfxPlay('xxx-explode');
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
      },

      /**
       */
      onNewGame: function(mode) {
        //sh.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      },

      /**
       */
      onEarnScore: function(msg) {
        this.getHUD().updateScore( msg.score);
      },

      /**
       */
      onDone: function() {
        this.options.running=false;
        this.reset();
        this.getHUD().enableReplay();
      }

    });

    exports= {

      /**
       * @property {String} rtti
       * @static
       */
      rtti : sh.ptypes.game,

      /**
       * @method reify
       * @param {Object} options
       * @return {cc.Scene}
       */
      reify: function(options) {
        var scene = new scenes.XSceneFactory([
          huds.BackLayer,
          GameLayer,
          huds.HUDLayer ]).reify(options);

        scene.onmsg('/game/players/earnscore', function(topic, msg) {
          sh.main.onEarnScore(msg);
        }).
        onmsg('/hud/showmenu',function(t,msg) {
          mmenus.showMenu();
        }).
        onmsg('/hud/replay',function(t,msg) {
          sh.main.replay();
        }).
        onmsg('/game/players/killed', function(topic, msg) {
          sh.main.onPlayerKilled(msg);
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

