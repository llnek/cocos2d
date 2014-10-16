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

define('zotohlab/p/arena', ['zotohlab/p/s/utils',
                           'zotohlab/p/sysobjs',
                           'cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/xcfg',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus',
                           'zotohlab/p/hud'],

  function (utils, sobjs, sjs, sh, xcfg, ccsx,
            layers, scenes, mmenus, huds) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    GameLayer = layers.XGameLayer.extend({

      reset: function(newFlag) {
        if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
          var img = cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
          this.atlasBatch = new cc.SpriteBatchNode(img);
          this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
        }
        this.getHUD().reset();
      },

      getHUD: function() {
        var rc= this.ptScene.getLayers();
        return rc['HUD'];
      },

      getNode: function() { return this.atlasBatch; },

      operational: function() {
        return this.options.running;
      },

      replay: function() {
        this.play(false);
      },

      play: function(newFlag) {

        var pss = sobjs.Priorities;

        this.reset(newFlag);
        this.cleanSlate();

        this.options.factory=new sobjs.EntityFactory(this.engine);
        this.options.running = true;

        R.forEach(function(z) {
          this.engine.addSystem(new (z[0])(this.options), z[1]);
        }.bind(this),
        [ [sobjs.Supervisor, pss.PreUpdate],
          [sobjs.Motions, pss.Motion],
          [sobjs.CollisionSystem, pss.Collision] ]);

      },

      spawnPlayer: function() {
      },

      onPlayerKilled: function(msg) {
        sh.sfxPlay('xxx-explode');
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
      },

      onNewGame: function(mode) {
        //sh.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      },

      onEarnScore: function(msg) {
        this.getHUD().updateScore( msg.score);
      },

      onDone: function() {
        this.reset();
        this.options.running=false;
        this.getHUD().enableReplay();
      }

    });

    return {

      'GameArena' : {

        create: function(options) {
          var fac = new scenes.XSceneFactory([
            huds.BackLayer,
            GameLayer,
            huds.HUDLayer ]),
          scene= fac.create(options);
          if (!!scene) {
            scene.ebus.on('/game/objects/players/earnscore', function(topic, msg) {
              sh.main.onEarnScore(msg);
            });
            scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
              mmenus.XMenuLayer.onShowMenu();
            });
            scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
              sh.main.replay();
            });
            scene.ebus.on('/game/objects/players/killed', function(topic, msg) {
              sh.main.onPlayerKilled(msg);
            });
          }
          return scene;
        }
      }
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

