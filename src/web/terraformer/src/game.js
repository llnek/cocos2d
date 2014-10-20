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
                           'zotohlab/asx/ccsx',
                           'zotohlab/asx/xlayers',
                           'zotohlab/asx/xscenes',
                           'zotohlab/asx/xmmenus',
                           'zotohlab/p/hud'],

  function (sobjs, sjs, sh, ccsx,
            layers, scenes, mmenus, huds) { "use strict";

    var xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,
    GameLayer = layers.XGameLayer.extend({

      cfgInputMouse: function() {

        cc.eventManager.addListener({

          event: cc.EventListener.MOUSE,
          onMouseMove: function(e)
          {
            if (e.getButton() ===
                cc.EventMouse.BUTTON_LEFT) {
              e.getCurrentTarget().processEvent(e);
            }
          }
        }, this);

      },

      cfgTouch: function() {
        this.cfgInputTouchesAll();
      },

      processEvent: function(e) {
        var ship= this.options.player;
        if (this.options.running &&
            !!ship) {
          sobjs.Utils.processTouch(ship,
                                   e.getDelta());
        }
      },

      reset: function(newFlag) {

        if (! sjs.isEmpty(this.atlases)) {
          //sjs.eachObj(function(z) { z.removeAllChildren(); }, this.atlases);
        } else {

          R.forEach(function(info) {
            var b = new cc.SpriteBatchNode(cc.textureCache.addImage( sh.getAtlasPath(info[0])));
            if (info[1]) {
              b.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            }
            this.regoAtlas(info[0], b);
          }.bind(this), [ ['op-pics', true], ['tr-pics', false] ]);

        }

        this.getHUD().reset();
      },

      initBackTiles:function () {
        this.moveBackTiles();
        this.schedule(this.moveBackTiles, 5);
      },

      moveBackTiles: function () {
        var ps= sh.pools.BackTiles,
        wz= ccsx.screen(),
        move,
        fun,
        tm = ps.get();

        if (!tm) {
          this.factory.createBackTiles();
          tm= ps.get();
        }

        tm.inflate({ x: sjs.rand(wz.width),
                     y: wz.height });

        move = cc.moveBy(sjs.rand(2) + 10,
                         cc.p(0, -wz.height - wz.height * 0.5));
        fun = cc.callFunc(function() {
          tm.deflate();
        }, this);

        tm.sprite.runAction(cc.sequence(move,fun));
      },

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

        this.factory=new sobjs.EntityFactory(this.engine);
        sh.factory = this.factory;
        this.options.secCount=0;
        this.options.running = true;

        R.forEach(function(z) {
          this.engine.addSystem(new (z[0])(this.options), z[1]);
        }.bind(this),
        [ [sobjs.Supervisor, pss.PreUpdate],
          [sobjs.Motions, pss.Motion],
          [sobjs.LevelManager, pss.Movement],
          [sobjs.MoveMissiles, pss.Movement],
          [sobjs.MoveBombs, pss.Movement],
          [sobjs.MoveShip, pss.Movement],
          [sobjs.Collisions, pss.Collision],
          [sobjs.Resolution, pss.Resolve],
          [sobjs.Rendering, pss.Render] ]);

        this.schedule(this.countSeconds, 1);
      },

      countSeconds: function() {
        // this counter is used to spawn enemies
        ++this.options.secCount;
      },

      spawnPlayer: function() {
        sobjs.Utils.bornShip(this.options.player);
      },

      onPlayerKilled: function(msg) {
        //sh.sfxPlay('xxx-explode');
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
        this.options.running=false;
        this.reset();
        this.getHUD().enableReplay();
      },

      getEnclosureBox: function() {
        var wz= ccsx.screen();
        return {
          bottom: 0,
          left: 0,
          top: wz.height + 10,
          right: wz.width
        };
      },

      ctor: function(options) {
        //this._levelManager = new LevelManager(this);
        this._super(options);
      }

    });

    return {

      'GameArena' : {

        create: function(options) {
          var fac = new scenes.XSceneFactory([
            huds.BackLayer,
            GameLayer,
            huds.HUDLayer
             ]),
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


