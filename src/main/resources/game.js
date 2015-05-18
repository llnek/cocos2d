// This library is distributed in  the hope that it will be useful but without
// any  warranty; without  even  the  implied  warranty of  merchantability or
// fitness for a particular purpose.
// The use and distribution terms for this software are covered by the Eclipse
// Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
// can be found in the file epl-v10.html at the root of this distribution.
// By using this software in any  fashion, you are agreeing to be bound by the
// terms of this license. You  must not remove this notice, or any other, from
// this software.
// Copyright (c) 2013, Ken Leung. All rights reserved.

define('zotohlab/p/arena', ['zotohlab/p/elements',
                           'zotohlab/p/sysobjs',
                           'cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus',
                           'zotohlab/p/hud'],

  function (cobjs, sobjs, sjs, sh, ccsx,
            layers, scenes, mmenus, huds) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    GameLayer = layers.XGameLayer.extend({

      operational: function() { return this.options.running; },

      reset: function(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj(function (v) {
            v.removeAllChildren();
          }, this.atlases);
        } else {
          this.regoAtlas('game-pics');
        }
        this.getHUD().reset();
      },

      replay: function() {
        this.play(false);
      },

      play: function(newFlag) {

        var pss = sobjs.Priorities;

        this.reset(newFlag);
        this.cleanSlate();

        sh.factory=new sobjs.Factory(this.engine,
                                     this.options);
        this.options.running = true;

        R.forEach(function(z) {
          this.engine.addSystem(new (z[0])(this.options), z[1]);
        }.bind(this),
        [ [sobjs.Supervisor, pss.PreUpdate],
          [sobjs.Motions, pss.Motion],
          [sobjs.Resolution, pss.Resolve] ]);

      },

      onPlayerKilled: function(msg) {
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
      },

      spawnPlayer: function() {
      },

      onNewGame: function(mode) {
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
          var scene = new scenes.XSceneFactory([
            huds.BackLayer,
            GameLayer,
            huds.HUDLayer ]).create(options);

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

          return scene;
        }
      }
    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

