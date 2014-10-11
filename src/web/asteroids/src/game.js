// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013 Cherimoia, LLC. All rights reserved.

define('zotohlab/p/arena', ['zotohlab/p/sysobjs',
                           'cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/xcfg',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus',
                           'zotohlab/p/hud',
                           'ash-js'],

  function(sobjs, sjs, sh, xcfg, ccsx, layers, scenes, mmenus, huds, Ash) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    GameLayer = layers.XGameLayer.extend({

      getHUD: function() {
        var rc= this.ptScene.getLayers();
        return rc['HUD'];
      },

      getNode: function() { return this.atlasBatch; },

      replay: function() {
        this.play(false);
      },

      play: function(newFlag) {

        var pss = sobjs.Priorities;

        this.reset(newFlag);
        this.cleanSlate();

        this.options.factory=new sobjs.EntityFactory(this.engine);
        this.options.world= this.getEnclosureRect();
        this.options.level=1;
        this.options.running=true;

        R.forEach(function(z) {
          this.engine.addSystem(new (z[0])(this.options), z[1]);
        }.bind(this),
        [ [sobjs.Supervisor, pss.PreUpdate],
          [sobjs.Motions, pss.Motion],
          [sobjs.MissileControl, pss.Motion],
          [sobjs.MoveAsteroids, pss.Movement],
          [sobjs.MovementShip, pss.Movement],
          [sobjs.MoveMissiles, pss.Movement],
          [sobjs.Collisions, pss.Collision] ]);
      },

      reset: function(newFlag) {
        if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
          var img = cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
          this.atlasBatch = cc.SpriteBatchNode.create(img,320);
          this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
        }
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
      },

      operational: function() {
        return this.options.running;
      },

      spawnPlayer: function() {
        this.options.factory.createShip(sh.main, this.options);
      },

      onPlayerKilled: function(msg) {
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
      },

      onDone: function() {
        this.reset();
        this.getHUD().enableReplay();
      },

      onEarnScore: function(msg) {
        this.getHUD().updateScore(msg.score);
      },

      onNewGame: function(mode) {
        //sh.xcfg.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      }

    });

    return {

      'GameArena' : {

        create: function(options) {
          var scene = new scenes.XSceneFactory([
            huds.BackLayer,
            GameLayer,
            huds.HUDLayer
          ]).create(options);
          if (!!scene) {
            scene.ebus.on('/game/objects/missiles/killed', function(topic, msg) {
              sh.main.onMissileKilled(msg);
            });
            scene.ebus.on('/game/objects/ufos/killed', function(topic, msg) {
              sh.main.onUfoKilled(msg);
            });
            scene.ebus.on('/game/objects/players/shoot',function(t,msg) {
              sh.main.onFireMissile(msg);
            });
            scene.ebus.on('/game/objects/players/killed',function(t,msg) {
              sh.main.onPlayerKilled(msg);
            });
            scene.ebus.on('/game/objects/ufos/shoot',function(t,msg) {
              sh.main.onFireLaser(msg);
            });
            scene.ebus.on('/game/objects/stones/create',function(t,msg) {
              sh.main.onCreateStones(msg);
            });
            scene.ebus.on('/game/objects/rocks/create',function(t,msg) {
              sh.main.onCreateRocks(msg);
            });
            scene.ebus.on('/game/objects/players/earnscore', function(topic, msg) {
              sh.main.onEarnScore(msg);
            });
            scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
              mmenus.XMenuLayer.onShowMenu();
            });
            scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
              sh.main.replay();
            });
          }
          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

