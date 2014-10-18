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
                           'zotohlab/p/hud'],

  function (sobjs, sjs, sh, xcfg, ccsx,
            layers, scenes, mmenus, huds) { "use strict";

    var csts = xcfg.csts,
    R = sjs.ramda,
    undef,
    GameLayer = layers.XGameLayer.extend({

      cfgInputMouse: function() {
        cc.eventManager.addListener({
          event: cc.EventListener.MOUSE,
          onMouseMove: function(event){
            if (event.getButton() === cc.EventMouse.BUTTON_LEFT) {
              event.getCurrentTarget().processEvent(event);
            }
          }
        }, this);
      },

      processEvent: function(event) {
        if (this.operational()) {
          var delta = event.getDelta(),
          p= this.options.player;
          if (!!p) {
            sobjs.Utils.processTouch(p,delta);
          }
        }
      },

      cfgTouch: function() {
        this.cfgInputTouchesAll();
      },

      reset: function(newFlag) {
        var wz = ccsx.screen(),
        b,
        img;

        if (!!this.atlases) {
          sjs.eachObj(function(z) { z.removeAllChildren(); }, this.atlases);
        } else {
          img = cc.textureCache.addImage( sh.getAtlasPath('op-pics'));
          b = new cc.SpriteBatchNode(img);
          b.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
          this.atlases = { 'op-pics' : b };
          this.addChild(b, ++this.lastZix, ++this.lastTag);
          //2
          img = cc.textureCache.addImage( sh.getAtlasPath('tr-pics')),
          b = new cc.SpriteBatchNode(img);
          this.atlases[ 'tr-pics' ] =  b;
          this.addChild(b, ++this.lastZix, ++this.lastTag);
        }
        this.screenRect = cc.rect(0, 0, wz.width, wz.height + 10);
        this.getHUD().reset();
      },

      initBackground:function () {
        var n, rc= this.options.backSkies,
        fac= this.options.factory,
        layer= this.getBackgd();

        for (n = 0; n < 2; ++n) {
          rc[n] = fac.createBackSky(layer, this.options);
        }
        this.options.backSky= rc[0];

        this.moveBackTiles();
        this.schedule(this.moveBackTiles, 5);
      },

      moveBackTiles: function () {
        var bg = this.getBackgd(),
        wz= ccsx.screen(),
        tm = bg.getOrCreate();

        tm.sprite.setPosition( sjs.rand(wz.width), wz.height);

        var move = cc.moveBy(sjs.rand(2) + 10, cc.p(0, -wz.height - wz.height * 0.5)),
        fun = cc.callFunc(function() {
          tm.sprite.setVisible(false);
          tm.status=false;
        },this);

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

        this.options.factory=new sobjs.EntityFactory(this.engine);
        this.options.backSkies=[];
        this.options.touches=[];
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

        this.initBackground();
        this.schedule(this.countSeconds, 1);
      },

      countSeconds: function() {
        // this counter is used to spawn enemies
        ++this.options.secCount;
      },

      spawnPlayer: function() {
        this.options.factory.createShip(sh.main,this.options);
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

      getCameraView: function() {
        var wz= ccsx.screen();
        return cc.rect(0,0, wz.width, wz.height+10);
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


