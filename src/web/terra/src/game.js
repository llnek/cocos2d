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
        'zotohlab/asx/xscenes',
        'zotohlab/asx/xmmenus',
        'zotohlab/p/hud'],

  function (sobjs, sjs, sh, ccsx,
            scenes, mmenus, huds) { "use strict";

    /** @alias module:zotohlab/p/arena */
    let exports = {},
    xcfg = sh.xcfg,
    csts= xcfg.csts,
    R = sjs.ramda,
    undef,

    /**
     * @extends module:zotohlab/asx/xscenes.XGameLayer
     * @class GameLayer
     */
    GameLayer = scenes.XGameLayer.extend({

      /**
       * @method cfgInputMouse
       * @protected
       */
      cfgInputMouse() {
        cc.eventManager.addListener({
          event: cc.EventListener.MOUSE,
          onMouseMove(e) {
            if (e.getButton() === cc.EventMouse.BUTTON_LEFT) {
              e.getCurrentTarget().processEvent(e);
            }
          }
        }, this);
      },

      /**
       * @method cfgTouch
       * @protected
       */
      cfgTouch() {
        this.cfgInputTouchesAll();
      },

      /**
       * @method processEvent
       * @private
       */
      processEvent(e) {
        const ship= this.options.player;
        if (this.options.running &&
            !!ship) {
          sobjs.Utils.processTouch(ship, e.getDelta());
        }
      },

      /**
       * @method reset
       */
      reset(newFlag) {
        if (! sjs.isEmpty(this.atlases)) {
          //sjs.eachObj(function(z) { z.removeAllChildren(); }, this.atlases);
        } else {
          R.forEach((info) => {
            const b= this.regoAtlas(info[0]);
            if (info[1]) {
              b.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            }
          }, [ ['op-pics', true],
               ['tr-pics', false],
               ['explosions', true]]);
        }
        this.getHUD().reset();
      },

      /**
       * @method initBackTiles
       * @private
       */
      initBackTiles() {
        this.moveBackTiles();
        this.schedule(this.moveBackTiles, 5);
      },

      /**
       * @method moveBackTiles
       * @private
       */
      moveBackTiles() {
        let ps= sh.pools.BackTiles,
        wz= ccsx.vrect(),
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
        fun = cc.callFunc(() => {
          tm.deflate();
        }, this);

        tm.sprite.runAction(cc.sequence(move,fun));
      },

      /**
       * @method operational
       * @protected
       */
      operational() {
        return this.options.running;
      },

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

        this.factory=new sobjs.EntityFactory(this.engine);
        sh.factory = this.factory;
        this.options.secCount=0;
        this.options.running = true;

        R.forEach((z) => {
          this.engine.addSystem(new (z)(this.options), z.Priority);
        },
        [ sobjs.Supervisor,
          sobjs.Motions,
          sobjs.LevelManager,
          sobjs.MoveMissiles,
          sobjs.MoveBombs,
          sobjs.MoveShip,
          sobjs.Collisions,
          sobjs.Resolution,
          sobjs.Rendering ]);

        sh.sfxPlayMusic('bgMusic', true);
        this.schedule(this.countSeconds, 1);
      },

      /**
       * @method countSeconds
       * @private
       */
      countSeconds() {
        // this counter is used to spawn enemies
        ++this.options.secCount;
      },

      /**
       * @method spawnPlayer
       * @private
       */
      spawnPlayer() {
        sobjs.Utils.bornShip(this.options.player);
      },

      /**
       * @method onPlayerKilled
       * @private
       */
      onPlayerKilled(msg) {
        //sh.sfxPlay('xxx-explode');
        if ( this.getHUD().reduceLives(1)) {
          this.onDone();
        } else {
          this.spawnPlayer();
        }
      },

      /**
       * @method onNewGame
       * @private
       */
      onNewGame(mode) {
        //sh.sfxPlay('start_game');
        this.setGameMode(mode);
        this.play(true);
      },

      /**
       * @method onEarnScore
       * @private
       */
      onEarnScore(msg) {
        this.getHUD().updateScore( msg.score);
      },

      /**
       * @method onDone
       * @private
       */
      onDone() {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
        this.options.running=false;
        this.reset();
        this.getHUD().enableReplay();
      },

      /**
       * @method getEnclosureBox
       * @private
       */
      getEnclosureBox() {
        var wz= ccsx.vrect();
        return {
          bottom: 0,
          left: 0,
          top: wz.height + 10,
          right: wz.width
        };
      },

      /**
       * @method ctor
       * @constructs
       */
      ctor(options) {
        //this._levelManager = new LevelManager(this);
        this._super(options);
      }

    });

    exports =  /** @lends exports# */{

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
          huds.BackLayer,
          GameLayer,
          huds.HUDLayer
        ]).reify(options);

        scene.onmsg('/game/players/earnscore', (topic, msg) => {
          sh.main.onEarnScore(msg);
        }).
        onmsg('/hud/showmenu',(t,msg) => {
          mmenus.showMenu();
        }).
        onmsg('/hud/replay',(t,msg) => {
          sh.main.replay();
        }).
        onmsg('/game/players/killed', (topic, msg) => {
          sh.main.onPlayerKilled(msg);
        });

        return scene;
      }
    };

    return exports;
});

//////////////////////////////////////////////////////////////////////////////
//EOF

