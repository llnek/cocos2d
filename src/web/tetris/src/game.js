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

define("zotohlab/p/arena",

       ['cherimoia/skarojs',
       'zotohlab/asterix',
       'zotohlab/asx/ccsx',
       'zotohlab/asx/xlayers',
       'zotohlab/asx/xscenes',
       'zotohlab/asx/xmmenus',
       'zotohlab/p/hud',
       'zotohlab/p/components',
       'zotohlab/p/sysobjs'],

  function(sjs, sh, ccsx, layers, scenes,
           mmenus, huds, cobjs, sobjs) { "use strict";

    var xcfg = sh.xcfg,
    csts = xcfg.csts,
    R = sjs.ramda,
    undef,

    //////////////////////////////////////////////////////////////////////////
    GameLayer = layers.XGameLayer.extend({

      reset: function(newFlag) {
        if (!sjs.isEmpty(this.atlases)) {
          sjs.eachObj(function(v) {
            v.removeAllChildren();
          }, this.atlases);
        } else {
          this.regoAtlas('game-pics');
          this.regoAtlas('lang-pics');
        }
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
      },

      ctor: function (options) {
        this._super(options);
        this.collisionMap= [];
        this.ops = {};
      },

      operational: function() {
        return this.options.running;
      },

      onclicked: function(mx,my) {
        if (this.options.running &&
            this.options.selQ.length === 0) {
          sjs.loggr.debug("selection made at pos = " + mx + "," + my);
          this.options.selQ.push({ x: mx, y: my, cell: -1 });
        }
      },


      replay: function() {
        this.play(false);
      },

      play: function(newFlag) {
        var pss= sobjs.Priorities;

        this.reset(newFlag);
        this.cleanSlate();

        sh.factory = new sobjs.Factory(this.engine);
        this.options.running=true;
        this.options.selQ=[];

        R.forEach(function(z) {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        }.bind(this),
        [sobjs.Supervisor,
         sobjs.RowClearance,
         sobjs.Generator,
         sobjs.Movements,
         sobjs.MotionControl,
         sobjs.Rendering,
         sobjs.Resolution ]);
      },

      endGame: function() {
        this.options.running=false;
        this.getHUD().endGame();
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
            huds.HUDLayer ]).create(options);

          scene.ebus.on('/game/hud/end', function(topic, msg) {
            sh.main.endGame();
          });
          scene.ebus.on('/game/hud/score/update', function(topic, msg) {
            sh.main.getHUD().updateScore(msg.score);
          });

          scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
            mmenus.XMenuLayer.onShowMenu();
          });
          scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
            sh.main.replay();
          });

          return scene;
        }
      }

    };

});

//////////////////////////////////////////////////////////////////////////////
//EOF

