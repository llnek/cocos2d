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

define("zotohlab/p/arena", ['cherimoia/skarojs',
                           'zotohlab/asterix',
                           'zotohlab/asx/xcfg',
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus',
                           'zotohlab/p/hud',
                           'zotohlab/p/components',
                           'zotohlab/p/sysobjs'],

  function(sjs, sh, xcfg, ccsx,
           layers, scenes, mmenus,
           huds, cobjs, sobjs) { "use strict";

    var csts = xcfg.csts,
    undef,
    GameLayer = layers.XGameLayer.extend({

      reset: function(newFlag) {
        if (this.atlasBatch) { this.atlasBatch.removeAllChildren(); } else {
          var img = cc.textureCache.addImage( sh.getAtlasPath('game-pics'));
          this.atlasBatch = new cc.SpriteBatchNode(img);
          this.addChild(this.atlasBatch, ++this.lastZix, ++this.lastTag);
        }
        if (newFlag) {
          this.getHUD().resetAsNew();
        } else {
          this.getHUD().reset();
        }
        this.pauseToClear=false;
        this.op.onspace: sh.throttle(this.onSpace.bind(this), 100);
      },

      ctor: function (options) {
        this._super(options);
        this.collisionMap= [];
        this.ops = {};
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
        this.reset(newFlag);
        this.cleanSlate();
        this.options.factory = new bks.EntityFactory(this.engine);
        this.engine.addSystem(new bks.GameSupervisor(this.options),
                              bks.Priorities.PreUpdate);
        this.engine.addSystem(new bks.RowClearance(this.options),
                              bks.Priorities.Clear);
        this.engine.addSystem(new bks.ShapeGenerator(this.options),
                              bks.Priorities.Generate);
        this.engine.addSystem(new bks.MovementSystem(this.options),
                              bks.Priorities.Move);
        this.engine.addSystem(new bks.MotionCtrlSystem(this.options),
                              bks.Priorities.Motion);
        this.engine.addSystem(new bks.RenderSystem(this.options),
                              bks.Priorities.Render);
        this.engine.addSystem(new bks.ResolutionSystem(this.options),
                              bks.Priorities.Resolve);
        this.options.running=true;
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


asterix.Bricks.Factory = {
  create: function(options) {
    var fac = new asterix.XSceneFactory([ bks.BackLayer, GameLayer, bks.HUDLayer ]),
    scene= fac.create(options);
    if (!scene) { return null; }

    scene.ebus.on('/game/hud/end', function(topic, msg) {
      sh.main.endGame();
    });
    scene.ebus.on('/game/hud/score/update', function(topic, msg) {
      sh.main.getHUD().updateScore(msg.score);
    });

    scene.ebus.on('/game/hud/controls/showmenu',function(t,msg) {
      asterix.XMenuLayer.onShowMenu();
    });
    scene.ebus.on('/game/hud/controls/replay',function(t,msg) {
      sh.main.replay();
    });

    return scene;
  }
}

});

//////////////////////////////////////////////////////////////////////////////
//EOF

