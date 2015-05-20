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
 * @requires zotohlab/asx/xlayers
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
        'zotohlab/asx/xlayers',
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus',
        'zotohlab/p/hud'],

  function(sobjs, sjs, sh, ccsx, layers, scenes, mmenus, huds) { "use strict";

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

        sh.factory=new sobjs.Factory(this.engine, this.options);
        this.options.world= this.getEnclosureBox();
        this.options.level=1;
        this.options.running=true;

        R.forEach(function(z) {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        }.bind(this),
        [ [sobjs.Supervisor, pss.PreUpdate],
          [sobjs.Motions, pss.Motion],
          [sobjs.MissileControl, pss.Motion],
          [sobjs.MoveAsteroids, pss.Movement],
          [sobjs.MovementShip, pss.Movement],
          [sobjs.MoveMissiles, pss.Movement],
          [sobjs.Collisions, pss.Collision],
          [sobjs.Resolution, pss.Resolve] ]);
      },

      /**
       * @private
       */
      reset: function(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj(function(v) { v.removeAllChildren(); }, this.atlases);
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
       */
      operational: function() {
        return this.options.running;
      },

      /**
       */
      spawnPlayer: function() {
        sh.factory.bornShip();
      },

      /**
       * @private
       */
      onPlayerKilled: function(msg) {
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
      },

      /**
       * @private
       */
      onDone: function() {
        this.reset();
        this.options.running =false;
        this.getHUD().enableReplay();
      },

      /**
       * @private
       */
      onEarnScore: function(msg) {
        this.getHUD().updateScore(msg.score);
      },

      /**
       * @private
       */
      onNewGame: function(mode) {
        //sh.xcfg.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      }

    });

    exports= {

      rtti : sh.ptypes.game,

      reify: function(options) {
        var scene = new scenes.XSceneFactory([
          huds.BackLayer,
          GameLayer,
          huds.HUDLayer
        ]).reify(options);

        scene.ebus.onmsg('/game/missiles/killed', function(topic, msg) {
          sh.main.onMissileKilled(msg);
        }).
        onmsg('/game/ufos/killed', function(topic, msg) {
          sh.main.onUfoKilled(msg);
        }).
        onmsg('/game/players/shoot',function(t,msg) {
          sh.main.onFireMissile(msg);
        }).
        onmsg('/game/players/killed',function(t,msg) {
          sh.main.onPlayerKilled(msg);
        }).
        onmsg('/game/ufos/shoot',function(t,msg) {
          sh.main.onFireLaser(msg);
        }).
        onmsg('/game/stones/create',function(t,msg) {
          sh.main.onCreateStones(msg);
        }).
        onmsg('/game/rocks/create',function(t,msg) {
          sh.main.onCreateRocks(msg);
        }).
        onmsg('/game/players/earnscore', function(topic, msg) {
          sh.main.onEarnScore(msg);
        }).
        onmsg('/hud/showmenu',function(t,msg) {
          mmenus.showMenu();
        }).
        onmsg('/hud/replay',function(t,msg) {
          sh.main.replay();
        });

        return scene;
      }
    }


});

//////////////////////////////////////////////////////////////////////////////
//EOF

